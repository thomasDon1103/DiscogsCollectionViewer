<template>
  <div class="relative">
    <!-- Change User Button -->
    <transition enter-active-class="transition-all duration-500 ease-out delay-500"
      enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-500 ease-in" leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4">
      <div v-if="showCollection" class="flex items-center justify-center gap-4 mb-10">
        <button @click="resetForm"
          class="flex items-center gap-2.5 px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white/80 rounded-full text-sm font-medium border border-white/10 hover:bg-white/20 hover:text-white hover:border-white/20 active:scale-95 transition-all duration-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Change User
        </button>
        <div class="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
          <span class="text-white/50 text-sm">Viewing</span>
          <span class="text-white font-semibold text-sm ml-1.5">{{ formData.username }}'s</span>
          <span class="text-white/50 text-sm ml-1">collection</span>
        </div>
      </div>
    </transition>

    <!-- Form Container -->
    <transition mode="out-in" enter-active-class="transition-all duration-600 ease-out delay-500"
      enter-from-class="opacity-0 translate-y-8" enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-400 ease-in" leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-8 scale-95" @after-leave="handleFormGone">
      <div v-if="showForm" class="max-w-md mx-auto">
        <loginForm :loading="loading" :form-data="formData" @submit="handleSubmit"></loginForm>
      </div>
    </transition>

    <!-- Error Message -->
    <transition enter-active-class="transition-all duration-400 ease-out" enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="error" class="mt-6 max-w-md mx-auto">
        <div class="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl p-5">
          <div class="flex items-start gap-3">
            <div class="shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#f87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <div class="text-left">
              <h3 class="text-red-400 font-semibold text-sm mb-1">Something went wrong</h3>
              <pre class="text-red-300/80 whitespace-pre-wrap wrap-break-word text-xs leading-relaxed">{{ error }}</pre>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Collection Result -->
    <transition mode="out-in" enter-active-class="transition-all duration-600 ease-out delay-500"
      enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-400 ease-in" leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95" @after-leave="handleCollectionGone">
      <div v-if="showCollection" class="max-w-7xl mx-auto">
        <!-- Collection Header -->
        <div class="mb-10">
          <h3 class="text-center text-3xl font-bold text-white mb-2">
            {{ totalItems }} Records
          </h3>
          <p class="text-white/40 text-sm">
            <span v-if="loadingMore" class="inline-flex items-center gap-2">
              <svg class="animate-spin h-3.5 w-3.5 text-white/40" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Loading {{ collectionData!.releases.length }} of {{ totalItems }} records...
            </span>
            <span v-else>Swipe or use arrows to browse</span>
          </p>
        </div>

        <!-- Carousel -->
        <div class="px-4 py-6">
          <div class="flex items-center justify-center gap-6">
            <button @click="previousRelease" :disabled="currentIndex === 0"
              class="shrink-0 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/10 hover:bg-white/20 hover:border-white/20 hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/10 z-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div class="relative flex-1 max-w-5xl overflow-visible cursor-grab active:cursor-grabbing select-none"
              @mousedown="handleDragStart" @mousemove="handleDragMove" @mouseup="handleDragEnd"
              @mouseleave="handleDragEnd" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
              @touchend="handleTouchEnd">
              <div class="flex items-center justify-center relative" style="height: 580px;">
                <div id="albumCard" v-for="(release, index) in collectionData!.releases" :key="release.id"
                  class="absolute transition-all duration-500 ease-in-out" :style="getCardStyle(index)">
                  <div class="rounded-2xl overflow-hidden card-glass" :class="{
                    'cursor-pointer hover:scale-[1.02]': index !== currentIndex,
                    'ring-2 ring-white/20': index === currentIndex
                  }" @click="index !== currentIndex && goToRelease(index)">
                    <div class="relative">
                      <img :src="release.basic_information.cover_image" :alt="release.basic_information.title"
                        class="w-full aspect-square object-cover" draggable="false" />
                      <!-- Subtle gradient overlay at bottom of image -->
                      <div v-if="index === currentIndex"
                        class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent">
                      </div>
                      <!-- Format badge -->
                      <div v-if="index === currentIndex && release.basic_information.formats.length > 0"
                        class="absolute top-3 right-3 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-medium border border-white/10">
                        {{ release.basic_information.formats[0].name }}
                      </div>
                    </div>
                    <div v-if="index === currentIndex" class="p-6 bg-surface-light/95 backdrop-blur-sm">
                      <p class="font-bold text-xl text-white mb-1.5 leading-tight truncate">{{
                        release.basic_information.title }}</p>
                      <p class="text-white/60 text-base mb-4 truncate">{{release.basic_information.artists.map(a =>
                        a.name).join(', ')}}</p>
                      <div class="flex items-center justify-center gap-2 flex-wrap">
                        <span v-for="genre in release.basic_information.genres" :key="genre"
                          class="px-3 py-1 bg-white/10 rounded-full text-white/70 text-xs font-medium border border-white/5">
                          {{ genre }}
                        </span>
                        <span v-if="release.basic_information.year"
                          class="px-3 py-1 bg-primary-start/20 rounded-full text-primary-start text-xs font-semibold border border-primary-start/10">
                          {{ release.basic_information.year }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button @click="nextRelease" :disabled="currentIndex === collectionData!.releases.length - 1"
              class="shrink-0 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/10 hover:bg-white/20 hover:border-white/20 hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/10 z-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- Progress indicator -->
        <div class="flex items-center justify-center gap-3 mt-4">
          <span class="text-white/30 text-sm font-medium tabular-nums">{{ currentIndex + 1 }}</span>
          <div class="w-48 h-1 bg-white/10 rounded-full overflow-hidden relative">
            <!-- Loaded portion background (shows how much of the collection is fetched) -->
            <div v-if="loadingMore"
              class="absolute inset-y-0 left-0 bg-white/5 rounded-full transition-all duration-500 ease-out"
              :style="{ width: `${(collectionData!.releases.length / totalItems) * 100}%` }"></div>
            <!-- Current position indicator -->
            <div
              class="h-full bg-linear-to-r from-primary-start to-primary-end rounded-full transition-all duration-500 ease-out relative"
              :style="{ width: `${((currentIndex + 1) / totalItems) * 100}%` }"></div>
          </div>
          <span class="text-white/30 text-sm font-medium tabular-nums">{{ totalItems }}</span>
        </div>

        <!-- Keyboard hint -->
        <div class="mt-6 flex items-center justify-center gap-4 text-white/20 text-xs">
          <div class="flex items-center gap-1.5">
            <kbd class="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono">&larr;</kbd>
            <kbd class="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono">&rarr;</kbd>
            <span>Arrow keys</span>
          </div>
          <span class="text-white/10">|</span>
          <span>Drag to browse</span>
        </div>

        <!-- Random Albun Button -->
        <div class="flex items-center justify-center gap-4 mb-4 mt-4">
          <div
            class="w-72 h-12 rounded-2xl bg-linear-to-br from-primary-start to-primary-end flex items-center justify-center shadow-lg shadow-purple-500/30 randomButton">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="3"></circle>
              <line x1="12" y1="2" x2="12" y2="5"></line>
              <line x1="12" y1="19" x2="12" y2="22"></line>
              <line x1="2" y1="12" x2="5" y2="12"></line>
              <line x1="19" y1="12" x2="22" y2="12"></line>
            </svg>
            <button @click="randomAlbum"
              class="text-3xl font-extrabold tracking-tight bg-white bg-clip-text text-transparent">
              Find Something For Me...
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
  <audio ref="backgroundAudioPlayer" :src="backroundMusicURL" loop></audio>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { DiscogsCollectionResponse } from '../types/Discogs';
import { discogsService } from '../services/api';
import loginForm, { LoginFormData } from './loginForm.vue'

const formData = ref<LoginFormData>({
  username: '',
  apiKey: '',
});

const loading = ref(false);
const loadingMore = ref(false);
const totalItems = ref(0);
const error = ref<string | null>(null);
const collectionData = ref<DiscogsCollectionResponse | null>(null);
const currentIndex = ref(0);
const showCollection = ref(false);
const showForm = ref(true);

// Used to cancel background fetching when the user resets
let abortController: AbortController | null = null;

// Drag/swipe state
const isDragging = ref(false);
const startX = ref(0);
const currentX = ref(0);
const dragThreshold = 50; // pixels to trigger slide change

const swipeAudio = new Audio('sounds/swipe.wav');
swipeAudio.volume = 0.3;
const startAudio = new Audio('sounds/startup.mp3');
const backgroundAudioPlayer = ref<HTMLAudioElement | null>(null);

const backroundMusicURL = "sounds/background.mp3";

const FADE_DURATION = 500; // milliseconds
const FADE_INTERVAL = 20;  // milliseconds
const MAX_VOLUME = 1.0;

const backgroundFadeIn = () => {
  if (!backgroundAudioPlayer.value) return;

  // Start at silent volume before playing
  backgroundAudioPlayer.value.volume = 0;
  backgroundAudioPlayer.value.play();

  const interval = setInterval(() => {
    if (!backgroundAudioPlayer.value) return;

    // Increase volume in small steps
    if (backgroundAudioPlayer.value.volume < MAX_VOLUME) {
      const newVol = backgroundAudioPlayer.value.volume + (MAX_VOLUME * FADE_INTERVAL) / FADE_DURATION;
      if (newVol < MAX_VOLUME) {
        backgroundAudioPlayer.value.volume = newVol;
      }
      else {
        backgroundAudioPlayer.value.volume = MAX_VOLUME;
        clearInterval(interval);
      }
    } else {
      clearInterval(interval);
    }
  }, FADE_INTERVAL);
};

const backgroundFadeOut = () => {
  if (!backgroundAudioPlayer.value) return;

  const interval = setInterval(() => {
    if (!backgroundAudioPlayer.value) return;

    // Decrease volume in small steps
    if (backgroundAudioPlayer.value.volume > 0) {
      const newVol = backgroundAudioPlayer.value.volume - (MAX_VOLUME * FADE_INTERVAL) / FADE_DURATION;
      if (newVol > 0.0) {
        backgroundAudioPlayer.value.volume = newVol;
      }
      else {
        backgroundAudioPlayer.value.volume = 0;
        clearInterval(interval);
        backgroundAudioPlayer.value.pause();
      }
    } else {
      clearInterval(interval);
      backgroundAudioPlayer.value.pause();
    }
  }, FADE_INTERVAL);
};

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (!showCollection.value || !collectionData.value) return;
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    previousRelease();
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    nextRelease();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

const resetForm = () => {
  // Cancel any in-progress background page fetches
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
  loadingMore.value = false;
  showCollection.value = false;
  // Wait for collection to fully fade out (500ms) before clearing data and showing form
  setTimeout(() => {
    collectionData.value = null;
    totalItems.value = 0;
    error.value = null;
    currentIndex.value = 0;
  }, 500);
  backgroundFadeOut();
};

const handleFormGone = () => {
  showCollection.value = true;
}

const handleCollectionGone = () => {
  showForm.value = true;
}

const playSwipe = () => {
  swipeAudio.currentTime = 0; // Rewind if played quickly
  swipeAudio.play();
}

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;
  currentIndex.value = 0;;

  try {
    // Fetch the first page
    const data = await discogsService.fetchCollectionPage(
      formData.value.username,
      1,
      formData.value.apiKey || undefined,
    );

    collectionData.value = data;
    totalItems.value = data.pagination.items;

    // Wait for form to fully fade out (500ms) before showing collection
    setTimeout(() => {
      showForm.value = false;
    }, 500);

    // If there are more pages, fetch them in the background
    if (data.pagination.pages > 1) {
      fetchRemainingPages(data.pagination.pages);
    }
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
    startAudio.currentTime = 0; // Rewind if played quickly
    startAudio.play();
    startAudio.onended = () => {
      setTimeout(() => {
        // Code to run after 50ms
      }, 50);
      backgroundFadeIn();
    };

  }
};

