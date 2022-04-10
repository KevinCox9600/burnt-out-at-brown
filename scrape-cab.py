import requests
from bs4 import BeautifulSoup
from seleniumwire import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from seleniumwire.utils import decode
import json
import time


def wait_for_response(driver, seconds_to_wait=10):
    """Wait for the one of the requests to have response and return request."""
    start_time = time.time()
    while time.time() - start_time < seconds_to_wait:
        search_requests = [
            request
            for request in driver.requests
            if f"keyword={department_code}" in request.url
        ]
        for request in search_requests:
            # check if request exists, and if it does, return it
            if request.response:
                return request
    print("No response found")
    return None


driver = webdriver.Chrome(ChromeDriverManager().install())

CAB_URL = "https://cab.brown.edu/"

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

classes = []

# for each department, find all courses
print("finding courses by department")
for department_code in unique_dept:
    driver.get("https://cab.brown.edu")

    input_field = driver.find_element(By.ID, "crit-keyword")

    input_field.send_keys(department_code)
    input_field.send_keys(Keys.RETURN)
    driver.find_element(By.ID, "search-button").click()

    # find request of the department's courses and process results
    print(department_code)
    # time.sleep(5)
    # [print(request.url) for request in search_requests]
    # go until a response exists or 10 seconds have elapsed
    request = wait_for_response(driver)
    if request:
        if f"keyword={department_code}" in request.url:
            if request.response:

                # if f'keyword={department_code}' in request.url:
                #     print('HERE', request.url, request.response.body)
                # if request.url == f"https://cab.brown.edu/api/?page=fose&route=search&keyword={department_code}&is_ind_study=N&is_canc=N":
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
class_list_file = open("class_list.json", "w")
class_list_file.write(classes_json)
class_list_file.close()

driver.quit()
