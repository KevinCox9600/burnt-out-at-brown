import { Routes, Route, Navigate, NavLink, Link } from 'react-router-dom';
import './App.css';
import Courses from './routes/courses';
import Profs from './routes/profs';
import About from './routes/about';

function App({ to }) {
  return (
    <div>
      <header className="sticky-top">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
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
                  <NavLink to="/profs" className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}>Profs</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/about" className={({ isActive }) => isActive ? "active nav-link" : "nav-link"}>About</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <div className="container-fluid">
        <Routes>
          <Route path="courses" element={<Courses />} />
          <Route path="about" element={<About />} />
          <Route path="profs" element={<Profs />} />
          <Route path="*" element={<Navigate to="courses" />} />
        </Routes>
      </div>
      <footer className="fixed-bottom bg-light pt-3 text-center">
        <p>If you find any issues, you can contact us at cpax@brown.edu</p>
      </footer>
    </div >
  );
}

export default App;
