import React from 'react';

export function Workout({ title, description, time, onComplete }) {
  const [isWorkingOut, setIsWorkingOut] = React.useState(false);
  const [remainingTime, setRemainingTime] = React.useState(0);
  const timer = React.useRef();
  const interval = React.useRef();
  console.log('rendering Workout:', title);

  function handleStopWorkout() {
    clearTimeout(timer.current);
    clearInterval(interval.current);
    onComplete();
    setIsWorkingOut(false);
    setRemainingTime(0);
  }

  function handleStartWorkout() {
    setIsWorkingOut(true);
    setRemainingTime(time);

    const startTime = Date.now();
    const endTime = startTime + time;

    interval.current = setInterval(() => {
      const timeLeft = endTime - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval.current);
      } else {
        setRemainingTime(timeLeft);
      }
    }, 1000);

    timer.current = setTimeout(handleStopWorkout, time);
  }

  const formattedTime = Math.ceil(remainingTime / 1000);

  return (
    <article className="workout">
      <h3>{title}</h3>
      <p>{description}</p>
      {isWorkingOut && <p>Time remaining: {formattedTime}s</p>}
      <p>
        <button onClick={handleStartWorkout}>Start</button>
        <button onClick={isWorkingOut ? handleStopWorkout : null}>Stop</button>
      </p>
    </article>
  );
}

const workouts = [
  {
    title: 'Pushups',
    description: 'Do 30 pushups',
    time: 1000 * 60 * 3,
  },
  {
    title: 'Squats',
    description: 'Do 30 squats',
    time: 1000 * 60 * 2,
  },
  {
    title: 'Pullups',
    description: 'Do 10 pullups',
    time: 1000 * 60 * 3,
  },
];

function App() {
  const [completedWorkouts, setCompletedWorkouts] = React.useState([]);

  function handleWorkoutComplete(workoutTitle) {
    setCompletedWorkouts((prevCompletedWorkouts) => [
      ...prevCompletedWorkouts,
      workoutTitle,
    ]);
  }

  return (
    <main>
      <section>
        <h2>Choose a workout</h2>
        <ul>
          {workouts.map((workout) => (
            <li key={workout.title}>
              <Workout
                {...workout}
                onComplete={() => handleWorkoutComplete(workout.title)}
              />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Completed workouts</h2>
        <ul>
          {completedWorkouts.map((workoutTitle, index) => (
            <li key={index}>{workoutTitle}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
