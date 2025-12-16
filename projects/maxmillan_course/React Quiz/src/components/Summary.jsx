import quizCompleteImg from '../assets/quiz-complete.png';
import QUESTIONS from '../questions.js';
export default function Summary({ userAnswers }) {
  const skippedAnswers = userAnswers.filter((answer) => answer == null).length;
  const correctAnswers = userAnswers.filter(
    (answer, index) => answer !== null && answer === QUESTIONS[index].answers[0]
  ).length;
  const incorrectAnswers = userAnswers.filter(
    (answer, index) => answer !== null && answer !== QUESTIONS[index].answers[0]
  ).length;
  const skippedPercentage = Math.round(
    (skippedAnswers / QUESTIONS.length) * 100
  );
  const correctPercentage = Math.round(
    (correctAnswers / QUESTIONS.length) * 100
  );
  const incorrectPercentage = Math.round(
    (incorrectAnswers / QUESTIONS.length) * 100
  );
  return (
    <div id="summary">
      <img src={quizCompleteImg} alt="Quiz Over" />
      <h2>Quiz Completed</h2>
      <div id="summary-stats">
        <p>
          <span className="number">{skippedPercentage}%</span>
          <span className="text">skipped</span>
        </p>
        <p>
          <span className="number">{correctPercentage}%</span>
          <span className="text">Correctly answered questions</span>
        </p>
        <p>
          <span className="number">{incorrectPercentage}%</span>
          <span className="text">incorrectly answered questions</span>
        </p>
      </div>
      <ol>
        {userAnswers.map((answer, index) => {
          let cssClass = 'user-answer';

          if (answer == null) {
            cssClass += ' skipped';
          } else if (answer === QUESTIONS[index].answers[0]) {
            cssClass += ' correct';
          } else {
            cssClass += ' wrong';
          }

          return (
            <li key={index}>
              <h2>{index + 1}</h2>
              <p className="question">{QUESTIONS[index].text}</p>
              <p className={cssClass}>{answer ? answer : 'No answer given'}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
