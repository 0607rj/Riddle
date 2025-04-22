import React from 'react';
import '../styles/RiddleGame.css';
import'../styles/ThankYou.css';

const ThankYou = () => {
  return (
    <div className="game-container">
      <h1>🎉 Thank You!</h1>
      <h2>Web Hunt has been successfully completed.</h2>
      <p>We hope you enjoyed solving the riddles!</p>
    </div>
  );
};

export default ThankYou;