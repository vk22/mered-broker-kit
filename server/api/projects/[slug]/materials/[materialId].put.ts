import type { Material } from "~/data/projects";
import { hasDatabase } from "~/server/db/postgres";
import { updateMaterial } from "~/server/db/projects";

export default defineEventHandler(async (event) => {
  if (!hasDatabase()) {
    throw createError({
      statusCode: 503,
      statusMessage: "DATABASE_URL is required for admin updates",
    });
  }

  const materialId = Number(getRouterParam(event, "materialId"));

  if (!Number.isFinite(materialId)) {
    throw createError({ statusCode: 400, statusMessage: "Invalid material id" });
  }

  const body = await readBody<Partial<Material>>(event);
  const material = await updateMaterial(materialId, {
    title: body.title,
    subtitle: body.subtitle,
    type: body.type,
    size: body.size,
    image: body.image,
    icon: body.icon,
    fileUrl: body.fileUrl,
    sortOrder:
      body.sortOrder === undefined ? undefined : Number(body.sortOrder),
  });

  if (!material) {
    throw createError({ statusCode: 404, statusMessage: "Material not found" });
  }

  return material;
});

