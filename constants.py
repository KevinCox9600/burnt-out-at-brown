########## local constants ############
# update season and year every time you run main.py
SEASON = "fall"
YEAR = "2026"
semester = SEASON.lower() + YEAR

###### DO NOT NEED TO UPDATE BELOW #############


def split_semester(sem):
    """'fall2026' -> ('fall', '2026')"""
    for season in ("spring", "fall"):
        if sem.startswith(season):
            return season, sem[len(season) :]
    raise ValueError(f"unrecognized semester {sem!r}, expected e.g. 'fall2026'")


# data constants
def class_list_file(sem=semester):
    return f"./data/{sem}/class_list.json"


def class_reviews_list_file(sem=semester):
    return f"./data/{sem}/class_objs.json"


def prof_reviews_list_file(sem=semester):
    return f"./data/{sem}/prof_objs.json"


def compiled_data_file(sem=semester):
    return f"./burnt-out-app/src/data/{sem}/compiled_course_data.json"


def department_data_file(sem=semester):
    return f"./burnt-out-app/src/data/{sem}/department_data.json"


CLASS_LIST_FILE = class_list_file()
CLASS_REVIEWS_LIST_FILE = class_reviews_list_file()
PROF_REVIEWS_LIST_FILE = prof_reviews_list_file()
COMPILED_DATA_FILE = compiled_data_file()
DEPARTMENT_DATA_FILE = department_data_file()

# every Critical Review review ever scraped, unioned across past semesters
CR_AGGREGATED_FILE = "./data/cr_aggregated.json"


# urls
def construct_db_string(season, year, suffix=None):
    """
    spring 2023 = 202220
    fall 2022 = 202210

    """
    db_yr = int(year)
    if season == "spring":
        db_yr -= 1

    if not suffix:
        suffix = "20" if season == "spring" else "10"

    return str(db_yr) + suffix


SRC_DB = construct_db_string(SEASON, YEAR)
CAB_URL = "https://cab.brown.edu/"
CAB_COURSE_SEARCH_URL = (
    "https://cab.brown.edu/api/?page=fose&route=search&is_ind_study=N&is_canc=N"
)
CAB_DETAILS_URL = "https://cab.brown.edu/api/?page=fose&route=details"


def cab_search_payload(sem=semester):
    return {
        "other": {"srcdb": construct_db_string(*split_semester(sem))},
        "criteria": [
            {"field": "is_ind_study", "value": "N"},
            {"field": "is_canc", "value": "N"},
        ],
    }


CAB_SEARCH_PAYLOAD = cab_search_payload()

# CAB rejects requests without a browser User-Agent
CAB_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/147.0.0.0 Safari/537.36"
    ),
}
