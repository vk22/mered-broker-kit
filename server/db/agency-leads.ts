import { getPool, hasDatabase } from "./postgres";

export type AgencyLead = {
  id: number;
  company: string;
  tel: string;
  email: string;
  message: string;
  createdAt: string;
};

type AgencyLeadRow = {
  id: number;
  company: string;
  tel: string;
  email: string;
  message: string;
  created_at: Date;
};

export type AgencyLeadInput = Omit<AgencyLead, "id" | "createdAt">;

const mapAgencyLead = (row: AgencyLeadRow): AgencyLead => ({
  id: row.id,
  company: row.company,
  tel: row.tel,
  email: row.email,
  message: row.message,
  createdAt: row.created_at.toISOString(),
});

export const getAgencyLeads = async (): Promise<AgencyLead[]> => {
  if (!hasDatabase()) {
    return [];
  }

  const { rows } = await getPool().query<AgencyLeadRow>(`
    select id, company, tel, email, message, created_at
    from agency_leads
    order by created_at desc, id desc
  `);

  return rows.map(mapAgencyLead);
};

export const createAgencyLead = async (input: AgencyLeadInput) => {
  const { rows } = await getPool().query<AgencyLeadRow>(
    `
      insert into agency_leads (company, tel, email, message)
      values ($1, $2, $3, $4)
      returning id, company, tel, email, message, created_at
    `,
    [input.company, input.tel, input.email, input.message],
  );

  return mapAgencyLead(rows[0]);
};
