export default function CourseRow({ data, sameProf }) {
  const same = sameProf ? "same-prof" : "diff-prof";
  return (
    <tr>
      <td>{data[same]["avg-grade"]}</td>
      <td>{data["name"]}</td>
      <td>{data[same]["avg-hrs"]}</td>
      <td>{data[same]["max-hrs"]}</td>
      <td>{data["cr-link"]}</td>
      <td>{data[same]["avg-size"]}</td>
      <td>{data["prof"]}</td>
    </tr>
  );
}