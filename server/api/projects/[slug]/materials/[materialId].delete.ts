import { hasDatabase } from "~/server/db/postgres";
import { deleteMaterial } from "~/server/db/projects";

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

  const deleted = await deleteMaterial(materialId);

  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: "Material not found" });
  }

  return { ok: true };
});

