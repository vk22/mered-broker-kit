<script setup lang="ts">
import { gsap } from 'gsap'

const route = useRoute()
const project = useProject(String(route.params.slug))

if (!project) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

useSeoMeta({
  title: `${project.name} | MERED Broker Kit`,
  description: project.description
})

const downloaded = ref<string | null>(null)
const materialCards = ref<HTMLElement[]>([])

const setMaterialCard = (element: Element | null) => {
  if (element instanceof HTMLElement) {
    materialCards.value.push(element)
  }
}

onBeforeUpdate(() => {
  materialCards.value = []
})

onMounted(async () => {
  await nextTick()

  gsap.set(materialCards.value, {
    autoAlpha: 0,
    y: 40
  })

  gsap.to(materialCards.value, {
    autoAlpha: 1,
    y: 0,
    duration: 1.2,
    ease: 'power3.out',
    stagger: 0.12
  })
})

const download = (title: string) => {
  downloaded.value = title
  window.setTimeout(() => {
    downloaded.value = null
  }, 1800)
}
</script>

<template>
  <main>
    <section class="absolute z-[999px] top-0 h-[25svh] min-h-[320px] overflow-hidden text-white md:min-h-[300px]">
      <!-- <img class="h-full w-full object-cover object-center" :src="project.image" :alt="project.name">
      <div class="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,14,19,.73),rgba(8,14,19,.08)_72%),linear-gradient(0deg,rgba(8,14,19,.45),transparent_55%)]" /> -->
      <NuxtLink class="absolute left-5 top-[100px] z-[2] text-[10px] uppercase tracking-[.14em] md:left-[4vw] md:top-[125px]" to="/">← All projects</NuxtLink>
      <!-- <div class="absolute bottom-[7vh] left-5 right-5 md:left-[7vw] md:right-[7vw]">
        <p class="mb-[22px] text-[10px] uppercase tracking-[.2em] text-white/70">{{ project.eyebrow }}</p>
        <h1 class="mb-[50px] font-serif text-[1vw] font-medium leading-[.96] tracking-[-.04em] ">{{ project.name }}</h1>
        <div class="grid grid-cols-2 gap-5 border-t border-white/45 pt-[22px] md:grid-cols-3 md:gap-0">
          <p class="text-[13px]"><span class="mb-2 block text-[9px] uppercase tracking-[.16em] text-white/60">Location</span>{{ project.location }}</p>
          <p class="text-[13px]"><span class="mb-2 block text-[9px] uppercase tracking-[.16em] text-white/60">Status</span>{{ project.status }}</p>
          <p class="text-[13px]"><span class="mb-2 block text-[9px] uppercase tracking-[.16em] text-white/60">Completion</span>{{ project.completion }}</p>
        </div>
      </div> -->
    </section>

    <!-- <section class="block px-5 py-[85px] md:grid md:grid-cols-[1fr_3fr] md:gap-[6vw] md:px-[7vw] md:py-[130px]">
      <p class="mb-[22px] text-[10px] uppercase tracking-[.2em]">Project overview</p>
      <h2 class="max-w-[1050px] font-serif text-[clamp(38px,4.5vw,70px)] font-medium leading-[1.08] tracking-[-.04em]">{{ project.description }}</h2>
    </section> -->

    <section class="h-screen bg-[#252828]">
      <!-- <div class="block border-b border-ink/20 pb-5 md:flex md:items-end md:justify-between">
        <div>
          <p class="mb-[22px] text-[10px] uppercase tracking-[.2em]">Downloads</p>
          <h2 class="font-serif text-[clamp(42px,5vw,72px)] font-medium leading-[.96] tracking-[-.04em]">Marketing materials</h2>
        </div>
        <p class="text-[11px] uppercase tracking-[.1em]">Last updated June 2026</p>
      </div> -->

      <div class="grid grid-cols-1 md:grid-cols-3 h-screen">
        <button
          v-for="(material, index) in project.materials"
          :key="material.title"
          :ref="setMaterialCard"
          class="group relative grid h-[230px] cursor-pointer overflow-hidden p-6 text-left text-white md:h-full"
          type="button"
          @click="download(material.title)"
        >
          <img
            class="absolute inset-0 h-full w-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.025]"
            :src="material.image"
            :alt="material.title"
          >
          <span class="pointer-events-none absolute inset-0 bg-[linear-gradient(#fff0,#01193b)] opacity-[.42]" />
          <!-- <span class="relative z-[1] text-[9px] tracking-[.1em] opacity-55">0{{ index + 1 }}</span> -->
          <!-- <span class="relative z-[1] self-center justify-self-start border border-current px-2 py-2.5 text-[9px] tracking-[.1em]">{{ material.type }}</span> -->
          <span class="relative z-[1] self-end font-sans fond-bold text-[32px]">{{ material.title }}</span>
          <span class="absolute bottom-6 right-6 z-[1] tracking-[.1em] text-[32px]">→</span>
          <!-- <span class="absolute right-6 top-[22px] z-[1] text-[22px]">{{ downloaded === material.title ? '✓' : '↓' }}</span> -->
        </button>
      </div>
      <p v-if="downloaded" class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 bg-ink px-[22px] py-3.5 text-[11px] tracking-[.08em] text-white">{{ downloaded }} is ready to download</p>
    </section>
  </main>
</template>
