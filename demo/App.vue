<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { RgbaColorPicker, type RgbaColor } from "../src";

const swatches: RgbaColor[] = [
  { r: 209, g: 97, b: 28, a: 1 },
  { r: 34, g: 91, b: 161, a: 1 },
  { r: 225, g: 17, b: 135, a: 0.7625 },
  { r: 21, g: 139, b: 59, a: 1 },
  { r: 189, g: 60, b: 60, a: 1 },
];

const color = ref<RgbaColor>(swatches[Math.floor(Math.random() * swatches.length)]);
const stars = ref(0);

const textColor = computed(() => {
  const brightness = (color.value.r * 299 + color.value.g * 587 + color.value.b * 114) / 1000;
  return brightness > 128 || color.value.a < 0.5 ? "#000" : "#fff";
});

const colorString = computed(
  () => `rgba(${color.value.r}, ${color.value.g}, ${color.value.b}, ${color.value.a})`
);

watch(
  colorString,
  (value) => {
    document.body.style.backgroundColor = value;
  },
  { immediate: true }
);

onMounted(async () => {
  try {
    const response = await fetch("https://api.github.com/repos/RareFormLabs/vue-colorful");
    const data = await response.json();
    if (typeof data?.stargazers_count === "number") {
      stars.value = data.stargazers_count;
    }
  } catch {
    // Keep the fallback count if the API is unavailable.
  }
});
</script>

<template>
  <div>
    <header class="header" :style="{ color: textColor }">
      <div class="header-demo">
        <RgbaColorPicker v-model:color="color" class="header-demo-picker" />
      </div>
      <div class="header-content">
        <h1 class="header-title">Vue Colorful 🎨</h1>
        <h2 class="header-description">A tiny color picker component for Vue 3 apps</h2>

        <nav class="links">
          <a
            class="link"
            href="https://github.com/RareFormLabs/vue-colorful"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
            <span class="link-separator"></span>
            <svg class="star-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12.9 2.6l2.3 5c.1.3.4.5.7.6l5.2.8c.9 0 1.2 1 .6 1.6l-3.8 3.9c-.2.2-.3.6-.3.9l.9 5.4c.1.8-.7 1.5-1.4 1.1l-4.7-2.6c-.3-.2-.6-.2-.9 0l-4.7 2.6c-.7.4-1.6-.2-1.4-1.1l.9-5.4c.1-.3-.1-.7-.3-.9l-3.8-3.9C1.7 10 2 9 2.8 8.9L8 8.1c.3 0 .6-.3.7-.6l2.3-5c.5-.7 1.5-.7 1.9.1z"
              />
            </svg>
            {{ stars }}
          </a>
          <a
            class="link"
            href="https://www.npmjs.com/package/@rareformlabs/vue-colorful"
            target="_blank"
            rel="noreferrer"
          >
            NPM
          </a>
        </nav>
      </div>
    </header>
  </div>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: none;
  font: inherit;
  outline: none;
}

:global(body) {
  color: #222;
  background-color: #fff;
  font: normal 20px/1.4 "Recursive", Arial, Helvetica, sans-serif;
}

.header {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  min-height: 100vh;
  padding: 120px 32px;
  transition: color 0.15s;
}

.header-demo {
  position: relative;
  width: 200px;
  flex-shrink: 0;
}

.header-demo-picker {
  width: 100%;
  border-radius: 9px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.header-content {
  flex-grow: 1;
  margin-left: 40px;
}

.header-title {
  margin-bottom: 16px;
  font-size: 44px;
  line-height: 1;
}

.header-description {
  max-width: 16em;
}

.links {
  display: flex;
  margin-top: 32px;
}

.link {
  display: flex;
  align-items: center;
  height: 44px;
  margin-right: 16px;
  color: inherit;
  text-decoration: none;
  border: 2px solid currentColor;
  border-radius: 6px;
  padding: 0 16px;
  opacity: 0.8;
}

.link:last-child {
  margin-right: 0;
}

.link:hover {
  opacity: 1;
}

.star-icon {
  margin-right: 4px;
}

.link-separator {
  width: 2px;
  height: 100%;
  margin: 0 12px;
  background: currentColor;
}

@media (max-width: 767px) {
  .header {
    max-width: 360px;
    padding: 40px 20px;
    flex-direction: column;
  }

  .header-content {
    text-align: center;
    margin-top: 40px;
    margin-left: 0;
  }

  .header-title {
    font-size: 32px;
  }

  .header-description {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
