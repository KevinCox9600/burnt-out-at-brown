export default function About() {
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
              Leyton Ho<br />
              Eitan Zemel
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