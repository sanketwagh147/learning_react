import ProjectSidebar from './components/ProjectSidebar';
import NewProject from './components/NewProject';
import NoProjectSelected from './components/NoProjectSelected';
import { useState } from 'react';
import SelectedProject from './components/SelectedProject';
function App() {
  const [projectsState, setProjects] = useState({
    selectedProjectId: undefined,
    projects: [],
    tasks: [],
  });

  function handleAddTask(text) {
    if (!text || text.trim().length === 0) {
      return;
    }
    // Logic to add a new task
    setProjects((prevState) => {
      const newTask = {
        text,
        taskId: Math.random(),
        id: prevState.selectedProjectId,
      };
      return {
        ...prevState,
        tasks: [...prevState.tasks, newTask],
      };
    });
  }
  function handleDeleteTask(taskId) {
    // Logic to delete a task
    setProjects((prevState) => ({
      ...prevState,
      tasks: prevState.tasks.filter((t) => t.taskId !== taskId),
    }));
  }

  function handleStartAddProject() {
    setProjects((prevState) => ({
      ...prevState,
      selectedProjectId: null,
    }));
    // Logic to start adding a new project
  }
  function handleCancel() {
    setProjects((prevState) => {
      const newProject = {
        ...prevState.projectData,
        id: Math.random(),
      };
      return {
        ...prevState,
        selectedProjectId: undefined,
        projects: [...prevState.projects, newProject],
      };
    });
  }

  function handleSelectProject(projectId) {
    setProjects((prevState) => ({
      ...prevState,
      selectedProjectId: projectId,
    }));
    // Logic to select a project
  }
  function handleDeleteProject() {
    setProjects((prevState) => ({
      ...prevState,
      selectedProjectId: undefined,
      projects: prevState.projects.filter(
        (project) => project.id !== prevState.selectedProjectId
      ),
    }));
    // Logic to select a project
  }

  function handleAddProject({ projectData }) {
    setProjects((prevState) => {
      const newProject = {
        ...projectData,
        id: Math.random(),
      };
      return {
        ...prevState,
        selectedProjectId: undefined,
        projects: [...prevState.projects, newProject],
      };
    });
  }
  const selectedProject = projectsState.projects.find(
    (project) => project.id === projectsState.selectedProjectId
  );
  const projectTasks = projectsState.tasks.filter(
    (task) => task.id === projectsState.selectedProjectId
  );
  let content = (
    <SelectedProject
      project={selectedProject}
      onDeleteProject={handleDeleteProject}
      onAddProject={handleAddProject}
      onAddTask={handleAddTask}
      onDeleteTask={handleDeleteTask}
      tasks={projectTasks}
    />
  );

  if (projectsState.selectedProjectId === null) {
    content = (
      <NewProject onAddProject={handleAddProject} onCancel={handleCancel} />
    );
  } else if (projectsState.selectedProjectId === undefined) {
    content = <NoProjectSelected onStartAddProject={handleStartAddProject} />;
  }
  console.log(projectsState);

  return (
    <main className="h-screen my-8 flex gap-8">
      <ProjectSidebar
        onStartAddProject={handleStartAddProject}
        projects={projectsState.projects}
        onSelectProject={handleSelectProject}
        selectedProjectId={projectsState.selectedProjectId}
      />
      {/* <h1 className="my-8 text-center text-5xl font-bold">Hello World</h1> */}
      {/* <NewProject /> */}
      {content}
    </main>
  );
}

export default App;
