create table if not exists projects (
  id bigserial primary key,
  slug text not null unique,
  name text not null,
  location text not null default '',
  status text not null default '',
  completion text not null default '',
  image text not null default '',
  logo text not null default '',
  logo2 text not null default '',
  eyebrow text not null default '',
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists materials (
  id bigserial primary key,
  project_id bigint not null references projects(id) on delete cascade,
  title text not null,
  subtitle text not null default '',
  type text not null default '',
  size text not null default '',
  image text not null default '',
  icon text not null default 'FileText',
  file_url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists materials_project_sort_idx
  on materials(project_id, sort_order, id);

