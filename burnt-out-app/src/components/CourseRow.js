import React from "react";
import "./CourseRow.css";

/**
 * CourseRow holds a single course in the CourseTable.
 * Props:
 * - rank (int) - the listed rank of the course in the table
 * - name (str) - the name of the course
 * - code (str) - the code associated with the course (e.g., CSCI0300)
 * - link (str) - the Critical Review link for the course
 * - description (str) - the description of the course 
 * - profs (str[]) - the professor list of professors by section (e.g., K. Fisler)
 * - times (str[]) - the times of each section
 * - sections (str[]) - the section numbers
 * - maxHrs (int) - the max hours for the course
 * - avgHrs (int) - the avg hours for the course
 * - avgRating (int) - the avg rating for the course
 * - avgSize (int) - the avg size for the course
 * - sortBy (str) - what the table is currently sorted by (e.g., "max_hrs", "size", "avg_hrs")
 * - handleFilterChange (function) - the function to use change the table filters, 
 *     takes two arguments: filter_name (e.g., "prof"), filter_value (e.g., "K. Fisler")
 */
class CourseRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandDesc: false,
      hoverDesc: false,
    };
  }

  /**
   * Returns the html for professor names where clicking one will filter on that professor name.
   */
  get profsHtml() {
    const uniqueProfs = this.props.profs.filter((v, i, a) => a.indexOf(v) === i);
    const profNames = uniqueProfs.join(",, ").split(', '); // TODO: add commas after prof names in less sus way

    return (
      <div>
        {/* Clicking on the professor name will automatically filter by that prof. */}
        <i className="fa-solid fa-chalkboard-user fa-sm me-1" ></i >
        {
          profNames.filter((v, i, a) => a.indexOf(v) === i).map((prof, index) => {
            return <span className="text-secondary fw-bold hover-underline me-1" role="button" key={prof}
              onClick={() => this.props.handleFilterChange("prof", prof)}>
              {prof}
            </span>;
          })}
      </div>
    );
  }

  render() {
    // For mobile view of stats:
    // The currently sorted stat will have the class "bg-primary". 
    // The other will have "bg-secondary".
    const avgHrsBadgeType = this.props.sortBy === "avg_hrs" ? "bg-primary" : "bg-secondary";
    const maxHrsBadgeType = this.props.sortBy === "max_hrs" ? "bg-primary" : "bg-secondary";
    const avgSizeBadgeType = this.props.sortBy === "size" ? "bg-primary" : "bg-secondary";
    const avgRatingBadgeType = this.props.sortBy === "avg_rating" ? "bg-primary" : "bg-secondary";

    // TODO: Add back cab search links to description text (maybe autodetect course codes?)
    const descriptionWithoutHtml = this.props.description.replace(/<.*?>/g, '');

    return (
      <tr>
        <td className="text-center d-none d-sm-table-cell">{this.props.rank}</td>
        <td className="w-50 align-middle">
          <div className="fw-bold">
            {/* Add rank to course name for mobile. */}
            <span className="d-inline d-sm-none">{this.props.rank}. </span>
            {this.props.code}: {this.props.name} {this.props.writ ? '(WRIT)' : ''}
          </div>
          {this.profsHtml}
          <div className="text-secondary fw-bold">
            <i className="fa-regular fa-calendar me-1"></i>
            {this.props.times.map((time, index) => {
              return (time + ` (${this.props.sections[index]})`);
            }).join(',, ').split(', ').map((timeSectionText, index) => {
              return (
                <span key={index}>{timeSectionText}</span>
              );
            })}
            {/* {this.props.sections} */}
            {/* {this.props.times[0]} */}
          </div>
          <div>
            <span className={`p-0 text-muted user-select-none ${this.state.hoverDesc && "text-decoration-underline"}`}
              role="button"
              data-bs-toggle="collapse"
              data-bs-target={`#${this.props.code}-description`}
              onClick={() => this.setState({ 'expandDesc': !this.state.expandDesc })}
              onMouseEnter={() => this.setState({ 'hoverDesc': true })}
              onMouseLeave={() => this.setState({ 'hoverDesc': false })}
            >
              Course Description
              {this.state.expandDesc && this.state.hoverDesc && <i className="me-1 fa-solid fa-chevron-up fa-sm"></i>}
              {!this.state.expandDesc && this.state.hoverDesc && <i className="me-1 fa-solid fa-chevron-down fa-sm"></i>}
            </span>
            <div className="collapse" id={`${this.props.code}-description`}>
              {descriptionWithoutHtml}
            </div>
          </div>
          {/* Include stats under Course header as badges for mobile view. */}
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
              {(Math.round(this.props.avgSize * 100) / 100).toFixed(0)} students
              {this.props.sortBy === "size" && <i className="fa-solid fa-caret-down ms-1"></i>}
            </span>
            <span className={`badge m-1 ${avgRatingBadgeType}`}>
              {(Math.round(this.props.avgRating * 100) / 100).toFixed(1)} average rating
              {this.props.sortBy === "avg_rating" && <i className="fa-solid fa-caret-down ms-1"></i>}
            </span>
          </div>
          <div>
            <a href={this.props.link} target="_blank" className="d-none d-sm-block">
              <i className="fa-solid fa-arrow-up-right-from-square me-1"></i>
              Critical Review
            </a>
            {/* Do not open CR in new tab on mobile. */}
            <a href={this.props.link} className="d-block d-sm-none">Critical Review</a>
          </div>
        </td>
        {/* Include stats in table for web view. */}
        <td className="text-center d-none d-sm-table-cell">
          {(Math.round(this.props.avgHrs * 100) / 100).toFixed(1)}
        </td>
        <td className="text-center d-none d-sm-table-cell">
          {(Math.round(this.props.maxHrs * 100) / 100).toFixed(1)}
        </td>
        <td className="text-center d-none d-sm-table-cell">
          {(Math.round(this.props.avgSize * 100) / 100).toFixed(0)}
        </td>
        <td className="text-center d-none d-sm-table-cell">
          {(Math.round(this.props.avgRating * 100) / 100).toFixed(1)}
        </td>
      </tr >
    );
  }
}

export default CourseRow;
