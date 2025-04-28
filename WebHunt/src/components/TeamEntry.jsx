import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TeamEntry.css';

const TeamEntry = ({ onTeamSubmit }) => {
  const [inputName, setInputName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!inputName.trim()) {
      alert('Please enter a valid team name.');
      return;
    }

    setLoading(true);
    console.log('Submitting team name...');

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const registerTeamEndpoint = import.meta.env.VITE_REGISTER_TEAM_ENDPOINT;

      const response = await fetch(`${apiUrl}${registerTeamEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName: inputName }),
      });

      if (!response.ok) {
        throw new Error('Failed to register team name');
      }

      console.log('Team name submitted successfully!');

      onTeamSubmit(inputName);
      navigate('/riddlegame');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to register team name. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="team-entry-container">
      <div className="team-entry-form">
        <h2>Enter your Team name</h2>
        <input
          type="text"
          placeholder="Full team name"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <div className="loader"></div> // Show loader if loading
          ) : (
            'SUBMIT'
          )}
        </button>
      </div>
    </div>
  );
};

export default TeamEntry;
