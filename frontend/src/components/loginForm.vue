<template>
    <div class="max-w-md mx-auto">
        <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl shadow-black/20">
            <div class="mb-8">
                <h2 class="text-white text-2xl font-bold mb-2">Enter your details</h2>
                <p class="text-white/40 text-sm">Connect to Discogs to browse your vinyl collection</p>
            </div>
            <form @submit.prevent="handleSubmit" class="space-y-5">
                <div class="space-y-1.5">
                    <label
                        class="block text-left text-white/60 text-xs font-semibold uppercase tracking-wider pl-1">Username</label>
                    <div class="relative">
                        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <input v-model="props.formData.username" type="text" placeholder="e.g. vinylcollector" required
                            class="w-full pl-12 pr-5 py-4 text-base rounded-xl text-white placeholder-white/25 bg-white/5 border border-white/10 focus:bg-white/10 focus:border-primary-start/60 focus:shadow-[0_0_20px_rgba(102,126,234,0.15)] transition-all duration-300 outline-none" />
                    </div>
                </div>
                <div class="space-y-1.5">
                    <label class="block text-left text-white/60 text-xs font-semibold uppercase tracking-wider pl-1">API
                        Key
                        <span class="text-white/30 normal-case font-normal">(optional)</span></label>
                    <div class="relative">
                        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path
                                    d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4">
                                </path>
                            </svg>
                        </div>
                        <input v-model="props.formData.apiKey" type="text" placeholder="Your Discogs API key"
                            class="w-full pl-12 pr-5 py-4 text-base rounded-xl text-white placeholder-white/25 bg-white/5 border border-white/10 focus:bg-white/10 focus:border-primary-start/60 focus:shadow-[0_0_20px_rgba(102,126,234,0.15)] transition-all duration-300 outline-none" />
                    </div>
                </div>
                <div class="pt-3">
                    <button type="submit" :disabled="props.loading"
                        class="w-full py-4 bg-linear-to-r from-primary-start to-primary-end text-white rounded-xl text-base font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg">
                        <span v-if="props.loading" class="flex items-center justify-center gap-3">
                            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            Fetching collection...
                        </span>
                        <span v-else class="flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            Explore Collection
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">

const props = defineProps(['loading', 'formData']);
const emit = defineEmits(['submit']);


export interface LoginFormData {
    username: string,
    apiKey: string,
}

const handleSubmit = () => {
    // Emit the event, optionally with a payload (e.g., a todo ID)
    emit('submit');
};

</script>