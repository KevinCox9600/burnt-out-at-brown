import React from "react";
import ReactToolTip from "react-tooltip";
import CourseRow from "./CourseRow";
import { SEMESTERS, DEFAULT_SEMESTER } from '../data/constants';
import "./CourseTable.css";

/**
 * CourseTable is a table of courses + a filter form to search them.
 */
class CourseTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sorts: {
        sortBy: "avg_hrs", // sortBy must match the snake case of the data.
        sortAsc: true,
      },

      filters: {
        semester: DEFAULT_SEMESTER, // in format `${lowerCaseSeason}${year}`
        maxAvgHrs: 100, // Do we need this filter?
        maxMaxHrs: 100, // Do we need this filter?
        maxAvgSize: 500, // Do we need this filter?
        prof: "",
        dept: "",
        days: { "M": true, "T": true, "W": true, "Th": true, "F": true },
        times: { "earlyAM": true, "AM": true, "PM": true, "latePM": true },
        writ: false,
        fys: false,
        soph: false,
        sameProf: true, // whether or not the stats are based on the professor who is teaching that semester.
      }
    };

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleFilterChangeEvent = this.handleFilterChangeEvent.bind(this);
    this.handleDayFilterChange = this.handleDayFilterChange.bind(this);
    this.handleTimeFilterChange = this.handleTimeFilterChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleSortChangeEvent = this.handleSortChangeEvent.bind(this);
    this.getSemesterSeasonAndYear = this.getSemesterSeasonAndYear.bind(this);
    this.courseOccursInScheduledTimeAndDays = this.courseOccursInScheduledTimeAndDays.bind(this);
  }

  // METHODS
  /**
   * Handles a filter change by updating the filters state.
   * @param {*} filter - the name of the filter.
   * @param {*} value - the new filter value.
   */
  handleFilterChange(filter, value) {
    this.setState({
      "filters": {
        ...this.state.filters,
        [filter]: value,
      }
    });
  }

  /**
   * Handles a filter change through an event (useful for forms).
   * @param {*} event - the change event.
   */
  handleFilterChangeEvent(event) {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    this.handleFilterChange(name, value);
  }

  /**
   * Handles changes to the days filter.
   * @param {*} event - the change event on any day checkbox.
   */
  handleDayFilterChange(event) {
    const day = event.target.name;
    const newDays = this.state.filters.days;

    newDays[day] = !newDays[day];

    this.handleFilterChange("days", newDays);
  }
  /**
   * Handles changes to the times filter.
   * @param {*} event - the change event on any time checkbox.
   */
  handleTimeFilterChange(event) {
    const time = event.target.name;
    const newTimes = this.state.filters.times;

    newTimes[time] = !newTimes[time];

    this.handleFilterChange("times", newTimes);
  }

  /**
   * Handles a sort change by updating the sorts state.
   * @param {*} sortBy - the sortBy value.
   */
  handleSortChange(sortBy) {
    const new_sort_state = {
      ...this.state.sorts
    };

    // if the sortBy value hasn't changed,
    // toggle sort direction
    if (this.state.sorts.sortBy === sortBy) {
      new_sort_state.sortAsc = !this.state.sorts.sortAsc;
    }
    // otherwise, change sort by and revert to ascending
    else {
      new_sort_state.sortBy = sortBy;
      new_sort_state.sortAsc = true;
    }

    this.setState({
      "sorts": new_sort_state
    });
  }
  /**
   * Handles a sort change through an event (useful for forms).
   * @param {*} event - the change event.
   */
  handleSortChangeEvent(event) {
    const sortBy = event.target.value;
    this.handleSortChange(sortBy);
  }

  /**
   * Helper function to blur a target on focus attempt.
   * Used to override annoying Bootstrap behavior.
   * @param {*} event - the focus event.
   */
  blurFocus(event) {
    event.target.blur();
  }

  /**
   * Given a semester string, return the separate season and year.
   * @param {string} semester - formatted like `${lowerCaseSeason}${year}` (e.g., "fall2022")
   * @returns a dictionary with season (uppercase) and year separated.
   */
  getSemesterSeasonAndYear(semester) {
    const semesterText = semester.match(/[a-zA-Z]+|[0-9]+/g);
    const season = semesterText[0].charAt(0).toUpperCase() + semesterText[0].slice(1).toLowerCase();
    const year = semesterText[1];
    return { season, year };
  }

  /**
   * Given a day-time string, returns whether or not the course should appear.
   * @param {string} dateTime - formatted like `${days} ${start}-${end}{'a'||'p'}`
   * @returns {boolean} whether or not the course occurs in the filtered days/times. 
   */
  courseOccursInScheduledTimeAndDays(dateTime) {
    const [daysStr, timeStr] = dateTime.split(" ");

    // check through all days and return false if one of the days is not there
    for (let i = 0; i < daysStr.length; i++) {
      if (daysStr[i] === "T" && i + 1 < daysStr.length && daysStr[i + 1] === "h") {
        if (!this.state.filters.days['Th']) {
          return false;
        }
        i++;
      } else {
        if (!this.state.filters.days[daysStr[i]]) {
          return false;
        }
      }
    }

    // compare all start times to figure out if course shouldn't show
    const startTime = parseInt(timeStr);
    if (startTime < 10 && timeStr.includes('a') && !this.state.filters.times['earlyAM']) {
      return false;
    }
    if (startTime >= 10 && parseInt(timeStr) < 12 && timeStr.includes('a') && !this.state.filters.times['AM']) {
      return false;
    }
    if ((startTime >= 12 || startTime >= 1) && startTime < 5 && timeStr.includes('p') && !this.state.filters.times['PM']) {
      return false;
    }
    if (startTime >= 5 && timeStr.includes('p') && !this.state.filters.times['latePM']) {
      return false;
    }

    return true;

  }

  // COMPUTED PROPERTIES
  /**
   * Gets the appropriate data based on the current selected semester.
   * Filters out rows with data with invalid data.
   */
  get semesterData() {
    const semesterDict = require(`../data/${this.state.filters.semester}/compiled_course_data.json`);
    const dataArray = Object.values(semesterDict);
    const same = this.state.filters.sameProf ? "same_prof" : "all_reviews";
    return dataArray.filter((rowData) => {
      return (rowData[same] && rowData[same]['max_hrs'] > 0 &&
        rowData[same]['avg_hrs'] > 0);
    });

  }
  /**
   * Gets the HTML for the semester options (e.g., Fall 2022, Spring 2023, etc.).
   */
  get semesterOptions() {
    return (
      SEMESTERS
        .map((s, index) => {
          const { season, year } = this.getSemesterSeasonAndYear(s);
          return (
            <option key={index} value={s}>{season} {year}</option>
          );
        })
    );
  }

  /**
   * Gets the HTML for the filter form.
   */
  get filterForm() {
    return (
      <form>
        {/* Row with Semester select */}
        <div className="row">
          <div className="input-group m-sm-3 my-1 col-sm">
            <label htmlFor="semester" className="input-group-text">Semester</label>
            <select className="form-control" name="semester" id="semester"
              value={this.state.filters.semester}
              onChange={this.handleFilterChangeEvent}
            >
              {this.semesterOptions}
            </select>
          </div>
        </div>
        {/* Row with Department and Professor inputs (separate rows on mobile) */}
        <div className="row">
          <div className="input-group m-sm-3 my-1 col-sm">
            <label htmlFor="dept" className="input-group-text">Department</label>
            <input type="text" className="form-control" placeholder="CSCI"
              name="dept" id="dept"
              value={this.state.filters.dept}
              onChange={this.handleFilterChangeEvent}
            />
          </div>
          <div className="input-group m-sm-3 my-1 col-sm">
            <label htmlFor="prof" className="input-group-text">Professor</label>
            <input type="text" className="form-control" placeholder="Carberry"
              name="prof" id="prof"
              value={this.state.filters.prof}
              onChange={this.handleFilterChangeEvent} />
          </div>
        </div>
        {/* Row with Days and Time filters */}
        <div className="row">
          <div className="mx-sm-3 my-1 col-sm">
            <span className="text-muted">What days?</span>
            <div className="btn-group d-flex" role="group" aria-label="Days of course">
              <input type="checkbox" name="M" className="btn-check" id="mon" autoComplete="off"
                checked={this.state.filters.days['M']} onChange={this.handleDayFilterChange}
                onFocus={this.blurFocus} />
              <label className="btn btn-outline-primary" htmlFor="mon">Mon</label>
              <input type="checkbox" name="T" className="btn-check" id="tue" autoComplete="off"
                checked={this.state.filters.days['T']} onChange={this.handleDayFilterChange}
                onFocus={this.blurFocus} />
              <label className="btn btn-outline-primary" htmlFor="tue">Tue</label>
              <input type="checkbox" name="W" className="btn-check" id="wed" autoComplete="off"
                checked={this.state.filters.days['W']} onChange={this.handleDayFilterChange}
                onFocus={this.blurFocus} />
              <label className="btn btn-outline-primary" htmlFor="wed">Wed</label>
              <input type="checkbox" name="Th" className="btn-check" id="thu" autoComplete="off"
                checked={this.state.filters.days['Th']} onChange={this.handleDayFilterChange}
                onFocus={this.blurFocus} />
              <label className="btn btn-outline-primary" htmlFor="thu">Thu</label>
              <input type="checkbox" name="F" className="btn-check" id="fri" autoComplete="off"
                checked={this.state.filters.days['F']} onChange={this.handleDayFilterChange}
                onFocus={this.blurFocus} />
              <label className="btn btn-outline-primary" htmlFor="fri">Fri</label>
            </div>
          </div>
          <div className="mx-sm-3 my-1 col-sm">
            <ReactToolTip place="top" type="dark" effect="solid" id="tp-early-am" >
              Starts before 10am
            </ReactToolTip>
            <ReactToolTip place="top" type="dark" effect="solid" id="tp-am" >
              10am-12pm
            </ReactToolTip>
            <ReactToolTip place="top" type="dark" effect="solid" id="tp-pm" >
              12pm-5pm
            </ReactToolTip>
            <ReactToolTip place="top" type="dark" effect="solid" id="tp-late-pm" >
              Starts after 5pm
            </ReactToolTip>
            <span className="text-muted">What times?</span>
            <div className="btn-group d-flex" role="group" aria-label="Time options">
              <input type="checkbox" name="earlyAM" className="btn-check" id="early-am" autoComplete="off"
                checked={this.state.filters.times['earlyAM']} onChange={this.handleTimeFilterChange}
                onFocus={this.blurFocus} />
              <label className="btn btn-outline-primary" htmlFor="early-am" data-tip data-for="tp-early-am">Early AM</label>
              <input type="checkbox" name="AM" className="btn-check" id="am" autoComplete="off"
                checked={this.state.filters.times['AM']} onChange={this.handleTimeFilterChange}
                onFocus={this.blurFocus} />
              <label className="btn btn-outline-primary" htmlFor="am" data-tip data-for="tp-am">AM</label>
              <input type="checkbox" name="PM" className="btn-check" id="pm" autoComplete="off"
                checked={this.state.filters.times['PM']} onChange={this.handleTimeFilterChange}
                onFocus={this.blurFocus} />
              <label className="btn btn-outline-primary" htmlFor="pm" data-tip data-for="tp-pm">PM</label>
              <input type="checkbox" name="latePM" className="btn-check" id="late-pm" autoComplete="off"
                checked={this.state.filters.times['latePM']} onChange={this.handleTimeFilterChange}
                onFocus={this.blurFocus} />
              <label className="btn btn-outline-primary" htmlFor="late-pm" data-tip data-for="tp-late-pm">Late PM</label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="m-sm-3 my-1 col-sm">
            <ReactToolTip place="top" type="dark" effect="solid" id="tp-writ" >
              Writing-designated
            </ReactToolTip>
            <ReactToolTip place="top" type="dark" effect="solid" id="tp-fys" >
              First-year seminar
            </ReactToolTip>
            <ReactToolTip place="top" type="dark" effect="solid" id="tp-soph" >
              Sophomore seminar
            </ReactToolTip>
            <span className="text-muted">Course Designations</span>
            <div id="course-designations" className="btn-group d-flex" role="group" aria-label="Designations">
              <input type="checkbox" name="writ" className="btn-check" id="writ" autoComplete="off"
                checked={this.state.filters.writ} onChange={this.handleFilterChangeEvent}
                onFocus={this.blurFocus} />
              <label className="btn btn-outline-secondary" htmlFor="writ" data-tip data-for="tp-writ">
                <i className="fa-solid fa-pen fa-sm me-1"></i>
                WRIT
              </label>
              <input type="checkbox" name="fys" className="btn-check" id="fys" autoComplete="off"
                checked={this.state.filters.fys} onChange={this.handleFilterChangeEvent}
                onFocus={this.blurFocus} />
              <label className="btn btn-outline-secondary" htmlFor="fys" data-tip data-for="tp-fys">
                <i className="fa-solid fa-1 fa-sm me-1"></i>
                FYS
              </label>
              <input type="checkbox" name="soph" className="btn-check" id="soph" autoComplete="off"
                checked={this.state.filters.soph} onChange={this.handleFilterChangeEvent}
                onFocus={this.blurFocus} />
              <label className="btn btn-outline-secondary" htmlFor="soph" data-tip data-for="tp-soph">
                <i className="fa-solid fa-2 fa-sm me-1"></i>
                SOPH
              </label>
            </div>
          </div>
        </div>
        {/* Row for mobile view that creates a Rank By select */}
        <div className="row d-sm-none">
          <div className="input-group my-1">
            <label htmlFor="sort-by" className="input-group-text">Rank By</label>
            <select type="text" className="form-control" placeholder="Avg Hrs"
              name="sortBy" id="sortBy"
              value={this.state.sorts.sortBy}
              onChange={this.handleSortChangeEvent}
            >
              <option value="max_hrs">Max Hours</option>
              <option value="avg_hrs">Avg Hours</option>
              <option value="size">Avg Size</option>
              <option value="avg_rating">Avg Rating</option>
            </select>
          </div>
        </div>
        {/* Row with switch for basing stats on same professor */}
        {/* <div className="row">
          <div className="col-sm">
            <div className="form-check form-switch mx-sm-3">
              <input className="form-check-input" type="checkbox" role="switch"
                id="same-prof" name="sameProf"
                checked={this.state.filters.sameProf}
                onChange={this.handleFilterChangeEvent} />
              <label htmlFor="same-prof" style={{ fontSize: "smaller" }}>
                Base stats on same professor
              </label>
            </div>
          </div>
        </div> */}
      </form>
    );
  }

  /**
   * Gets the HTML for the table rows.
   * Filters semester data, sorts it, and maps it to CourseRow components.
   */
  get rows() {
    const same = this.state.filters.sameProf ? "same_prof" : "all_reviews";
    return this.semesterData
      .filter((rowData) => {
        const filterProfName = this.state.filters.prof.toLowerCase();
        return (
          rowData[same]["max_hrs"] <= this.state.filters.maxMaxHrs &&
          rowData[same]["avg_hrs"] <= this.state.filters.maxAvgHrs &&
          rowData["size"] <= this.state.filters.maxAvgSize &&
          ((rowData["writ"] && this.state.filters.writ) || !this.state.filters.writ) &&
          ((rowData["fys"] && this.state.filters.fys) || !this.state.filters.fys) &&
          ((rowData["soph"] && this.state.filters.soph) || !this.state.filters.soph) &&
          rowData["dept"].toLowerCase().includes(this.state.filters.dept.toLowerCase()) &&
          rowData["profs"].reduce((acc, prof) => acc || prof.toLowerCase().includes(filterProfName), false) &&
          rowData['times'].reduce((acc, time) => acc || this.courseOccursInScheduledTimeAndDays(time), false)
        );
      })
      .sort((a, b) => {
        const sortBy = this.state.sorts.sortBy;
        const asc = this.state.sorts.sortAsc;
        if (sortBy === "max_hrs" || sortBy === "avg_hrs" || sortBy === "avg_rating") {

          if (a[same][sortBy] === b[same][sortBy]) {
            return asc && a["name"] > b["name"] ? 1 : -1;
          }
          else if (a[same][sortBy] > b[same][sortBy]) {
            return asc ? 1 : -1;
          }
          else if (a[same][sortBy] < b[same][sortBy]) {
            return asc ? -1 : 1;
          }
        }

        return asc && a[sortBy] >= b[sortBy] ? 1 : -1;
      })
      .map((rowData, index) => (
        <CourseRow key={index}
          rank={index + 1}
          name={rowData["name"]}
          code={rowData["code"]}
          link={rowData["link"]}
          description={rowData["description"]}
          writ={rowData["writ"]}
          profs={rowData["profs"]}
          times={rowData["times"]}
          sections={rowData["sections"]}
          maxHrs={rowData[same]["max_hrs"]}
          avgHrs={rowData[same]["avg_hrs"]}
          avgSize={rowData["size"]}
          avgRating={rowData[same]["avg_rating"]}
          handleFilterChange={this.handleFilterChange}
          sortBy={this.state.sorts.sortBy}
        />
      ));
  }

  render() {
    // easy access to sortBy and sortAsc state values
    const sortBy = this.state.sorts.sortBy;
    const asc = this.state.sorts.sortAsc;
    return (
      // maxWidth set to 768px, Bootstrap's medium breakpoint
      // better for reading
      <main style={{ maxWidth: "768px" }} className="container">
        {/* include filter form */}
        {this.filterForm}
        <table className="table table-striped" >
          <thead className="table-dark">
            <tr>
              {/* Rank only separate column on web view. */}
              <th scope="col" className="d-none d-sm-table-cell">Rank</th>
              <th scope="col" className="w-50">Course</th>
              {/* On web view, avg hours, max hours, and avg size act as sort buttons.
                  The active sort header, gets a caret indicating sort direction.
                  These headers disappear on mobile view.
              */}
              <th scope="col" className="d-none d-sm-table-cell user-select-none text-center"
                onClick={() => this.handleSortChange("avg_hrs")} role="button">
                Avg Hours
                {sortBy === "avg_hrs" && asc && <i className="fa-solid fa-caret-down ms-1"></i>}
                {sortBy === "avg_hrs" && !asc && <i className="fa-solid fa-caret-up ms-1"></i>}
              </th>
              <th scope="col" className="d-none d-sm-table-cell user-select-none text-center"
                onClick={() => this.handleSortChange("max_hrs")} role="button">
                Max Hours
                {sortBy === "max_hrs" && asc && <i className="fa-solid fa-caret-down ms-1"></i>}
                {sortBy === "max_hrs" && !asc && <i className="fa-solid fa-caret-up ms-1"></i>}
              </th>
              <th scope="col" className="d-none d-sm-table-cell user-select-none text-center"
                onClick={() => this.handleSortChange("size")} role="button">
                Avg Size
                {sortBy === "size" && asc && <i className="fa-solid fa-caret-down ms-1"></i>}
                {sortBy === "size" && !asc && <i className="fa-solid fa-caret-up ms-1"></i>}
              </th>
              <th scope="col" className="d-none d-sm-table-cell user-select-none text-center"
                onClick={() => this.handleSortChange("avg_rating")} role="button">
                Avg Rating
                {sortBy === "avg_rating" && asc && <i className="fa-solid fa-caret-down ms-1"></i>}
                {sortBy === "avg_rating" && !asc && <i className="fa-solid fa-caret-up ms-1"></i>}
              </th>
            </tr>
          </thead>
          <tbody>
            {/* include rows */}
            {this.rows}
          </tbody>
        </table >
      </main >
    );
  }

}

export default CourseTable;