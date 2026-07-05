<template>
  <main class="min-h-dvh bg-[#282828] px-5 py-8 text-[#171816] md:px-10">
    <section class="mx-auto flex max-w-5xl flex-col gap-8">
      <div class="w-full flex justify-center gap-3 mb-4">
        <button
          class="h-10 px-4 text-sm uppercase tracking-[.12em]"
          :class="
            activeSection === 'projects'
              ? 'bg-white text-[#171816]'
              : 'border border-white/25 text-white'
          "
          type="button"
          @click="activeSection = 'projects'"
        >
          Projects
        </button>
        <button
          class="h-10 px-4 text-sm uppercase tracking-[.12em]"
          :class="
            activeSection === 'leads'
              ? 'bg-white text-[#171816]'
              : 'border border-white/25 text-white'
          "
          type="button"
          @click="activeSection = 'leads'"
        >
          Agency leads
        </button>
      </div>


      <section
        v-if="activeSection === 'projects' && selectedProject"
        class="grid gap-8 lg:grid-cols-[360px_1fr]"
      >

      <div
        class="flex flex-col gap-4 pb-2 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <h1 class="font-serif text-3xl leading-none text-white">
            Project Info
          </h1>
        </div>

        <div
          class="flex flex-col gap-3 sm:flex-row sm:items-center bg-transparent pr-4 rounded-sm overflow-hidden border border-white/20"
        >
          <select
            v-model="selectedSlug"
            class="h-11 min-w-[220px] text-white bg-transparent px-3 text-md font-semibold focus:outline-none"
          >
            <option
              v-for="project in projects"
              :key="project.slug"
              :value="project.slug"
            >
              {{ project.name }}
            </option>
          </select>
        </div>
      </div>

        <form
          class="flex flex-col gap-4 bg-white p-7"
          @submit.prevent="saveProject"
        >
          <h2 class="font-serif text-3xl leading-none py-3">{{ selectedProject.name }}</h2>

          <label
            v-for="field in projectFields"
            :key="field.key"
            class="grid gap-1 text-sm"
          >
            <span class="text-xs uppercase tracking-[.12em] text-black/50">{{
              field.label
            }}</span>
            <textarea
              v-if="field.multiline"
              v-model="selectedProject[field.key]"
              class="min-h-24 border border-black/15 px-3 py-2"
            />
            <input
              v-else
              v-model="selectedProject[field.key]"
              class="h-10 border border-black/15 px-3"
            />
            <input
              v-if="isProjectUploadField(field.key)"
              class="text-sm file:mr-3 file:h-9 file:border-0 file:bg-[#171816] file:px-3 file:text-xs file:uppercase file:tracking-[.12em] file:text-white"
              accept="image/*"
              type="file"
              :disabled="uploading[projectUploadKey(field.key)]"
              @change="uploadProjectImage(field.key, $event)"
            />
            <span
              v-if="uploading[projectUploadKey(field.key)]"
              class="text-xs uppercase tracking-[.12em] text-black/50"
            >
              Uploading
            </span>
          </label>

          <button
            class="h-11 bg-[#171816] px-4 text-sm uppercase tracking-[.12em] text-white"
            type="submit"
          >
            Save project
          </button>
        </form>

        <div class="flex flex-col gap-5">
          <div class="flex items-center justify-between">
            <h2 class="font-serif text-3xl text-white leading-none">
              Materials
            </h2>
            <button
              class="h-10 border border-black/20 bg-white px-4 text-sm uppercase tracking-[.12em]"
              type="button"
              @click="addMaterial"
            >
              Add material
            </button>
          </div>

          <form
            v-for="material in selectedProject.materials"
            :key="material.id ?? material.title"
            class="grid gap-4 bg-white p-7 md:grid-cols-2"
            @submit.prevent="saveMaterial(material)"
          >
            <label
              v-for="field in materialFields"
              :key="field.key"
              class="grid gap-1 text-sm"
              :class="field.wide ? 'md:col-span-2' : ''"
            >
              <span class="text-xs uppercase tracking-[.12em] text-black/50">{{
                field.label
              }}</span>
              <input
                v-model="material[field.key]"
                class="h-10 border border-black/15 px-3"
              />
              <input
                v-if="field.key === 'image'"
                class="text-sm file:mr-3 file:h-9 file:border-0 file:bg-[#171816] file:px-3 file:text-xs file:uppercase file:tracking-[.12em] file:text-white"
                accept="image/*"
                type="file"
                :disabled="uploading[materialUploadKey(material)]"
                @change="uploadMaterialImage(material, $event)"
              />
              <span
                v-if="
                  field.key === 'image' &&
                  uploading[materialUploadKey(material)]
                "
                class="text-xs uppercase tracking-[.12em] text-black/50"
              >
                Uploading
              </span>
            </label>

            <label class="grid gap-1 text-sm">
              <span class="text-xs uppercase tracking-[.12em] text-black/50"
                >Icon</span
              >
              <select
                v-model="material.icon"
                class="h-10 border border-black/15 bg-white px-3"
              >
                <option v-for="icon in materialIcons" :key="icon" :value="icon">
                  {{ icon }}
                </option>
              </select>
            </label>

            <label class="grid gap-1 text-sm">
              <span class="text-xs uppercase tracking-[.12em] text-black/50"
                >Order</span
              >
              <input
                v-model.number="material.sortOrder"
                class="h-10 border border-black/15 px-3"
                type="number"
              />
            </label>

            <div class="flex gap-3 md:col-span-2">
              <button
                class="h-10 bg-[#171816] px-4 text-sm uppercase tracking-[.12em] text-white"
                type="submit"
              >
                Save
              </button>
              <button
                class="h-10 border border-red-900/30 px-4 text-sm uppercase tracking-[.12em] text-red-900"
                type="button"
                @click="removeMaterial(material)"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </section>

      <section v-if="activeSection === 'leads'" class="flex flex-col gap-5">
        <div class="flex items-center justify-start">
          <h2 class="font-serif text-3xl text-white leading-none">
            Agency leads
          </h2>
          <!-- <button
            class="h-10 border border-black/20 bg-white px-4 text-sm uppercase tracking-[.12em]"
            type="button"
            @click="refreshLeads"
          >
            Refresh
          </button> -->
        </div>

        <div v-if="agencyLeads.length" class="grid gap-4">
          <article
            v-for="lead in agencyLeads"
            :key="lead.id"
            class="grid gap-4 bg-white p-7 md:grid-cols-[220px_1fr]"
          >
            <div class="flex flex-col gap-2">
              <p class="text-xs uppercase tracking-[.12em] text-black/50">
                {{ formatLeadDate(lead.createdAt) }}
              </p>
              <h3 class="font-serif text-xl leading-none">
                {{ lead.company }}
              </h3>
            </div>

            <div class="grid gap-3 text-sm">
              <div class="grid gap-3 md:grid-cols-2">
                <a
                  class="border-b border-black/20 pb-1"
                  :href="`tel:${lead.tel}`"
                >
                  {{ lead.tel }}
                </a>
                <a
                  class="border-b border-black/20 pb-1"
                  :href="`mailto:${lead.email}`"
                >
                  {{ lead.email }}
                </a>
              </div>
              <p v-if="lead.message" class="leading-relaxed text-black/75">
                {{ lead.message }}
              </p>
            </div>
          </article>
        </div>

        <p v-else class="bg-white px-4 py-3 text-sm">No agency leads yet.</p>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { Material, MaterialIcon, Project } from "~/data/projects";

