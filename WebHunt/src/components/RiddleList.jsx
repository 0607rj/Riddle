import React from 'react';

const RiddleList = ({ riddles, answers, onAnswerChange, submitted }) => {
  return (
    <div className="riddle-list">
      {riddles.map((riddle, index) => (
        <div key={riddle.id} className="riddle-item">
          <p>{riddle.question}</p>
          {/* Display the hint below each question */}
          {riddle.hint && !submitted && (
            <p className="riddle-hint">{riddle.hint}</p>
          )}
          <input
            type="text"
            value={answers[index]}
            onChange={(e) => onAnswerChange(index, e.target.value)}
            className={submitted === false && answers[index].trim() === '' ? 'input-error' : ''}
            disabled={submitted}
            placeholder="Your answer"
          />
        </div>
      ))}
    </div>
  );
};

export default RiddleList;
