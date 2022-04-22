import { DEFAULT_SEMESTER } from "../data/constants";

export default function Departments() {
  const departments = require(`../data/${DEFAULT_SEMESTER}/department_data.json`);
  return (
    <h1>Departments by hours per week</h1>
  );
}