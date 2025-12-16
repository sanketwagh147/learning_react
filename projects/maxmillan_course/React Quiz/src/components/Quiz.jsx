import { useCallback, useState } from 'react';
import QUESTIONS from '../questions.js';
import Summary from './Summary.jsx';

import quizCompleteImg from '../assets/quiz-complete.png';
import Question from './Question.jsx';
export default function Quiz() {
  const [userAnswers, setUserAnswers] = useState([]);
  const activeQuestionIndex = userAnswers.length;
  const isQuizOver = userAnswers.length === QUESTIONS.length;

  const handleSelectAnswer = useCallback(function (selectedAnswer) {
    setUserAnswers((prevAnswers) => [...prevAnswers, selectedAnswer]);
  }, []);

  const handleSkipAnswer = useCallback(
    () => handleSelectAnswer(null),
    [handleSelectAnswer]
  );

  if (isQuizOver) {
    console.log('Quiz is over');
    return <Summary userAnswers={userAnswers} />;
  }

  return (
    <div id="quiz">
      <Question
        key={activeQuestionIndex}
        questionIndex={activeQuestionIndex}
        onSelect={handleSelectAnswer}
        onKeySkip={handleSkipAnswer}
      />
    </div>
  );
}
