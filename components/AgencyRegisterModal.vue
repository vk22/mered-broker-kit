<template>
  <Teleport to="body">
    <div
      ref="overlayElement"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-5 py-12 opacity-0"
      @click.self="close"
    >
      <section
        ref="dialogElement"
        class="w-full max-w-[520px] bg-black/0 p-8 py-12 text-[#171816] opacity-0 md:p-10 md:py-12"
        role="dialog"
        aria-modal="true"
        aria-labelledby="agency-form-title"
      >
        <div
          class="mb-7 flex items-start justify-center gap-6"
          v-if="!formMessage"
        >
          <div class="pb-8">
            <h2
              id="agency-form-title"
              class="font-serif text-5xl md:text-6xl leading-none text-[#ebebeb] font-thin text-center"
            >
              Register your agency
            </h2>
          </div>

          <!-- <button
            class="absolute right-2 top-2 h-10 w-10 shrink-0 text-5xl text-white leading-none font-thin"
            type="button"
            aria-label="Close form"
            @click="close"
          >
            ×
          </button> -->
        </div>

        <form
          class="grid gap-4"
          @submit.prevent="submitForm"
          v-if="!formMessage"
        >
          <label class="grid gap-1 text-sm">
            <span class="text-xs uppercase tracking-[.12em] text-white/70">
              Company
            </span>
            <input
              v-model="form.company"
              class="h-11 border border-black/15 bg-[#ddd] px-3"
              name="company"
              required
              type="text"
            />
          </label>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="grid gap-1 text-sm">
              <span class="text-xs uppercase tracking-[.12em] text-white/70">
                Phone
              </span>
              <input
                v-model="form.tel"
                class="h-11 border border-black/15 bg-[#ddd] px-3"
                name="tel"
                required
                type="tel"
              />
            </label>

            <label class="grid gap-1 text-sm">
              <span class="text-xs uppercase tracking-[.12em] text-white/70">
                Email
              </span>
              <input
                v-model="form.email"
                autocomplete="email"
                class="h-11 border border-black/15 bg-[#ddd] px-3"
                name="email"
                required
                type="email"
              />
            </label>
          </div>

          <label class="grid gap-1 text-sm">
            <span class="text-xs uppercase tracking-[.12em] text-white/70">
              Message
            </span>
            <textarea
              v-model="form.message"
              class="min-h-32 resize-y border border-black/15 bg-[#ddd] px-3 py-2"
              name="message"
            />
          </label>

          <button
            class="mt-2 h-12 bg-transparent border border-white/40 hover:border-white/80 px-4 text-sm uppercase tracking-[.12em] text-white transition duration-300"
            :disabled="pending"
            type="submit"
          >
            {{ pending ? "Submitting" : "Submit" }}
          </button>
        </form>

        <h2
          v-else
          class="font-serif text-5xl md:text-6xl leading-none text-[#ebebeb] font-thin text-center"
        >
          {{ formMessage }}
        </h2>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { gsap } from "gsap";

const emit = defineEmits<{
  close: [];
}>();

const overlayElement = ref<HTMLElement | null>(null);
const dialogElement = ref<HTMLElement | null>(null);
const formMessage = ref("");
const pending = ref(false);
const form = ref({
  company: "",
  tel: "",
  email: "",
  message: "",
});

const close = async () => {
  console.log("close2");
  await gsap
    .timeline()
    .to(dialogElement.value, {
      autoAlpha: 0,
      y: 18,
      scale: 0.98,
      duration: 0.24,
      ease: "power2.in",
    })
    .to(
      overlayElement.value,
      {
        autoAlpha: 0,
        duration: 0.2,
        ease: "power2.in",
      },
      "-=0.12",
    );

  emit("close");
};

const submitForm = async () => {
  pending.value = true;
  formMessage.value = "";

  try {
    await $fetch("/api/agency-leads", {
      method: "POST",
      body: form.value,
    });

    await gsap.timeline().to(dialogElement.value, {
      autoAlpha: 0,
      y: 18,
      scale: 0.98,
      duration: 0.24,
      ease: "power2.in",
    });

    formMessage.value = "Thank you. We will contact you shortly.";
    form.value = {
      company: "",
      tel: "",
      email: "",
      message: "",
    };
    await gsap
      .timeline()
      .to(overlayElement.value, {
        autoAlpha: 1,
        duration: 0.28,
        ease: "power2.out",
      })
      .fromTo(
        dialogElement.value,
        { autoAlpha: 0, y: 28, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" },
        "-=0.12",
      );
    setTimeout(() => {
      console.log("close");
      close();
    }, 3000);
  } catch {
    formMessage.value = "Could not submit the form. Please try again.";
  } finally {
    pending.value = false;
  }
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    close();
  }
};

onMounted(async () => {
  document.body.style.overflow = "hidden";
  window.addEventListener("keydown", handleEscape);

  await nextTick();

  gsap.killTweensOf([overlayElement.value, dialogElement.value]);
  gsap
    .timeline()
    .to(overlayElement.value, {
      autoAlpha: 1,
      duration: 0.28,
      ease: "power2.out",
    })
    .fromTo(
      dialogElement.value,
      { autoAlpha: 0, y: 28, scale: 0.98 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" },
      "-=0.12",
    );
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleEscape);
  document.body.style.overflow = "";
});
</script>
