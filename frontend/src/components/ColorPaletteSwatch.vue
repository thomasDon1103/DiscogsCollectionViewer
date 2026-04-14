<script setup lang="ts">
import { computed } from 'vue'

const clipId = computed(() => `swatch-clip-${Math.random().toString(36).slice(2, 9)}`)
</script>

<template>
  <svg class="block w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Clip to a rounded-square shape -->
      <clipPath :id="clipId">
        <rect x="5" y="5" width="190" height="190" rx="28" ry="28" />
      </clipPath>
    </defs>

    <g :clip-path="`url(#${clipId})`">
      <!-- Background colors — large diagonal bands (bottom layer) -->
      <foreignObject x="5" y="5" width="190" height="190">
        <div xmlns="http://www.w3.org/1999/xhtml" class="relative w-full h-full overflow-hidden">
          <!-- Background diagonal stripes container -->
          <div class="absolute"
            style="width: 200%; height: 200%; top: -50%; left: -50%; transform: rotate(-25deg); transform-origin: center center; display: flex;">
            <div class="bg-(--main-bg-start)" style="flex: 1.2;" />
            <div class="bg-(--main-bg-mid)" style="flex: 0.7;" />
            <div class="bg-(--main-bg-end)" style="flex: 1.2;" />
          </div>

          <!-- Primary colors — overlapping circles (top layer) -->
          <div class="bg-(--primary-start) absolute rounded-full opacity-85"
            style="width: 55%; height: 55%; top: 8%; left: 5%;" />
          <div class="bg-(--primary-mid) absolute rounded-full opacity-85"
            style="width: 50%; height: 50%; top: 22%; left: 30%;" />
          <div class="bg-(--primary-end) absolute rounded-full opacity-85"
            style="width: 45%; height: 45%; top: 42%; left: 50%;" />
        </div>
      </foreignObject>

      <!-- Rounded-square border -->
      <rect x="5" y="5" width="190" height="190" rx="28" ry="28" fill="none" stroke="currentColor" stroke-width="1.5"
        opacity="0.15" />
    </g>
  </svg>
</template>