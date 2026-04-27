<template>
    <div class="pb-4 w-full flex justify-center items-center h-fit">
        <div class="w-full sm:w-2/3 lg:w-1/2 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/20 flex items-center justify-between gap-4">
            <!-- Song Info (Left Side) -->
            <div class="flex flex-col items-start min-w-0 flex-1">
                <span class="text-xs uppercase tracking-widest text-white/50 mb-1">Now Playing</span>
                <div class="relative w-full overflow-hidden">
                    <Transition name="song-fade" mode="out-in">
                        <h3 :key="currentAudioIndex" class="font-bold text-sm sm:text-base truncate w-full text-left">
                            {{ currentAudio.name }}
                        </h3>
                    </Transition>
                </div>
            </div>

            <!-- Audio Element -->
            <audio ref="audioPlayer" :src="currentAudio.url" @ended="onTrackEnded" @play="isPlaying = true" @pause="isPlaying = false"></audio>

            <!-- Playback Controls (Right Side) -->
            <div class="flex items-center gap-2 shrink-0">
                <!-- Previous Button -->
                <button @click="playPrevious" class="gradientButton rounded-2xl p-3" aria-label="Previous track">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
                    </svg>
                </button>

                <!-- Play / Pause Button -->
                <button @click="togglePlayPause" class="gradientButton rounded-2xl p-3" aria-label="Play or pause">
                    <!-- Play Icon -->
                    <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                    <!-- Pause Icon -->
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19h4V5H6zm8-14v14h4V5z" />
                    </svg>
                </button>

                <!-- Next Button -->
                <button @click="playNext" class="gradientButton rounded-2xl p-3" aria-label="Next track">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                    </svg>
                </button>

                <!-- Loop Button -->
                <button @click="toggleLoop" class="rounded-2xl p-3 transition-all duration-300" :class="isLooping ? 'gradientButton' : 'bg-white/5 hover:bg-white/15'" aria-label="Toggle loop">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue';

// Playlist
const playlist = ref([
    { name: 'Florida Rains - Lowball Glass', url: 'sounds/Florida Rains - Lowball Glass.mp3' },
    { name: 'Sonic Mega Collection Plus - Game Library, Extras, & Options', url: 'sounds/Sonic Mega Collection Plus - Game Library, Extras, & Options.mp3' },
]);

const currentAudioIndex = ref(0);
const audioPlayer = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const isLooping = ref(false);

// Current song
const currentAudio = computed(() => playlist.value[currentAudioIndex.value]);

// Play / Pause toggle
const togglePlayPause = () => {
    if (!audioPlayer.value) return;
    if (isPlaying.value) {
        audioPlayer.value.pause();
    } else {
        audioPlayer.value.play();
    }
};

// Toggle loop
const toggleLoop = () => {
    isLooping.value = !isLooping.value;
};

// Handle track end — loop or advance
const onTrackEnded = () => {
    if (isLooping.value && audioPlayer.value) {
        audioPlayer.value.currentTime = 0;
        audioPlayer.value.play();
    } else {
        playNext();
    }
};

// Change track and auto-play
const changeTrack = (newIndex: number) => {
    currentAudioIndex.value = newIndex;
    nextTick(() => {
        if (audioPlayer.value) {
            audioPlayer.value.load();
            audioPlayer.value.play();
        }
    });
};

// Next track
const playNext = () => {
    changeTrack((currentAudioIndex.value + 1) % playlist.value.length);
};

// Previous track
const playPrevious = () => {
    changeTrack((currentAudioIndex.value - 1 + playlist.value.length) % playlist.value.length);
};
</script>

<style scoped>
.song-fade-enter-active,
.song-fade-leave-active {
    transition: opacity 0.35s ease, transform 0.35s ease;
}

.song-fade-enter-from {
    opacity: 0;
    transform: translateY(6px);
}

.song-fade-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>