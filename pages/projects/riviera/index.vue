<template>
  <main>
    <section
      class="relative isolate min-h-[600px] h-[calc(100svh-100px)] overflow-hidden bg-[#252828] text-white md:h-[calc(100svh-145px)] md:min-h-[480px]"
      aria-label="Choose Riviera Residences phase"
    >
      <img
        ref="backgroundImage"
        :src="background"
        alt="Riviera Residences waterfront"
        class="riviera-background absolute inset-0 -z-20 h-full w-full object-cover object-bottom"
        :class="{ 'is-ready': imageReady }"
        @load="revealImage"
        decoding="async"
        fetchpriority="high"
      />
      <div class="absolute inset-0 -z-10 bg-black/20 sm:bg-black/10" />
      <div
        class="riviera-content grid h-full grid-cols-1 grid-rows-2 content-center md:grid-cols-2 md:grid-rows-1"
        :class="{ 'is-ready': fontsReady }"
      >
        <NuxtLink
          v-for="phase in [1, 2]"
          :key="phase"
          :to="`/projects/riviera/phase${phase}`"
          class="bg-transparent group flex flex-col gap-4 md:gap-12 items-center md:items-start justify-center md:justify-center px-5 py-10 transition-all duration-300 hover:bg-black/10 focus-visible:bg-black/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-white md:items-center"
          :class="
            phase === 2 ? 'items-center border-t border-white/20 sm:border-none' : ''
          "
        >
          <div class="flex flex-col items-center md:items-center justify-end md:justify-center">
            <span
              class="title-sans-serif-l px-6 py-2 text-center text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-6xl tracking-[.1rem] transition-colors md:px-6 uppercase"
            >
              Riviera Residences
            </span>
            <span
              class="title-sans-serif-r px-6 py-2 text-center text-base tracking-[.1rem] transition-colors md:px-6 md:text-lg uppercase"
            >
              Phase {{ phase }}
            </span>
          </div>

          <button
            class="bg-[#faf3e9] border border-white/30 hover:border-white/70 text-[#434848] text-[.7rem] md:text-[.85rem] tracking-[.1rem] h-12 md:h-12 px-8 md:px-12 rounded-0 uppercase transition duration-300"
            type="button"
          >
            Phase {{ phase }} Assets
          </button>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import chiswickLight from "~/assets/fonts/ChiswickSans-Light-Web.woff2?url";
import chiswickRegular from "~/assets/fonts/ChiswickGrotesque-Regular-Web.woff2?url";
import commonsRegular from "~/assets/fonts/TTCommonsPro-Rg.woff2?url";
import type { Project } from "~/data/projects";

const { data: project } = await useFetch<Project>("/api/projects/riviera");
if (!project.value)
  throw createError({ statusCode: 404, statusMessage: "Project not found" });

const background = computed(
  () => project.value!.phaseSelectionImage || "/images/riviera/main.jpg",
);
const backgroundImage = ref<HTMLImageElement | null>(null);
const imageReady = ref(false);
const fontsReady = ref(false);
let disposed = false;

const revealImage = async () => {
  const image = backgroundImage.value;
  if (!image?.naturalWidth) return;
  try {
    await image.decode();
  } catch {
    // A loaded image can still be displayed if decoding is unsupported.
  }
  if (!disposed) imageReady.value = true;
};

usePageSeo({
  title: "Riviera Residences | MERED Broker Kit",
  description:
    "Choose Riviera Residences Phase 1 or Phase 2 to access sales and marketing materials.",
  image: background,
  imageAlt: "Riviera Residences",
  path: "/projects/riviera",
});

useHead({
  link: [
    { rel: "preload", as: "image", href: background, fetchpriority: "high" },
    ...[chiswickLight, chiswickRegular, commonsRegular].map((href) => ({
      rel: "preload",
      as: "font",
      type: "font/woff2",
      crossorigin: "anonymous" as const,
      href,
    })),
  ],
  noscript: [{ innerHTML: "<style>.riviera-background,.riviera-content{opacity:1!important}</style>" }],
});

onMounted(async () => {
  // The load event may have fired before hydration when the image is cached.
  if (backgroundImage.value?.complete) void revealImage();

  if (document.fonts) {
    await Promise.allSettled([
      document.fonts.load('300 48px "Chiswick Light"'),
      document.fonts.load('400 18px "Chiswick Regular"'),
      document.fonts.load('400 14px "TT Commons Pro"'),
    ]);
  }
  if (!disposed) fontsReady.value = true;
});

onBeforeUnmount(() => {
  disposed = true;
});
</script>

<style scoped>
.riviera-background,
.riviera-content {
  opacity: 0;
  transition: opacity 700ms ease;
}

.riviera-content {
  transition-duration: 450ms;
}

.is-ready {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .riviera-background,
  .riviera-content {
    transition: none;
  }
}
</style>
