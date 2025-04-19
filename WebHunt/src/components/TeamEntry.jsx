import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigating to RiddleGame
import '../styles/TeamEntry.css'; // Import CSS file

const TeamEntry = ({ onTeamSubmit }) => {
  const [inputName, setInputName] = useState('');
  const navigate = useNavigate(); // Navigate hook to redirect after submission

  // Handle the team name submission
  const handleSubmit = async () => {
    if (!inputName.trim()) {
      alert('Please enter a valid team name.');
      return;
    }

    try {
      // Placeholder API call — Replace with your actual API once ready
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({ teamName: inputName }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to register team name');
      }

      console.log('Team name registered:', inputName);

      // Pass the team name to the parent component (if necessary)
      onTeamSubmit(inputName);

      // Redirect to RiddleGame after submission
      navigate('/riddlegame');
    } catch (err) {
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
