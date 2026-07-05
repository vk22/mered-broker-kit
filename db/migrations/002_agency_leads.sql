create table if not exists agency_leads (
  id bigserial primary key,
  company text not null,
  tel text not null,
  email text not null,
  message text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists agency_leads_created_at_idx
  on agency_leads(created_at desc, id desc);
