import React from 'react';

const RiddleList = ({ riddles, answers, onAnswerChange, submitted }) => {
  return (
    <div>
      {riddles.map((riddle, index) => (
        <div className="riddle-card" key={riddle.id}>
          <p>{riddle.question}</p>
          <input
            type="text"
            value={answers[index] || ''}
            onChange={(e) => onAnswerChange(index, e.target.value)}
            disabled={submitted}
            placeholder="Your Answer"
          />
        </div>
      ))}
    </div>
  );
};

export default RiddleList;