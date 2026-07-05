import { hasDatabase } from "~/server/db/postgres";
import { createAgencyLead } from "~/server/db/agency-leads";

const cleanText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

export default defineEventHandler(async (event) => {
  if (!hasDatabase()) {
    throw createError({
      statusCode: 503,
      statusMessage: "DATABASE_URL is required",
    });
  }

  const body = await readBody(event);
  const company = cleanText(body.company);
  const tel = cleanText(body.tel);
  const email = cleanText(body.email);
  const message = cleanText(body.message);

  if (!company || !tel || !email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Company, tel and email are required",
    });
  }

  return createAgencyLead({
    company,
    tel,
    email,
    message,
  });
});
