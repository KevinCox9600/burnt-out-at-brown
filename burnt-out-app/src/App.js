import { Routes, Route, Navigate, NavLink, Link } from 'react-router-dom';
import './App.css';
import Courses from './routes/courses';
import Profs from './routes/profs';
import About from './routes/about';
import Departments from './routes/departments';

function App({ to }) {
  return (
    <div>
      <header className="sticky-top">
        <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "rgb(196, 164, 132)" }}>
          <div className="container-fluid">
            <Link to="/courses" className="navbar-brand"><img style={{ height: '64px' }} src='/burntout_brown.png' /></Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink to="/courses" className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}>Courses</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/about" className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}>About</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <div id="page-content" className="container-fluid" style={{ padding: "0 20px 0 20px", 'marginBottom': '56px' }}>
        <Routes>
          <Route path="courses" element={<Courses />} />
          <Route path="about" element={<About />} />
          <Route path="secret" element={<Departments />} />
          <Route path="*" element={<Navigate to="courses" />} />
        </Routes>
      </div>
      <footer className="fixed-bottom pt-3 text-center" style={{ backgroundColor: "rgb(244,240,236)" }}>
        <p>For questions, comments, or concerns, contact us at&nbsp;
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSebtY940Fu93KNPj52LHuz8Yha4fWiU4PlgrKI85QPcT6hEfw/viewform" target="_blank" rel="noreferrer noopener">
            cpax@brown.edu
          </a>
          &nbsp;🐻
        </p>
      </footer>
    </div >
  );
}

export default App;
