import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RiddleList from '../components/RiddleList';
import axios from 'axios';
import '../styles/RiddleGame.css'; // Ensure this includes styles below

const riddles = [
  { id: 1, question: 'I speak without a mouth and hear without ears. I have nobody, but I come alive with the wind. What am I?' },
  { id: 2, question: 'You measure my life in hours and I serve you by expiring. I\'m quick when I\'m thin and slow when I\'m fat. The wind is my enemy.' },
  { id: 3, question: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?' },
  { id: 4, question: 'What can run but never walks, has a bed but never sleeps, has a mouth but never talks?' },
  { id: 5, question: 'The more of me you take, the more you leave behind. What am I?' },
];

const RiddleGame = ({ teamName }) => {
  const [answers, setAnswers] = useState(Array(riddles.length).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [hasSwitchedTab, setHasSwitchedTab] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
  }, []);

  useEffect(() => {
    const handleDisqualify = () => {
      if (!hasSwitchedTab) {
        setHasSwitchedTab(true);
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

  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true); // Auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted]);

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

  const handleSubmit = async (auto = false) => {
    if (submitted || loading) return;

    const anyEmpty = answers.some(ans => ans.trim() === '');
    if (anyEmpty && !auto) {
      // Don't alert or exit fullscreen
      return;
    }

    setLoading(true);
    try {
      await axios.post('https://jsonplaceholder.typicode.com/posts', { teamName, answers });
      setSubmitted(true);
      navigate('/thank-you');
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const allFilled = answers.every(ans => ans.trim() !== '');

  return (
    <div className="riddle-game-container">
      <div className="header">
        <h2>Welcome, {teamName}</h2>
        <div className="timer">⏳ Time Left: {formatTime(timeLeft)}</div>
      </div>

      <RiddleList
        riddles={riddles}
        answers={answers}
        onAnswerChange={handleAnswerChange}
        submitted={submitted}
      />

      <button
        onClick={() => handleSubmit(false)}
        disabled={submitted || loading || !allFilled}
        className={`submit-answers-button ${!allFilled ? 'disabled' : ''}`}
      >
        {loading ? 'Submitting...' : 'Submit Answers'}
      </button>
    </div>
  );
};

export default RiddleGame;
