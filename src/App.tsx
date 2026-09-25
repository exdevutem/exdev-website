import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home'
import About from './pages/about/about'
import Apply from './pages/apply/apply';
import Projects from './pages/projects/projects';
import Events from './pages/events/events';
function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/events" element={<Events />} />

        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
