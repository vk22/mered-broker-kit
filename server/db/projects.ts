import { fallbackProjects, type Material, type Project } from "~/data/projects";
import { getPool, hasDatabase } from "./postgres";

type ProjectRow = {
  id: number;
  slug: string;
  name: string;
  location: string;
  status: string;
  completion: string;
  image: string;
  logo: string;
  logo2: string;
  eyebrow: string;
  description: string;
};

type MaterialRow = {
  id: number;
  project_id: number;
  title: string;
  subtitle: string;
  type: string;
  size: string;
  image: string;
  icon: Material["icon"];
  file_url: string;
  sort_order: number;
};

const mapMaterial = (row: MaterialRow): Material => ({
  id: row.id,
  title: row.title,
  subtitle: row.subtitle,
  type: row.type,
  size: row.size,
  image: row.image,
  icon: row.icon,
  fileUrl: row.file_url,
  sortOrder: row.sort_order,
});

const mapProject = (row: ProjectRow, materials: Material[] = []): Project => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  location: row.location,
  status: row.status,
  completion: row.completion,
  image: row.image,
  logo: row.logo,
  logo2: row.logo2,
  eyebrow: row.eyebrow,
  description: row.description,
  materials,
});

export const getProjects = async (): Promise<Project[]> => {
  if (!hasDatabase()) {
    return fallbackProjects;
  }

  const { rows } = await getPool().query<ProjectRow>(`
    select id, slug, name, location, status, completion, image, logo, logo2, eyebrow, description
    from projects
    order by sort_order asc, id asc
  `);

  const materials = await getPool().query<MaterialRow>(`
    select id, project_id, title, subtitle, type, size, image, icon, file_url, sort_order
    from materials
    order by sort_order asc, id asc
  `);

  return rows.map((project) =>
    mapProject(
      project,
      materials.rows
        .filter((material) => material.project_id === project.id)
        .map(mapMaterial),
    ),
  );
};

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  if (!hasDatabase()) {
    return fallbackProjects.find((project) => project.slug === slug) ?? null;
  }

  const projectResult = await getPool().query<ProjectRow>(
    `
      select id, slug, name, location, status, completion, image, logo, logo2, eyebrow, description
      from projects
      where slug = $1
      limit 1
    `,
    [slug],
  );

  const project = projectResult.rows[0];

  if (!project) {
    return null;
  }

  const materialResult = await getPool().query<MaterialRow>(
    `
      select id, project_id, title, subtitle, type, size, image, icon, file_url, sort_order
      from materials
      where project_id = $1
      order by sort_order asc, id asc
    `,
    [project.id],
  );

  return mapProject(project, materialResult.rows.map(mapMaterial));
};

export const updateProjectBySlug = async (
  slug: string,
  input: Partial<Omit<Project, "id" | "slug" | "materials">>,
) => {
  const result = await getPool().query<ProjectRow>(
    `
      update projects
      set
        name = coalesce($2, name),
        location = coalesce($3, location),
        status = coalesce($4, status),
        completion = coalesce($5, completion),
        image = coalesce($6, image),
        logo = coalesce($7, logo),
        logo2 = coalesce($8, logo2),
        eyebrow = coalesce($9, eyebrow),
        description = coalesce($10, description),
        updated_at = now()
      where slug = $1
      returning id, slug, name, location, status, completion, image, logo, logo2, eyebrow, description
    `,
    [
      slug,
      input.name,
      input.location,
      input.status,
      input.completion,
      input.image,
      input.logo,
      input.logo2,
      input.eyebrow,
      input.description,
    ],
  );

  return result.rows[0] ? getProjectBySlug(result.rows[0].slug) : null;
};

export const createMaterial = async (slug: string, input: Material) => {
  const project = await getProjectBySlug(slug);

  if (!project?.id) {
    return null;
  }

  const result = await getPool().query<MaterialRow>(
    `
      insert into materials
        (project_id, title, subtitle, type, size, image, icon, file_url, sort_order)
      values
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      returning id, project_id, title, subtitle, type, size, image, icon, file_url, sort_order
    `,
    [
      project.id,
      input.title,
      input.subtitle,
      input.type,
      input.size,
      input.image,
      input.icon,
      input.fileUrl,
      input.sortOrder,
    ],
  );

  return mapMaterial(result.rows[0]);
};

export const updateMaterial = async (
  materialId: number,
  input: Partial<Material>,
) => {
  const result = await getPool().query<MaterialRow>(
    `
      update materials
      set
        title = coalesce($2, title),
        subtitle = coalesce($3, subtitle),
        type = coalesce($4, type),
        size = coalesce($5, size),
        image = coalesce($6, image),
        icon = coalesce($7, icon),
        file_url = coalesce($8, file_url),
        sort_order = coalesce($9, sort_order),
        updated_at = now()
      where id = $1
      returning id, project_id, title, subtitle, type, size, image, icon, file_url, sort_order
    `,
    [
      materialId,
      input.title,
      input.subtitle,
      input.type,
      input.size,
      input.image,
      input.icon,
      input.fileUrl,
      input.sortOrder,
    ],
  );

  return result.rows[0] ? mapMaterial(result.rows[0]) : null;
};

export const deleteMaterial = async (materialId: number) => {
  const result = await getPool().query(
    "delete from materials where id = $1 returning id",
    [materialId],
  );

  return Number(result.rowCount) > 0;
};

