import NewTask from './NewTask';

export default function Tasks({ tasks, onAddTask, onDeleteTask }) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-stone-700 mb-4"> Tasks</h2>
      <NewTask onAddTask={onAddTask} />
      {tasks.length === 0 && (
        <p className="text-stone-500 my-4">This Projects does not have tasks</p>
      )}
      {tasks.length > 0 && (
        <ul className="p-4 rounded-md bg-stone-100">
          {tasks.map((task) => (
            <li
              key={task.taskId}
              className="flex justify-between items-center p-2 my-1 bg-stone-50 rounded hover:bg-stone-200"
            >
              <span className="text-stone-700">{task.text}</span>
              <button
                onClick={() => onDeleteTask(task.taskId)}
                className="ml-4 text-stone-600 hover:text-stone-900"
              >
                Clear
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
