<template>
    <div class="flex">
        <!-- Sidebar Container -->
        <aside :class="isOpen ? 'translate-x-0 z-40' : '-translate-x-full z-0'"
            class="fixed top-0 left-0 w-fit pl-6 pr-6 h-screen transition-transform duration-300 bg-white/5 backdrop-blur-md border border-white/10  p-10 shadow-2xl shadow-black/20">
            <div class="">
                <h2 class="text-3xl font-bold">Menu</h2>
                <div class="bg-primary-end/70 rounded-lg shadow-lg  w-full mt-1 mb-2 h-1"></div>
                <nav class="mt-4">
                    <slot />
                </nav>
            </div>

            <!-- Toggle Button (Moves with Sidebar) -->
            <div
                class="absolute top-5 -right-20 flex items-center justify-center bg-primary-gradient shadow-lg shadow-primary-shadow/30 gradientButton rounded focus:outline-none">
                <button @click="handleOpenToggle" class="">
                    <!-- Icon (Hamburger or Arrow) -->
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>

        </aside>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

let openAudio: HTMLAudioElement | null = null;
let closeAudio: HTMLAudioElement | null = null;

const getOpenAudio = () => {
    if (!openAudio) openAudio = new Audio('sounds/openMenu.wav');
    return openAudio;
};
const getCloseAudio = () => {
    if (!closeAudio) closeAudio = new Audio('sounds/closeMenu.wav');
    return closeAudio;
};

const isOpen = ref(false);

const handleOpenToggle = () => {
    if (!isOpen.value) {
        getOpenAudio().play();
    } else {
        getCloseAudio().play();
    }
    isOpen.value = !isOpen.value;
}


</script>

<style scoped></style>