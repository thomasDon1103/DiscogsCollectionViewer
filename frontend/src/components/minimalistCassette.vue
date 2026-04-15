<template>
  <div class="flex justify-center items-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <!-- Outer shell -->
      <rect x="2" y="4" width="20" height="16" rx="2" />

      <!-- Left reel -->
      <circle cx="8" cy="12" r="2" />

      <!-- Right reel -->
      <circle cx="16" cy="12" r="2" />

      <!-- Tape line between reels -->
      <line x1="10" y1="12" x2="14" y2="12" />

      <!-- Bottom tape window -->
      <path d="M 6 20 L 8 17 L 16 17 L 18 20" />

      <!-- Top label line -->
      <line x1="7" y1="7" x2="17" y2="7" />
    </svg>
  </div>
</template>

<script lang="ts">

</script>

<style scoped></style>