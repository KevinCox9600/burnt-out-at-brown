########## local constants ############
# update season and year every time you run main.py
SEASON = "spring"
YEAR = "2025"
semester = SEASON.lower() + YEAR

###### DO NOT NEED TO UPDATE BELOW #############

# data constants
CLASS_LIST_FILE = f"./data/{semester}/class_list.json"
CLASS_REVIEWS_LIST_FILE = f"./data/{semester}/class_objs.json"
PROF_REVIEWS_LIST_FILE = f"./data/{semester}/prof_objs.json"
COMPILED_DATA_FILE = f"./burnt-out-app/src/data/{semester}/compiled_course_data.json"
DEPARTMENT_DATA_FILE = f"./burnt-out-app/src/data/{semester}/department_data.json"

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


# SRC_DB = "202310"  # fall2023
# SRC_DB = "202320"  # spring2024
SRC_DB = construct_db_string(SEASON, YEAR)
CAB_URL = "https://cab.brown.edu/"
CAB_COURSE_SEARCH_URL = (
    "https://cab.brown.edu/api/?page=fose&route=search&is_ind_study=N&is_canc=N"
)
CAB_SEARCH_PAYLOAD = {
    "other": {"srcdb": SRC_DB},  # TODO: Check if this needs to be updated
    "criteria": [
        {"field": "is_ind_study", "value": "N"},
        {"field": "is_canc", "value": "N"},
    ],
}
