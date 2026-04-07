<template>
  <div class="flex justify-center items-center">
    <svg class="w-full h-auto" viewBox="0 0 400 245" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer shell -->
      <rect x="10" y="10" width="380" height="225" rx="12" ry="12"
            fill="#2c2c3a" stroke="#555" stroke-width="2" />

      <!-- Inner border / inset -->
      <rect x="30" y="30" width="340" height="160" rx="6" ry="6"
            fill="#1e1e2a" stroke="#444" stroke-width="1.5" />

      <!-- Label area -->
      <rect x="80" y="43" width="240" height="60" rx="4" ry="4"
            fill="#e8d5b7" stroke="#c4a97d" stroke-width="1" />

      <!-- Label lines -->
      <line x1="100" y1="65" x2="300" y2="65" stroke="#c4a97d" stroke-width="0.8" />
      <line x1="100" y1="77" x2="300" y2="77" stroke="#c4a97d" stroke-width="0.8" />
      <line x1="100" y1="89" x2="300" y2="89" stroke="#c4a97d" stroke-width="0.8" />

      <!-- Label text -->
      <text x="200" y="58" text-anchor="middle" font-family="monospace"
            font-size="11" fill="#5a4a3a" letter-spacing="3">{{ label }}</text>

      <!-- Left tape roll (supply side - larger) -->
      <circle cx="130" cy="140" r="22" fill="#1a1020" stroke="#3a2a1a" stroke-width="1" opacity="0.7" />
      <circle cx="130" cy="140" r="18" fill="#2a1a10" stroke="#3a2a1a" stroke-width="0.5" opacity="0.6" />
      <circle cx="130" cy="140" r="14" fill="#1a1020" stroke="#3a2a1a" stroke-width="0.5" opacity="0.5" />

      <!-- Right tape roll (take-up side - smaller) -->
      <circle cx="270" cy="140" r="15" fill="#1a1020" stroke="#3a2a1a" stroke-width="1" opacity="0.7" />
      <circle cx="270" cy="140" r="12" fill="#2a1a10" stroke="#3a2a1a" stroke-width="0.5" opacity="0.5" />

      <!-- Left reel hub -->
      <circle cx="130" cy="140" r="24" fill="none" stroke="#666" stroke-width="1.5" />
      <circle cx="130" cy="140" r="10" fill="#1a1a2e" stroke="#888" stroke-width="1.5" />
      <!-- Left reel spokes (6, evenly spaced at 60° intervals) -->
      <line x1="130" y1="130" x2="130" y2="116" stroke="#666" stroke-width="1" />
      <line x1="138.66" y1="135" x2="150.78" y2="127.14" stroke="#666" stroke-width="1" />
      <line x1="138.66" y1="145" x2="150.78" y2="152.86" stroke="#666" stroke-width="1" />
      <line x1="130" y1="150" x2="130" y2="164" stroke="#666" stroke-width="1" />
      <line x1="121.34" y1="145" x2="109.22" y2="152.86" stroke="#666" stroke-width="1" />
      <line x1="121.34" y1="135" x2="109.22" y2="127.14" stroke="#666" stroke-width="1" />

      <!-- Right reel hub -->
      <circle cx="270" cy="140" r="24" fill="none" stroke="#666" stroke-width="1.5" />
      <circle cx="270" cy="140" r="10" fill="#1a1a2e" stroke="#888" stroke-width="1.5" />
      <!-- Right reel spokes (6, evenly spaced at 60° intervals) -->
      <line x1="270" y1="130" x2="270" y2="116" stroke="#666" stroke-width="1" />
      <line x1="278.66" y1="135" x2="290.78" y2="127.14" stroke="#666" stroke-width="1" />
      <line x1="278.66" y1="145" x2="290.78" y2="152.86" stroke="#666" stroke-width="1" />
      <line x1="270" y1="150" x2="270" y2="164" stroke="#666" stroke-width="1" />
      <line x1="261.34" y1="145" x2="249.22" y2="152.86" stroke="#666" stroke-width="1" />
      <line x1="261.34" y1="135" x2="249.22" y2="127.14" stroke="#666" stroke-width="1" />

      <!-- Bottom window / tape head opening -->
      <path d="M 90,235 L 115,190 L 285,190 L 310,235 Z"
            fill="transparent" stroke="#555" stroke-width="1.5" />

      <!-- Screw holes -->
      <circle cx="25" cy="24" r="4" fill="#222" stroke="#555" stroke-width="1" />
      <circle cx="375" cy="24" r="4" fill="#222" stroke="#555" stroke-width="1" />
      <circle cx="25" cy="221" r="4" fill="#222" stroke="#555" stroke-width="1" />
      <circle cx="375" cy="221" r="4" fill="#222" stroke="#555" stroke-width="1" />

      <!-- Bottom edge detail -->
      <rect x="170" y="222" width="60" height="8" rx="2" ry="2"
            fill="none" stroke="#555" stroke-width="1" />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CassetteTape',
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
