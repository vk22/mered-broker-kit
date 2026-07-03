<template>
  <main class="min-h-dvh bg-[#f4f1eb] px-5 py-8 text-[#171816] md:px-10">
    <section class="mx-auto flex max-w-7xl flex-col gap-8">
      <div class="flex flex-col gap-4 border-b border-black/15 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[.18em] text-black/50">Admin</p>
          <h1 class="font-serif text-5xl leading-none">Projects materials</h1>
        </div>

        <select
          v-model="selectedSlug"
          class="h-11 min-w-[220px] border border-black/20 bg-white px-3 text-sm"
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

      <p
        v-if="message"
        class="border border-black/15 bg-white px-4 py-3 text-sm"
      >
        {{ message }}
      </p>

      <section v-if="selectedProject" class="grid gap-8 lg:grid-cols-[360px_1fr]">
        <form
          class="flex flex-col gap-4 border border-black/15 bg-white p-5"
          @submit.prevent="saveProject"
        >
          <h2 class="font-serif text-3xl leading-none">Project</h2>

          <label v-for="field in projectFields" :key="field.key" class="grid gap-1 text-sm">
            <span class="text-xs uppercase tracking-[.12em] text-black/50">{{ field.label }}</span>
            <textarea
              v-if="field.multiline"
              v-model="selectedProject[field.key]"
              class="min-h-24 border border-black/15 px-3 py-2"
            />
            <input
              v-else
              v-model="selectedProject[field.key]"
              class="h-10 border border-black/15 px-3"
            >
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
            <h2 class="font-serif text-3xl leading-none">Materials</h2>
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
            class="grid gap-4 border border-black/15 bg-white p-5 md:grid-cols-2"
            @submit.prevent="saveMaterial(material)"
          >
            <label
              v-for="field in materialFields"
              :key="field.key"
              class="grid gap-1 text-sm"
              :class="field.wide ? 'md:col-span-2' : ''"
            >
              <span class="text-xs uppercase tracking-[.12em] text-black/50">{{ field.label }}</span>
              <input
                v-model="material[field.key]"
                class="h-10 border border-black/15 px-3"
              >
            </label>

            <label class="grid gap-1 text-sm">
              <span class="text-xs uppercase tracking-[.12em] text-black/50">Icon</span>
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
              <span class="text-xs uppercase tracking-[.12em] text-black/50">Order</span>
              <input
                v-model.number="material.sortOrder"
                class="h-10 border border-black/15 px-3"
                type="number"
              >
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
    </section>
  </main>
</template>

<script setup lang="ts">
import type { Material, MaterialIcon, Project } from "~/data/projects";

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

const selectedSlug = ref(projects.value[0]?.slug ?? "");
const message = ref("");

const selectedProject = computed(() =>
  projects.value.find((project) => project.slug === selectedSlug.value),
);

const showMessage = (text: string) => {
  message.value = text;
  window.setTimeout(() => {
    message.value = "";
  }, 2500);
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

