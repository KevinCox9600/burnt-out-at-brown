"""
Builds a term's class_objs.json from data/cr_aggregated.json instead of scraping
thecriticalreview.org, for when a CR session cookie is unavailable.

Output is a drop-in replacement for scrape_cr.py's class_objs.json: a mapping of
course code -> list of review dicts.

The aggregate is treated as a cache of each CR page's *intrinsic* stats (year,
ratings, hours, respondents, class size, grade distribution). Everything else in
a review dict - Prof, Name, Time, Link - is stamped from the current term's CAB
listing, exactly as scrape_cr.py does, because those fields describe who is
teaching the course now, not who taught the reviewed offering.
"""

import json
import os

from constants import (
    CR_AGGREGATED_FILE,
    class_list_file,
    class_reviews_list_file,
    semester as CURRENT_SEMESTER,
)

# the six "tiny statistic" labels scrape_cr.py reads off a CR offering tab
CR_STAT_FIELDS = (
    "Course",
    "Professor",
    "Avg Hours",
    "Max Hours",
    "Respondents",
    "Class Size",
)
# fields that belong to the reviewed offering itself, used to identify duplicates
CR_INTRINSIC_FIELDS = ("Year",) + CR_STAT_FIELDS + ("grade_obj",)


def dedupe_offerings(reviews):
    """
    Drops repeated offerings, preserving order.

    The aggregate was unioned from past semesters' class_objs.json files, and
    each of those repeats a CR page once per CAB section, so the same offering
    can appear several times. Averages downstream are unweighted, so leaving the
    repeats in would silently over-weight those offerings.
    """
    seen = set()
    unique = []
    for review in reviews:
        key = tuple(review.get(field) for field in CR_INTRINSIC_FIELDS)
        if key in seen:
            continue
        seen.add(key)
        unique.append(review)
    return unique


def build_class_objs(sem=CURRENT_SEMESTER):
    print(f"building CR data for {sem} from {CR_AGGREGATED_FILE}")
    with open(class_list_file(sem)) as class_list_handle:
        class_list = json.load(class_list_handle)["data"]
    with open(CR_AGGREGATED_FILE) as aggregate_handle:
        aggregate = json.load(aggregate_handle)

    offerings_by_code = {
        code: dedupe_offerings(reviews) for code, reviews in aggregate.items()
    }

    courses = {}
    matched = 0
    for c in class_list:
        dept, num, prof, time, name = (
            c["dept"],
            c["num"],
            c["prof"],
            c["time"],
            c["name"],
        )

        code = dept + num
        if code not in courses:
            courses[code] = []

        offerings = offerings_by_code.get(code)
        if not offerings:
            continue
        matched += 1

        # one review per offering per section, mirroring scrape_cr.py's loop over
        # the class list: a course with two sections gets each offering twice,
        # stamped with each section's professor
        for offering in offerings:
            review = {
                "Year": offering["Year"],
                "Course Code": code,
                "Dept": dept,
                "Number": num,
                "Name": name,
                "Prof": prof,
                "Time": time,
                "Link": f"https://thecriticalreview.org/search/{dept}/{num}",
            }
            for field in CR_STAT_FIELDS:
                if field in offering:
                    review[field] = offering[field]
            review["grade_obj"] = offering.get("grade_obj", "")

            courses[code].append(review)

    review_count = sum(len(reviews) for reviews in courses.values())
    print(
        f"  {matched}/{len(class_list)} sections matched CR data, "
        f"{review_count} reviews across {len(courses)} codes"
    )

    out_file = class_reviews_list_file(sem)
    os.makedirs(os.path.dirname(out_file), exist_ok=True)
    with open(out_file, "w") as class_reviews_file:
        class_reviews_file.write(json.dumps(courses))
    print(f"  wrote {out_file}")


if __name__ == "__main__":
    build_class_objs()
