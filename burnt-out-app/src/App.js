import { Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import Courses from './routes/courses';
import Profs from './routes/profs';
import About from './routes/about';

function App() {
  return (
    <div className="container-fluid">
      <header>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <div class="container-fluid">
            <Link to="/courses" className="navbar-brand">Burnt Out at Brown</Link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="#">Courses</a>
                  <Link to="/courses" />
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Profs</a>
                  <Link to="/profs" />
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">About</a>
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
      <footer>
        <p>This is the footer</p>
      </footer>
    </div>
  );
}

export default App;
