insert into projects
  (slug, name, location, status, completion, image, logo, logo2, eyebrow, description, sort_order)
values
  (
    'iconic',
    'ICONIC RESIDENCES',
    'Al Reem Island, Abu Dhabi',
    'Now selling',
    'Q4 2028',
    '/images/iconic/main.jpg',
    '/images/iconic/iconic-logo.svg',
    '/images/iconic/iconic-logo2.svg',
    'Waterfront residences',
    'An exclusive branded residence designed by Italian icon Pininfarina.',
    1
  ),
  (
    'riviera',
    'RIVIERA RESIDENCES',
    'Saadiyat Island, Abu Dhabi',
    'Exclusive release',
    'Q2 2027',
    '/images/riviera/main.jpg',
    '/images/riviera/riviera-logo.svg',
    '/images/riviera/riviera-logo2.svg',
    'Private beach collection',
    'Stunning waterfront residences with signature architecture and amenities.',
    2
  )
on conflict (slug) do update set
  name = excluded.name,
  location = excluded.location,
  status = excluded.status,
  completion = excluded.completion,
  image = excluded.image,
  logo = excluded.logo,
  logo2 = excluded.logo2,
  eyebrow = excluded.eyebrow,
  description = excluded.description,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into materials
  (project_id, title, subtitle, type, size, image, icon, file_url, sort_order)
select
  projects.id,
  seed.title,
  seed.subtitle,
  seed.type,
  seed.size,
  seed.image,
  seed.icon,
  seed.file_url,
  seed.sort_order
from (
  values
    ('iconic', 'Presentations', 'Digital presntations and broshures', 'PDF', '18.4 MB', '/images/iconic/brochure.jpg', 'FileText', '', 1),
    ('iconic', 'Renders', 'High-quality renders and visualizations', 'ZIP', '148 MB', '/images/iconic/renders.jpg', 'Image', '', 2),
    ('iconic', 'Show Apartment', 'Virtual tour of the show apartment', 'PDF', '2.1 MB', '/images/iconic/apartments.jpg', 'Rotate3d', '', 3),
    ('iconic', 'Videos', 'Project videos and walkthroughs', 'ZIP', '46.8 MB', '/images/iconic/videos.jpg', 'Video', '', 4),
    ('iconic', 'Views', 'Location views and panoramas', 'PDF', '1.2 MB', '/images/iconic/view.jpg', 'Eye', '', 5),
    ('riviera', 'Presentations', 'Digital presntations and broshures', 'PDF', '24.6 MB', '/images/riviera/brochure.jpg', 'FileText', '', 1),
    ('riviera', 'Renders', 'High-quality renders and visualizations', 'PDF', '12.8 MB', '/images/riviera/renders.jpg', 'Image', '', 2),
    ('riviera', 'Sales Gallery', 'Digital presntations and broshures', 'ZIP', '38.2 MB', '/images/riviera/gallery.jpg', 'FileText', '', 3),
    ('riviera', 'Videos', 'Project videos and walkthroughs', 'XLSX', '840 KB', '/images/riviera/videos.jpg', 'Video', '', 4)
) as seed(project_slug, title, subtitle, type, size, image, icon, file_url, sort_order)
join projects on projects.slug = seed.project_slug
where not exists (
  select 1
  from materials
  where materials.project_id = projects.id
    and materials.title = seed.title
);