type AgencyLead = {
  id: number;
  company: string;
  tel: string;
  email: string;
  message: string;
  createdAt: string;
};

type ProjectField = {
  key: keyof Omit<Project, "id" | "slug" | "materials">;
  label: string;
  multiline?: boolean;
};

type MaterialField = {
  key: keyof Pick<
    Material,
    "title" | "subtitle" | "type" | "size" | "image" | "fileUrl"
  >;
  label: string;
  wide?: boolean;
};

const materialIcons: MaterialIcon[] = [
  "FileText",
  "Image",
  "CirclePlay",
  "Rotate3d",
  "Video",
  "Eye",
];

const projectFields: ProjectField[] = [
  { key: "name", label: "Name" },
  { key: "location", label: "Location" },
  { key: "status", label: "Status" },
  { key: "completion", label: "Completion" },
  { key: "eyebrow", label: "Eyebrow" },
  { key: "description", label: "Description", multiline: true },
  { key: "image", label: "Hero image" },
  { key: "logo", label: "Logo" },
  { key: "logo2", label: "Logo 2" },
];

const materialFields: MaterialField[] = [
  { key: "title", label: "Title" },
  { key: "subtitle", label: "Subtitle" },
  { key: "type", label: "Type" },
  { key: "size", label: "Size" },
  { key: "image", label: "Image URL", wide: true },
  { key: "fileUrl", label: "File/link URL", wide: true },
];

