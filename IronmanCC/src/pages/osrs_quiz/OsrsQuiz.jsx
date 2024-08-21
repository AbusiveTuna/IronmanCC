import React, { useState, useEffect } from 'react';
import multipleChoice from '../../resources/quiz/multipleChoice.json';
import './OsrsQuiz.css';

const OsrsQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setQuestions(multipleChoice.sort(() => 0.5 - Math.random()));
  }, []);

  useEffect(() => {
    if (questions.length > 0 && !currentQuestion) {
      const question = questions[0];
      setCurrentQuestion(question);
      setOptions(shuffleOptions(question.options));
    }
  }, [questions, currentQuestion]);

  const shuffleOptions = (options) => {
    const shuffledOptions = [...options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    return shuffledOptions;
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion.answer) {
      setScore(score + 1);
      const remainingQuestions = questions.filter(q => q.id !== currentQuestion.id);
      if (remainingQuestions.length > 0) {
        setTimeout(() => {
          setCurrentQuestion(remainingQuestions[0]);
          setOptions(shuffleOptions(remainingQuestions[0].options));
          setSelectedAnswer(null);
          setQuestions(remainingQuestions);
        }, 500); 
      } else {
        setGameOver(true);
      }
    } else {
      setTimeout(() => {
        setGameOver(true);
        setSelectedAnswer(null);
      }, 100);
    }
  };

  const resetGame = () => {
    setGameOver(false);
    setScore(0);
    setSelectedAnswer(null);
    const shuffledQuestions = multipleChoice.sort(() => 0.5 - Math.random());
    setQuestions(shuffledQuestions);
    if (shuffledQuestions.length > 0) {
      setCurrentQuestion(shuffledQuestions[0]);
      setOptions(shuffleOptions(shuffledQuestions[0].options));
    }
  };

  return (
    <div className="osrs-quiz">
      <h1>Welcome to Quiz Master</h1>
      {currentQuestion && (
        <div>
          <p className="current-question">{currentQuestion.question}</p>
          <div className="options-grid">
            {options.map((option, index) => (
              <button key={index}
                className={`option-button ${selectedAnswer === option ? (selectedAnswer === currentQuestion.answer ? 'correct' : 'selected') : ''}`}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer || gameOver}>
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
      {gameOver && (
        <div className="game-over">
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
      <p className="score">Score: {score}</p>
    </div>
  );
  
};

export default OsrsQuiz;
