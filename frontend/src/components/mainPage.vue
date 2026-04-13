<template>
  <!-- Overlays Start -->
  <!-- Sidebar -->
  <div class="max-w-1/8 w-1/4 absolute z-50 h-screen">
    <SideBar>
      <!-- All Sidebar Elements -->
      <div class="flex flex-col h-screen">
        <!-- Format Filter Buttons -->
        <div class="h-5/6 flex flex-col">
          <h3 class="text-xl font-bold pb-4">Format Filtering</h3>
          <div class="flex">
            <button class="styleButton mr-3 w-18 h-10 flex items-center justify-center "
              :class="{ 'gradientButton': vinylFilterOn }" @click="vinylFilterToggle">
              <minimalistVinyl></minimalistVinyl>
            </button>
            <button class="styleButton ml-3 w-18 h-10 flex items-center justify-center"
              :class="{ 'gradientButton': cassetteFilterOn }" @click="cassetteFilterToggle">
              <minimalistCassette></minimalistCassette>
            </button>
          </div>
        </div>
        <!-- Sign Out Button -->
        <div class="h-1/6">
          <button @click="resetForm" :disabled="!showCollection"
            class="styleButton flex items-center gap-2.5 px-5 py-2.5 font-bold text-sm sm:text-md active:scale-95 transition-all duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span class="hidden sm:inline"> Change User </span>
          </button>
        </div>
      </div>
    </SideBar>
  </div>
  <!-- Album Info Overlay -->
  <div class="relative">
    <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-4">
      <albumOverlay v-if="showAlbumOverlay" :album-info="albumInfo" @close-overlay="closeOverlay"></albumOverlay>
    </Transition>

    <!-- Vinyl Filter Transition Overlay -->
    <Transition enter-active-class="transition-all duration-250 ease-out" enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-250 ease-in"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-4">
      <div v-if="playingVinylFilter" class="w-full h-full fixed inset-0 z-50 flex items-center justify-center bg-black">
      </div>
    </Transition>
    <Transition type="animation" enter-active-class="transition-all animate-fly-up-flip-y-fly-down"
      leave-active-class="hidden" @after-enter="playingVinylFilter = false">
      <div v-if="playingVinylFilter"
        class="w-full h-full fixed inset-0 z-50 flex items-center justify-center bottom-0 pointer-events-none 0.5s"
        :class="{ 'hidden': !playingVinylFilter }">
        <VinylSVG class="w-150 left-0 bottom-0" label="Loading..."></VinylSVG>
      </div>
    </Transition>

    <!-- Cassette Filter Transition Overlay -->
    <Transition enter-active-class="transition-all duration-250 ease-out" enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-250 ease-in"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-4">
      <div v-if="playingCassetteFilter"
        class="w-full h-full fixed inset-0 z-50 flex items-center justify-center bg-black">
      </div>
    </Transition>
    <Transition type="animation" enter-active-class="transition-all animate-fly-up-flip-y-fly-down"
      leave-active-class="hidden" @after-enter="playingCassetteFilter = false">
      <div v-if="playingCassetteFilter"
        class="w-full h-full fixed inset-0 z-50 flex items-center justify-center bottom-0 pointer-events-none"
        :class="{ 'hidden': !playingCassetteFilter }">
        <CassetteSVG class="w-150 left-0 bottom-0" label="Loading..."></CassetteSVG>
      </div>
    </Transition>
    <!-- Overlays Start -->

    <!-- Header -->
    <Transition enter-active-class="transition-all duration-300 ease-out delay-500"
      enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300 ease-in" leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4">
      <div v-if="showCollection" class="flex flex-col items-center justify-center gap-4 mb-5 sm:mb-10">
        <div class="flex h-10">
          <div class="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <span class="text-sm">Viewing</span>
            <span class="text-primary-end font-semibold text-sm ml-1.5">{{ formData.username }}'s</span>
            <span class="text-sm ml-1">collection</span>
          </div>
        </div>
        <!-- Header Buttons -->
        <div v-if="showCollection" class="flex flex-row items-center justify-center gap-4">
          <div class="">
            <Select v-model="selectedGenre" :options="collectionGenres" placeholder="What are you in the mood for?"
              @change="handleFilter" :virtualScrollerOptions="{ itemSize: 38, showLoader: false }" :pt="{
                root: { class: 'bg-white/10 !border border-white/10 flex justify-center ' },
                label: { class: 'text-sm sm:text-md font-bold' },
                panel: { class: 'bg-transparent' },
                overlay: { class: 'flex justify-center ' },
                option: { class: 'text-xs sm:text-base hover:cursor-pointer flex items-center justify-center gap-2.5 px-5 py-2.5 w-full hover:bg-white/20 rounded-full text-center active:scale-95 transition-all duration-500 my-1' },
                list: { class: 'text-center' },
                listContainer: { class: 'bg-primary-gradient rounded-lg gap-5 px-5 py-2.5 w-3/4 m-3 border border-white/10 shadow shadow-purple-500/30 shadow-xl' }
              }"
              class="hover:cursor-pointer w-50 sm:w-80 flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/20 hover:border-white/20 active:scale-95 transition-all duration-500 bg-white/10 "></Select>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Form Container -->
    <Transition mode="out-in" enter-active-class="transition-all duration-600 ease-out delay-500"
      enter-from-class="opacity-0 translate-y-8" enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-400 ease-in" leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-8 scale-95" @after-leave="handleFormGone">
      <div v-if="showForm" class="max-w-md mx-auto">
        <loginForm :loading="loading" :form-data="formData" @submit="handleSubmit"></loginForm>
      </div>
    </Transition>

    <!-- Error Message -->
    <Transition enter-active-class="transition-all duration-400 ease-out" enter-from-class="opacity-0 translate-y-4"
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
    </Transition>

    <!-- Collection Result -->
    <Transition mode="out-in" enter-active-class="transition-all duration-600 ease-out delay-500"
      enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-400 ease-in" leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95" @after-leave="handleCollectionGone">
      <div v-if="showCollection" class="max-w-7xl mx-auto">
        <!-- Collection Header -->
        <div>
          <h3 class="text-center text-xl sm:text-3xl font-bold sm:mb-4">
            {{ totalItems }} Albums
          </h3>
          <p class="text-primary-text/40 text-sm">
            <span v-if="loadingMore" class="inline-flex items-center gap-2">
              <svg class="animate-spin h-3.5 w-3.5 text-primary-text/40" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Loading {{ collectionData?.releases.length }} of {{ totalItems }} records...
            </span>
          </p>
        </div>

        <!-- Carousel -->
        <div class="px-4 py-1 sm:py-6  sm:min-h-100">
          <Transition enter-active-class="transition-all duration-300 ease-out delay-300"
            enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-300 ease-in" leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-4" @after-leave="handleCarouselGone">
            <albumCarousel :collection-data="filteredCollectionData" v-if="showCarousel" :current-index="currentIndex"
              @next-release="nextRelease" @prev-release="previousRelease" @album-selected="handleAlbumSelected"
              @go-to-release="goToRelease">
            </albumCarousel>
          </Transition>
        </div>

        <!-- Bottom Bar Buttons -->
        <Transition enter-active-class="transition-all duration-300 ease-out delay-300"
          enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-300 ease-in" leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4">
          <div v-if="totalItems != 0">
            <!-- Progress indicator -->
            <div class="flex items-center justify-center gap-3 sm:mt-4">
              <span class="text-primary-text/30 text-sm font-medium tabular-nums">{{ currentIndex + 1 }}</span>
              <div class="w-48 h-1 bg-white/10 rounded-full overflow-hidden relative">
                <!-- Loaded portion background (shows how much of the collection is fetched) -->
                <div v-if="loadingMore"
                  class="absolute inset-y-0 left-0 bg-white/5 rounded-full transition-all duration-500 ease-out"
                  :style="{ width: `${(filteredCollectionData!.releases.length / totalItems) * 100}%` }"></div>
                <!-- Current position indicator -->
                <div class="h-full bg-primary-gradient rounded-full transition-all duration-500 ease-out relative"
                  :style="{ width: `${((currentIndex + 1) / totalItems) * 100}%` }"></div>
              </div>
              <span class="text-primary-text/30 text-sm font-medium tabular-nums">{{ totalItems }}</span>
            </div>
            <!-- Keyboard hint -->
            <div class="hidden mt-6 sm:flex sm:flex-col items-center justify-center gap-4 text-xs">
              <div class="flex items-center gap-1.5">
                <kbd class="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono">&larr;</kbd>
                <kbd class="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono">&rarr;</kbd>
                <span class="text-primary-text/20">Swipe or use arrow keys to browse</span>
              </div>
              <div>
                <span class="text-primary-text/20">Double click an album for more info</span>
              </div>
            </div>

            <!-- Random Albun Button -->
            <div class="flex items-center justify-center gap-4 mb-4 mt-4">
              <button @click="randomAlbum"
                class="group w-60 sm:w-72 sm:h-12 rounded-2xl flex items-center justify-center gradientButton text-sm sm:text-lg font-bold ">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="group-hover:animate-spin">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="3"></circle>
                  <line x1="12" y1="2" x2="12" y2="5"></line>
                  <line x1="12" y1="19" x2="12" y2="22"></line>
                  <line x1="2" y1="12" x2="5" y2="12"></line>
                  <line x1="19" y1="12" x2="22" y2="12"></line>
                </svg>
                <text class="pl-4"> Find Me An Album... </text>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { DiscogsCollectionResponse, DiscogsRelease } from '../types/DiscogsCollectionInfo';
