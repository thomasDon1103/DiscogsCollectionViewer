<template>
  <div class="w-full h-full fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-hidden">
    <div class="w-full max-w-[95vw] max-h-screen flex flex-col gap-4 p-6 overflow-hidden">
      <div
        v-for="(section, index) in themeSections"
        :key="section.label"
        class="rounded-2xl bg-surface/60 backdrop-blur-sm border border-white/10 overflow-hidden flex flex-col"
        :class="{ 'flex-1 min-h-0': expandedSections[index] }"
      >
        <!-- Section Header -->
        <button
          class="w-full flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-white/5 transition-colors duration-200"
          @click="toggleSection(index)"
        >
          <span class="text-xl font-semibold text-white">{{ section.label }}</span>
          <svg
            class="w-5 h-5 text-white/70 transition-transform duration-300"
            :class="{ 'rotate-180': expandedSections[index] }"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Collapsible Content -->
        <div
          class="grid-wrapper min-h-0 flex-1"
          :style="{
            gridTemplateRows: expandedSections[index] ? '1fr' : '0fr',
          }"
        >
          <div class="overflow-hidden overflow-y-auto min-h-0 flex-1">
            <div class="flex flex-wrap items-start justify-center gap-6 px-5 pb-5 pt-2">
              <div
                v-for="[displayName, themeValue] in section.themes"
                :key="themeValue"
                class="flex flex-col items-center gap-2 cursor-pointer rounded-xl p-3 transition-all duration-200"
                :class="[
                  selectedTheme === themeValue
                    ? 'ring-2 ring-primary-start bg-surface-light scale-105'
                    : 'hover:bg-surface/50 hover:scale-102',
                ]"
                @click="selectTheme(themeValue)"
              >
                <div :data-theme="themeValue" v-html="renderColorPaletteSwatchHTML()" style="width: 120px; height: 120px;" />
                <span class="text-sm text-center text-white max-w-30 leading-tight">
                  {{ displayName }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import {
  styleThemeMap,
  themesMap,
  themesPlusMap,
  themesPlusPlusMap,
  themesPlusPlusPlusMap,
  themesPlusPlusPlusPlusMap,
} from '../../public/themeMap.ts'
import { renderColorPaletteSwatchHTML } from './colorPaletteSwatch';

// // Cache the swatch HTML since it's the same structure for every theme
// // (the theme-specific colors come from the data-theme attribute on the parent)
// const cachedSwatchHTML = renderColorPaletteSwatchHTML();

const emit = defineEmits(['closeThemeOverlay']);

const themeSections = [
  { label: 'Default Themes', themes: styleThemeMap },
  { label: 'Theme Pack 1', themes: themesMap },
  { label: 'Theme Pack 2', themes: themesPlusMap },
  { label: 'Theme Pack 3', themes: themesPlusPlusMap },
  { label: 'Theme Pack 4', themes: themesPlusPlusPlusMap },
  { label: 'Theme Pack 5', themes: themesPlusPlusPlusPlusMap },
];

const expandedSections = reactive<boolean[]>(themeSections.map(() => false));

function toggleSection(index: number) {
  expandedSections[index] = !expandedSections[index];
}

const selectedTheme = ref<string>('')

// Lazy-load audio to avoid blocking component mount
let closeAudio: HTMLAudioElement | null = null;
const getCloseAudio = () => {
    if (!closeAudio) {
        closeAudio = new Audio('sounds/closeOverlay.wav');
        closeAudio.volume = 0.5;
    }
    return closeAudio;
};

// Play open sound on mount without blocking
const playOpenSound = () => {
    const openAudio = new Audio('sounds/openOverlay.wav');
    openAudio.volume = 0.5;
    openAudio.play();
};
playOpenSound();

function selectTheme(themeValue: string) {
  selectedTheme.value = themeValue
  closeOverlay()
}

const closeOverlay = () => {
  emit('closeThemeOverlay', selectedTheme.value);
  getCloseAudio().play();
}
</script>

<style scoped>
.grid-wrapper {
  display: grid;
  transition: grid-template-rows 0.35s ease-in-out;
}
</style>