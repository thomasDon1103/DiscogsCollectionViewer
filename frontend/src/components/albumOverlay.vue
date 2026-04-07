<template>
    <!-- Transparent Dark Background -->
    <div class="w-full h-full fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click="closeOverlay">
        <!-- Overlay Content -->
        <div href="#"
            class="w-10/12 h-10/12 animate-background block rounded-lg bg-linear-to-r from-primary-start via-primary-mid to-primary-end bg-size-[400%_400%] p-2 [animation-duration:6s]">
            <div class="bg-gradient-window-gradient rounded-lg shadow-lg w-full h-full sm:p-10" @click.stop>
                <div class="flex flex-col h-full w-full">
                    <!-- Title Box -->
                    <div class="flex flex-col bg-white/10 rounded-lg p-3 mb-3">
                        <h1 class="text-6xl -skew-x-6 font-bold text-shadow-lg text-shadow-primary-end">{{
                            props.albumInfo?.artists[0].name }} - {{
                                props.albumInfo?.title }}</h1>
                        <div class="bg-primary-end/70 rounded-lg shadow-lg w-full mt-2 h-2"></div>
                    </div>

                    <!-- Album Image and Info -->
                    <div class="flex flex-row ">
                        <div class="bg-white/10 rounded-lg p-3 w-1/2">
                            <img :src="displayedImage" :alt="albumInfo?.title"
                                class="aspect-square object-cover rounded-lg w-full" draggable="false" />
                        </div>

                        <div class="w-full flex flex-col">
                            <div class="w-full flex flex-row">
                                <!-- Release Info -->
                                <div
                                    class="bg-white/10 rounded-lg p-3 ml-3 w-2/3 sm:h-100 overflow-scroll overflow-x-hidden">
                                    <h1 class="font-bold text-2xl -skew-x-6">Release Information</h1>
                                    <div class="bg-primary-end/70 rounded-lg shadow-lg w-full mt-1 mb-2 h-1"></div>
                                    <div class="flex flex-col items-start w-full">
                                        <div class="w-full flex flex-wrap">
                                            <p class="text-left text-lg font-bold">Release Date: &nbsp;</p>
                                            <p class="text-left text-lg">{{ props.albumInfo?.released }}</p>
                                        </div>
                                        <div class="w-full flex flex-wrap">
                                            <p class="text-left text-lg font-bold">Labels: &nbsp;</p>
                                            <div class="flex" v-for="(label, index) in props.albumInfo?.labels">
                                                <p class="text-left text-lg">&nbsp;{{ label.name }}</p>
                                                <p v-if="index != props.albumInfo?.labels?.length as number - 1">,</p>
                                            </div>
                                        </div>
                                        <div class="w-full flex flex-wrap">
                                            <p class="text-left text-lg font-bold">Edition:</p>
                                            <div class="flex" v-for="(format, index) in props.albumInfo?.formats">
                                                <p class="text-left text-lg">&nbsp;{{ format.name }}</p>
                                                <p v-if="format.text" class="text-left text-lg">&nbsp;- {{ format.text
                                                    }}
                                                </p>
                                                <p v-if="index != props.albumInfo?.formats?.length as number - 1">,</p>
                                            </div>
                                        </div>
                                        <div class="w-full flex flex-wrap">
                                            <p class="text-left text-lg font-bold">Genres: &nbsp;</p>
                                            <div class="flex" v-for="(genre, index) in props.albumInfo?.genres">
                                                <p class="text-left text-lg">&nbsp;{{ genre }}</p>
                                                <p v-if="index != props.albumInfo?.genres?.length as number - 1">,</p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Separated Release Notes Because I can -->
                                    <div class="bg-primary-end/70 rounded-lg shadow-lg w-full mt-1 mb-2 h-1"></div>
                                    <div class="w-full flex flex-col flex-wrap">
                                        <p class="text-left text-lg font-bold">Release Notes: &nbsp;</p>
                                        <p v-if="props.albumInfo?.notes" class="text-left text-lg ">{{
                                            props.albumInfo?.notes }}</p>
                                        <p v-else class="text-left text-lg text-gray-500">No release notes available.
                                        </p>
                                    </div>
                                </div>

                                <!-- Tracklist -->
                                <div class="bg-white/10 rounded-lg p-3 ml-3 w-1/3 sm:h-100">
                                    <div class="flex flex-col w-full h-full">
                                        <h1 class="font-bold text-2xl -skew-x-6">Tracklist</h1>
                                        <div class="bg-primary-end/70 rounded-lg shadow-lg  w-full mt-1 mb-2 h-1"></div>
                                        <div class="flex flex-col items-start overflow-scroll overflow-x-hidden">
                                            <div class="flex flex-wrap" v-for="song in albumInfo?.tracklist">
                                                <p class="text-left mt-1 text-lg font-bold">{{ song.position }} -&nbsp;
                                                </p>
                                                <p class="text-left mt-1 text-lg flex-1">{{ song.title }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-white/10 rounded-lg p-3 mt-3 ml-3 w-full h-full flex flex-col">
                                <p class="font-bold text-2xl -skew-x-6">Your Notes:</p>
                                <div class="bg-primary-end/70 rounded-lg shadow-lg w-full mt-1 mb-2 h-1"></div>

                                <p class="text-left text-gray-500"> Login required for this info... (I'm not done with
                                    this part yet)</p>
                            </div>
                        </div>
                    </div>

                    <!-- Images display -->
                    <div v-drag-scroll
                        class="bg-white/10 rounded-lg  mt-3 h-full w-full flex overflow-x-hidden select-none">
                        <img v-for="image in props.albumInfo?.images" :src="image?.uri"
                            title="Double Click To Change Image"
                            class="aspect-square object-cover rounded-lg ml-3 m-3 hover:cursor-pointer select-none border-3 border-white/0 hover:border-primary-end transition-colors duration-300"
                            draggable="false" @dblclick="changeImage(image.uri)" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { DiscogsAlbumInfoResponse } from '../types/DiscogsAlbumInfo';
const props = defineProps<{
    albumInfo: DiscogsAlbumInfoResponse | null
}>()

const emit = defineEmits(['closeOverlay']);

const displayedImage = ref<string>(props!.albumInfo!.images[0]?.uri);

const closeOverlay = () => {
    emit('closeOverlay');
}

const changeImage = (uri: string) => {
    displayedImage.value = uri;
}

</script>