import { discogsService } from '../services/api';
import loginForm, { LoginFormData } from './loginForm.vue'
import Select from 'primevue/select';
import albumCarousel from "./albumCarousel.vue"
import albumOverlay from "./albumOverlay.vue"
import minimalistVinyl from './minimalistVinyl.vue';
import minimalistCassette from './minimalistCassette.vue';
import CassetteSVG from './cassetteSVG.vue';
import VinylSVG from './vinylSVG.vue';
import SideBar from './sideBar.vue';
import { DiscogsAlbumInfoResponse } from '../types/DiscogsAlbumInfo';

const emit = defineEmits(["startBackgroundMusic", "stopBackgroundMusic"]);

const formData = ref<LoginFormData>({
  username: '',
  apiKey: '',
});

const loading = ref(false);
const loadingMore = ref(false);
const totalItems = computed(() => {
  return filteredCollectionData.value?.releases.length ?? 0;
});
const error = ref<string | null>(null);
const collectionData = ref<DiscogsCollectionResponse | null>(null);
const filteredCollectionData = computed(() => {
  const filteredCollection: DiscogsCollectionResponse = {
    pagination: collectionData.value?.pagination!,
    releases: []
  };
  if (selectedGenre.value === '' || selectedGenre.value === anyGenreStr) {
    if (!vinylFilterOn.value && !cassetteFilterOn.value) {
      return collectionData.value;
    }
    if (vinylFilterOn.value) {
      filteredCollection.releases = [...filteredCollection.releases, ...collectionData.value!.releases.filter(release => release.basic_information.formats[0].name === 'Vinyl')];
    }

    if (cassetteFilterOn.value) {
      filteredCollection.releases = [...filteredCollection.releases, ...collectionData.value!.releases.filter(release => release.basic_information.formats[0].name === 'Cassette')];
    }

    return filteredCollection;
  }

  const collectionGenreFilter = collectionData.value?.releases.filter(release => release.basic_information.genres.includes(selectedGenre.value)) as DiscogsRelease[];

  if (!vinylFilterOn.value && !cassetteFilterOn.value) {
    filteredCollection.releases = collectionGenreFilter;
    return filteredCollection;
  }

  if (vinylFilterOn.value) {
    filteredCollection.releases = [...filteredCollection.releases, ...collectionGenreFilter.filter(release => release.basic_information.formats[0].name === 'Vinyl')];
  }

  if (cassetteFilterOn.value) {
    filteredCollection.releases = [...filteredCollection.releases, ...collectionGenreFilter.filter(release => release.basic_information.formats[0].name === 'Cassette')];
  }
  return filteredCollection;
});

