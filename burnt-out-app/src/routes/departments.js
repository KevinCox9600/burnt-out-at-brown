import { DEFAULT_SEMESTER } from "../data/constants";

function get_rows(departments) {
  // build ordered list of department objects containing name and hours
  departments.sort((a, b) => a.avg_hours - b.avg_hours);
  const weightedDepartments = [...departments];
  weightedDepartments.sort((a, b) => a.weighted_avg_hours - b.weighted_avg_hours);

  const maxTime = departments[departments.length - 1].avg_hours;
  const weightedMaxTime = weightedDepartments[weightedDepartments.length - 1].weighted_avg_hours;

  // return all rows in a tbody tag
  return (
    <tbody>
      {departments.map((dept, index) => {
        const weightedDept = weightedDepartments[index];
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{weightedDept.name}</td>
            <td>{Math.round(weightedDept.weighted_avg_hours / weightedMaxTime * 100) / 100}</td>
            <td>{Math.round(weightedDept.weighted_avg_hours * 100) / 100}</td>
            <td>{dept.name}</td>
            <td>{Math.round(dept.avg_hours / maxTime * 100) / 100}</td>
            <td>{Math.round(dept.avg_hours * 100) / 100}</td>
          </tr>
        );
      })}
    </tbody>
  );
}

export default function Departments() {
  const departments_data = require(`../data/${DEFAULT_SEMESTER}/department_data.json`);
  const departments = departments_data.data;
  console.log(departments);

  const rows = get_rows(departments);
  return (
    <div>
      <h1>Departments by hours per week</h1>
      <div className="table-responsive">
        <table className="table" style={{ 'marginBottom': 0 }}>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Department</th>
              <th scope="col">Proportion of Max</th>
              <th scope="col">Weighted Average hours</th>
              <th scope="col">Department</th>
              <th scope="col">Proportion of Max</th>
              <th scope="col">Average hours</th>
            </tr>
          </thead>
          {rows}
        </table>
      </div>
    </div>
  );
}