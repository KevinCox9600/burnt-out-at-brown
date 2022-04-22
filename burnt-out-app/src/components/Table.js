import CourseRow from "./CourseRow";
import ProfRow from "./ProfRow";
// import * as data from "../data/courses.json";
import React from 'react';
import { SEMESTERS, DEFAULT_SEMESTER } from '../data/constants';


function header(type) {
  const courseHeader = (
    <thead>
      <tr>
        {/* <th scope="col">Avg Grade</th> */}
        <th scope="col">Avg Hours</th>
        <th scope="col">Course</th>
        <th scope="col">Max Hours</th>
        <th scope="col">Critical Review Link</th>
        <th scope="col">Avg Class Size</th>
        <th scope="col">Professor</th>
      </tr>
    </thead>
  );
  const profsHeader = (
    <thead>
      <tr>
        <th scope="col">Avg Rating</th>
        <th scope="col">Avg Grade</th>
        <th scope="col">Avg Avg Hours</th>
        <th scope="col">Avg Max Hours</th>
        <th scope="col">Name</th>
        <th scope="col">Department</th>
        <th scope="col">Critical Review Link</th>
      </tr>
    </thead>
  );

  return type === "courses" ? courseHeader : profsHeader;
};

function rows(dataArray, type, filterValues) {
  const same = filterValues.sameProf ? "same_prof" : "all_reviews";
  return (
    <tbody>
      {dataArray.filter((row) => {
        const belowMaxHrs = parseInt(row[same]["max_hrs"]) <= filterValues.maxHrs;
        const belowAvgHrs = parseInt(row[same]["avg_hrs"]) <= filterValues.avgHrs;
        return belowMaxHrs && belowAvgHrs;
      }).map((rowData, index) => (
        type === "courses"
          ? <CourseRow key={index} data={rowData} sameProf={filterValues.sameProf} />
          : <ProfRow key={index} data={rowData} />
      ))}
    </tbody>
  );
}

function getSemesterSeasonAndYear(semester) {
  const semesterText = semester.match(/[a-zA-Z]+|[0-9]+/g);
  const season = semesterText[0].charAt(0).toUpperCase() + semesterText[0].slice(1).toLowerCase();
  const year = semesterText[1];
  return { season, year };
}

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sameProf: true,
      maxHrs: 40,
      avgHrs: 20,
      prof: "",
      dept: "",
      semester: DEFAULT_SEMESTER, // in format `${lowerCaseSeason}${year}`
    };

    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  handleFilterChange(event) {
    console.log("filter change");
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    // set the state
    this.setState({
      [name]: value
    });

    // filter the data
  }

  render() {
    // for security, because if we just display this.state.semester user can probe file structure
    const semesterToDisplay = SEMESTERS.includes(this.state.semester) ? this.state.semester : DEFAULT_SEMESTER;
    const dataObj = require(`../data/${semesterToDisplay}/compiled_course_data.json`);
    // console.log(dataObj);

    let filters;
    if (this.props.type === "courses") {
      filters = (
        <form>
          <select type="select" className="form-control" placeholder="" name="semester"
            value={this.state.semester}
            onChange={this.handleFilterChange}
          >
            {
              Array.from({ length: SEMESTERS.length }, (_, i) => (
                <option key={i} value={SEMESTERS[i]}>
                  {getSemesterSeasonAndYear(SEMESTERS[i]).season + ' '}
                  {getSemesterSeasonAndYear(SEMESTERS[i]).year}
                </option>
              ))
            }
          </select>
          <input type="text" className="form-control" placeholder="Departments" name="dept"
            value={this.state.dept}
            onChange={this.handleFilterChange}
          />
          <input type="text" className="form-control" placeholder="Professor" name="prof"
            value={this.state.prf}
            onChange={this.handleFilterChange}
          />
          {/* <input type="number" className="form-control" placeholder="Avg Hours" name="avgHrs"
            value={this.state.avgHrs}
            onChange={this.handleFilterChange}
          />
          <input type="number" className="form-control" placeholder="Max Hours" name="maxHrs"
            value={this.state.maxHrs}
            onChange={this.handleFilterChange} />
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" id="same-prof" name="sameProf"
              checked={this.state.sameProf}
              onChange={this.handleFilterChange} />
            <label className="form-check-label" htmlFor="same-prof">Same professor</label>
          </div> */}
        </form>
      );
    } else {
      filters = (
        <form>
          <input type="text" className="form-control" placeholder="Avg Hours" />
          <input type="text" className="form-control" placeholder="Max Hours" />
        </form>
      );
    }

    let filterValues = {
      sameProf: this.state.sameProf,
      maxHrs: this.state.maxHrs,
      avgHrs: this.state.avgHrs,
      dept: this.state.dept,
      prof: this.state.prof
    };


    // filter the data
    let filteredDataArray = [];
    let sameProfKey = filterValues.sameProf ? 'same_prof' : 'all_reviews';
    for (let courseNum in dataObj) {
      let courseData = dataObj[courseNum];
      // filter course with no CR data, TODO: filter on cr_data available
      // if (courseData['cr_data_available'] === 'false') {
      // continue;
      // }
      if (!courseData[sameProfKey] || courseData[sameProfKey]['max_hrs'] <= 0 || courseData[sameProfKey]['avg_hrs'] <= 0) {
        continue;
      }
      let underMaxHrs = courseData[sameProfKey]['max_hrs'] < parseInt(filterValues.maxHrs);
      let underAvgHrs = courseData[sameProfKey]['avg_hrs'] < parseInt(filterValues.avgHrs);
      let sameDept = false || !filterValues.dept;
      for (let dept of filterValues.dept.split(/\s/g)) {
        if (dept) {
          sameDept = sameDept || courseData.dept.toLowerCase().includes(dept.toLowerCase());;
        }
      }
      let correctProf = courseData.prof.toLowerCase().includes(filterValues.prof.toLowerCase());
      if (underMaxHrs && underAvgHrs && sameDept && correctProf) {
        courseData['cr-link'] = `https://thecriticalreview.org/search/${courseData.dept}/${courseData.num}`;
        filteredDataArray.push({ courseNum, ...courseData });
      }
    }

    // sort the data
    filteredDataArray.sort((a, b) => {
      // console.log(a.dept);
      if (a.dept < b.dept) {
        return -1;
      } else if (a.dept === b.debt) {
        return 0;
      } else {
        return 1;
      }
    });
    filteredDataArray.sort((a, b) => a[sameProfKey]['avg_hrs'] - b[sameProfKey]['avg_hrs']);

    // limit size to 50
    filteredDataArray = filteredDataArray.slice(0, 500);

    const semesterText = this.state.semester.match(/[a-zA-Z]+|[0-9]+/g);
    const season = semesterText[0].charAt(0).toUpperCase() + semesterText[0].slice(1).toLowerCase();
    const year = semesterText[1];

    return (<main>
      <h2 style={{ textTransform: 'capitalize', marginTop: "20px" }}>Courses - {season} {year}</h2>
      {filters}
      <div className="table-responsive">
        <table className="table" style={{ 'marginBottom': 0 }}>
          {header(this.props.type)}
          {rows(filteredDataArray, this.props.type, filterValues)}
        </table>
      </div>
    </main >);
  }
}

export default Table;