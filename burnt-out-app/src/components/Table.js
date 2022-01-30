import CourseRow from "./CourseRow";
import ProfRow from "./ProfRow";
// import * as data from "../data/courses.json";
import React from 'react';

function header(type) {
  const courseHeader = (
    <thead>
      <tr>
        <th scope="col">Avg Grade</th>
        <th scope="col">Course</th>
        <th scope="col">Avg Hours</th>
        <th scope="col">Avg Max Hours</th>
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

function rows(dataArray, type, sameProf, maxHours) {
  const same = sameProf ? "same-prof" : "diff-prof";
  return (
    <tbody>
      {dataArray.filter((row) => {
        return parseInt(row[same]["max-hrs"]) <= maxHours;
      }).map((rowData, index) => (
        type === "courses"
          ? <CourseRow key={index} data={rowData} sameProf={sameProf} />
          : <ProfRow key={index} data={rowData} />
      ))}
    </tbody>
  );
}

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sameProf: true,
      maxHours: 17
    };

    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  handleFilterChange(event) {
    console.log("filter change");
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    const courses = require('../data/courses.json');
    const dataArray = courses["data"];

    let filters;
    if (this.props.type === "courses") {
      filters = (<form>
        <input type="text" className="form-control" placeholder="Department" />
        <input type="text" className="form-control" placeholder="Professor" />
        <input type="text" className="form-control" placeholder="Avg Hours" />
        <input type="number" className="form-control" placeholder="Max Hours" name="maxHours" value={this.state.maxHours} onChange={this.handleFilterChange} />
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" role="switch" id="same-prof" name="sameProf"
            checked={this.state.sameProf}
            onChange={this.handleFilterChange} />
          <label className="form-check-label" htmlFor="same-prof">Same professor</label>
        </div>
      </form>);
    } else {
      filters = (
        <form>
          <input type="text" className="form-control" placeholder="Avg Hours" />
          <input type="text" className="form-control" placeholder="Max Hours" />
        </form>
      );
    }

    return (<main>
      <h2 style={{ textTransform: 'capitalize' }}>{this.props.type}</h2>
      {filters}
      <table className="table">
        {header(this.props.type)}
        {rows(dataArray, this.props.type, this.state.sameProf, this.state.maxHours)}
      </table>
    </main>);
  }
}

export default Table;