# local constants
SEASON = "spring"
YEAR = "2024"
semester = SEASON.lower() + YEAR

# data constants
CLASS_LIST_FILE = f"./data/{semester}/class_list.json"
CLASS_REVIEWS_LIST_FILE = f"./data/{semester}/class_objs.json"
PROF_REVIEWS_LIST_FILE = f"./data/{semester}/prof_objs.json"
COMPILED_DATA_FILE = f"./burnt-out-app/src/data/{semester}/compiled_course_data.json"
DEPARTMENT_DATA_FILE = f"./burnt-out-app/src/data/{semester}/department_data.json"

# urls
# TODO: automate SRC_DB
# SRC_DB = "202310"  # fall2023
SRC_DB = "202320"  # spring2024
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
