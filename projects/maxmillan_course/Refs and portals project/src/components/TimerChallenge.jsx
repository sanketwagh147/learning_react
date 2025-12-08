import { useState, useRef } from 'react';
import ResultModal from './ResultModal';
export default function TimerChallenge({ title, targetTime }) {
  const [timeRemaining, setTimeRemaining] = useState(targetTime * 1000);
  const resultModalRef = useRef();

  let timer = useRef();

  const isTimerActive = timeRemaining > 0 && timeRemaining < targetTime * 1000;

  if (timeRemaining <= 0) {
    clearInterval(timer.current);
    resultModalRef.current.showModal();
  }

  function handleStart() {
    timer.current = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 10);
    }, 10);
  }

  function handleReset() {
    setTimeRemaining(targetTime * 1000);
  }

  function handleStop() {
    resultModalRef.current.showModal();
    clearInterval(timer.current);
  }

  return (
    <>
      <ResultModal
        ref={resultModalRef}
        result="lost"
        targetTime={targetTime}
        remainingTime={timeRemaining}
        onReset={handleReset}
      />
      <section className="challenge">
        <h2>{title}</h2>
        {/* {timerExpired && <p>You lost</p>} */}
        <p className="challenge-time">
          {targetTime} second{targetTime > 1 ? 's' : ''}
        </p>
        <p>
          <button onClick={isTimerActive ? handleStop : handleStart}>
            {isTimerActive ? 'Stop' : 'Start Challenge'}
          </button>
        </p>
        <p className={isTimerActive ? 'active' : undefined}>
          {isTimerActive ? 'Timer is running...' : 'Timer is not running'}
        </p>
      </section>
    </>
  );
}
