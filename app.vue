<template>
  <div>
    <header
      class="relative inset-x-0 top-0 z-20 flex h-[100px] flex-row gap-3 items-center justify-between bg-[#252828] px-5 md:h-[145px] md:px-[2vw]"
    >
      <div class="w-[33%]">
        <NuxtLink
          v-if="headerProject"
          class="relative z-[2] text-[12px] uppercase tracking-[.14em] text-white flex items-center gap-2"
          to="/"
          ><span class="text-[18px] pr-2 h-8">←</span>
          <span class="hidden md:block">All projects</span></NuxtLink
        >
      </div>

      <div class="flex flex-col gap-1 justify-center items-center pt-2">
        <NuxtLink class="" to="/">
          <div class="h-24 flex align-bottom">
            <img
              ref="headerLogoElement"
              :src="displayedHeaderLogo"
              :alt="displayedHeaderLogoAlt"
              class="w-[200px] shadow-sm"
            />
          </div>
          <!-- <p class="text-white/50 text-sm tracking-wider" v-if="!headerProject">Brokers Kit</p> -->
        </NuxtLink>
        
      </div>

      <div class="w-[33%] flex justify-end h-full flex p-0 items-center">
        <button
          v-if="!isNotFront"
          class="hidden md:block h-12 bg-transparent border border-white/30 hover:border-white/70 text-[#fff] text-[.75rem] md:text-[.85rem] tracking-[.1rem] bg-[#fff] px-4 rounded-0 uppercase transition duration-300"
          type="button"
          @click="openLink(meredBrokerLink)"
        >
          Register Your Agency
        </button>

        <button
          v-if="!isNotFront"
          class="block md:hidden h-10 bg-transparent text-[#fff] text-[.75rem] md:text-[.85rem] tracking-[.1rem] bg-[#fff] px-4 rounded-0 uppercase"
          type="button"
          @click="openLink(meredBrokerLink)"
        >
          <Send class="w-6 h-6"></Send>
        </button>

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

      <div
        class="flex justify-center pt-[5px] text-[9px] uppercase tracking-[.16em] md:col-span-2"
      >
        <span
          >© {{ new Date().getFullYear() }} Mered Residences Real Estate
          LLC</span
        >
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { gsap } from "gsap";
import meredLogo from "~/assets/img/mered-logo.svg";
import { useRoute } from "vue-router";
import { Send } from "lucide-vue-next";

const menuOpen = ref(false);
const route = useRoute();
const headerLogoElement = ref<HTMLImageElement | null>(null);
const meredBrokerLink = 'https://mered.ae/broker'

const headerProject = computed(() => {
  const slug = route.params.slug;

  if (!route.path.startsWith("/projects/") || typeof slug !== "string") {
    return null;
  }

  return useProject(slug) ?? null;
});

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

watch(headerLogo, async (nextLogo, previousLogo) => {
  if (nextLogo === previousLogo) {
    return;
  }

  const logoElement = headerLogoElement.value;

  if (!logoElement) {
    displayedHeaderLogo.value = nextLogo;
    displayedHeaderLogoAlt.value = headerLogoAlt.value;
    return;
  }

  await gsap.to(logoElement, {
    autoAlpha: 0,
    y: -10,
    duration: 0.28,
    ease: "power2.in",
  });

  displayedHeaderLogo.value = nextLogo;
  displayedHeaderLogoAlt.value = headerLogoAlt.value;

  await nextTick();

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
