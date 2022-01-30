from bs4 import BeautifulSoup
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC



CR_url = "https://thecriticalreview.org/search/CSCI/1420"

driver = webdriver.Chrome(ChromeDriverManager().install())

driver.get(CR_url)


# get through username/password page
inputElement1 = driver.find_element_by_id("username")
inputElement1.send_keys('')

inputElement2 = driver.find_element_by_id("password")
inputElement2.send_keys('')

inputElement2.send_keys(Keys.ENTER)


# get through 2auth page
driver.switch_to.frame('duo_iframe') # REACHED

driver.find_element_by_xpath("//button[@class='auth-button&#x20;positive']")

# iframe_source = driver.page_source

# soup = BeautifulSoup(iframe_source, 'html.parser')
# print(soup.prettify())

    # click on passcode button
# buttons = driver.find_element(By.ID, "react-component")
# button = buttons.find_elements_by_id("passcode")
# print("LIST OF BUTTONS: ")
# print(buttons)
# buttons.find_elements_by_id("passcode").click()
#button.click()



#code_box = driver.find_element(By.CLASS_NAME, "passcode-input")

#inputCode = driver.find_element_by_class_name("base-wrapper")
#print("HEYYYYYYYYY")
#inputCode.send_keys('')
#inputCode.send_keys(Keys.ENTER)

# # pass to beautiful soup
# page_source = driver.page_source

# soup = BeautifulSoup(page_source, 'html.parser')
# print(soup.prettify())