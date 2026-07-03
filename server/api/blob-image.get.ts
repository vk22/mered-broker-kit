import { get } from "@vercel/blob";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const pathname = typeof query.pathname === "string" ? query.pathname : "";

  if (!pathname || pathname.includes("..")) {
    throw createError({ statusCode: 400, statusMessage: "Missing pathname" });
  }

  const result = await get(pathname, {
    access: "private",
    ifNoneMatch: getHeader(event, "if-none-match") ?? undefined,
  });

  if (!result) {
    throw createError({ statusCode: 404, statusMessage: "Image not found" });
  }

  if (result.statusCode === 304) {
    return new Response(null, {
      status: 304,
      headers: {
        ETag: result.blob.etag,
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  }

  return new Response(result.stream, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Type": result.blob.contentType,
      ETag: result.blob.etag,
      "X-Content-Type-Options": "nosniff",
    },
  });
});
