<template>
  <ProjectCatalog :key="slug" :slug="slug" />
</template>

<script setup lang="ts">
const route = useRoute();
const slug = computed(() => String(route.params.slug));
if (slug.value === "riviera-phase2") {
  await navigateTo("/projects/riviera/phase2", { redirectCode: 301 });
}
</script>
