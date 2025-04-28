import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeamEntry from './components/TeamEntry';
import RiddleGame from './pages/RiddleGame';
import ThankYou from './pages/ThankYou';
import Disqualified from './pages/Disqualified';

const App = () => {
  const [teamName, setTeamName] = useState('');

  const handleTeamSubmit = (name) => {
    setTeamName(name); // Store the team name to pass to RiddleGame
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TeamEntry onTeamSubmit={handleTeamSubmit} />} />
        <Route path="/riddlegame" element={<RiddleGame teamName={teamName} />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/disqualified" element={<Disqualified />} />
      </Routes>
    </Router>
  );
};

export default App;
