import json
import os
import requests
from bs4 import BeautifulSoup

from constants import CLASS_LIST_FILE, CLASS_REVIEWS_LIST_FILE, PROF_REVIEWS_LIST_FILE
from cookie import COOKIE_CONSTANTS


def scrape_cr():
    with open(CLASS_LIST_FILE) as class_list_file:
        class_list_data = json.load(class_list_file)

    s = requests.Session()

    ## TO SEND TO FILE
    courses = {}
    profs = {}

    data = class_list_data["data"]
    data_length = len(data)
    print("data length:", data_length)
    for iterations, c in enumerate(data):
        if iterations % 100 == 0:
            print(f"iterations: {iterations} / {data_length}")

        dept, num, prof, time, name = (
            c["dept"],
            c["num"],
            c["prof"],
            c["time"],
            c["name"],
        )

        if prof not in profs:  # prof key not yet created
            profs[prof] = []  # instantiate list

        code = dept + num
        if code not in courses:  # code key not yet created
            courses[code] = []  # initialize list of reviews (each a dict)

        page = s.get(
            f"https://thecriticalreview.org/search/{dept}/{num}",
            cookies=COOKIE_CONSTANTS,
        )

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
            grade_obj = offering.find("div", {"class": "review_data"})[
                "data-test-value"
            ]
            review["grade_obj"] = grade_obj

            # review dict now complete, add to correct list in courses
            courses[code].append(review)

            # add to list in profs dict
            profs[prof].append(review)

    # write to class and professor files
    classes_json = json.dumps(courses)
    os.makedirs(os.path.dirname(CLASS_REVIEWS_LIST_FILE), exist_ok=True)
    with open(CLASS_REVIEWS_LIST_FILE, "w") as class_reviews_file:
        class_reviews_file.write(classes_json)

    profs_json = json.dumps(profs)
    os.makedirs(os.path.dirname(PROF_REVIEWS_LIST_FILE), exist_ok=True)
    with open(PROF_REVIEWS_LIST_FILE, "w") as prof_reviews_file:
        prof_reviews_file.write(profs_json)


if __name__ == "__main__":
    scrape_cr()
