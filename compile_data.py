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

        # compile department data (department to avg num hours, weighted by respondents)
        department_data = {}  # department to list of avg hours
        for _, course_dict in courses.items():
            if "all_reviews" in course_dict:
                dept = course_dict["dept"]
                num_respondents = course_dict["num-respondents"]
                average_hours = course_dict["all_reviews"]["avg_hrs"]
                sum_of_hours = average_hours * num_respondents
                if dept not in department_data:
                    department_data[dept] = {
                        "sum_of_hours": sum_of_hours,
                        "count": num_respondents,
                    }
                else:
                    department_data[dept]["sum_of_hours"] += sum_of_hours
                    department_data[dept]["count"] += num_respondents

        # use department data to find overall averages
        department_hours = []
        for dept, dept_dict in department_data.items():
            department_hours.append(
                {
                    "name": dept,
                    "hours": dept_dict["sum_of_hours"] / dept_dict["count"],
                }
            )
        departments = {"data": department_hours}

    # write compiled course data to file
    if courses:
        print("courses compiled properly")
    courses_json = json.dumps(courses)
    os.makedirs(os.path.dirname(COMPILED_DATA_FILE), exist_ok=True)
    with open(COMPILED_DATA_FILE, "w") as f:
        f.write(courses_json)

    # write department data to file
    if department_data:
        print("departments compiled properly")
    department_json = json.dumps(departments)
    os.makedirs(os.path.dirname(DEPARTMENT_DATA_FILE), exist_ok=True)
    with open(DEPARTMENT_DATA_FILE, "w") as f:
        f.write(department_json)


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
