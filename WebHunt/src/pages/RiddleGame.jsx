import React, { useState, useEffect } from 'react';
import RiddleList from '../components/RiddleList';
import '../styles/RiddleGame.css';
import axios from 'axios';

const riddles = [
  { id: 1, question: 'I speak without a mouth and hear without ears. I have nobody, but I come alive with the wind. What am I?' },
  { id: 2, question: 'You measure my life in hours and I serve you by expiring. I\'m quick when I\'m thin and slow when I\'m fat. The wind is my enemy.' },
  { id: 3, question: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?' },
  { id: 4, question: 'What can run but never walks, has a bed but never sleeps, has a mouth but never talks?' },
  { id: 5, question: 'The more of me you take, the more you leave behind. What am I?' },
];

const RiddleGame = () => {
  const [teamName, setTeamName] = useState('');
  const [inputName, setInputName] = useState('');
  const [answers, setAnswers] = useState(Array(riddles.length).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  // Fullscreen
  useEffect(() => {
    if (teamName) {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen();
    }
  }, [teamName]);

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            alert('❌ You switched tabs too many times. You are disqualified.');
            window.location.reload();
          }
          return newCount;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (submitted || loading) return;
    setLoading(true);

    try {
      // TODO: Replace with actual backend URL later
      // await axios.post('https://your-backend-url.com/api/submit-riddles', { teamName, answers });

      // Temporary mock for development
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Submitted:', { teamName, answers });

      alert('✅ Answers submitted successfully!');
      setSubmitted(true);
    } catch (err) {
      alert('❌ Submission failed. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTeamSubmit = async () => {
    if (!inputName.trim()) {
      alert('Please enter your full team name.');
      return;
    }

    try {
      // TODO: Replace with backend API URL later
      // await axios.post('https://your-backend-url.com/api/register-team', { teamName: inputName });

      // Temporary mock for development
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Team registered:', inputName);

      setTeamName(inputName);
    } catch (err) {
      alert('Failed to register team. Try again.');
    }
  };

  return (
    <div className="game-container">
      {!teamName ? (
        <div className="team-entry">
          <h2>Enter Your Team Name</h2>
          <input
            type="text"
            placeholder="Team Name"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          />
          <button onClick={handleTeamSubmit}>Start Game</button>
        </div>
      ) : (
        <div>
          <h2 className="title">Welcome {teamName}! Solve the Riddles</h2>
          <RiddleList
            riddles={riddles}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            submitted={submitted}
          />
          <button
            onClick={handleSubmit}
            disabled={submitted || loading}
            className="submit-button"
          >
            {loading ? 'Submitting...' : 'Submit Answers'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RiddleGame;
