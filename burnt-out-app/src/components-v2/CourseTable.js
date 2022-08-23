import React from "react";

import CourseRow from "./CourseRow";
import { SEMESTERS, DEFAULT_SEMESTER } from '../data/constants';

const FAKE_DATA = [
  {
    "name": "Course 1",
    "code": "UNIV101",
    "dept": "UNIV",
    "prof": "Einstein",
    "description": "This is a college course.",
    "size": 20,
    "same_prof": { "max_hrs": 30.0, "avg_hrs": 20.0 },
    "all_reviews": { "max_hrs": 32.0, "avg_hrs": 22.0 },
    "link": "https://thecriticalreview.org/",
  },
  {
    "name": "Course 2",
    "code": "UNIV102",
    "dept": "UNIV",
    "prof": "Einstein",
    "description": "This is another college course.",
    "size": 30,
    "same_prof": { "max_hrs": 20.0, "avg_hrs": 10.0 },
    "all_reviews": { "max_hrs": 22.0, "avg_hrs": 12.0 },
    "link": "https://thecriticalreview.org/",
  },
  {
    "name": "Course 3",
    "code": "UNIV102",
    "dept": "UNIV",
    "prof": "Einstein",
    "description": "This is a third college course with a description that is very long. It even has multiple sentences with people making different comments. Some say that it is great! Some people say it kind of sucks. Also, it is about math, but also english and philosophy.",
    "size": 40,
    "same_prof": { "max_hrs": 10.0, "avg_hrs": 5.0 },
    "all_reviews": { "max_hrs": 12.0, "avg_hrs": 6.0 },
    "link": "https://thecriticalreview.org/",
  },
];

class CourseTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sorts: {
        sortBy: "avg_hrs",
        sortAsc: true,
      },

      filters: {
        semester: DEFAULT_SEMESTER, // in format `${lowerCaseSeason}${year}`
        maxAvgHrs: 20,
        maxMaxHrs: 40,
        maxAvgSize: 500,
        prof: "",
        dept: "",
        sameProf: true,
      }
    };

    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  // METHODS
  handleFilterChange(event) {
    const name = event.target.name;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    this.setState({
      "filters": {
        ...this.state.filters,
        [name]: value,
      }
    });
  }

  handleSortChange(sortBy) {
    const new_sort_state = {
      ...this.state.sorts
    };

    if (this.state.sorts.sortBy === sortBy) {
      new_sort_state.sortAsc = !this.state.sorts.sortAsc;
    }
    else {
      new_sort_state.sortBy = sortBy;
      new_sort_state.sortAsc = true;
    }

    this.setState({
      "sorts": new_sort_state
    });
  }

  getSemesterSeasonAndYear(semester) {
    const semesterText = semester.match(/[a-zA-Z]+|[0-9]+/g);
    const season = semesterText[0].charAt(0).toUpperCase() + semesterText[0].slice(1).toLowerCase();
    const year = semesterText[1];
    return { season, year };
  }

  // COMPUTED PROPERTIES
  get semesterData() {
    // return FAKE_DATA;
    const semesterDict = require(`../data/${this.state.filters.semester}/compiled_course_data.json`);
    const dataArray = Object.values(semesterDict);
    const same = this.state.filters.sameProf ? "same_prof" : "all_reviews";
    return dataArray.filter((rowData) => {
      return (rowData[same] && rowData[same]['max_hrs'] > 0 &&
        rowData[same]['avg_hrs'] > 0);
    });

  }

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

  get filterForm() {
    return (
      <form>
        <div className="row">
          <div className="input-group m-3 col">
            <label htmlFor="semester" className="input-group-text">Semester</label>
            <select className="form-control" name="semester" id="semester"
              value={this.state.filters.semester}
              onChange={this.handleFilterChange}
            >
              {this.semesterOptions}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="input-group m-3 col">
            <label htmlFor="dept" className="input-group-text">Department</label>
            <input type="text" className="form-control" placeholder="CSCI"
              name="dept" id="dept"
              value={this.state.filters.dept}
              onChange={this.handleFilterChange}
            />
          </div>
          <div className="input-group m-3 col">
            <label htmlFor="prof" className="input-group-text">Professor</label>
            <input type="text" className="form-control" placeholder="Carberry"
              name="prof" id="prof"
              value={this.state.filters.prof}
              onChange={this.handleFilterChange} />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch"
                id="same-prof" name="sameProf"
                checked={this.state.filters.sameProf}
                onChange={this.handleFilterChange} />
              <label htmlFor="same-prof" style={{ fontSize: "smaller" }}>
                Base stats on same professor
              </label>
            </div>
          </div>
        </div>
      </form>
    );
  }


  get rows() {
    const same = this.state.filters.sameProf ? "same_prof" : "all_reviews";
    return this.semesterData
      .filter((rowData) => {
        return (
          rowData[same]["max_hrs"] <= this.state.filters.maxMaxHrs &&
          rowData[same]["avg_hrs"] <= this.state.filters.maxAvgHrs &&
          rowData["size"] <= this.state.filters.maxAvgSize &&
          rowData["dept"].includes(this.state.filters.dept) &&
          rowData["prof"].includes(this.state.filters.prof)
        );
      })
      .sort((a, b) => {
        const sortBy = this.state.sorts.sortBy;
        const asc = this.state.sorts.sortAsc;
        if (sortBy === "max_hrs" || sortBy == "avg_hrs") {

          if (a[same][sortBy] === b[same][sortBy]) {
            return asc && a["name"] > b["name"] ? 1 : -1;
          }
          else if (a[same][sortBy] > b[same][sortBy]) {
            return asc ? 1 : -1;
          }
          else if (a[same][sortBy] < b[same][sortBy]) {
            return asc ? -1 : 1;
          }
        } else {
          return asc && a[sortBy] >= b[sortBy] ? 1 : -1;
        }
      })
      .map((rowData, index) => (
        <CourseRow key={index}
          rank={index + 1}
          name={rowData["name"]}
          code={rowData["code"]}
          link={rowData["link"]}
          description={rowData["description"]}
          prof={rowData["prof"]}
          maxHrs={rowData[same]["max_hrs"]}
          avgHrs={rowData[same]["avg_hrs"]}
          avgSize={rowData["size"]}
        />
      ));
  }

  render() {
    const sortBy = this.state.sorts.sortBy;
    const asc = this.state.sorts.sortAsc;
    return (
      <main style={{ width: "800px" }} className="container">
        {this.filterForm}
        < table className="table table-striped" >
          <thead className="table-dark">
            <tr>
              <th scope="col">Rank</th>
              <th scope="col" className="w-50">Course</th>
              <th scope="col" onClick={() => this.handleSortChange("avg_hrs")} role="button" className="user-select-none">
                Avg Hours
                {sortBy === "avg_hrs" && asc && <i className="fa-solid fa-caret-down ms-1"></i>}
                {sortBy === "avg_hrs" && !asc && <i className="fa-solid fa-caret-up ms-1"></i>}
              </th>
              <th scope="col" onClick={() => this.handleSortChange("max_hrs")} role="button" className="user-select-none">
                Max Hours
                {sortBy === "max_hrs" && asc && <i className="fa-solid fa-caret-down ms-1"></i>}
                {sortBy === "max_hrs" && !asc && <i className="fa-solid fa-caret-up ms-1"></i>}
              </th>
              <th scope="col" onClick={() => this.handleSortChange("size")} role="button" className="user-select-none">
                Avg Size
                {sortBy === "size" && asc && <i className="fa-solid fa-caret-down ms-1"></i>}
                {sortBy === "size" && !asc && <i className="fa-solid fa-caret-up ms-1"></i>}
              </th>
            </tr>
          </thead>
          <tbody>
            {this.rows}
          </tbody>
        </table >
      </main >
    );
  }

}

export default CourseTable;