// src/pages/Disqualified.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Disqualified.css'; // 👈 External CSS

const Disqualified = () => {
  const navigate = useNavigate();

  return (
    <div className="disqualified-container">
      <div className="disqualified-card">
        <h1 className="disqualified-title">🚨 Heist Failed! You Got Caught!</h1>

        <p className="disqualified-message">
          🔒 The security system detected your move.
        </p>
        <p className="disqualified-message">
          🚔 Authorities have surrounded the building.
        </p>
        <p className="disqualified-message">
          🧿 All escape routes are blocked.
        </p>
        <p className="disqualified-message">
          ⚖️ You are sentenced to life imprisonment.  
          The dream is over... for now.
        </p>

        <button onClick={() => navigate('/')} className="disqualified-button">
          Return to Safehouse 🏠
        </button>
      </div>
    </div>
  );
};

export default Disqualified;
