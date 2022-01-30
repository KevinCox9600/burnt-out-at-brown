export default function CourseRow({ data, sameProf }) {
  const same = sameProf ? "same_prof" : "all_reviews";
  return (
    <tr>
      {/* <td>{data[same]["avg-grade"]}</td> */}
      <td>{data["code"] + " - " + data["name"]}</td>
      <td>{Math.round(data[same]["avg_hrs"] * 100) / 100}</td>
      <td>{Math.round(data[same]["max_hrs"] * 100) / 100}</td>
      <td><a href={data["cr-link"]}>{data["cr-link"]}</a></td>
      <td>{data[same]["avg-size"]}</td>
      <td>{data["prof"]}</td>
    </tr>
  );
}