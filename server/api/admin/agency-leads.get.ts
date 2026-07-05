import { getAgencyLeads } from "~/server/db/agency-leads";
import { hasValidAdminSession } from "~/server/utils/admin-auth";

export default defineEventHandler(async (event) => {
  if (!hasValidAdminSession(event)) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  return getAgencyLeads();
});
