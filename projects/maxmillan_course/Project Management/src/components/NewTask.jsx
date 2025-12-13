import { useState } from 'react';
export default function NewTask({ onAddTask }) {
  const [enteredTasks, setEnteredTasks] = useState('');

  function handleChange(event) {
    setEnteredTasks(event.target.value);
  }

  function handleClick() {
    setEnteredTasks('');
    onAddTask(enteredTasks);
  }
  return (
    <div className="flex items-center gap-4">
      <input
        type="text"
        className="w-64 px-2 py-1 rounded-sm bg-stone-200"
        onChange={handleChange}
        value={enteredTasks}
      />
      <button
        onClick={handleClick}
        className="text-stone-700 hover:text-stone-950"
      >
        Add Task
      </button>
    </div>
  );
}
