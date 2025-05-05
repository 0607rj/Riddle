import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RiddleList from '../components/RiddleList';
import '../styles/RiddleGame.css';
import "../styles/Fullscreen.css";


const riddles = [ {
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
},
{
  id: 6,
  question: 'I’m a type of malware that locks your files and demands a ransom for their release. What am I?',
  hint: 'You may receive a message asking for payment to unlock your files after this happens.'
},
{
  id: 7,
  question: 'I am a form of encryption that allows you to communicate privately, even over unsecured networks. What am I?',
  hint: 'I’m commonly used to protect your online communications and ensure they remain confidential.'
},
{
  id: 8,
  question: 'I’m a device that connects multiple computers within a network. What am I?',
  hint: 'You’ll often find me in office networks, managing the traffic between different devices.'
},
{
  id: 9,
  question: 'I am a network attack that involves overwhelming a server with traffic, causing it to crash. What am I?',
  hint: 'I’m often used to disrupt services by flooding a system with excessive requests.'
},
{
  id: 10,
  question: 'I am a program that tracks your online activities without your permission. What am I?',
  hint: 'I gather your personal data and browsing habits, sometimes for malicious purposes.'
}
  
];

const RiddleGame = ({ teamName }) => {
  const [answers, setAnswers] = useState(Array(riddles.length).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200); // 30 minutes timer
  const [gameStarted, setGameStarted] = useState(false);
  const [warned, setWarned] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [disqualified, setDisqualified] = useState(false);
  const [awaitingUserAction, setAwaitingUserAction] = useState(false);
  const navigate = useNavigate();

  const disqualify = () => {
    if (!disqualified) {
      setDisqualified(true);
      navigate('/disqualified');
    }
  };

  const requestFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  const startGame = async () => {
    await requestFullscreen();
    setGameStarted(true);
  };

  useEffect(() => {
    if (!gameStarted) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timerInterval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(timerInterval);
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    const onVisibilityChange = () => {
      if (document.hidden) {
        handleFullscreenExitAttempt();
      }
    };

    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleFullscreenExitAttempt();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, [gameStarted, warned]);

  const handleFullscreenExitAttempt = async () => {
    if (!warned) {
      setWarned(true);
      setShowWarningModal(true);
      setAwaitingUserAction(true);
    } else {
      disqualify();
    }
  };

  const handleReEnterFullscreen = async () => {
    if (awaitingUserAction) {
      await requestFullscreen();
      setAwaitingUserAction(false);
      setShowWarningModal(false);
    }
  };

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

      if (!response.ok) throw new Error('Failed to submit answers');

      setSubmitted(true);
      navigate('/thank-you');
    } catch (err) {
      console.error(err);
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
          <p className="warning-text">*DO NOT EXIT FULL SCREEN OR YOU WILL BE DISQUALIFIED.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="riddle-game-container">
      {showWarningModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>⚠️ Warning!</h3>
            <p>Do not try to exit fullscreen. You will be disqualified next time.</p>
            <button onClick={handleReEnterFullscreen}>Re-enter Fullscreen</button>
          </div>
        </div>
      )}

      <div className="header">
        <h2>Welcome, {teamName}</h2>
        <div className="timer">
          ⏳ Time Left: {`${Math.floor(timeLeft / 60)
            .toString()
            .padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`}
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
