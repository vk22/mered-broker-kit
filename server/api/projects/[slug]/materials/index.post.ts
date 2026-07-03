import type { Material } from "~/data/projects";
import { hasDatabase } from "~/server/db/postgres";
import { createMaterial } from "~/server/db/projects";

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

  const body = await readBody<Material>(event);
  const material = await createMaterial(slug, {
    title: body.title || "New material",
    subtitle: body.subtitle || "",
    type: body.type || "",
    size: body.size || "",
    image: body.image || "",
    icon: body.icon || "FileText",
    fileUrl: body.fileUrl || "",
    sortOrder: Number(body.sortOrder || 0),
  });

  if (!material) {
    throw createError({ statusCode: 404, statusMessage: "Project not found" });
  }

  return material;
});

