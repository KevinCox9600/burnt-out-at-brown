from bs4 import BeautifulSoup
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By


CR_url = "https://thecriticalreview.org/search/CSCI/1420"

driver = webdriver.Chrome(ChromeDriverManager().install())

# options = webdriver.ChromeOptions()
# options.add_argument('--ignore-certificate-errors')
# options.add_argument('--incognito')
# options.add_argument('--headless')
# driver = webdriver.Chrome("/usr/lib/chromium-browser/chromedriver", chrome_options=options)

driver.get(CR_url)


# get through username/password page
inputElement1 = driver.find_element_by_id("username")
inputElement1.send_keys('isharon')

inputElement2 = driver.find_element_by_id("password")
inputElement2.send_keys('7A4DJxsH*axzakT')

inputElement2.send_keys(Keys.ENTER)

# get through 2auth page

# Store the web element
#iframe = driver.find_element(By.cssSelector("#duo_iframe"))

# Switch to the frame
# iframe = driver.find_element(By.CSS_SELECTOR, "#modal > iframe")

driver.switch_to.frame('duo_iframe')

inputCode = driver.find_element_by_class_name("base-wrapper")
print("HEYYYYYYYYY")
#inputCode.send_keys('053967809')
#inputCode.send_keys(Keys.ENTER)

# # pass to beautiful soup
# page_source = driver.page_source

# soup = BeautifulSoup(page_source, 'html.parser')
# print(soup.prettify())