const albumInfo = ref<DiscogsAlbumInfoResponse | null>(null);

const anyGenreStr = "Anything's Fine";
const collectionGenres = computed(() => { return [anyGenreStr, ... new Set(collectionData.value?.releases.map(release => release.basic_information.genres.flat()).flat())] });
const selectedGenre = ref('')

const cassetteFilterOn = ref(false);
const vinylFilterOn = ref(false);
const playingCassetteFilter = ref(false);
const playingVinylFilter = ref(false);

const currentIndex = ref(0);
const showCollection = ref(false);
const showForm = ref(true);
const showCarousel = ref(true);
const showAlbumOverlay = ref(false);

// Used to cancel background fetching when the user resets
let abortController: AbortController | null = null;

const swipeAudio = new Audio('sounds/swipe.wav');
swipeAudio.volume = 0.3;
const startAudio = new Audio('sounds/startup.mp3');


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
    error.value = null;
    currentIndex.value = 0;
  }, 500);
  emit("stopBackgroundMusic");
};

const handleFormGone = () => {
  showCollection.value = true;
  showCarousel.value = true;
}

const handleCollectionGone = () => {
  showForm.value = true;
}

const handleCarouselGone = () => {
  if (showCollection.value) {
    showCarousel.value = true;
  }
}

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;
  currentIndex.value = 0;;
  selectedGenre.value = '';
  let playAudio = true;

  try {
    // Fetch the first page
    const data = await discogsService.fetchCollectionPage(
      formData.value.username.trim(),
      1,
      formData.value.apiKey || undefined,
    );

    collectionData.value = data;

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
    playAudio = false;
  } finally {
    loading.value = false;
    if (playAudio) {
      startAudio.currentTime = 0; // Rewind if played quickly
      startAudio.play();
      startAudio.onended = () => {
        setTimeout(() => {
          // Code to run after 50ms
        }, 50);
        emit("startBackgroundMusic");
      };
    }
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
        formData.value.username.trim(),
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

const handleAlbumSelected = async (
  albumID: number
) => {
  try {
    // Fetch album infor
    const data = await discogsService.fetchAlbumInfo(
      albumID
    );

    albumInfo.value = data;

    showAlbumOverlay.value = true;
  } catch (err) {
    error.value = (err as Error).message;
  }
};

const closeOverlay = () => {
  showAlbumOverlay.value = false;
}

// Carousel navigation
const nextRelease = () => {
  if (filteredCollectionData.value && currentIndex.value < filteredCollectionData.value.releases.length - 1) {
    currentIndex.value++;
  }
};

const previousRelease = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const goToRelease = (index: number) => {
  currentIndex.value = index;
};

const randomAlbum = () => {
  if (!filteredCollectionData.value) {
    return;
  }
  const randomNumber = Math.floor(Math.random() * (filteredCollectionData.value?.releases.length));
  showCarousel.value = false;
  goToRelease(randomNumber);
  // showCarousel.value = true;
}

const handleFilter = () => {
  if (showCarousel.value) {
    showCarousel.value = false;
  } else {
    showCarousel.value = true;
  }
  currentIndex.value = 0;
}

const vinylFilterToggle = () => {
  playingVinylFilter.value = true;
  setTimeout(() => {
    currentIndex.value = 0;
    vinylFilterOn.value = !vinylFilterOn.value;
  }, 200);
}

const cassetteFilterToggle = () => {
  playingCassetteFilter.value = true;
  setTimeout(() => {
    currentIndex.value = 0;
    cassetteFilterOn.value = !cassetteFilterOn.value;
  }, 200);
}

</script>

<style scoped></style>