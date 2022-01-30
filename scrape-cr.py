import requests
from bs4 import BeautifulSoup
from cookie import COOKIE_CONSTANTS
import json

class_list_file = open('class_list.json')
class_list_data = json.load(class_list_file)
class_list_file.close()

s = requests.Session()

course_info = []

ex = "https://thecriticalreview.org/search/CSCI/0150"

page = s.get(ex, cookies = COOKIE_CONSTANTS)

soup = BeautifulSoup(page.content, "html.parser")

all_courses = {"data": []}

for c in class_list_data["data"]:
    dept, num = c['dept'], c['num']

    page = s.get(f"https://thecriticalreview.org/search/{dept}/{num}", cookies=COOKIE_CONSTANTS)

    soup = BeautifulSoup(page.content, "html.parser")

    for offering in soup.find_all("div", {"class": "ui tab"}):
        course = {}
        course["Year"] = offering["data-edition"]
        results = offering.find_all("div", {"class": "ui tiny statistic"})
        for r in results[:6]:
            label = r.find("div", {"class": "label"}).text.strip()
            value = r.find("div", {"class": "value"}).text.strip()
            course[label] = value
        grade_obj = offering.find("div", {"class": "review_data"})["data-test-value"]
        course["grade_obj"] = grade_obj
        all_courses["data"].append(course)

classes_json = json.dumps(all_courses)
class_list_file = open("CR_classes.json", "w")
class_list_file.write(classes_json)
class_list_file.close()