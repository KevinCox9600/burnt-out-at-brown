"""
Runs the full pipeline over one or more semesters, sourcing Critical Review data
from data/cr_aggregated.json rather than scraping CR.

    python update_semesters.py fall2026 spring2027

With no arguments it runs the semester set in constants.py.
"""

import sys

from compile_data import compile_data
from constants import semester as CURRENT_SEMESTER, split_semester
from cr_from_aggregate import build_class_objs
from scrape_cab import scrape_cab


def update_semesters(semesters):
    for sem in semesters:
        split_semester(sem)  # fail fast on a typo before spending a scrape
    for sem in semesters:
        print(f"####### {sem} " + "#" * (34 - len(sem)))
        scrape_cab(sem)
        build_class_objs(sem)
        compile_data(sem)
    print("####### DONE ##############################")


if __name__ == "__main__":
    update_semesters(sys.argv[1:] or [CURRENT_SEMESTER])
