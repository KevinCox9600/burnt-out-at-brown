"""
Scrapes CAB (Courses @ Brown) for the current term and outputs into class_list.json
"""

import json
import os
import requests
import time
from bs4 import BeautifulSoup
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select

from seleniumwire import webdriver
from seleniumwire.utils import decode
from webdriver_manager.chrome import ChromeDriverManager

from constants import CLASS_LIST_FILE, CAB_URL, SEASON, YEAR


def wait_for_response(driver, department_code, seconds_to_wait=10):
    """Wait for the one of the requests to have response and return request."""
    start_time = time.time()
    request_url_substring = f"keyword={department_code}"
    while time.time() - start_time < seconds_to_wait:
        search_requests = [
            request
            for request in driver.requests
            if request_url_substring in request.url
        ]
        # for each request, check if request exists, and if it does, return it
        for request in search_requests:
            if request.response:
                return request
    print("No response found")
    return None


def scrape_cab():
    driver = webdriver.Chrome(ChromeDriverManager().install())

    print("loading CAB")
    page = requests.get(CAB_URL)

    # Set up Beautiful Soup parser
    soup = BeautifulSoup(page.content, "html.parser")

    # Find all department codes
    print("getting department codes")
    results = soup.find(id="crit-dept")
    departments = [option["value"] for option in results.find_all("option")]
    filt_departments = str_list = list(filter(None, departments))  # why str_list?

    print("getting subjects")
    results_s = soup.find(id="crit-subject")
    subjects = [option["value"] for option in results_s.find_all("option")]
    filt_subjects = str_list = list(filter(None, subjects))

    unique_dept = list(set(filt_subjects + filt_departments))

    unique_dept = [c.lower() for c in unique_dept]
    unique_dept.sort()

    # for each department, find all courses
    semester_text = f"{SEASON.capitalize()} {YEAR}"
    classes = []
    print("finding courses by department")
    for department_code in unique_dept:
        driver.get("https://cab.brown.edu")

        # select semester
        select = Select(driver.find_element_by_id("crit-srcdb"))
        select.select_by_visible_text(semester_text)

        # search for department
        input_field = driver.find_element(By.ID, "crit-keyword")

        input_field.send_keys(department_code)
        input_field.send_keys(Keys.RETURN)
        driver.find_element(By.ID, "search-button").click()

        # find request of the department's courses and process results
        request = wait_for_response(driver, department_code)
        if request:
            if request.response:
                body = decode(
                    request.response.body,
                    request.response.headers.get("Content-Encoding", "identity"),
                )
                str_body = body.decode("utf-8")
                dict = json.loads(str_body)
                results = dict["results"]

                print(department_code, len(results))

                # process results
                for r in results:
                    code, title, time_of_class, prof = (
                        r["code"],
                        r["title"],
                        r["meets"],
                        r["instr"],
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
                        }
                    )

    # Write classes to a JSON file
    classes_dict = {"data": classes}
    classes_json = json.dumps(classes_dict)
    os.makedirs(os.path.dirname(CLASS_LIST_FILE), exist_ok=True)
    with open(CLASS_LIST_FILE, "w") as class_list_file:
        class_list_file.write(classes_json)

    driver.quit()


if __name__ == "__main__":
    scrape_cab()
