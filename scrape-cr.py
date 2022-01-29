import requests
from bs4 import BeautifulSoup
from cookie import COOKIE_CONSTANTS
import json

class_list_file = open('class_list.json')
class_list_data = json.load(class_list_file)
class_list_file.close()

s = requests.Session()

for c in class_list_data["data"]:
    dept, num = c['dept'], c['num']

    page = s.get(f"https://thecriticalreview.org/search/{dept}/{num}", cookies=COOKIE_CONSTANTS)

    soup = BeautifulSoup(page.content, "html.parser")

    for offering in soup.find_all("div", {"class": "ui tab"}):
        # print(offering["data-edition"])
        results = offering.find_all("div", {"class": "ui tiny statistic"})
        for r in results[:6]:
            # print(" ".join(r.text.split()))
            pass