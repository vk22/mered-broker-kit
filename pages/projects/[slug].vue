<template>
  <main>

    <section class="h-[calc(100dvh-125px)] bg-[#252828] ">
      <div class="grid h-full grid-cols-1 md:grid-cols-12 md:auto-rows-fr gap-0 md:gap-4 px-[2vw]">
        <button
          v-for="(material, index) in project.materials"
          :key="material.title"
          :ref="setMaterialCard"
          :class="materialCardClass(index)"
          class="group relative flex h-[175px] flex-col justify-between cursor-pointer overflow-hidden p-6 md:p-6 lg:p-8 text-left text-white md:h-full "
          type="button"
          @click="openLink(material.fileUrl)"
        >
          <img
            :ref="(element) => setMaterialImage(element, index)"
            class="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.025]"
            :class="
              loadedMaterialImages[material.title] ? 'opacity-100' : 'opacity-0'
            "
            :src="material.image"
            :alt="material.title"
            :loading="index < 3 ? 'eager' : 'lazy'"
            decoding="async"
            :fetchpriority="index < 3 ? 'high' : 'auto'"
            @load="markMaterialImageLoaded(material.title)"
          />
          <span
            class="pointer-events-none absolute inset-0 bg-[linear-gradient(66deg,rgba(17,24,32,0.80)_0%,rgba(17,24,32,0.40)_50%,rgba(17,24,32,0)_100%)] opacity-[.75]"
          />

          <span class="flex flex-col gap-8 pt-4">
            <!-- <span
              class="relative z-[1] self-start justify-self-start text-[9px] tracking-[.1em]"
            >
              <component
                :is="materialIcon(material.icon)"
                class="h-8 w-8"
                :stroke-width="1.5"
              ></component>
            </span> -->
          </span>

          <span class="flex flex-col gap-0 md:gap-0 lg:gap-1 pb-0 pr-[50px]">
            <span
              class="relative z-[1] self-start font-serif fond-bold text-[24px] md:text-[26px] lg:md:text-[32px] xl:text-[38px] tracking-[.25px]"
              >{{ material.title }}</span
            >
            <span
              class="relative z-[1] self-start font-sans fond-bold text-[16px] md:text-[16px] lg:text-[20px] w-[80%] md:w-full "
              >{{ material.subtitle }}</span
            >
          </span>

          <span
            class="absolute right-8 bottom-4 lg:bottom-8 z-[1] tracking-[.1em] text-[32px]"
            >→</span
          >
          <!-- <span class="absolute right-6 top-[22px] z-[1] text-[22px]">{{ downloaded === material.title ? '✓' : '↓' }}</span> -->
        </button>
      </div>
      <p
        v-if="downloaded"
        class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 bg-ink px-[22px] py-3.5 text-[11px] tracking-[.08em] text-white"
      >
        {{ downloaded }} is ready to download
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { FileText, Image, CirclePlay, Rotate3d, Video, Eye } from "lucide-vue-next";
import type { Project } from "~/data/projects";

const materialIcons = {
  FileText,
  Image,
  CirclePlay,
  Rotate3d,
  Video,
  Eye
} as const;

const materialIcon = (name: string) =>
  materialIcons[name as keyof typeof materialIcons] ?? FileText;

const route = useRoute();
const { data: project } = await useFetch<Project>(
  `/api/projects/${String(route.params.slug)}`,
);

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: "Project not found" });
}

useSeoMeta({
  title: () => `${project.value?.name ?? "Project"} | MERED Broker Kit`,
  description: () => project.value?.description ?? "",
});

const materialCardClass = (index: number) => {
  const count = project.value?.materials.length ?? 0;

  if (count === 7) {
    return index < 4 ? "md:col-span-3" : "md:col-span-4";
  }

  if (count === 6) {
    return "md:col-span-4";
  }

  if (count === 5) {
    return index < 3 ? "md:col-span-4" : "md:col-span-6";
  }

  if (count === 4) {
    return "md:col-span-6";
  }

  if (count === 3) {
    return "md:col-span-4";
  }

  if (count === 2) {
    return "md:col-span-6";
  }

  return "md:col-span-12";
};

const downloaded = ref<string | null>(null);
const materialCards = ref<HTMLElement[]>([]);
const materialImages = ref<HTMLImageElement[]>([]);
const loadedMaterialImages = ref<Record<string, boolean>>({});

useHead({
  link: project.value.materials.slice(0, 3).map((material) => ({
    rel: "preload",
    as: "image",
    href: material.image,
    fetchpriority: "high",
  })),
});

const setMaterialCard = (element: Element | null) => {
  if (element instanceof HTMLElement) {
    materialCards.value.push(element);
  }
};

const setMaterialImage = (element: Element | null, index: number) => {
  if (element instanceof HTMLImageElement) {
    materialImages.value[index] = element;
  }
};

const markMaterialImageLoaded = (title: string) => {
  loadedMaterialImages.value[title] = true;
};

onBeforeUpdate(() => {
  materialCards.value = [];
  materialImages.value = [];
});

onMounted(async () => {
  await nextTick();

  materialImages.value.forEach((image, index) => {
    if (image.complete && image.naturalWidth > 0) {
      markMaterialImageLoaded(project.value.materials[index].title);
    }
  });

  gsap.set(materialCards.value, {
    autoAlpha: 0,
    y: 40,
  });

  gsap.to(materialCards.value, {
    autoAlpha: 1,
    y: 0,
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.12,
  });
});

const download = (title: string) => {
  downloaded.value = title;
  window.setTimeout(() => {
    downloaded.value = null;
  }, 1800);
};


const openLink = (url: string) => {
  if (url) {
    window.open(url, "_self")
  }
}
</script>
