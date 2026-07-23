# vue-colorful

Vue 3 port of [`react-colorful`](https://github.com/omgovich/react-colorful), maintained by RareFormLabs.

It keeps the original library's strengths:

- tiny, dependency-free pickers
- keyboard and touch support
- multiple color models
- Shadow DOM-aware style injection
- CSP nonce support via `setNonce()`

## Demo

- GitHub Pages: <https://rareformlabs.github.io/vue-colorful/>
- Upstream project: <https://github.com/omgovich/react-colorful>

## Install

```bash
npm install @rareformlabs/vue-colorful
```

## Basic usage

```vue
<script setup lang="ts">
import { ref } from "vue";
import { HexColorPicker } from "@rareformlabs/vue-colorful";

const color = ref("#aabbcc");
</script>

<template>
  <HexColorPicker v-model:color="color" />
</template>
```

Every picker supports:

- `v-model:color` for two-way binding
- `@change` for every intermediate update while dragging or using the keyboard
- `@change-end` for the committed value after mouseup, touchend, or keyup

```vue
<HexColorPicker
  v-model:color="color"
  @change="previewColor"
  @change-end="saveColor"
/>
```

## Included pickers

```ts
import {
  HexColorPicker,
  HexAlphaColorPicker,
  RgbColorPicker,
  RgbaColorPicker,
  RgbStringColorPicker,
  RgbaStringColorPicker,
  HslColorPicker,
  HslaColorPicker,
  HslStringColorPicker,
  HslaStringColorPicker,
  HsvColorPicker,
  HsvaColorPicker,
  HsvStringColorPicker,
  HsvaStringColorPicker,
  HexColorInput,
} from "@rareformlabs/vue-colorful";
```

## Hex input

```vue
<script setup lang="ts">
import { ref } from "vue";
import { HexColorInput, HexColorPicker } from "@rareformlabs/vue-colorful";

const color = ref("#7f5af0");
</script>

<template>
  <HexColorPicker v-model:color="color" />
  <HexColorInput v-model:color="color" prefixed />
</template>
```

`HexColorInput` props:

- `prefixed` adds the leading `#`
- `alpha` enables `#rgba` and `#rrggbbaa`

## CSP

If your app needs a nonce for inline styles, set it before mounting a picker:

```ts
import { setNonce } from "@rareformlabs/vue-colorful";

setNonce("your-csp-nonce");
```

## Development

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm test
```

## Notes

- The repository is named `vue-colorful`, while preserving the original lineage from `react-colorful`.
- The default demo deploys through GitHub Actions to GitHub Pages.
