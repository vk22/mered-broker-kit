import { getProjects } from "~/server/db/projects";

export default defineEventHandler(async () => {
  return getProjects();
});

