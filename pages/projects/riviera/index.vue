<template>
  <main>
    <section
      class="relative isolate min-h-[600px] h-[calc(100svh-100px)] overflow-hidden bg-[#252828] text-white md:h-[calc(100svh-145px)] md:min-h-[480px]"
      aria-label="Choose Riviera Residences phase"
    >
      <img
        :ref="setProjectCard"
        :src="background"
        alt="Riviera Residences waterfront"
        class="absolute inset-0 -z-20 h-full w-full object-cover"
        fetchpriority="high"
      />
      <div class="absolute inset-0 -z-10 bg-black/35" />
      <div
        class="pointer-events-none absolute inset-0 z-10 flex items-start justify-center"
      >
        <img
          :ref="setProjectCard"
          :src="project.logo"
          alt="Riviera Residences"
          class="mt-[25vh] w-[60vw] max-w-[420px] drop-shadow-lg md:w-[28vw]"
        />
      </div>
      <div
        class="grid h-full grid-cols-1 content-end md:grid-cols-2 md:grid-rows-1"
      >
        <NuxtLink
          v-for="phase in [1, 2]"
          :key="phase"
          :to="`/projects/riviera/phase${phase}`"
          class="bg-black/10 group flex items-start justify-center px-5 pt-6 transition-all duration-300 hover:bg-black/25 focus-visible:bg-black/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-white md:items-end md:pb-[12vh] md:pt-0"
          :class="phase === 2 ? 'items-end pb-20 md:pb-[12vh]' : ''"
        >
          <span
            class="border border-white/40 bg-black/25 px-6 py-4 text-center text-base tracking-[.1rem] backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-[#252828] md:px-6 md:text-lg uppercase"
          >
            Riviera Residences Phase {{ phase }}
            <span class="ml-3" aria-hidden="true">→</span>
          </span>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import type { Project } from "~/data/projects";

const { data: project } = await useFetch<Project>("/api/projects/riviera");
if (!project.value) throw createError({ statusCode: 404, statusMessage: "Project not found" });

const background = computed(
  () => project.value!.phaseSelectionImage || project.value!.image,
);
const projectCards = ref<HTMLElement[]>([])

const setProjectCard = (element: Element | null) => {
  if (element instanceof HTMLElement) {
    projectCards.value.push(element)
  }
}


usePageSeo({
  title: "Riviera Residences | MERED Broker Kit",
  description:
    "Choose Riviera Residences Phase 1 or Phase 2 to access sales and marketing materials.",
  image: background,
  imageAlt: "Riviera Residences",
  path: "/projects/riviera",
});

useHead({ link: [{ rel: "preload", as: "image", href: background }] });

onMounted(async () => {
  await nextTick()

  console.log('projectCards ', projectCards)

  gsap.set(projectCards.value, {
    autoAlpha: 0,
    y: 20
  })

  gsap.to(projectCards.value, {
    autoAlpha: 1,
    y: 0,
    duration: 1.25,
    ease: 'power3.out',
    stagger: 0.15
  })
})
</script>
