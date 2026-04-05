<template>
  <div id="app" class="h-screen flex flex-col overflow-hidden bg-gradient-window-gradient">


    <!-- Header -->
    <header class="pt-5 sm:pt-10 pb-6 px-6">
      <div class="flex items-center justify-center gap-4 mb-2">
        <div
          class="w-12 h-12 rounded-2xl bg-linear-to-br from-primary-start to-primary-end flex items-center justify-center shadow-lg shadow-purple-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="3"></circle>
            <line x1="12" y1="2" x2="12" y2="5"></line>
            <line x1="12" y1="19" x2="12" y2="22"></line>
            <line x1="2" y1="12" x2="5" y2="12"></line>
            <line x1="19" y1="12" x2="22" y2="12"></line>
          </svg>
        </div>
        <h1
          class="text-3xl font-extrabold tracking-tight bg-linear-to-r from-primary-start via-accent to-primary-end bg-clip-text text-transparent">
          Discogs Explorer
        </h1>
      </div>
      <p class="text-white/40 text-sm font-medium tracking-wide">Browse your vinyl collection beautifully</p>
    </header>

    <!-- Main Content -->
    <main class="px-6 pb-12">
      <MainPage @start-background-music="backgroundFadeIn" @stop-background-music="backgroundFadeOut" />
    </main>
    <BallsBackground></BallsBackground>
  </div>
  <audio ref="backgroundAudioPlayer" :src="backroundMusicURL" loop></audio>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MainPage from './components/mainPage.vue';
import BallsBackground from './components/floatingBallsBackground.vue';
// import WavesBackground from './components/wavesBackground.vue';

const backroundMusicURL = "sounds/background.mp3";
const backgroundAudioPlayer = ref<HTMLAudioElement | null>(null);

// Background Audio Constants
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


</script>

<style scoped>
#app {
  width: 100%;
}
</style>