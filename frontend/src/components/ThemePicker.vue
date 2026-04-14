<template>
  <div class="w-full h-full fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-scroll">
    <div class="max-h-screen flex flex-wrap items-start justify-center gap-6 p-6">
      <div v-for="[displayName, themeValue] in themeMap" :key="themeValue"
        class="flex flex-col items-center gap-2 cursor-pointer rounded-xl p-3 transition-all duration-200" :class="[
          selectedTheme === themeValue
            ? 'ring-2 ring-primary-start bg-surface-light scale-105'
            : 'hover:bg-surface/50 hover:scale-102',
        ]" @click="selectTheme(themeValue)">
        <div :data-theme="themeValue">
          <ColorPaletteSwatch :width="120" :height="120" />
        </div>
        <span class="text-sm text-center max-w-30 leading-tight">
          {{ displayName }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { themeMap } from '../../public/themeMap.ts'
import ColorPaletteSwatch from './ColorPaletteSwatch.vue'

const emit = defineEmits(['closeThemeOverlay']);

const selectedTheme = ref<string>('')
const openAudio = new Audio('sounds/openOverlay.wav');
openAudio.volume = 0.5;
openAudio.play();
const closeAudio = new Audio('sounds/closeOverlay.wav');
closeAudio.volume = 0.5;

function selectTheme(themeValue: string) {
  selectedTheme.value = themeValue
  closeOverlay()
}

const closeOverlay = () => {
  emit('closeThemeOverlay', selectedTheme.value);
  closeAudio.play();
}



</script>