<script setup lang="ts">
import { gsap } from 'gsap'

const projects = useProjects();

const projectCards = ref<HTMLElement[]>([])

const setProjectCard = (element: Element | null) => {
  if (element instanceof HTMLElement) {
    projectCards.value.push(element)
  }
}

onBeforeUpdate(() => {
  projectCards.value = []
})

onMounted(async () => {
  await nextTick()

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

<template>
  <main>
    <section
      id="projects"
      class="flex w-full h-screen relative bg-[#252828]"
    >
      <div class="flex flex-col basis-full md:flex-row w-full h-screen">
        <NuxtLink
          v-for="(project, index) in projects"
          :key="project.slug"
          class="group block flex-1"
          :to="`/projects/${project.slug}`"
        >
          <div
            :ref="setProjectCard"
            class="relative flex h-full w-full items-center justify-center overflow-hidden"
          >
            <div class="relative z-[999] text-white flex flex-col h-full items-center justify-center text-center">
              <img :src="`${project.logo}`"alt="" class="w-[40vw] md:w-[20vw]">
              <div class="absolute bottom-0 w-[100vw] flex justify-center flex p-10 md:p-16">
                <p class="text-md md:text-xl text-center leading-[1.2rem] md:leading-[1.65rem]  px-[1vw] md:px-[35vw]">{{ project.description }}</p>
              </div>
              
            </div>
            <img
              class="absolute top-0 left-0 h-full w-full object-cover opacity-60 transition-transform duration-[800ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.025]"
              :src="project.image"
              :alt="project.name"
            />
          </div>

        </NuxtLink>
      </div>
    </section>

    <section
      class="relative bg-[#252828] px-5 py-[85px] text-white md:px-[7vw] md:pt-[100px] flex flex-col items-center"
    >
      <p class="mb-[22px] text-[10px] uppercase tracking-[.2em] text-white/70 text-center">
        Broker support
      </p>
      <h2
        class="mb-[90px] font-serif text-6xl font-medium leading-[.96] tracking-[-.04em] text-center"
      >
        Need something<br />specific?
      </h2>
      <a
        class="flex w-[310px] justify-between border-b border-white/50 pb-[17px] text-xs uppercase tracking-[.13em]"
        href="mailto:sales@mered.ae"
        >Talk to our team <span>↗</span></a
      >
    </section>
  </main>
</template>
