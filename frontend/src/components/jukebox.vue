<template>
    <div class="pb-4 w-full flex justify-center items-center">
        <div class="sm:w-1/3 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/20">
            <h3 class="font-bold transform -skew-x-12 p-4"> Now Playing: {{ currentAudio.name }} </h3>

            <!-- Audio Element -->
            <audio ref="audioPlayer" :src="currentAudio.url"></audio>
            <button @click="playRandom" class="gradientButton rounded-2xl">Play Something New...</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

// Start of the music player
const playlist = ref([
    { name: 'Forida Rains - Lowball Glass', url: 'sounds/Florida Rains - Lowball Glass.mp3' },
    { name: 'Sonic Mega Collection Plus - Game Library, Extras, & Options', url: 'sounds/Sonic Mega Collection Plus - Game Library, Extras, & Options.mp3' },
]);
const currentAudioIndex = ref(0);
const audioPlayer = ref<HTMLAudioElement | null>(null);

// 3. Computed for current song
const currentAudio = computed(() => playlist.value[currentAudioIndex.value]);


const playRandom = () => {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * playlist.value.length);
    } while (newIndex === currentAudioIndex.value);

    currentAudioIndex.value = newIndex;
    // Use nextTick if you need to play immediately after DOM update
    setTimeout(() => audioPlayer?.value?.play(), 0);
};
</script>

<style></style>