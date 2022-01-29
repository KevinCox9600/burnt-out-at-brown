import requests
from bs4 import BeautifulSoup
from cookie import COOKIE_CONSTANTS

s = requests.Session()
r = s.get('https://thecriticalreview.org/search/CSCI/0020', cookies=COOKIE_CONSTANTS)

soup = BeautifulSoup(r.content, "html.parser")
results = soup.find_all("div", {"class": "ui tiny statistic"})

for r in results[:6]:
    print(" ".join(r.text.split()))