<template>
    <div class="flex">
        <!-- Sidebar Container -->
        <aside :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
            class="fixed top-0 left-0 z-40 w-fit pl-6 pr-6 h-screen transition-transform duration-300 bg-white/5 backdrop-blur-xl border border-white/10  p-10 shadow-2xl shadow-black/20">
            <div class="">
                <h2 class="text-3xl font-bold">Menu</h2>
                <div class="bg-primary-end/70 rounded-lg shadow-lg  w-full mt-1 mb-2 h-1"></div>
                <nav class="mt-4">
                    <slot />
                </nav>
            </div>

            <!-- Toggle Button (Moves with Sidebar) -->
            <div
                class="absolute top-5 -right-20 flex items-center justify-center  bg-linear-to-br from-primary-start to-primary-end shadow-lg shadow-purple-500/30 gradientButton text-white rounded focus:outline-none">
                <button @click="isOpen = !isOpen" class="">
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

const isOpen = ref(false);
</script>

<style scoped>

</style>