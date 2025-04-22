import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TeamEntry.css';

const TeamEntry = ({ onTeamSubmit }) => {
  const [inputName, setInputName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!inputName.trim()) {
      alert('Please enter a valid team name.');
      return;
    }

    try {
      // Log the team name to verify before sending it
      console.log('Submitting team name:', inputName);

      const response = await fetch('https://web-hunt.onrender.com/api/quiz/register-team', {
        method: 'POST',
        body: JSON.stringify({ teamName: inputName }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.error('Failed to register team name');
        throw new Error('Failed to register team name');
      }

      console.log('Team name registered successfully:', inputName);

      onTeamSubmit(inputName);

      navigate('/riddlegame');
    } catch (err) {
      console.error('Error during team name registration:', err);
      alert('Failed to register team name. Try again.');
    }
  };

  return (
    <div className="team-entry-container">
      <div className="team-entry-form">
        <h2>Enter Team Name</h2>
        <input
          type="text"
          value={inputName}
          placeholder="Full Team Name"
          onChange={(e) => setInputName(e.target.value)}
        />
        <button className="team-submit-button" onClick={handleSubmit}>
          Submit Team Name
        </button>
      </div>
    </div>
  );
};

export default TeamEntry;
