import { DEFAULT_SEMESTER } from "../data/constants";

function get_rows(departments) {
  // build ordered list of department objects containing name and hours
  departments.sort((a, b) => a.hours - b.hours);

  // return all rows in a tbody tag
  return (
    <tbody>
      {departments.map((dept, index) => {
        return (
          <tr>
            <td>{dept.name}</td>
            <td>{Math.round(dept.hours * 100) / 100}</td>
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
              <th></th>
            </tr>
          </thead>
          {rows}
        </table>
      </div>
    </div>
  );
}