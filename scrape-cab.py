import requests
from bs4 import BeautifulSoup
from seleniumwire import webdriver
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
from seleniumwire.utils import decode
import json


driver = webdriver.Chrome(ChromeDriverManager().install())

CAB_URL = "https://cab.brown.edu/"

page = requests.get(CAB_URL)

# Set up Beautiful Soup parser
soup = BeautifulSoup(page.content, "html.parser")

# Find all department codes
results = soup.find(id="crit-dept")
departments = [option['value'] for option in results.find_all('option')]
filt_departments = str_list = list(filter(None, departments))

classes = []

for department_code in filt_departments:
    driver.get('https://cab.brown.edu')


    input_field = driver.find_element_by_id("crit-keyword")

    input_field.send_keys(department_code)
    input_field.send_keys(Keys.RETURN)
    driver.find_element_by_id("search-button").click()

    for request in driver.requests:
        if request.response:

            if request.url == f"https://cab.brown.edu/api/?page=fose&route=search&keyword={department_code}&is_ind_study=N&is_canc=N":
                body = decode(request.response.body, request.response.headers.get('Content-Encoding', 'identity'))
                str_body = body.decode('utf-8')
                dict = json.loads(str_body)
                results = dict["results"]

                for r in results:
                    code, title, time, prof = r["code"], r["title"], r["meets"], r["instr"]

                    # Split PHP 2510 into PHP, 2510
                    dept_identifier, num = code.split(" ")
                    classes.append({"num": num, "dept": dept_identifier, "name": title, "time": time, "prof": prof})
                    
# Write classes to a JSON file
classes_dict = {"data": classes}
classes_json = json.dumps(classes_dict)
class_list_file = open("class_list_hihi.json", "w")
class_list_file.write(classes_json)
class_list_file.close()

driver.quit()
