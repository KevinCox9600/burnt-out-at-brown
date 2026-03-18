# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Burnt Out at Brown is a website that displays Brown University courses ranked by lowest workload. It has two parts:
1. **Python scraper** (root directory) — scrapes CAB and The Critical Review, compiles data
2. **React frontend** (`burnt-out-app/`) — displays compiled course data as a filterable/sortable table

## Commands

### Python Scraper (run from repo root)

```bash
# Set up virtualenv (first time)
python -m venv .venv
source .venv/bin/activate  # Mac
pip install -r requirements.txt

# Run the full pipeline (scrape CAB → scrape CR → compile data)
python main.py

# Run individual steps
python scrape_cab.py
python scrape_cr.py
python compile_data.py
```

### React Frontend (run from `burnt-out-app/`)

```bash
cd burnt-out-app
npm start    # dev server
npm run build  # production build
npm test     # run tests
```

## Adding a New Semester

This is the primary recurring task. Two files must be updated:

1. **`constants.py`** — change `SEASON` and `YEAR` to the new semester
2. **`burnt-out-app/src/data/constants.js`** — add the new semester string to `SEMESTERS` array and update `DEFAULT_SEMESTER`

Then:
- Obtain a fresh `connect.sid` cookie from thecriticalreview.org and put it in `cookie.py` (copy from `cookie_template.py` if needed)
- Run `python main.py` from repo root
- The compiled JSON files are written to `burnt-out-app/src/data/<semester>/`

## Architecture

### Data Pipeline

```
CAB API → scrape_cab.py → data/<semester>/class_list.json
                                   ↓
             scrape_cr.py → data/<semester>/class_objs.json
                                           prof_objs.json
                                   ↓
             compile_data.py → burnt-out-app/src/data/<semester>/compiled_course_data.json
                                                                  department_data.json
```

- `constants.py` defines semester, file paths, and CAB API parameters. The CAB DB string encoding: spring YYYY → `(YYYY-1)20`, fall YYYY → `(YYYY)10`.
- `helpers/stats.py` provides `calc_max_hrs`, `calc_avg_hrs`, `calc_avg_rating` used by `compile_data.py`.
- `scrape_cr.py` requires a valid `connect.sid` session cookie from thecriticalreview.org (stored in `cookie.py`, gitignored).

### Compiled Course Data Schema

Each entry in `compiled_course_data.json` has:
- `dept`, `num`, `code`, `name`, `prof`, `time`, `writ`, `fys`, `soph`, `description`, `link`
- `size`, `num-respondents`
- `same_prof` and `all_reviews`: each with `max_hrs`, `avg_hrs`, `avg_rating`
- `cr_data_available`: `"true"` or `"false"`

The frontend defaults to using `same_prof` stats (reviews only from the current semester's professor).

### Frontend

- Single-page React app using React Router. Routes: `/courses` (main table), `/about`, `/secret` (departments).
- `CourseTable.js` is the main component — manages all filter/sort state and loads semester data via `require()` (so each semester's JSON is bundled at build time).
- `CourseRow.js` renders one table row; it is responsive (badges on mobile, columns on desktop).
- `burnt-out-app/src/data/constants.js` controls which semesters appear in the UI dropdown.

## Important Notes

- The `env/` directory is an old Python 3.7 virtualenv committed to the repo; use `.venv/` instead.
- `prof_objs.json` is scraped but currently unused by the frontend.
- The `components-old/` folder contains deprecated components.
- See `documentation/common_bugs.md` for known scraping issues and `documentation/todos.md` for planned work.
