<template>
  <div>
    <header
      class="relative inset-x-0 top-0 z-20 flex h-[100px] md:h-[145px] flex-row gap-3 items-center justify-between bg-[#252828] px-5 md:px-[2vw]"
    >
      <div class="w-[40%] hidden md:block">
        <NuxtLink
          v-if="headerProject"
          class="relative z-[2] text-[12px] uppercase tracking-[.14em] text-white flex items-center gap-2"
          :to="isRivieraPhase ? '/projects/riviera' : '/'"
          ><span class="text-[18px] pr-2 h-8">←</span>
          <span>{{
            isRivieraPhase ? "All phases" : "All projects"
          }}</span></NuxtLink
        >
      </div>

      <div class="flex flex-col gap-1 justify-center items-center pt-2 h-full">
        <NuxtLink
          class="flex flex-col gap-1 justify-center items-center"
          to="/"
        >
          <div class="h-[100%] sm:h-[80%] flex align-bottom">
            <img
              ref="headerLogoElement"
              :src="displayedHeaderLogo"
              :alt="displayedHeaderLogoAlt"
              class="w-[150px] md:w-[220px] shadow-sm"
            />
          </div>
          <div class="absolute w-full -bottom-[12%] md:-bottom-[12%] flex justify-center">
            <transition name="fade">
            <p
              class="title-sans-serif-r text-white/90 text-[12px] md:text-[14px] font-medium tracking-[1.25px] uppercase"
              v-if="isRivieraPhase"
            >
              {{ phaseNumber }}
            </p>
            </transition>
          </div>
        </NuxtLink>
      </div>

      <div class="w-[40%] flex justify-end h-full flex p-0 items-center">
        <button
          v-if="!isNotFront"
          class="bg-transparent border border-white/30 hover:border-white/70 text-[#fff] text-[.7rem] md:text-[.85rem] tracking-[.1rem] h-12 md:h-12 px-2 md:px-4 rounded-0 uppercase transition duration-300"
          type="button"
          @click="openLink(meredBrokerLink)"
        >
          Register Your Agency
        </button>

        <!-- <button
          v-if="!isNotFront"
          class="block md:hidden h-10 bg-transparent text-[#fff] text-[.75rem] md:text-[.85rem] tracking-[.1rem] bg-[#fff] px-4 rounded-0 uppercase"
          type="button"
          @click="openLink(meredBrokerLink)"
        >
          <Send class="w-6 h-6"></Send>
        </button> -->

        <button
          v-if="isAdmin"
          class="h-11 border border-black/20 bg-white px-4 text-[.95rem] tracking-[.1rem] uppercase"
          type="button"
          @click="logout"
        >
          Log out
        </button>
      </div>
    </header>

    <NuxtPage />

    <AgencyRegisterModal
      v-if="agencyModalOpen"
      @close="agencyModalOpen = false"
    />

    <footer
      class="block bg-[#252828] px-5 pb-[35px] pt-[70px] text-white md:grid md:grid-cols-1 md:gap-0 md:p-[7vw] md:pb-[45px] md:pt-[15px]"
    >
      <div
        class="flex leading-none tracking-[.28em] w-full justify-center py-10"
      >
        <img src="assets/img/mered-logo2.svg" alt="" class="w-[135px]" />
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { Project } from "~/data/projects";
import { gsap } from "gsap";
import meredLogo from "~/assets/img/mered-logo.svg";
import { useRoute } from "vue-router";
import { Send } from "lucide-vue-next";

const menuOpen = ref(false);
const route = useRoute();
const headerLogoElement = ref<HTMLImageElement | null>(null);
const meredBrokerLink = "https://mered.ae/broker";

const phase = computed(() => String(route.params.phase));
const phaseNumber = computed(() =>
  phase.value === "phase1" ? "phase 1" : "phase 2",
);

const isRivieraPhase = computed(() =>
  /^\/projects\/riviera\/phase[12]\/?$/.test(route.path),
);
const headerSlug = computed(() =>
  route.path.startsWith("/projects/riviera")
    ? "riviera"
    : typeof route.params.slug === "string"
      ? route.params.slug
      : "",
);
const { data: headerProjects } = await useFetch<Project[]>("/api/projects", {
  default: () => [],
});
const headerProject = computed(
  () =>
    headerProjects.value.find((project) => project.slug === headerSlug.value) ??
    null,
);

const headerLogo = computed(() => headerProject.value?.logo2 ?? meredLogo);
const headerLogoAlt = computed(() => headerProject.value?.name ?? "MERED");
const isAdmin = computed(() => route.path === "/admin");
const isNotFront = computed(
  () => route.path === "/admin" || route.path === "/login",
);
const displayedHeaderLogo = ref(headerLogo.value);
const displayedHeaderLogoAlt = ref(headerLogoAlt.value);
const agencyModalOpen = ref(false);

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
  },
);

watch(headerLogo, async (nextLogo, previousLogo, onCleanup) => {
  if (nextLogo === previousLogo) return;

  const nextLogoAlt = headerLogoAlt.value;
  const logoElement = headerLogoElement.value;

  if (!logoElement) {
    displayedHeaderLogo.value = nextLogo;
    displayedHeaderLogoAlt.value = nextLogoAlt;
    return;
  }

  let cancelled = false;
  onCleanup(() => {
    cancelled = true;
    gsap.killTweensOf(logoElement);
  });

  await gsap.to(logoElement, {
    autoAlpha: 0,
    y: -10,
    duration: 0.28,
    ease: "power2.in",
  });

  if (cancelled) return;

  displayedHeaderLogo.value = nextLogo;
  displayedHeaderLogoAlt.value = nextLogoAlt;

  await nextTick();
  if (cancelled) return;

  gsap.fromTo(
    logoElement,
    {
      autoAlpha: 0,
      y: 8,
    },
    {
      autoAlpha: 1,
      y: 0,
      duration: 1.75,
      ease: "power3.out",
    },
  );
});

const logout = async () => {
  await $fetch("/api/admin/logout", {
    method: "POST",
  });
  await navigateTo("/login");
};

const openAgencyModal = () => {
  agencyModalOpen.value = true;
};

const openLink = (url: string) => {
  if (url) {
    window.open(url, "_blank");
  }
};
</script>
