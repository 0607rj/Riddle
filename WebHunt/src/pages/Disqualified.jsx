// src/pages/Disqualified.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Disqualified = () => {
  const navigate = useNavigate();

  return (
    <div className="disqualified-container" style={styles.container}>
      <h1 style={styles.title}>❌ You are disqualified</h1>
      <p style={styles.message}>
        You either changed the tab or exited fullscreen. This violates the rules of the game.
      </p>
      <button onClick={() => navigate('/')} style={styles.button}>
        Go Back to Home
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center',
    background: '#ffe6e6',
    borderRadius: '12px',
    margin: '2rem auto',
    maxWidth: '600px',
    boxShadow: '0 0 10px rgba(255, 0, 0, 0.2)',
  },
  title: {
    fontSize: '2rem',
    color: '#b30000',
  },
  message: {
    fontSize: '1.1rem',
    margin: '1rem 0',
  },
  button: {
    padding: '0.7rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default Disqualified;
