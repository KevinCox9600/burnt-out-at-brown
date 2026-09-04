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

This is the primary recurring task.

1. **`constants.py`** — change `SEASON` and `YEAR` to the current semester
2. **`burnt-out-app/src/data/constants.js`** — add the new semester string to `SEMESTERS` array and update `DEFAULT_SEMESTER`
3. Run the pipeline, then rebuild the frontend to confirm it compiles

The compiled JSON files are written to `burnt-out-app/src/data/<semester>/`.

### Without a Critical Review cookie (current situation)

```bash
python update_semesters.py fall2026 spring2027
```

Scrapes CAB for each term, sources CR data from `data/cr_aggregated.json`, and
compiles. Takes semesters as arguments, so one run covers several terms.

### With a Critical Review cookie

Obtain a fresh `connect.sid` cookie from thecriticalreview.org and put it in
`cookie.py` (copy from `cookie_template.py` if needed), then run `python main.py`
for the semester set in `constants.py`. Prefer this when it is available: it
picks up reviews published since the aggregate was last built.

## Architecture

### Data Pipeline

```
CAB API → scrape_cab.py → data/<semester>/class_list.json
                                   ↓
             scrape_cr.py → data/<semester>/class_objs.json
                                           prof_objs.json
      (or cr_from_aggregate.py, which builds class_objs.json from
       data/cr_aggregated.json when no CR cookie is available)
                                   ↓
             compile_data.py → burnt-out-app/src/data/<semester>/compiled_course_data.json
                                                                  department_data.json
```

- `constants.py` defines the current semester plus path and CAB-payload helpers that take a semester, so one run can cover several terms. The CAB DB string encoding: spring YYYY → `(YYYY-1)20`, fall YYYY → `(YYYY)10`.
- Every stage (`scrape_cab`, `scrape_cr`, `cr_from_aggregate`, `compile_data`) takes a semester argument defaulting to the one in `constants.py`.
- `scrape_cab.py` fans the CAB detail-view requests across a 100-thread pool and retries transient failures.
- `helpers/stats.py` provides `calc_max_hrs`, `calc_avg_hrs`, `calc_avg_rating` used by `compile_data.py`. They return `-1` when no review reported a value; treat that as "no data", never as a number.
- `scrape_cr.py` requires a valid `connect.sid` session cookie from thecriticalreview.org (stored in `cookie.py`, gitignored).
- `scrape_cr.py` stamps each review's `Prof`, `Name`, `Time` and `Link` from the CAB listing, not from the Critical Review page. So `same_prof` means "reviews attached to this section's professor", and it equals `all_reviews` except for courses with multiple sections.

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

### RecruitingAdvert

**Files:** `burnt-out-app/src/components/RecruitingAdvert.js`, `burnt-out-app/src/components/RecruitingAdvert.css`

**Not currently rendered anywhere.** It was an alert banner at the top of the Courses page advertising for student contributors; #29 removed it from `routes/courses.js`, and the leftover import in `App.js` was dropped later. The component is class-based with `expandDesc` and `hoverDesc` state, but its render output and CSS are empty stubs.