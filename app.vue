<script setup lang="ts">
import { gsap } from 'gsap'
import meredLogo from '~/assets/img/mered-logo.svg'

const menuOpen = ref(false)
const route = useRoute()
const headerLogoElement = ref<HTMLImageElement | null>(null)

const headerProject = computed(() => {
  const slug = route.params.slug

  if (!route.path.startsWith('/projects/') || typeof slug !== 'string') {
    return null
  }

  return useProject(slug) ?? null
})

const headerLogo = computed(() => headerProject.value?.logo2 ?? meredLogo)
const headerLogoAlt = computed(() => headerProject.value?.name ?? 'MERED')
const displayedHeaderLogo = ref(headerLogo.value)
const displayedHeaderLogoAlt = ref(headerLogoAlt.value)

watch(() => route.fullPath, () => {
  menuOpen.value = false
})

watch(headerLogo, async (nextLogo, previousLogo) => {
  if (nextLogo === previousLogo) {
    return
  }

  const logoElement = headerLogoElement.value

  if (!logoElement) {
    displayedHeaderLogo.value = nextLogo
    displayedHeaderLogoAlt.value = headerLogoAlt.value
    return
  }

  await gsap.to(logoElement, {
    autoAlpha: 0,
    y: -16,
    duration: 0.28,
    ease: 'power2.in'
  })

  displayedHeaderLogo.value = nextLogo
  displayedHeaderLogoAlt.value = headerLogoAlt.value

  await nextTick()

  gsap.fromTo(
    logoElement,
    {
      autoAlpha: 0,
      y: 16
    },
    {
      autoAlpha: 1,
      y: 0,
      duration: 1.75,
      ease: 'power3.out'
    }
  )
})
</script>

<template>
  <div>
    <header class="absolute inset-x-0 top-0 z-20 flex h-[125px] flex-col gap-3 items-center justify-center bg-transparent px-5 md:h-[150px] md:px-[4vw]">
      <NuxtLink class="" to="/">
      <img ref="headerLogoElement" :src="displayedHeaderLogo" :alt="displayedHeaderLogoAlt" class="w-[185px] shadow-sm">
      </NuxtLink>
      <p class="text-white text-sm tracking-wider">Brokers Media Kit</p>
    </header>

    <NuxtPage />

    <footer class="block bg-[#252828] px-5 pb-[35px] pt-[70px] text-white md:grid md:grid-cols-1 md:gap-0 md:p-[7vw] md:pb-[45px] md:pt-[15px]">
      
      <div class="flex leading-none tracking-[.28em] w-full justify-center py-10">
        <img src="assets/img/mered-logo2.svg" alt="" class="w-[135px]">
      </div>

      <div class="flex justify-center pt-[5px] text-[9px] uppercase tracking-[.16em] md:col-span-2">
        <span>© {{ new Date().getFullYear() }} Mered Residences Real Estate LLC</span>
      </div>
    </footer>
  </div>
</template>
