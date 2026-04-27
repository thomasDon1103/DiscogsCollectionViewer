<template>
    <div class="w-full 2xl:h-150 2xl:mt-5">
        <swiper :effect="'coverflow'" :grabCursor="true" :centeredSlides="true" :slidesPerView="'auto'" :keyboard="true"
            :navigation="true" :initial-slide="props.currentIndex" @swiper="onSwiper" @slideChange="onSlideChange"
            :virtual="{
                enabled: true,
                addSlidesAfter: 10,
                addSlidesBefore: 10,
                cache: true
            }" :free-mode="{
                enabled: true,
                sticky: true,
                momentum: true,          // Enable momentum
                momentumRatio: 0.95,      // Adjust momentum strength (default 1)
                momentumVelocityRatio: 0.95 // Adjust velocity impact
            }" :coverflowEffect="{
                rotate: 20,
                stretch: 0,
                depth: 125,
                modifier: 1,
                slideShadows: false,
            }" :modules="modules" class="mySwiper w-full h-115 2xl:h-full">
            <swiper-slide v-for="(release, index) in props.collectionData!.releases" :key="index" class="w-full">
                <div id="albumCard w-full"
                    class="transition-[opacity,transform] duration-500 ease-in-out flex flex-col items-center justify-center mb-2 w-full">
                    <div class="rounded-2xl overflow-hidden w-70 lg:w-50 xl:w-75 2xl:w-100 h-fit transition-[transform,box-shadow] duration-300"
                        :class="{
                            'cursor-pointer hover:scale-[1.02]': index !== currentIndex,
                            'ring-2 ring-white/20': index === currentIndex
                        }" @click="index !== currentIndex && goToRelease(index)">
                        <div class="relative">
                            <img :src="release.basic_information.cover_image" :alt="release.basic_information.title"
                                class="w-full aspect-square object-cover" draggable="false" loading="lazy"
                                decoding="async"
                                @dblclick="handleAlbumDoubleClick(props.collectionData!.releases[index].id)"
                                @touchstart="handleTouchDoubleTap($event, props.collectionData!.releases[index].id)" />
                            <!-- Subtle gradient overlay at bottom of image -->
                            <div v-show="index === currentIndex"
                                class="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-black/30 to-transparent w-full">
                            </div>
                            <!-- Format badge -->
                            <div v-show="index === currentIndex && release.basic_information.formats.length > 0"
                                class="absolute top-3 right-3 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-medium border border-white/10">
                                {{ release.basic_information.formats[0].name }}
                            </div>
                        </div>
                        <Transition>
                            <div v-if="index === currentIndex" class="p-2 2xl:p-6 bg-surface-light/95">
                                <p class="font-bold text-md sm:text-xl mb-1 leading-tight truncate">{{
                                    release.basic_information.title }}</p>
                                <p class="text-primary-text/60 text-base mb-1 sm:mb-4 truncate">
                                    {{release.basic_information.artists.map(a => a.name).join(', ')}}</p>
                                <div class="flex items-center justify-center gap-2 flex-wrap">
                                    <span v-for="genre in release.basic_information.genres" :key="genre"
                                        class="px-3 py-1 bg-white/10 rounded-full text-primary-text/70 text-xs font-medium border border-white/5">
                                        {{ genre }}
                                    </span>
                                    <span v-if="release.basic_information.year"
                                        class="px-3 py-1 bg-primary-start/20 rounded-full text-primary-start text-xs font-semibold border border-primary-start/10">
                                        {{ release.basic_information.year }}
                                    </span>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Swiper as SwiperType } from 'swiper';
// Import required modules
import { EffectCoverflow, Virtual, FreeMode, Keyboard } from 'swiper/modules';
import { ref } from 'vue';
import type { DiscogsCollectionResponse } from '../types/DiscogsCollectionInfo';
// Swiper JS CSS imports
import '../../node_modules/swiper/swiper.css';
import '../../node_modules/swiper/modules/effect-coverflow.css';
import '../../node_modules/swiper/modules/pagination.css';
import '../../node_modules/swiper/modules/virtual.css';

// Define modules to be used
const modules = [EffectCoverflow, Virtual, FreeMode, Keyboard];

const emit = defineEmits(['nextRelease', "prevRelease", "goToRelease", "albumSelected"]);

const props = defineProps<{
    collectionData: DiscogsCollectionResponse | null
    currentIndex: number
}>();

const swiperInstance = ref<SwiperType | null>(null);
let swipeAudio: HTMLAudioElement | null = null;
let bigSwipeAudio: HTMLAudioElement | null = null;

const getSwipeAudio = () => {
    if (!swipeAudio) swipeAudio = new Audio('sounds/swipe.wav');
    return swipeAudio;
};
const getBigSwipeAudio = () => {
    if (!bigSwipeAudio) bigSwipeAudio = new Audio('sounds/bigSwipe.wav');
    return bigSwipeAudio;
};

const onSwiper = (swiper: SwiperType) => {
    swiperInstance.value = swiper;
};

const onSlideChange = (swiper: SwiperType) => {
    emit('goToRelease', swiper.activeIndex);
    if (swiper.previousIndex === swiper.activeIndex - 1 || swiper.previousIndex === swiper.activeIndex + 1) {
        const audio = getSwipeAudio();
        audio.currentTime = 0;
        audio.play();
    } else {
        const audio = getBigSwipeAudio();
        audio.currentTime = 0;
        audio.play();
    }
};

const goToRelease = (index: number) => {
    // props.currentIndex.value = index;
    emit('goToRelease', index);
    swiperInstance.value?.slideTo(index);
};

const handleAlbumDoubleClick = (albumID: number) => {
    emit("albumSelected", albumID);
}


// Touch screen is annoying
const lastTouch = ref(0);
const handleTouchDoubleTap = (event: TouchEvent, id: number) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // ms

    if (now - lastTouch.value < DOUBLE_TAP_DELAY) {
        handleAlbumDoubleClick(id);
        event.preventDefault(); // Prevent zoom
    }
    lastTouch.value = now;
};
</script>

<style scoped>
.swiper-slide {
    width: 500px;
    height: 500px;
    background-color: #eee;
    /* Smoothly transition opacity */
    transition: opacity 0.3s;
    will-change: transform, opacity;
    contain: layout style;
}

.swiper-slide:not(.swiper-slide-active) {
    opacity: 0.5;
}
</style>