<template>
    <div class="flex items-center justify-center gap-6" v-if="showCarousel">
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
            <div class="flex flex-col items-center justify-center relative h-90 sm:h-125">
                <div id="albumCard" v-for="(release, index) in props.collectionData!.releases"
                    class="absolute transition-all duration-500 ease-in-out flex flex-col items-center justify-center"
                    :style="getCardStyle(index)">
                    <div class="rounded-2xl overflow-hidden w-3/5 sm:w-full h-80 sm:h-full" :class="{
                        'cursor-pointer hover:scale-[1.02]': index !== currentIndex,
                        'ring-2 ring-white/20': index === currentIndex
                    }" @click="index !== currentIndex && goToRelease(index)">
                        <div class="relative">
                            <img :src="release.basic_information.cover_image" :alt="release.basic_information.title"
                                class="w-full aspect-square object-cover"
                                :class="{ ' pointer-events-none': transitioning }" draggable="false"
                                @dblclick="handleAlbumDoubleClick(props.collectionData!.releases[index].id)" />
                            <!-- Subtle gradient overlay at bottom of image -->
                            <div v-if="index === currentIndex"
                                class="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-black/30 to-transparent">
                            </div>
                            <!-- Format badge -->
                            <div v-if="index === currentIndex && release.basic_information.formats.length > 0"
                                class="absolute top-3 right-3 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-medium border border-white/10">
                                {{ release.basic_information.formats[0].name }}
                            </div>
                        </div>
                        <div v-if="index === currentIndex" class="p-2 sm:p-6 bg-surface-light/95 backdrop-blur-sm">
                            <p class="font-bold text-md sm:text-xl text-white mb-1 leading-tight truncate">{{
                                release.basic_information.title }}</p>
                            <p class="text-white/60 text-base mb-1 sm:mb-4 truncate">
                                {{release.basic_information.artists.map(a => a.name).join(', ')}}</p>
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

        <button @click="nextRelease" :disabled="currentIndex === props.collectionData!.releases.length - 1"
            class="shrink-0 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/10 hover:bg-white/20 hover:border-white/20 hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/10 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import type { DiscogsCollectionResponse } from '../types/DiscogsCollectionInfo';

const props = defineProps<{
    collectionData: DiscogsCollectionResponse | null
    currentIndex: number
    showCarousel: boolean
}>()

const emit = defineEmits(['nextRelease', "prevRelease", "goToRelease", "albumSelected"]);

// Drag/swipe state
const isDragging = ref(false);
const startX = ref(0);
const currentX = ref(0);
const dragThreshold = 50; // pixels to trigger slide change

// Needed so cant click during transition
const transitioning = ref(false);

// Audio
const swipeAudio = new Audio('sounds/swipe.wav');

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

const handleAlbumDoubleClick = (albumID: number) => {
    console.log(albumID);
    emit("albumSelected", albumID);
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
    if (!props.showCarousel || !props.collectionData) return;
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousRelease();
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextRelease();
    }
};

// Carousel navigation
const nextRelease = () => {
    if (props.collectionData && props.currentIndex < props.collectionData.releases.length - 1) {
        emit("nextRelease");
        playSwipe();
    }
};

const previousRelease = () => {
    if (props.currentIndex > 0) {
        emit("prevRelease");
        playSwipe();
    }
};

const goToRelease = (index: number) => {
    // props.currentIndex.value = index;
    emit('goToRelease', index)
    playSwipe();
};

const playSwipe = () => {
    swipeAudio.currentTime = 0; // Rewind if played quickly
    transitioning.value = true;
    swipeAudio.play();
    swipeAudio.onended = () => {
        transitioning.value = false;
    }
}

// Calculate card positioning and styling for carousel effect
const getCardStyle = (index: number) => {
    const diff = index - props.currentIndex;
    const absDiff = Math.abs(diff);

    // Only show cards within 2 positions of current
    if (absDiff > 3) {
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
    const offset = diff * 200; // Horizontal spacing
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

</script>