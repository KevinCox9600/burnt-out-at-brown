import React from "react";
import "./CourseRow.css";

class CourseRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const avgHrsBadgeType = this.props.sortBy === "avg_hrs" ? "bg-primary" : "bg-secondary";
    const maxHrsBadgeType = this.props.sortBy === "max_hrs" ? "bg-primary" : "bg-secondary";
    const avgSizeBadgeType = this.props.sortBy === "size" ? "bg-primary" : "bg-secondary";

    return (
      <tr>
        <td className="text-center d-none d-sm-table-cell">{this.props.rank}</td>
        <td className="w-50 align-middle">
          <div className="fw-bold">
            <span className="d-inline d-sm-none">{this.props.rank}. </span>
            {this.props.code}: {this.props.name}
          </div>
          <div className="text-secondary fw-bold hover-underline" role="button"
            onClick={() => this.props.handleFilterChange("prof", this.props.prof)}
          >
            {this.props.prof}
          </div>
          <div>
            {this.props.description}
          </div>
          <div className="d-flex d-sm-none flex-wrap">
            <span className={`badge m-1 ${avgHrsBadgeType}`}>
              {(Math.round(this.props.avgHrs * 100) / 100).toFixed(1)} hours on average
              {this.props.sortBy === "avg_hrs" && <i className="fa-solid fa-caret-down ms-1"></i>}
            </span>
            <span className={`badge m-1 ${maxHrsBadgeType}`}>
              {(Math.round(this.props.maxHrs * 100) / 100).toFixed(1)} maximum hours
              {this.props.sortBy === "max_hrs" && <i className="fa-solid fa-caret-down ms-1"></i>}
            </span>
            <span className={`badge m-1 ${avgSizeBadgeType}`}>
              {(Math.round(this.props.avgSize * 100) / 100).toFixed(1)} students
              {this.props.sortBy === "size" && <i className="fa-solid fa-caret-down ms-1"></i>}
            </span>
          </div>
          <div>
            <a href={this.props.link}>Critical Review</a>
          </div>
        </td>
        <td className="text-center d-none d-sm-table-cell">
          {(Math.round(this.props.avgHrs * 100) / 100).toFixed(1)}
        </td>
        <td className="text-center d-none d-sm-table-cell">
          {(Math.round(this.props.maxHrs * 100) / 100).toFixed(1)}
        </td>
        <td className="text-center d-none d-sm-table-cell">
          {(Math.round(this.props.avgSize * 100) / 100).toFixed(1)}
        </td>
      </tr>
    );
  }
}

export default CourseRow;
