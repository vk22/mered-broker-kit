import { hasDatabase } from "~/server/db/postgres";
import { updateProjectBySlug } from "~/server/db/projects";

export default defineEventHandler(async (event) => {
  if (!hasDatabase()) {
    throw createError({
      statusCode: 503,
      statusMessage: "DATABASE_URL is required for admin updates",
    });
  }

  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Missing slug" });
  }

  const body = await readBody(event);
  const project = await updateProjectBySlug(slug, {
    name: body.name,
    location: body.location,
    status: body.status,
    completion: body.completion,
    image: body.image,
    logo: body.logo,
    logo2: body.logo2,
    eyebrow: body.eyebrow,
    description: body.description,
  });

  if (!project) {
    throw createError({ statusCode: 404, statusMessage: "Project not found" });
  }

  return project;
});

