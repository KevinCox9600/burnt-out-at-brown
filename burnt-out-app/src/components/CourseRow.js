export default function CourseRow({ data, sameProf }) {
  const same = sameProf ? "same-prof" : "diff-prof";
  return (
    <tr>
      <td>{data[same]["avg-grade"]}</td>
      <td>{data["code"] + " - " + data["name"]}</td>
      <td>{data[same]["avg-hrs"]}</td>
      <td>{data[same]["max-hrs"]}</td>
      <td><a href={data["cr-link"]}>{data["cr-link"]}</a></td>
      <td>{data[same]["avg-size"]}</td>
      <td>{data["prof"]}</td>
    </tr>
  );
}