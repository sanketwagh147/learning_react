import ProjectSidebar from './components/ProjectSidebar';
import NewProject from './components/NewProject';
import NoProjectSelected from './components/NoProjectSelected';
import { useState } from 'react';
function App() {
  const [projectsState, setProjects] = useState({
    selectedProjectId: undefined,
    projects: [],
  });

  function handleStartAddProject() {
    setProjects((prevState) => ({
      ...prevState,
      selectedProjectId: null,
    }));
    // Logic to start adding a new project
  }

  function handleAddProject({ projectData }) {
    setProjects((prevState) => {
      const newProject = { ...projectData, id: Math.random() };
      return {
        ...prevState,
        projects: [...prevState.projects, newProject],
      };
    });
  }

  let content;

  if (projectsState.selectedProjectId === null) {
    content = <NewProject onAddProject={handleAddProject} />;
  } else if (projectsState.selectedProjectId === undefined) {
    content = <NoProjectSelected onStartAddProject={handleStartAddProject} />;
  }
  console.log(projectsState);

  return (
    <main className="h-screen my-8 flex gap-8">
      <ProjectSidebar onStartAddProject={handleStartAddProject} />
      {/* <h1 className="my-8 text-center text-5xl font-bold">Hello World</h1> */}
      {/* <NewProject /> */}
      {content}
    </main>
  );
}

export default App;
