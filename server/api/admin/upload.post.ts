import { put } from "@vercel/blob";
import { hasValidAdminSession } from "~/server/utils/admin-auth";

const maxUploadSize = 12 * 1024 * 1024;

const safePathSegment = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export default defineEventHandler(async (event) => {
  if (!hasValidAdminSession(event)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  const parts = await readMultipartFormData(event);
  const file = parts?.find((part) => part.name === "file");

  if (!file?.filename || !file.data.length) {
    throw createError({ statusCode: 400, statusMessage: "Missing file" });
  }

  if (file.data.length > maxUploadSize) {
    throw createError({
      statusCode: 413,
      statusMessage: "Image must be smaller than 12 MB",
    });
  }

  if (!file.type?.startsWith("image/")) {
    throw createError({
      statusCode: 415,
      statusMessage: "Only image uploads are supported",
    });
  }

  const folder =
    parts?.find((part) => part.name === "folder")?.data.toString("utf8") ||
    "admin";
  const filename = safePathSegment(file.filename) || "image";
  const pathname = `broker-kit/${safePathSegment(folder)}/${filename}`;

  const blob = await put(pathname, file.data, {
    access: "private",
    addRandomSuffix: true,
    contentType: file.type,
    multipart: file.data.length > 4 * 1024 * 1024,
  });

  return {
    url: `/api/blob-image?pathname=${encodeURIComponent(blob.pathname)}`,
    pathname: blob.pathname,
  };
});
