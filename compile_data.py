from functools import reduce
import json
import os
import re

from constants import (
    CLASS_LIST_FILE,
    CLASS_REVIEWS_LIST_FILE,
    COMPILED_DATA_FILE,
    DEPARTMENT_DATA_FILE,
)
from helpers.stats import calc_max_hrs, calc_avg_hrs, calc_avg_rating


def compile_data():
    cr_data = {}
    with open(CLASS_LIST_FILE) as class_file, open(
        CLASS_REVIEWS_LIST_FILE
    ) as reviews_file:
        class_data = json.load(class_file)
        cr_data = json.load(reviews_file)

        # iterate over every cab course and find all CRs
        courses = {}
        for course in class_data["data"]:
            course_dict = create_course_dict_from_course(course, cr_data)

            courses[course_dict["code"]] = course_dict

        departments = compile_department_data(courses)

    # write compiled course data to file
    if courses:
        print("courses compiled properly")
    courses_json = json.dumps(courses)
    os.makedirs(os.path.dirname(COMPILED_DATA_FILE), exist_ok=True)
    with open(COMPILED_DATA_FILE, "w") as f:
        f.write(courses_json)

    # write department data to file
    if departments:
        print("departments compiled properly")
    department_json = json.dumps(departments)
    os.makedirs(os.path.dirname(DEPARTMENT_DATA_FILE), exist_ok=True)
    with open(DEPARTMENT_DATA_FILE, "w") as f:
        f.write(department_json)


def compile_department_data(courses):
    # compile department data (department to avg num hours, weighted by respondents)
    department_data = {}  # department to list of avg hours
    for _, course_dict in courses.items():
        if "all_reviews" in course_dict:
            dept = course_dict["dept"]
            num_respondents = course_dict["num-respondents"]
            average_hours = course_dict["all_reviews"]["avg_hrs"]
            weighted_hours = average_hours * num_respondents
            new_data = {
                "hours": average_hours,
                "weighted_hours": weighted_hours,
                "count": 1,
                "num_respondents": num_respondents,
            }
            if dept not in department_data:
                department_data[dept] = new_data
            else:
                for key, val in new_data.items():
                    department_data[dept][key] += val

    if not department_data:
        return False

    # use department data to find overall averages
    department_hours = []
    total_hours = 0
    total_count = 0
    for dept, dept_dict in department_data.items():
        if dept_dict["num_respondents"] == 0:
            print(dept_dict)
            print(f"skipping dept {dept}")
            continue
        total_hours += dept_dict["weighted_hours"]
        total_count += dept_dict["num_respondents"]
        department_hours.append(
            {
                "name": dept,
                "avg_hours": dept_dict["hours"] / dept_dict["count"],
                "weighted_avg_hours": dept_dict["weighted_hours"]
                / dept_dict["num_respondents"],
            }
        )

    departments = {
        "data": department_hours,
        "avg_class_hours": total_hours / total_count,
        "total_hours": total_hours,
        "total_count": total_count,
    }

    return departments


def create_course_dict_from_course(course, cr_data):
    """Creates a dictionary of compiled course data to be passed to the front end."""
    ######### default fields #########################
    course_dict = {}
    course_dict["dept"] = course["dept"]
    course_dict["num"] = course["num"]
    course_dict["code"] = course["dept"] + "" + course["num"]
    course_dict["name"] = course["name"]
    course_dict["prof"] = course["prof"]
    course_dict["time"] = course["time"]
    course_dict["writ"] = course["writ"]
    course_dict["fys"] = course["fys"]
    course_dict["soph"] = course["soph"]
    course_dict["description"] = course["description"]

    # grab all reviews for course, returning if no reviews found
    course_crs = cr_data.get(course_dict["code"])
    if not course_crs:
        course_dict["cr_data_available"] = "false"
        return course_dict
    else:
        course_dict["cr_data_available"] = "true"

    ######### calculated fields ######################

    # filter course reviews by same prof
    course_crs_with_same_prof = list(
        filter(lambda cr: cr["Prof"] == course["prof"], course_crs)
    )

    # general calculated fields
    course_dict["size"] = reduce(
        lambda acc, cr: acc + int(re.sub("[^0-9]", "", cr["Class Size"])),
        course_crs,
        0,
    ) / len(course_crs)
    course_dict["num-respondents"] = reduce(
        lambda acc, cr: acc + int(cr["Respondents"]), course_crs, 0
    ) / len(course_crs)
    course_dict["link"] = (
        "https://thecriticalreview.org/search/" + f"{course['dept']}/{course['num']}"
    )

    course_dict["same_prof"] = {
        "max_hrs": calc_max_hrs(course_crs_with_same_prof),
        "avg_hrs": calc_avg_hrs(course_crs_with_same_prof),
        "avg_rating": calc_avg_rating(course_crs_with_same_prof),
    }
    course_dict["all_reviews"] = {
        "max_hrs": calc_max_hrs(course_crs),
        "avg_hrs": calc_avg_hrs(course_crs),
        "avg_rating": calc_avg_rating(course_crs),
    }

    return course_dict


if __name__ == "__main__":
    compile_data()
