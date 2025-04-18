// src/pages/RiddleGame.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RiddleList from '../components/RiddleList';
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
  const [isTeamSubmitted, setIsTeamSubmitted] = useState(false);
  const [answers, setAnswers] = useState(Array(riddles.length).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasSwitchedTab, setHasSwitchedTab] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const navigate = useNavigate();

  // Fullscreen
  useEffect(() => {
    if (isTeamSubmitted) {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen();
    }
  }, [isTeamSubmitted]);

  // Tab switch & fullscreen exit detection
  useEffect(() => {
    const handleDisqualify = () => {
      if (!hasSwitchedTab) {
        setHasSwitchedTab(true);
        // Directly navigate to disqualified page without alert
        navigate('/disqualified');
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleDisqualify();
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleDisqualify();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [hasSwitchedTab, navigate]);

  // Countdown timer
  useEffect(() => {
    if (!isTeamSubmitted || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTeamSubmitted, submitted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  // Submit team name to backend for registration
  const handleTeamSubmit = async () => {
    if (!teamName.trim()) {
      alert('Please enter a valid team name');
      return;
    }

    try {
      // Simulated API call — Replace with actual team registration endpoint
      await axios.post('https://jsonplaceholder.typicode.com/posts', { teamName }); // Placeholder API
      console.log('Team registered:', teamName);
      setIsTeamSubmitted(true);
    } catch (err) {
      alert('Failed to register team name. Try again.');
    }
  };

  // Submit answers to backend for verification
  const handleSubmit = async (auto = false) => {
    if (submitted || loading) return;

    const anyEmpty = answers.some(ans => ans.trim() === '');
    if (anyEmpty && !auto) {
      alert('Please answer all riddles before submitting.');
      return;
    }

    setLoading(true);

    try {
      // Simulated API call — Replace with actual answer verification endpoint
      await axios.post('https://jsonplaceholder.typicode.com/posts', { teamName, answers }); // Placeholder API
      console.log('Submitted answers:', { teamName, answers });
      setSubmitted(true);
      navigate('/thank-you');
    } catch (err) {
      alert('Submission failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="game-container">
      {!isTeamSubmitted ? (
        <div className="team-input">
          <h2>Enter Your Team Name</h2>
          <input
            type="text"
            value={teamName}
            placeholder="Team Name"
            onChange={(e) => setTeamName(e.target.value)}
          />
          <button onClick={handleTeamSubmit}>Start</button>
        </div>
      ) : (
        <div>
          <div className="header">
            <h2>Welcome, {teamName}</h2>
            <div className="timer">⏳ Time Left: {formatTime(timeLeft)}</div>
          </div>
          <RiddleList riddles={riddles} answers={answers} onAnswerChange={handleAnswerChange} submitted={submitted} />
          <button onClick={() => handleSubmit(false)} disabled={submitted || loading} className="submit-button">
            {loading ? 'Submitting...' : 'Submit Answers'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RiddleGame;
