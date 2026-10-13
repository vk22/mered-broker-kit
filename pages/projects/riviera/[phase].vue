<template>
  <ProjectCatalog :key="phase" :slug="slug" :phase="phaseNumber" :project="project" />
</template>

<script setup lang="ts">
import { useRoute } from 'nuxt/app';
import { ref, computed } from "vue";
definePageMeta({
  validate: route => route.params.phase === 'phase1' || route.params.phase === 'phase2',
});

const route = useRoute();
const project = ref('');
console.log('route.params ', route)
const phase = computed(() => String(route.params.phase));
const phaseNumber = computed(() => phase.value === 'phase1' ? 1 : 2);
const slug = computed(() => phase.value === 'phase1' ? 'riviera' : 'riviera-phase2');

</script>
