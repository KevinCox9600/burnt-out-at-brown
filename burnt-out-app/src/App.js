import { Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import Courses from './routes/courses';
import Profs from './routes/profs';
import About from './routes/about';

function App() {
  return (
    <div className="container-fluid">
      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link to="/courses" className="navbar-brand">Burnt Out at Brown</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/courses" />
                </li>
                <li className="nav-item">
                  <Link to="/profs" />
                </li>
                <li className="nav-item">
                  <Link to="/about" />
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <Routes>
        <Route path="courses" element={<Courses />} />
        <Route path="about" element={<About />} />
        <Route path="profs" element={<Profs />} />
        <Route path="*" element={<Navigate to="courses" />} />
      </Routes>
      <footer className="footer">
        <p>This is the footer</p>
      </footer>
    </div>
  );
}

export default App;
