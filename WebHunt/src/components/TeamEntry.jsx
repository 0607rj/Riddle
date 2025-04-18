import React, { useState } from 'react';

const TeamEntry = ({ onTeamSubmit }) => {
  const [inputName, setInputName] = useState('');

  const handleSubmit = () => {
    if (!inputName.trim()) {
      alert('Please enter a valid team name.');
      return;
    }

    onTeamSubmit(inputName);
  };

  return (
    <div className="team-input">
      <h2>Enter Team Name</h2>
      <input
        type="text"
        value={inputName}
        placeholder="Full Team Name"
        onChange={(e) => setInputName(e.target.value)}
      />
      <button className="submit-button" onClick={handleSubmit}>
        Submit Team Name
      </button>
    </div>
  );
};

export default TeamEntry;