/**
 * Fetches pages 2..totalPages in sequence and appends releases to collectionData.
 * Runs in the background after the first page is displayed.
 */
const fetchRemainingPages = async (totalPages: number) => {
  // Create a new AbortController so resetForm can cancel us
  abortController = new AbortController();
  const signal = abortController.signal;

  loadingMore.value = true;

  for (let page = 2; page <= totalPages; page++) {
    // Check if we were cancelled
    if (signal.aborted) break;

    try {
      const pageData = await discogsService.fetchCollectionPage(
        formData.value.username,
        page,
        formData.value.apiKey || undefined,
      );

      // Check again after the async call
      if (signal.aborted || !collectionData.value) break;

      // Append the new releases
      collectionData.value.releases = [
        ...collectionData.value.releases,
        ...pageData.releases,
      ];

      // Update pagination info to reflect current state
      collectionData.value.pagination = pageData.pagination;
    } catch (err) {
      // If aborted, silently stop; otherwise surface the error
      if (signal.aborted) break;
      console.error(`Failed to fetch page ${page}:`, err);
      // Continue trying remaining pages rather than stopping entirely
    }
  }

  loadingMore.value = false;
  abortController = null;
};

// Carousel navigation
const nextRelease = () => {
  if (collectionData.value && currentIndex.value < collectionData.value.releases.length - 1) {
    currentIndex.value++;
    playSwipe();
  }
};

