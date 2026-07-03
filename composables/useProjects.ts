import { fallbackProjects } from "~/data/projects";

export type { Material, MaterialIcon, Project } from "~/data/projects";

export const projects = fallbackProjects;

export const useProjects = () => projects;

export const useProject = (slug: string) =>
  projects.find((project) => project.slug === slug);
