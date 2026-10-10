<template>
  <main>
    <section class="relative isolate min-h-[600px] h-[calc(100svh-100px)] overflow-hidden bg-[#252828] text-white md:h-[calc(100svh-145px)] md:min-h-[480px]" aria-label="Choose Riviera Residences phase">
      <img :src="background" alt="Riviera Residences waterfront" class="absolute inset-0 -z-20 h-full w-full object-cover" fetchpriority="high" />
      <div class="absolute inset-0 -z-10 bg-black/35" />
      <div class="pointer-events-none absolute inset-0 z-10 flex items-start justify-center">
        <img :src="project.logo" alt="Riviera Residences" class="mt-[25vh] w-[60vw] max-w-[420px] drop-shadow-lg md:w-[28vw]" />
      </div>
      <div class="grid h-full grid-rows-2 md:grid-cols-2 md:grid-rows-1">
        <NuxtLink v-for="phase in [1, 2]" :key="phase" :to="`/projects/riviera/phase${phase}`"
          class="group flex items-start justify-center px-5 pt-16 transition-colors duration-300 hover:bg-black/15 focus-visible:bg-black/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-white md:items-end md:pb-[12vh] md:pt-0"
          :class="phase === 2 ? 'items-end pb-16 md:pb-[12vh]' : ''">
          <span class="border border-white/80 bg-black/25 px-6 py-5 text-center text-base tracking-[.04em] backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-[#252828] md:px-8 md:text-xl">
            Riviera Residences Phase {{ phase }} <span class="ml-3" aria-hidden="true">→</span>
          </span>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { Project } from '~/data/projects';
const { data: project } = await useFetch<Project>('/api/projects/riviera');
if (!project.value) throw createError({ statusCode: 404, statusMessage: 'Project not found' });
const background = computed(() => project.value!.phaseSelectionImage || project.value!.image);
usePageSeo({
  title: 'Riviera Residences | MERED Broker Kit',
  description: 'Choose Riviera Residences Phase 1 or Phase 2 to access sales and marketing materials.',
  image: background,
  imageAlt: 'Riviera Residences',
  path: '/projects/riviera',
});
useHead({ link: [{ rel: 'preload', as: 'image', href: background }] });
</script>
