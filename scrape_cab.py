"""
Scrapes CAB (Courses @ Brown) for the current term and outputs into class_list.json
"""

import grequests
import json
import os
import requests

from constants import (
    CLASS_LIST_FILE,
    CAB_URL,
    CAB_COURSE_SEARCH_URL,
    CAB_SEARCH_PAYLOAD,
    CAB_HEADERS
)


def scrape_cab():
    page = requests.get(CAB_URL)

    # get all courses
    courses = requests.post(CAB_COURSE_SEARCH_URL, json=CAB_SEARCH_PAYLOAD, headers=CAB_HEADERS).json()[
        "results"
    ]

    # get detail views for all courses
    details_view_url = "https://cab.brown.edu/api/?page=fose&route=details"
    get_details_payload = lambda r: {
        "group": f"code:{r['code']}",
        "key": f"crn:{r['crn']}",
        "srcdb": r["srcdb"],
        "matched": f"crn:{r['crn']}",
    }
    rs = (
        grequests.post(details_view_url, json=get_details_payload(r), headers=CAB_HEADERS) for r in courses
    )
    details_view_responses = grequests.map(rs)

    # format courses: store responses in dictionary accessible by course code
    details_view_json_by_code = {}
    for response in details_view_responses:
        response_json = response.json()
        details_view_json_by_code[response_json["code"]] = response_json

    # construct classes list
    classes = []
    for c in courses:
        details = details_view_json_by_code[c["code"]]
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

    # write classes to a JSON file
    classes_dict = {"data": classes}
    classes_json = json.dumps(classes_dict)
    os.makedirs(os.path.dirname(CLASS_LIST_FILE), exist_ok=True)
    with open(CLASS_LIST_FILE, "w") as class_list_file:
        class_list_file.write(classes_json)


if __name__ == "__main__":
    scrape_cab()
