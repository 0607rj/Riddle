import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RiddleList from '../components/RiddleList';
import '../styles/RiddleGame.css';
import '../styles/Fullscreen.css'; // ✅ use your Fullscreen CSS

const riddles = [
  {
    id: 1,
    question: 'I protect your accounts and data, and you need me to log in. Without me, your secrets are exposed. What am I?',
    hint: 'You type me in when logging into your accounts to keep them secure.'
  },
  {
    id: 2,
    question: 'I’m the first line of defense, keeping your digital world safe. Without me, you’re vulnerable to attack. What am I?',
    hint: 'I monitor incoming and outgoing data to protect your network from harmful threats.'
  },
  {
    id: 3,
    question: 'I make your data unreadable to others, and only the right key can unlock it. What am I?',
    hint: 'When your data is protected, it’s in a scrambled form that requires a secret key to unlock.'
  },
  {
    id: 4,
    question: 'I can automatically perform tasks online, but I’m not a real person. What am I?',
    hint: 'I can run repetitive tasks like sending messages or collecting data without human intervention.'
  },
  {
    id: 5,
    question: 'I’m a hidden part of the internet used for secretive or illegal activities. What am I?',
    hint: 'I’m not accessible by normal browsers and is often used for anonymity or illegal trading.'
  }
];

const RiddleGame = ({ teamName }) => {
  const [answers, setAnswers] = useState(Array(riddles.length).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [gameStarted, setGameStarted] = useState(false);
  const [disqualified, setDisqualified] = useState(false);
  const navigate = useNavigate();

  const disqualify = () => {
    if (!disqualified) {
      setDisqualified(true);
      navigate('/disqualified');
    }
  };

  const startGame = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setGameStarted(true);
    } catch (err) {
      alert('Fullscreen permission denied. Please allow fullscreen to continue.');
    }
  };

  useEffect(() => {
    if (!gameStarted) return;

    const onVisibilityChange = () => {
      if (document.hidden) disqualify();
    };

    const onFullscreenChange = () => {
      if (!document.fullscreenElement) disqualify();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, [gameStarted, disqualified]);

  useEffect(() => {
    if (!gameStarted || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, gameStarted]);

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async (auto = false) => {
    if (submitted || loading) return;

    const anyEmpty = answers.some((ans) => ans.trim() === '');
    if (anyEmpty && !auto) return;

    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const submitAnswersEndpoint = import.meta.env.VITE_SUBMIT_ANSWERS_ENDPOINT;

      const response = await fetch(`${apiUrl}${submitAnswersEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName,
          answers: answers.map((answer, index) => ({
            questionId: index + 1,
            givenAnswer: answer.trim(),
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answers');
      }

      setSubmitted(true);
      navigate('/thank-you');
    } catch (err) {
      console.error('Error during answer submission:', err);
      alert('Failed to submit answers. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!gameStarted) {
    return (
      <div className="fullscreen-container">
  <div className="monitor-content">
    <h1>WEB HUNT</h1>
    <p>//ACCESS GRANTED//</p>
    <h3>READY FOR THE HUNT? LET'S GET STARTED!</h3>
    <p>CLICK THE BUTTON BELOW TO ENTER FULL SCREEN AND START THE HUNT.</p>
    <div className="start-button">
      <button onClick={startGame}>START</button>
    </div>
    <p className="warning-text">*DO NOT EXIT FULL SCREEN OR YOU WILL GET ARRESTED.</p>
   
  </div>
</div>

      
    );
  }

  return (
    <div className="riddle-game-container">
      <div className="header">
        <h2>Welcome, {teamName}</h2>
        <div className="timer">
          ⏳ Time Left: {`${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`}
        </div>
      </div>

      <RiddleList
        riddles={riddles}
        answers={answers}
        onAnswerChange={handleAnswerChange}
        submitted={submitted}
      />

      <button
        onClick={() => handleSubmit(false)}
        disabled={submitted || loading || answers.some((ans) => ans.trim() === '')}
        className="submit-answers-button"
      >
        {loading ? 'Submitting...' : 'Submit Answers'}
      </button>
    </div>
  );
};

export default RiddleGame;
