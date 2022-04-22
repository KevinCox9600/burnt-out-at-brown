import { DEFAULT_SEMESTER } from "../data/constants";

const departments_data = require(`../data/${DEFAULT_SEMESTER}/department_data.json`);
const avg_class_hours = departments_data.avg_class_hours;


function round(num, decimals = 2) {
  const shift = 10 ** decimals;
  return Math.floor(num * shift) / shift;
};

function get_rows(departments) {
  // build ordered list of department objects containing name and hours
  departments.sort((a, b) => b.avg_hours - a.avg_hours);
  const weightedDepartments = [...departments];
  weightedDepartments.sort((a, b) => b.weighted_avg_hours - a.weighted_avg_hours);

  const maxTime = departments[0].avg_hours;
  const weightedMaxTime = weightedDepartments[0].weighted_avg_hours;

  // return all rows in a tbody tag
  return (
    <tbody>
      {departments.map((dept, index) => {
        const weightedDept = weightedDepartments[index];
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{round(weightedDept.weighted_avg_hours / avg_class_hours)}</td>
            <td>{weightedDept.name}</td>
            <td>{round(weightedDept.weighted_avg_hours / weightedMaxTime)}</td>
            <td style={{ borderRight: '1px solid #dddddd' }}>{round(weightedDept.weighted_avg_hours)}</td>
            <td>{dept.name}</td>
            <td>{round(dept.avg_hours / maxTime)}</td>
            <td>{round(dept.avg_hours)}</td>
          </tr>
        );
      })}
    </tbody >
  );
}

export default function Departments() {
  const departments = departments_data.data;
  console.log(departments);

  const rows = get_rows(departments);
  return (
    <div>
      <h1>Departments by hours per week</h1>
      <ul>
        <li>
          {round(departments_data.avg_class_hours)}:
          Hours of work per week for an average Brown course (on the Critical Review)
        </li>
        <li>
          {Math.round(departments_data.total_count)}:
          Number of experienced classes
        </li>
      </ul>
      <div className="table-responsive">
        <table className="table" style={{ 'marginBottom': 0 }}>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Num classes*</th>
              <th scope="col">Department</th>
              <th scope="col">Proportion of Max Weighted</th>
              <th scope="col">Weighted Average hours</th>
              <th scope="col">Department</th>
              <th scope="col">Proportion of Max</th>
              <th scope="col">Average hours</th>
            </tr>
          </thead>
          {rows}
        </table>
      </div>
      <p>*Calculated based on the number of hours for any class at Brown, weighted by class size</p>
    </div>
  );
}