<template>
  <div class="flex justify-center items-center">
    <svg class="w-full h-auto" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer record disc -->
      <circle cx="200" cy="200" r="190" fill="#1a1a2e" stroke="#555" stroke-width="2" />

      <!-- Grooves - outer region -->
      <circle cx="200" cy="200" r="182" fill="none" stroke="#3d3d50" stroke-width="0.8" />
      <circle cx="200" cy="200" r="176" fill="none" stroke="#333348" stroke-width="0.8" />
      <circle cx="200" cy="200" r="170" fill="none" stroke="#3d3d50" stroke-width="0.8" />
      <circle cx="200" cy="200" r="164" fill="none" stroke="#333348" stroke-width="0.8" />
      <circle cx="200" cy="200" r="158" fill="none" stroke="#3d3d50" stroke-width="0.8" />
      <circle cx="200" cy="200" r="152" fill="none" stroke="#333348" stroke-width="0.8" />
      <circle cx="200" cy="200" r="146" fill="none" stroke="#3d3d50" stroke-width="0.8" />
      <circle cx="200" cy="200" r="140" fill="none" stroke="#333348" stroke-width="0.8" />
      <circle cx="200" cy="200" r="134" fill="none" stroke="#3d3d50" stroke-width="0.8" />
      <circle cx="200" cy="200" r="128" fill="none" stroke="#333348" stroke-width="0.8" />
      <circle cx="200" cy="200" r="122" fill="none" stroke="#3d3d50" stroke-width="0.8" />
      <circle cx="200" cy="200" r="116" fill="none" stroke="#333348" stroke-width="0.8" />
      <circle cx="200" cy="200" r="110" fill="none" stroke="#3d3d50" stroke-width="0.8" />
      <circle cx="200" cy="200" r="104" fill="none" stroke="#333348" stroke-width="0.8" />
      <circle cx="200" cy="200" r="98" fill="none" stroke="#3d3d50" stroke-width="0.8" />
      <circle cx="200" cy="200" r="92" fill="none" stroke="#333348" stroke-width="0.8" />
      <circle cx="200" cy="200" r="86" fill="none" stroke="#3d3d50" stroke-width="0.8" />
      <circle cx="200" cy="200" r="80" fill="none" stroke="#333348" stroke-width="0.8" />

      <!-- Subtle sheen / light reflection -->
      <ellipse cx="170" cy="170" rx="120" ry="120" fill="url(#sheen)" opacity="0.08" />

      <!-- Dead wax area (smooth ring before label) -->
      <circle cx="200" cy="200" r="74" fill="none" stroke="#444" stroke-width="1" />

      <!-- Label area background -->
      <circle cx="200" cy="200" r="70" fill="#e8d5b7" stroke="#c4a97d" stroke-width="1.5" />

      <!-- Label inner ring decoration -->
      <circle cx="200" cy="200" r="62" fill="none" stroke="#c4a97d" stroke-width="0.8" />
      <circle cx="200" cy="200" r="55" fill="none" stroke="#c4a97d" stroke-width="0.5" stroke-dasharray="3,3" />

      <!-- Label lines -->
      <line x1="160" y1="185" x2="240" y2="185" stroke="#c4a97d" stroke-width="0.8" />
      <line x1="160" y1="197" x2="240" y2="197" stroke="#c4a97d" stroke-width="0.8" />
      <line x1="165" y1="209" x2="235" y2="209" stroke="#c4a97d" stroke-width="0.8" />
      <line x1="170" y1="221" x2="230" y2="221" stroke="#c4a97d" stroke-width="0.8" />

      <!-- Label text -->
      <text x="200" y="178" text-anchor="middle" font-family="monospace"
            font-size="11" fill="#5a4a3a" letter-spacing="3">{{ label }}</text>

      <!-- Side marker (small text) -->
      <text x="200" y="240" text-anchor="middle" font-family="monospace"
            font-size="7" fill="#5a4a3a" letter-spacing="1">SIDE A</text>

      <!-- Spindle hole -->
      <circle cx="200" cy="200" r="5" fill="#1a1a2e" stroke="#888" stroke-width="1.5" />

      <!-- Outer rim highlight -->
      <circle cx="200" cy="200" r="190" fill="none" stroke="#666" stroke-width="1" />

      <!-- Sheen gradient definition -->
      <defs>
        <radialGradient id="sheen" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
      </defs>
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VinylRecord',
  props: {
    label: {
      type: String,
      default: 'MIXTAPE'
    }
  }
});
</script>

<style scoped>
</style>