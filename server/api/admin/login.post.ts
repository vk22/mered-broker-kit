import {
  isAdminAuthConfigured,
  setAdminSession,
  verifyAdminCredentials,
} from "~/server/utils/admin-auth";

export default defineEventHandler(async (event) => {
  if (!isAdminAuthConfigured()) {
    throw createError({
      statusCode: 503,
      statusMessage: "ADMIN_PASSWORD is not configured",
    });
  }

  const body = await readBody<{
    username?: string;
    password?: string;
  }>(event);

  if (!verifyAdminCredentials(body.username ?? "", body.password ?? "")) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid username or password",
    });
  }

  setAdminSession(event);

  return { ok: true };
});
