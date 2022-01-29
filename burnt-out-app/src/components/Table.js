import CourseRow from "./CourseRow";
import ProfRow from "./ProfRow";

function header(type) {
  const courseHeader = (
    <thead>
      <tr>
        <th scope="col">Avg Grade</th>
        <th scope="col">Course</th>
        <th scope="col">Avg Hours</th>
        <th scope="col">Avg Max Hours</th>
        <th scope="col">Time of day</th>
        <th scope="col">Critical Review Link</th>
        <th scope="col">Avg Class Size</th>
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
}

function rows(dataArray, type) {
  return (
    <tbody>
      {dataArray.map((rowData, index) => (
        type === "courses"
          ? <CourseRow key={index} data={rowData} />
          : <ProfRow key={index} data={rowData} />
      ))}
    </tbody>
  );
}

export default function Table({ type }) {
  const dataArray = [];

  return (
    <main>
      <h2 style={{ textTransform: 'capitalize' }}>{type}</h2>
      <table class="table">
        {header(type)}
        {rows(dataArray, type)}
      </table>
    </main>
  );
}