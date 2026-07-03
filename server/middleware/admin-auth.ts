import {
  hasValidAdminSession,
  isAdminAuthConfigured,
} from "~/server/utils/admin-auth";

const isProtectedRequest = (event: Parameters<typeof getRequestURL>[0]) => {
  const { pathname } = getRequestURL(event);
  const method = getMethod(event).toUpperCase();

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return true;
  }

  return pathname.startsWith("/api/projects") && method !== "GET";
};

export default defineEventHandler((event) => {
  if (!isProtectedRequest(event)) {
    return;
  }

  if (!isAdminAuthConfigured()) {
    if (process.env.NODE_ENV === "development") {
      return;
    }

    throw createError({
      statusCode: 503,
      statusMessage: "ADMIN_PASSWORD is not configured",
    });
  }

  if (hasValidAdminSession(event)) {
    return;
  }

  const { pathname } = getRequestURL(event);

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const next = encodeURIComponent(pathname);

    return sendRedirect(event, `/login?next=${next}`, 302);
  }

  throw createError({
    statusCode: 401,
    statusMessage: "Authentication required",
  });
});
