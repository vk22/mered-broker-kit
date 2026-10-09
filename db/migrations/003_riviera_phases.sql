begin;

alter table projects add column if not exists phase_selection_image text not null default '';

-- Clone the current catalogue only when creating Phase 2 for the first time.
-- Never change Phase 1 or overwrite edits on subsequent migration runs.
with new_phase as (
  insert into projects
    (slug, name, location, status, completion, image, logo, logo2, eyebrow, description, sort_order)
  select 'riviera-phase2', 'RIVIERA RESIDENCES Phase 2', location, status,
    completion, image, logo, logo2, eyebrow, description, sort_order + 1
  from projects where slug = 'riviera'
  on conflict (slug) do nothing
  returning id
)
insert into materials (project_id, title, subtitle, type, size, image, icon, file_url, sort_order)
select new_phase.id, m.title, m.subtitle, m.type, m.size, m.image, m.icon, '', m.sort_order
from new_phase
cross join materials m
join projects p on p.id = m.project_id and p.slug = 'riviera';

commit;