const previousRelease = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    playSwipe();
  }
};

const goToRelease = (index: number) => {
  currentIndex.value = index;
  playSwipe();
};

const randomAlbum = () => {
  if (!collectionData.value) {
    return;
  }
  const randomNumber = Math.floor(Math.random() * (collectionData.value?.releases.length + 1));
  goToRelease(randomNumber);
}

// Calculate card positioning and styling for carousel effect
const getCardStyle = (index: number) => {
  const diff = index - currentIndex.value;
  const absDiff = Math.abs(diff);

  // Only show cards within 2 positions of current
  if (absDiff > 2) {
    return {
      opacity: '0',
      transform: 'translateX(0) scale(0.5)',
      pointerEvents: undefined,
      zIndex: '0',
    };
  }

  // Center card (current)
  if (diff === 0) {
    return {
      opacity: '1',
      transform: 'translateX(0) scale(1)',
      zIndex: '5',
      width: '380px',
      filter: 'brightness(1)',
    };
  }

  // Side cards
  const offset = diff * 260; // Horizontal spacing
  const scale = 0.72 - (absDiff - 1) * 0.1; // Scale down further cards
  const opacity = 0.5 - (absDiff - 1) * 0.2; // Fade out further cards
  const zIndex = 5 - absDiff;

  return {
    opacity: opacity.toString(),
    transform: `translateX(${offset}px) scale(${scale})`,
    zIndex: zIndex.toString(),
    width: '380px',
    filter: `brightness(0.6)`,
  };
};

