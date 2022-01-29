import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Courses from './routes/courses';
import Profs from './routes/profs';
import About from './routes/about';

const rootElement = document.getElementById('root');
ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="courses" element={<Courses />} />
      <Route path="about" element={<About />} />
      <Route path="profs" element={<Profs />} />
      <Route path="*" element={<Navigate to="courses" />} />
    </Routes>
  </BrowserRouter >,
  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
