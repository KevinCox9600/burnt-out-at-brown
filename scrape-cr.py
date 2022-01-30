import requests
from bs4 import BeautifulSoup
from cookie import COOKIE_CONSTANTS
import json

class_list_file = open('class_list.json')
class_list_data = json.load(class_list_file)
class_list_file.close()

s = requests.Session()

## TO SEND TO FILE
courses = {}
profs = {}


for c in class_list_data["data"]:
    dept, num, prof, time, name = c['dept'], c['num'], c['prof'], c['time'], c['name']

    if prof not in profs: # prof key not yet created
        profs[prof] = [] # instantiate list

    code = dept + num
    if code not in courses: # code key not yet created
        courses[code] = [] # initialize list of reviews (each a dict)

    page = s.get(f"https://thecriticalreview.org/search/{dept}/{num}", cookies=COOKIE_CONSTANTS)

    soup = BeautifulSoup(page.content, "html.parser")

    for offering in soup.find_all("div", {"class": "ui tab"}):
        review = {}
        review["Year"] = offering["data-edition"]
        review["Course Code"] = code
        review["Dept"] = dept
        review["Number"] = num
        review["Name"] = name
        review["Prof"] = prof
        review["Time"] = time
        review["Link"] = f"https://thecriticalreview.org/search/{dept}/{num}"

        # order of tiny stats is course rating, prof rating, avg hours, max hours, respondents, and class size
        results = offering.find_all("div", {"class": "ui tiny statistic"})
        for r in results[:6]:
            label = r.find("div", {"class": "label"}).text.strip()
            value = r.find("div", {"class": "value"}).text.strip()
            review[label] = value
        grade_obj = offering.find("div", {"class": "review_data"})["data-test-value"]
        review["grade_obj"] = grade_obj

        # review dict now complete, add to correct list in courses
        courses[code].append(review)

        # add to list in profs dict
        profs[prof].append(review)


classes_json = json.dumps(courses)
class_list_file = open("class_objs.json", "w")
class_list_file.write(classes_json)
class_list_file.close()

profs_json = json.dumps(profs)
class_list_file = open("prof_objs.json", "w")
class_list_file.write(profs_json)
class_list_file.close()





# for c in class_list_data["data"]:
#     dept, num, prof, time, name = c['dept'], c['num'], c['prof'], c['time'], c['name']

#     code = dept + num

#     page = s.get(f"https://thecriticalreview.org/search/{dept}/{num}", cookies=COOKIE_CONSTANTS)

#     soup = BeautifulSoup(page.content, "html.parser")

#     for offering in soup.find_all("div", {"class": "ui tab"}):
#         course = {}
#         course["Course Dept"] = dept
#         course["Course Num"] = num
#         course["Prof"] = prof
#         course["Year"] = offering["data-edition"]
#         course["Link"] = "https://thecriticalreview.org/search/{dept}/{num}"
#         course["Time"] = time
#         results = offering.find_all("div", {"class": "ui tiny statistic"})
#         for r in results[:6]:
#             label = r.find("div", {"class": "label"}).text.strip()
#             value = r.find("div", {"class": "value"}).text.strip()
#             course[label] = value
#         grade_obj = offering.find("div", {"class": "review_data"})["data-test-value"]
#         course["grade_obj"] = grade_obj

#         all_courses[code] = course

# classes_json = json.dumps(all_courses)
# class_list_file = open("CR_classes.json", "w")
# class_list_file.write(classes_json)
# class_list_file.close()