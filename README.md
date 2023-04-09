# burnt-out-at-brown
A website that displays a list of courses at Brown known to have the lowest workloads to enable
students to optimize their work/life balance

## How to run
1. Update semester (season and year) in `constants.py` and in `constants.js` in format 'spring2023'
   1. In python, it will determine which semesters are scraped
   2. In the javascript, it will determine which semesters are displayed
2. Update the SRC_DB in the `constants.py` file
   1. Find this by searching for a course within CAB for the semester that you wanna scrape
      and examine the network request payload to find the source database string
3. Go to critical review and get all cookies, putting them in cookies.py as a json object named
   COOKIE_CONSTANTS. Cannot be dumped with document.cookie because of HTTP only session id.
4. Run `python main.py` which will scrape cab, scrape the critical review, and then compile data

## How it works
The scrape-cab.py file logs into CAB to scrape a list of courses offered this semester (spring 
'22) at Brown and their corresponding data (course number, department, name, time, and 
professor), and formats the data as a json. scrape-cr.py then reads through the json that 
scrape-cab.py outputted. For each course in the json, scrape-cr.py goes to 
thecriticalreview.com for that page and scrapes additional data (the critical review link, 
the course and professor ratings, the average and max time commitment, the number of 
respondents, class size, and additional unpublished info). scrape-cr.py creates two json 
files from this aggregated data: (1) class_objs.json, which is a dictionary from course code to 
a list of course reviews (and corresponding data) for that course, and (2) prof_objs.json, 
which is a dictionary from the professor to the list of course reviews (and corresponding 
data) for courses they have taught. These two jsons allow for front-end manipulation of the 
data, such as sorting courses or professors by least workload. Currently, we do not use
prof_objs.json.

Lastly, the data is compiled with compile_data.py, which aggregates the data into a form
which our front end expects.
