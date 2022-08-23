import React from "react";

class CourseRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <tr>
        <td className="text-center">{this.props.rank}</td>
        <td className="w-50 align-middle">
          <div className="fw-bold">
            <a href={this.props.link}>
              {this.props.code}: {this.props.name}
            </a>
          </div>
          <div className="text-secondary fw-bold">
            {this.props.prof}
          </div>
          <div>
            {this.props.description}
          </div>
        </td>
        <td className="text-center">
          {(Math.round(this.props.avgHrs * 100) / 100).toFixed(1)}
        </td>
        <td className="text-center">
          {(Math.round(this.props.maxHrs * 100) / 100).toFixed(1)}
        </td>
        <td className="text-center">
          {(Math.round(this.props.avgSize * 100) / 100).toFixed(1)}
        </td>
      </tr>
    );
  }
}

export default CourseRow;
