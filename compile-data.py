from functools import reduce
import pprint
import json
from collections import Counter

cr_data = {}
CLASS_LIST_FILE = "./class_list.json"
REVIEWS_LIST_FILE = "./reviews_list.json"
with open(CLASS_LIST_FILE) as class_file, open(REVIEWS_LIST_FILE) as reviews_file:
    class_data = json.load(class_file)
    cr_data = json.load(reviews_file)

    # pprint.pprint(data)

    # iterate over every cab course and find all CRs
    courses = []
    reviews = {}
    for course in class_data:
        # default fields
        course_dict = {}
        course_dict["dept"] = course["dept"]
        course_dict["num"] = course["num"]
        course_dict["code"] = course["dept"] + " " + course["num"]
        course_dict["name"] = course["name"]
        course_dict["prof"] = course["prof"]
        course_dict["time"] = course["time"]

        # calculated fields

        # grab all reviews for course
        course_crs = reviews[course["code"]]

        # course_crs = filter(
        #     lambda cr: cr["num"] == course["num"] and cr["dept"] == course["dept"],
        #     cr_data,
        # )
        # TODO: ensure prof formatting is the same
        # filter course reviews by same prof
        course_crs_with_same_prof = filter(
            lambda cr: cr["prof"] == course["prof"], course_crs
        )

        # general calculated fields
        course_dict["size"] = reduce(
            lambda acc, cr: acc + cr["size"], course_crs
        ) / len(course_crs)
        course_dict["num-respondents"] = reduce(
            lambda acc, cr: acc + cr["respondents"], course_crs
        ) / len(course_crs)
        course_dict["link"] = (
            "https://thecriticalreview.org/search/"
            + f"{course['dept']}/{course['num']}"
        )

        # calculated fields based on professor matching or not
        calc_num_hrs = lambda is_max, cr_list: reduce(
            lambda acc, cr: acc + cr["max_hrs" if is_max else "avg_hrs"], cr_list
        ) / len(cr_list)

        calc_avg_size = lambda cr_list: reduce(
            lambda acc, cr: acc + cr["size"], cr_list
        ) / len(cr_list)

        calc_avg_rating = lambda cr_list: reduce(
            lambda acc, cr: acc + cr["Course"], cr_list
        ) / len(cr_list)

        course_dict["same_prof"] = {
            "max_hrs": calc_num_hrs(True, course_crs_with_same_prof),
            "avg_hrs": calc_num_hrs(False, course_crs_with_same_prof),
            "avg_size": calc_avg_size(course_crs_with_same_prof),
            "avg_size": calc_avg_rating(course_crs_with_same_prof),
        }
        course_dict["all_reviews"] = {
            "max_hrs": calc_num_hrs(True, course_crs),
            "avg_hrs": calc_num_hrs(False, course_crs),
            "avg_size": calc_avg_size(course_crs),
            "avg_size": calc_avg_rating(course_crs),
        }

        courses.append(course_dict)


# write compiled data to file
courses_json = json.dumps({data: courses})
with open("compiled_course_data.json", "w") as f:
    f.write(courses_json)
