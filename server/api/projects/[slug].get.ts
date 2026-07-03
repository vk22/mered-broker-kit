import { getProjectBySlug } from "~/server/db/projects";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Missing slug" });
  }

  const project = await getProjectBySlug(slug);

  if (!project) {
    throw createError({ statusCode: 404, statusMessage: "Project not found" });
  }

  return project;
});