const { data: projects, refresh } = await useFetch<Project[]>("/api/projects", {
  default: () => [],
});
const { data: agencyLeads, refresh: refreshLeads } = await useFetch<
  AgencyLead[]
>("/api/admin/agency-leads", {
  default: () => [],
});

const activeSection = ref<"projects" | "leads">("projects");
const selectedSlug = ref(projects.value[0]?.slug ?? "");
const message = ref("");
const uploading = ref<Record<string, boolean>>({});

const selectedProject = computed(() =>
  projects.value.find((project) => project.slug === selectedSlug.value),
);

const showMessage = (text: string) => {
  message.value = text;
  window.setTimeout(() => {
    message.value = "";
  }, 2500);
};

const formatLeadDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const isProjectUploadField = (
  key: keyof Omit<Project, "id" | "slug" | "materials">,
) => ["image", "logo", "logo2"].includes(key);

const projectUploadKey = (key: string) => `project:${key}`;

const materialUploadKey = (material: Material) =>
  `material:${material.id ?? material.title}`;

const uploadImage = async (file: File, folder: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  return $fetch<{ url: string }>("/api/admin/upload", {
    method: "POST",
    body: formData,
  });
};

const resetFileInput = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    event.target.value = "";
  }
};

const uploadProjectImage = async (
  key: keyof Omit<Project, "id" | "slug" | "materials">,
  event: Event,
) => {
  const input = event.target;

  if (
    !(input instanceof HTMLInputElement) ||
    !input.files?.[0] ||
    !selectedProject.value
  ) {
    return;
  }

  const uploadKey = projectUploadKey(key);
  uploading.value[uploadKey] = true;

  try {
    const blob = await uploadImage(
      input.files[0],
      `${selectedProject.value.slug}/${String(key)}`,
    );
    selectedProject.value[key] = blob.url;
    showMessage("Image uploaded. Save project to keep it.");
  } catch {
    showMessage("Image upload failed");
  } finally {
    uploading.value[uploadKey] = false;
    resetFileInput(event);
  }
};

const uploadMaterialImage = async (material: Material, event: Event) => {
  const input = event.target;

  if (
    !(input instanceof HTMLInputElement) ||
    !input.files?.[0] ||
    !selectedProject.value
  ) {
    return;
  }

  const uploadKey = materialUploadKey(material);
  uploading.value[uploadKey] = true;

  try {
    const blob = await uploadImage(
      input.files[0],
      `${selectedProject.value.slug}/materials`,
    );
    material.image = blob.url;
    showMessage("Image uploaded. Save material to keep it.");
  } catch {
    showMessage("Image upload failed");
  } finally {
    uploading.value[uploadKey] = false;
    resetFileInput(event);
  }
};

const saveProject = async () => {
  if (!selectedProject.value) {
    return;
  }

  await $fetch(`/api/projects/${selectedProject.value.slug}`, {
    method: "PUT",
    body: selectedProject.value,
  });
  await refresh();
  showMessage("Project saved");
};

const addMaterial = async () => {
  if (!selectedProject.value) {
    return;
  }

  await $fetch(`/api/projects/${selectedProject.value.slug}/materials`, {
    method: "POST",
    body: {
      title: "New material",
      subtitle: "",
      type: "",
      size: "",
      image: "",
      icon: "FileText",
      fileUrl: "",
      sortOrder: selectedProject.value.materials.length + 1,
    },
  });
  await refresh();
  showMessage("Material added");
};

const saveMaterial = async (material: Material) => {
  if (!selectedProject.value || !material.id) {
    return;
  }

  await $fetch(
    `/api/projects/${selectedProject.value.slug}/materials/${material.id}`,
    {
      method: "PUT",
      body: material,
    },
  );
  await refresh();
  showMessage("Material saved");
};

const removeMaterial = async (material: Material) => {
  if (!selectedProject.value || !material.id) {
    return;
  }

  await $fetch(
    `/api/projects/${selectedProject.value.slug}/materials/${material.id}`,
    {
      method: "DELETE",
    },
  );
  await refresh();
  showMessage("Material deleted");
};
</script>
