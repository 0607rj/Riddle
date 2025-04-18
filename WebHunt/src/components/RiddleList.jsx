import React from 'react';

const RiddleList = ({ riddles, answers, handleAnswerChange, submitted }) => {
  return (
    <>
      {riddles.map((riddle, index) => (
        <div className="riddle-card" key={riddle.id}>
          <p>{riddle.question}</p>
          <input
            type="text"
            value={answers[index]}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            disabled={submitted}
            placeholder="Your Answer"
          />
        </div>
      ))}
    </>
  );
};

export default RiddleList;