// Mouse drag handlers
const handleDragStart = (e: MouseEvent) => {
  isDragging.value = true;
  startX.value = e.clientX;
  currentX.value = e.clientX;
};

const handleDragMove = (e: MouseEvent) => {
  if (!isDragging.value) return;
  currentX.value = e.clientX;
};

const handleDragEnd = () => {
  if (!isDragging.value) return;

  const diff = startX.value - currentX.value;

  if (Math.abs(diff) > dragThreshold) {
    if (diff > 0) {
      nextRelease();
    } else {
      previousRelease();
    }
  }

  isDragging.value = false;
};

// Touch handlers
const handleTouchStart = (e: TouchEvent) => {
  startX.value = e.touches[0].clientX;
  currentX.value = e.touches[0].clientX;
};

const handleTouchMove = (e: TouchEvent) => {
  currentX.value = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  const diff = startX.value - currentX.value;

  if (Math.abs(diff) > dragThreshold) {
    if (diff > 0) {
      nextRelease();
    } else {
      previousRelease();
    }
  }
};

</script>

<style scoped>
.card-glass {
  background: rgba(30, 30, 46, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  transition: all 0.3s ease;
}

.card-glass:hover {
  border-color: rgba(255, 255, 255, 0.12);
}

.randomButton {
  background-size: 350% 100%;
  transition: all .4s ease-in-out;
}

.randomButton:hover {
  background-position: 100% 0;
}

.btn:hover {
  animation-name: flow;
  animation-duration: 500ms;
  animation-timing-function: linear;
}
</style>