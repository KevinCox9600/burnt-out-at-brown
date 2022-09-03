export default function About() {
  const iconSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAclBMVEX///8AAACamprc3Nyjo6Py8vK4uLjh4eH4+Pjs7OyMjIzZ2dmysrLn5+f7+/vIyMiUlJQzMzNmZmY8PDxTU1PExMSrq6suLi5ZWVlERERfX193d3eGhoYhISEXFxeAgIAPDw/Q0NBNTU0cHBwmJiZ5eXmaXFQLAAAFCklEQVR4nO2d7VriMBCFWwXaUgGRBXERsa7e/y2urCuLEJLJ96l73v/k4X1SpkmYmRQFIYQQQgghhBBC/l/qpmpTUzV1Kr3Z7r7Mw/1uFl+vvs1k98lt5JlcZfbbs4roN3zJbfeHl2jTeJ1b7UAVR7DN7XXEdQzBSW6rLzQRDHO9ItQswgs+5nY64Ta0INYzuif0c3qXW+iMTVhBvCksy2FQw6vcOgrCrm0WuXUU/AgpWOe2URLSsMstoyTkwuYmt4ySZUDDQW4ZJSFDjSKUjgdpGZ9/hau4hpE2MBepkhtG2b9oUGxOaWgDDRNAQ09omAAaekLDBNDQExomgIae0DABNPSEhgmgoSc0TAANPaFhAmjoCQ0TQENPaJgAGnpCwwTQ0BMaSpiMxuv59ql82s7X49HE9uPohu3u+eTzT492I0AbTlfqDOq5TcoPsqGuCuVGPAqu4fVcI1iWC2nmEayhOfV2IBsI1VBSRrQWjYRpWOuf0E8eJF8B0nC6FQm+B1XBV4A0lCeHv5gHQzT8KRaUFE8AGtoVY45Mw+EZNlaCZWmqmsQztC03vTOMB2c4sxQ0DghnKHsTHmN48aMZdtaCptx4NEObN8Unuz4ZDh0EDXVMYIZuVUTalhBghm4Vp489MnQS1NdnYxm61tT2x9D+dW8eE8vQtZhPV1CIZaiopBOhO13EMnxzNNT1ScAy3Dkajntj6NpDQ/dC/B6G/ZlD125Z/fkduvbL6k8sdX3j65beWIa2p1Cf6FrOYBk6rrx7tC512uIbjtvADN1CjfbvUjBDtx+itmkQmGHx4CCo76iDZjhyMNQ3Y0EzLE6TS8xs9QPCGdrHGkNaBpxh8ctS8N4wHp5hZ2nYGsbDMyw2VoLas9I9gIZWz6npGcU0tDk1NXcIRDS0aForSP2CNCw6oaApyuzBNBT2VhZl04IaFkNz1pCwdzWqoTk5UZpFi2tYTH5o/O7EbVaBDYtidsnxpyTE/AXa8H0eb8/3Gq9XVr2OwQ3faQd3//LZ55uVbd9FfMM/NFXbtZVTi+OeGHpAQ09omAAaekLDBNDQkyCG06btZsvlcta1zdT609iGw26wOf0n42Ez6GwWN7iGw9Hm8gn/82YktQQ1rG90m8MP1jeiTT6k4cV94Zmk4MI4PMPpwOZE+NfKFHvQDB2u2DNcigdm6JZgqq2XhTJcSisrT9lqfo9Ahs3a0W/P+uLZDY6h7x2Ql/4KRjGsfSbwg7U64oAYtvYJCuc8K09RMQxDXbijCqoQhq4J7Oe8YRqGvIb1PD8qv6Gwf4KUxekqLrth/RpUsCxfT0JqbsPAM7hn+3XnmNswvOBpBkpmQ5dkSzNfep7kNYx1SelxWnRWw3jXrR+VmOQ0XEYTPK7AyGjoWlwh4xBQMxrGvd/ysJnKaOiS0i3n0LeGhjSkIQ1pSEMa0pCGXobff106HcbkcOSW+5wmPjT0hIYJoKEnNExAekPbeglfquSG40FaFB3SQhqG+vs6LMKO/CLirq5dMXbItkBe0ZsSi8o3I3VuGSX2qdQa5C3y0yG6UkGM+SKO9IQMpe49V2NiVaBpxq23VUxMbeptUSwpMmN9J5YJ146dsTA2Q7EndEqQH5KLW2zBCjaBw8wHSAubSHs3HMVom9OJ+oa41CyiPKJ/QVjbhNw0KRi69ggOxVjW7MWL0SbXw3r/FnJLqKVuqjY1VZNg9gghhBBCCCGEEALLb1NlajYWXyXnAAAAAElFTkSuQmCC";
  return (
    <main className="container pt-1" style={{ maxWidth: "768px", textAlign: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', margin: '40px auto 0 auto' }}>
        <div>
          <h3>Our Mission</h3>
          <p style={{ width: '65%', margin: 'auto'}}>
            Burnt Out @ Brown is for students looking for better work-life balance!
            Sort courses from least to most time consuming and filter by department, professor, and time offered to put together your optimal schedule each semester.

          </p>
        </div>
        <div style={{ marginTop: '40px' }}>
          <h3>Who we are</h3>
          <div style={{ width: '65%', margin: 'auto'}}>
            <p>
              Burnt Out @ Brown arose from the need for a simpler way to browse courses by workload to construct a balanced schedule. Created with 🤎 by Brown students: 
            </p>
            <p style={{ fontWeight: '500', padding: '10px 0' }}>
              Kevin Cox <br />
              Jared Dunn<br />
              Isabelle Sharon<br />
              Leyton Ho
            </p>
            <p>For questions, comments, or concerns, contact us&nbsp;
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSebtY940Fu93KNPj52LHuz8Yha4fWiU4PlgrKI85QPcT6hEfw/viewform" target="_blank" rel="noreferrer noopener">
                here
              </a>
              &nbsp;🐻
            </p>
          </div>
        </div>
      </div>
    </main >
  );
}