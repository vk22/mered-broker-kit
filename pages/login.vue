<template>
  <main class="min-h-[calc(100dvh-100px)] bg-transparent px-5 py-12 text-[#171816] md:min-h-[calc(100dvh-125px)]">
    <section class="mx-auto flex min-h-[520px] max-w-sm flex-col justify-center">
      <div class="border border-black/15 bg-white p-6 md:p-8">
        <h1 class="mb-8 font-serif text-2xl leading-none">Sign in</h1>

        <form class="flex flex-col gap-4" @submit.prevent="login">
          <label class="grid gap-1 text-sm">
            <span class="text-xs uppercase tracking-[.12em] text-black/50">
              Username
            </span>
            <input
              v-model="username"
              autocomplete="username"
              class="h-11 border border-black/15 px-3"
              name="username"
              type="text"
            >
          </label>

          <label class="grid gap-1 text-sm">
            <span class="text-xs uppercase tracking-[.12em] text-black/50">
              Password
            </span>
            <input
              v-model="password"
              autocomplete="current-password"
              class="h-11 border border-black/15 px-3"
              name="password"
              type="password"
            >
          </label>

          <p v-if="error" class="border border-red-900/25 bg-red-50 px-3 py-2 text-sm text-red-900">
            {{ error }}
          </p>

          <button
            class="mt-2 h-11 bg-[#282828] px-4 text-sm uppercase tracking-[.12em] text-white disabled:opacity-50"
            :disabled="pending"
            type="submit"
          >
            {{ pending ? "Signing in" : "Sign in" }}
          </button>
        </form>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const route = useRoute();

const username = ref("admin");
const password = ref("");
const pending = ref(false);
const error = ref("");

const nextPath = computed(() => {
  const next = route.query.next;

  return typeof next === "string" && next.startsWith("/") ? next : "/admin";
});

const login = async () => {
  pending.value = true;
  error.value = "";

  try {
    await $fetch("/api/admin/login", {
      method: "POST",
      body: {
        username: username.value,
        password: password.value,
      },
    });
    await navigateTo(nextPath.value);
  } catch {
    error.value = "Invalid username or password";
  } finally {
    pending.value = false;
  }
};
</script>
