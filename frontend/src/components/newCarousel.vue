<template>
    <div class="w-150 h-150 mt-5">
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
                slideShadows: true,
            }" :modules="modules" class="mySwiper w-full">
            <swiper-slide v-for="(release, index) in props.collectionData!.releases" :key="index" class="w-full">
                <div id="albumCard w-full"
                    class="transition-all duration-500 ease-in-out flex flex-col items-center justify-center mb-2 w-full">
                    <div class="rounded-2xl overflow-hidden w-3/5 sm:w-100 h-80 sm:h-full" :class="{
                        'cursor-pointer hover:scale-[1.02]': index !== currentIndex,
                        'ring-2 ring-white/20': index === currentIndex
                    }" @click="index !== currentIndex && goToRelease(index)">
                        <div class="relative">
                            <img :src="release.basic_information.cover_image" :alt="release.basic_information.title"
                                class="w-full aspect-square object-cover" draggable="false"
                                @dblclick="handleAlbumDoubleClick(props.collectionData!.releases[index].id)" />
                            <!-- Subtle gradient overlay at bottom of image -->
                            <div v-if="index === currentIndex"
                                class="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-black/30 to-transparent w-full">
                            </div>
                            <!-- Format badge -->
                            <div v-if="index === currentIndex && release.basic_information.formats.length > 0"
                                class="absolute top-3 right-3 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-medium border border-white/10">
                                {{ release.basic_information.formats[0].name }}
                            </div>
                        </div>
                        <Transition>
                            <div v-if="index === currentIndex" class="p-2 sm:p-6 bg-surface-light/95 backdrop-blur-sm">
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
const swipeAudio = new Audio('sounds/swipe.wav');
const bigSwipeAudio = new Audio('sounds/bigSwipe.wav');

const onSwiper = (swiper: SwiperType) => {
    swiperInstance.value = swiper;
};

const onSlideChange = (swiper: SwiperType) => {
    emit('goToRelease', swiper.activeIndex);
    if (swiper.previousIndex === swiper.activeIndex - 1 || swiper.previousIndex === swiper.activeIndex + 1) {
        swipeAudio.currentTime = 0; // Rewind if played quickly
        swipeAudio.play();
    } else {
        bigSwipeAudio.currentTime = 0;
        bigSwipeAudio.play();
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

</script>

<style scoped>
.swiper-slide {
    width: 500px;
    height: 500px;
    background-color: #eee;
    /* Smoothly transition opacity */
    transition: opacity 0.3s;
}

.swiper-slide:not(.swiper-slide-active) {
    opacity: 0.5;
}
</style>