import noProjectImage from '../assets/no-projects.png';
import Button from './Button';

export default function NoProjectSelected({ onStartAddProject }) {
  return (
    <div className="mt-24 text-center w-2/3">
      <img
        src={noProjectImage}
        alt="No project selected "
        className="w-16 h-16 object-contain mx-auto"
      />
      <h2 className="text-xl font-bold text-stone-500 mt-4 my-4">
        No project selected
      </h2>
      <p className="text-stone-400 mb-4">
        Please select a project from the sidebar to view its details.
      </p>
      <p className="mt8">
        <Button onClick={onStartAddProject}>Create new project</Button>
      </p>
    </div>
  );
}
