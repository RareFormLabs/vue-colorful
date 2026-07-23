<script setup lang="ts">
import { computed, ref } from "vue";
import {
  HexAlphaColorPicker,
  HexColorInput,
  HexColorPicker,
  HslaStringColorPicker,
  RgbaStringColorPicker,
} from "../src";

const hex = ref("#7f5af0");
const alphaHex = ref("#7f5af0cc");
const rgba = ref("rgba(255, 125, 90, 0.65)");
const hsla = ref("hsla(184, 77%, 45%, 0.7)");

const swatches = computed(() => [
  { label: "Base", value: hex.value },
  { label: "Tint", value: "#f1eefc" },
  { label: "Accent", value: rgba.value },
  { label: "Mist", value: hsla.value },
]);
</script>

<template>
  <main class="page">
    <section class="hero">
      <p class="eyebrow">Vue 3 port of react-colorful</p>
      <h1>vue-colorful</h1>
      <p class="lede">
        Tiny, keyboard-friendly color pickers for Vue apps, now living comfortably in the
        RareFormLabs universe.
      </p>
      <div class="hero-actions">
        <a href="https://github.com/RareFormLabs/react-colorful" target="_blank" rel="noreferrer">
          View source
        </a>
        <a href="https://github.com/omgovich/react-colorful" target="_blank" rel="noreferrer">
          Upstream fork
        </a>
      </div>
    </section>

    <section class="grid">
      <article class="card spotlight">
        <header>
          <span>Hex picker</span>
          <strong>{{ hex }}</strong>
        </header>
        <HexColorPicker v-model:color="hex" />
        <HexColorInput v-model:color="hex" prefixed class="input" />
      </article>

      <article class="card">
        <header>
          <span>Alpha hex</span>
          <strong>{{ alphaHex }}</strong>
        </header>
        <HexAlphaColorPicker v-model:color="alphaHex" />
        <HexColorInput v-model:color="alphaHex" prefixed alpha class="input" />
      </article>

      <article class="card">
        <header>
          <span>RGBA string</span>
          <strong>{{ rgba }}</strong>
        </header>
        <RgbaStringColorPicker v-model:color="rgba" />
      </article>

      <article class="card">
        <header>
          <span>HSLA string</span>
          <strong>{{ hsla }}</strong>
        </header>
        <HslaStringColorPicker v-model:color="hsla" />
      </article>
    </section>

    <section class="palette">
      <div v-for="swatch in swatches" :key="swatch.label" class="swatch">
        <div class="chip" :style="{ background: swatch.value }"></div>
        <div>
          <span>{{ swatch.label }}</span>
          <strong>{{ swatch.value }}</strong>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family: "IBM Plex Sans", "Avenir Next", sans-serif;
  background:
    radial-gradient(circle at top left, rgba(127, 90, 240, 0.18), transparent 35%),
    radial-gradient(circle at top right, rgba(22, 163, 74, 0.14), transparent 28%),
    linear-gradient(180deg, #fffaf2 0%, #fff 45%, #f5f7fb 100%);
  color: #18212f;
}

:global(*) {
  box-sizing: border-box;
}

.page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 48px 20px 64px;
}

.hero {
  margin-bottom: 32px;
}

.eyebrow {
  margin: 0 0 8px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.78rem;
  color: #6d5c9a;
}

h1 {
  margin: 0;
  font-size: clamp(3rem, 8vw, 5.5rem);
  line-height: 0.95;
  letter-spacing: -0.05em;
}

.lede {
  max-width: 680px;
  font-size: 1.08rem;
  line-height: 1.6;
  color: #475569;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.hero-actions a {
  text-decoration: none;
  color: #18212f;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(24, 33, 47, 0.08);
  border-radius: 999px;
  padding: 10px 14px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
}

.card {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(24, 33, 47, 0.08);
  border-radius: 24px;
  padding: 18px;
  box-shadow: 0 22px 48px rgba(24, 33, 47, 0.08);
}

.spotlight {
  transform: rotate(-1deg);
}

.card header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: baseline;
  margin-bottom: 16px;
  font-size: 0.92rem;
}

.card strong {
  display: block;
  max-width: 150px;
  text-align: right;
  font-size: 0.82rem;
  color: #475569;
}

.input {
  margin-top: 14px;
  width: 100%;
  border: 1px solid rgba(24, 33, 47, 0.14);
  border-radius: 14px;
  padding: 12px 14px;
  font: inherit;
}

.palette {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  margin-top: 24px;
}

.swatch {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid rgba(24, 33, 47, 0.08);
  border-radius: 18px;
  padding: 14px;
}

.chip {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  box-shadow: inset 0 0 0 1px rgba(24, 33, 47, 0.08);
}

.swatch span,
.swatch strong {
  display: block;
}

.swatch span {
  font-size: 0.8rem;
  color: #64748b;
}

.swatch strong {
  font-size: 0.92rem;
}

@media (max-width: 720px) {
  .page {
    padding-top: 32px;
  }

  .card strong {
    max-width: 120px;
  }
}
</style>
