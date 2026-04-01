export interface Project {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  assignedUsers: string[];
  createdAt: string;
  status: 'active' | 'inactive';
}

const PROJECTS_KEY = 'app_projects';

const seedProjects = () => {
  const raw = localStorage.getItem(PROJECTS_KEY);
  if (!raw) {
    const defaults: Project[] = [
      { id: '1', name: 'Mobile App Redesign', description: 'Redesign the mobile application for better UX', createdBy: '1', assignedUsers: ['1', '2'], createdAt: '2025-11-01T10:00:00Z', status: 'active' },
      { id: '2', name: 'Analytics V2', description: 'Build next-gen analytics pipeline', createdBy: '1', assignedUsers: ['2'], createdAt: '2025-12-15T08:00:00Z', status: 'active' },
      { id: '3', name: 'Legacy Migration', description: 'Migrate legacy systems to cloud', createdBy: '2', assignedUsers: ['1'], createdAt: '2026-01-10T09:00:00Z', status: 'inactive' },
    ];
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(defaults));
  }
};
seedProjects();

export const getProjects = (): Project[] => {
  const raw = localStorage.getItem(PROJECTS_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveProjects = (projects: Project[]) => {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
};

export const addProject = (project: Omit<Project, 'id' | 'createdAt'>): Project => {
  const projects = getProjects();
  const newProject: Project = { ...project, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  projects.push(newProject);
  saveProjects(projects);
  return newProject;
};

export const updateProject = (id: string, updates: Partial<Project>) => {
  const projects = getProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx >= 0) {
    projects[idx] = { ...projects[idx], ...updates };
    saveProjects(projects);
  }
};

export const deleteProject = (id: string) => {
  saveProjects(getProjects().filter(p => p.id !== id));
};
