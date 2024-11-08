import { Routes, Route, Navigate, NavLink, Link } from 'react-router-dom';
import './App.css';
import Courses from './routes/courses';
import About from './routes/about';
import Departments from './routes/departments';

function App({ to }) {
  return (
    <div>
      <header className="sticky-top shadow-sm">
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
      <div id="page-content" className="container-fluid" style={{ padding: "0 20px 0 20px", marginBottom: '56px' }}>
        <Routes>
          <Route path="courses" element={<Courses />} />
          <Route path="about" element={<About />} />
          <Route path="secret" element={<Departments />} />
          <Route path="*" element={<Navigate to="courses" />} />
        </Routes>
      </div>
    </div >
  );
}

export default App;
