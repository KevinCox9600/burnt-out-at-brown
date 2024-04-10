# burnt-out-at-brown

A website that displays a list of courses at Brown known to have the lowest workloads to enable
students to optimize their work/life balance

## Overview

Burnt Out at Brown lists any courses that both appear on CAB for a
given semester and have Critical Review data. First, we scrape CAB data,
then we scrape Critical Review data, and then lastly, we compile the data
and move it into a front end folder, where it is loaded on the static website.
Users can use the frontend to filter and sort courses based on various metrics,
such as number of hours per week, time of day, and whether they are first year
seminars.

## Setup

1. Create a [Python virtual environment](https://docs.python.org/3/library/venv.html) in the 
root directory (burnt-out-at-brown) by running `python -m venv .venv`.
2. Start the virtual environment:
   1. On Mac: `source .venv/bin/activate`
   2. On PC: `.venv\Scripts\Activate.ps1` (powershell) or `.venv\Scripts\activate.bat` (cmd.exe)
3. Install requirements: `pip install -r requirements.txt`

## How to run

1. Run setup above if you haven't already
2. Update semester (season and year) in both `constants.py` and `constants.js` in format 'spring2023'
   1. In python, it will determine which semesters are scraped
   2. In the javascript, it will determine which semesters are displayed
   3. If the front end has a semester that has not yet been scraped, it will produce an error (:frowny-face:)
3. Go to the Critical Review and log in. Get the value of the "connect.sid" cookie from the
   cookies section in the developer tools (Developer Tools > Application > Cookies).
   Put this into a file called cookie.py.
   1. If `cookie.py` does not already exist, make a copy of `cookie_template.py`, rename it
      `cookie.py` and insert the connect.sid where suggested.
4. Run `python main.py` which will scrape cab, scrape the critical review, and then compile data
   for the given semester you selected in `constants.py`. Repeat steps 2 and 4 for any additional
   semesters you wish to update.

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
