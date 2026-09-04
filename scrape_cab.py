"""
Scrapes CAB (Courses @ Brown) for a given term and outputs into class_list.json
"""

import json
import os
import threading
from concurrent.futures import ThreadPoolExecutor

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from constants import (
    CAB_COURSE_SEARCH_URL,
    CAB_DETAILS_URL,
    CAB_HEADERS,
    CAB_URL,
    cab_search_payload,
    class_list_file,
    semester as CURRENT_SEMESTER,
)

MAX_WORKERS = 100

# requests.Session is not thread-safe, so each worker thread gets its own
_thread_local = threading.local()


def get_session():
    session = getattr(_thread_local, "session", None)
    if session is None:
        session = requests.Session()
        session.headers.update(CAB_HEADERS)
        retry = Retry(
            total=4,
            backoff_factor=0.5,
            status_forcelist=(429, 500, 502, 503, 504),
            allowed_methods=frozenset(["GET", "POST"]),
        )
        # pool sized to the worker count so threads reuse connections instead of
        # discarding them under contention
        session.mount(
            "https://", HTTPAdapter(max_retries=retry, pool_maxsize=MAX_WORKERS)
        )
        _thread_local.session = session
    return session


def fetch_details(course):
    """Fetches one course's detail view. Returns None if CAB never answered."""
    payload = {
        "group": f"code:{course['code']}",
        "key": f"crn:{course['crn']}",
        "srcdb": course["srcdb"],
        "matched": f"crn:{course['crn']}",
    }
    try:
        response = get_session().post(CAB_DETAILS_URL, json=payload, timeout=30)
        response.raise_for_status()
        return response.json()
    except (requests.RequestException, ValueError) as err:
        print(f"  failed details for {course['code']} (crn {course['crn']}): {err}")
        return None


def scrape_cab(sem=CURRENT_SEMESTER):
    print(f"scraping CAB for {sem}")
    session = get_session()
    session.get(CAB_URL, timeout=30)  # pick up any cookies CAB hands out

    # get all courses
    search = session.post(
        CAB_COURSE_SEARCH_URL, json=cab_search_payload(sem), timeout=60
    )
    search.raise_for_status()
    courses = search.json()["results"]
    print(f"  {len(courses)} course sections returned")

    # get detail views for all courses, 100 at a time
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        details_view_responses = list(executor.map(fetch_details, courses))

    # format courses: store responses in dictionary accessible by course code
    details_view_json_by_code = {}
    for response_json in details_view_responses:
        if response_json is not None:
            details_view_json_by_code[response_json["code"]] = response_json

    # construct classes list
    classes = []
    skipped = 0
    for c in courses:
        details = details_view_json_by_code.get(c["code"])
        if details is None:
            skipped += 1
            continue

        code, title, time_of_class, prof, description, writ, fys, soph = (
            c["code"],
            c["title"],
            c["meets"],
            c["instr"],
            details["description"],
            "WRIT" in details["attr_html"],
            "FYS" in details["attr_html"],
            "SOPH" in details["attr_html"],
        )

        # skip online courses and courses taught by multiple professors
        # do we want to do this?
        if prof == "Team" or time_of_class == "Course offered online":
            continue

        # Split PHP 2510 into [PHP, 2510]
        dept_identifier, num = code.split(" ")
        classes.append(
            {
                "num": num,
                "dept": dept_identifier,
                "name": title,
                "time": time_of_class,
                "prof": prof,
                "description": description,
                "writ": writ,
                "fys": fys,
                "soph": soph,
            }
        )

    if skipped:
        print(f"  warning: {skipped} sections dropped, no detail view returned")
    print(f"  {len(classes)} classes kept")

    # write classes to a JSON file
    classes_dict = {"data": classes}
    classes_json = json.dumps(classes_dict)
    out_file = class_list_file(sem)
    os.makedirs(os.path.dirname(out_file), exist_ok=True)
    with open(out_file, "w") as class_list_file_handle:
        class_list_file_handle.write(classes_json)
    print(f"  wrote {out_file}")


if __name__ == "__main__":
    scrape_cab()
