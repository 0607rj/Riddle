// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RiddleGame from './pages/RiddleGame';
import ThankYou from './pages/ThankYou';
import Disqualified from './pages/Disqualified';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RiddleGame />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/disqualified" element={<Disqualified />} />
      </Routes>
    </Router>
  );
}

export default App;
