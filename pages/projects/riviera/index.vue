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
      <div class="absolute inset-0 -z-10 bg-black/20 sm:bg-transparent" />
      <!-- <div
        class="pointer-events-none absolute inset-0 z-10 flex items-start justify-center"
      >
        <img
          :ref="setProjectCard"
          :src="project.logo"
          alt="Riviera Residences"
          class="mt-[25vh] w-[60vw] max-w-[420px] drop-shadow-lg md:w-[28vw]"
        />
      </div> -->
      <div
        class="grid h-full grid-cols-1 grid-rows-2 content-center md:grid-cols-2 md:grid-rows-1"
      >
        <NuxtLink
          v-for="phase in [1, 2]"
          :key="phase"
          :to="`/projects/riviera/phase${phase}`"
          class="bg-transparent group flex flex-col items-center md:items-start justify-end md:justify-center px-5 py-10 transition-all duration-300 hover:bg-black/10 focus-visible:bg-black/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-white md:items-center"
          :class="phase === 2 ? 'items-center !justify-start md:!justify-center' : ''"
        >
          <span
            class="title-sans-serif-l px-6 py-2 text-center text-3xl tracking-[.1rem] transition-colors md:px-6 sm:text-5xl md:text-7xl uppercase"
          >
            Riviera Residences
          </span>
          <span
            class="title-sans-serif-r px-6 py-2 text-center text-base tracking-[.1rem] transition-colors md:px-6 md:text-lg uppercase"
          >
            Phase {{ phase }}
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
  () => project.value!.phaseSelectionImage || "/images/riviera/main.jpg",
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
