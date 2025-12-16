import { useEffect, useState } from 'react';
export default function QuestionTimer({ timeout, onTimeOut, mode }) {
  const [timeLeft, setTimeLeft] = useState(timeout);

  useEffect(() => {
    console.log('Setting Timeout');
    if (!onTimeOut) {
      return;
    }
    const timerOutId = setTimeout(onTimeOut, timeout);
    return () => clearTimeout(timerOutId);
  }, [onTimeOut, timeout]);

  useEffect(() => {
    console.log('Setting Interval');

    const interval = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <progress
      id="question-time"
      max={timeout}
      value={timeLeft}
      className={mode}
    />
  );
}
