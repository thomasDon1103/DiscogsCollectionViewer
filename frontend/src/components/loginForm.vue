<template>
    <div class="max-w-md mx-auto">
        <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl shadow-black/20">
            <div class="mb-8">
                <h2 class="text-2xl font-bold mb-2">Enter your details</h2>
                <p class="text-primary-text/40 text-sm">Connect to Discogs to browse your vinyl collection</p>
            </div>

            <!-- Authenticated user banner -->
            <div v-if="authedUsername"
                class="mb-6 p-4 rounded-xl bg-primary-start/10 border border-primary-start/30 flex items-center justify-between gap-3">
                <div class="text-left">
                    <div class="text-xs uppercase tracking-wider text-primary-text/50 font-semibold">
                        Signed in as
                    </div>
                    <div class="text-sm font-semibold text-primary-text">{{ authedUsername }}</div>
                </div>
                <button type="button" @click="handleLogout"
                    class="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    Sign out
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-5">
                <div class="space-y-1.5">
                    <label
                        class="block text-left text-primary-text/60 text-xs font-semibold uppercase tracking-wider pl-1">Username</label>
                    <div class="relative">
                        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-text/30">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <input v-model="props.formData.username" type="text" placeholder="e.g. vinylcollector" required
                            class="w-full pl-12 pr-5 py-4 text-base rounded-xl placeholder-white/25 bg-white/5 border border-white/10 focus:bg-white/10 focus:border-primary-start/60 focus:shadow-[0_0_20px_rgba(102,126,234,0.15)] transition-all duration-300 outline-none" />
                    </div>
                </div>
                <div class="space-y-1.5">
                    <label class="block text-left text-primary-text/60 text-xs font-semibold uppercase tracking-wider pl-1">API
                        Key
                        <span class="text-primary-text/30 normal-case font-normal">(optional)</span></label>
                    <div class="relative">
                        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-primary-text/30">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path
                                    d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4">
                                </path>
                            </svg>
                        </div>
                        <input v-model="props.formData.apiKey" type="text" placeholder="Your Discogs API key"
                            class="w-full pl-12 pr-5 py-4 text-base rounded-xl placeholder-white/25 bg-white/5 border border-white/10 focus:bg-white/10 focus:border-primary-start/60 focus:shadow-[0_0_20px_rgba(102,126,234,0.15)] transition-all duration-300 outline-none" />
                    </div>
                </div>
                <div class="pt-3">
                    <button type="submit" :disabled="props.loading"
                        class="w-full py-4 bg-primary-gradient rounded-xl text-base font-semibold shadow-lg shadow-primary-shadow/25 hover:shadow-xl hover:shadow-primary-shadow-500/40 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg">
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

            <!-- Divider -->
            <div class="flex items-center gap-3 my-6">
                <div class="flex-1 h-px bg-white/10"></div>
                <span class="text-primary-text/40 text-xs uppercase tracking-wider">or</span>
                <div class="flex-1 h-px bg-white/10"></div>
            </div>

            <!-- OAuth login button -->
            <button type="button" @click="handleOAuthLogin" :disabled="oauthLoading || props.loading"
                class="w-full py-4 rounded-xl text-base font-semibold bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <svg v-if="oauthLoading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                    </circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                <span>{{ oauthLoading ? 'Connecting to Discogs...' : 'Sign in with Discogs' }}</span>
            </button>

            <p class="text-primary-text/30 text-xs mt-4 leading-relaxed">
                Sign in to view private collection details and your account info. You can still browse public
                collections without signing in.
            </p>

            <p v-if="oauthError" class="mt-4 text-xs text-red-300/80">{{ oauthError }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { discogsAuth, BackendUnreachableError } from '../services/api';

const props = defineProps(['loading', 'formData']);
const emit = defineEmits(['submit', 'oauth-authenticated', 'backend-error']);

export interface LoginFormData {
    username: string,
    apiKey: string,
}

const oauthLoading = ref(false);
const oauthError = ref<string | null>(null);
const authedUsername = ref<string | null>(discogsAuth.getAuthenticatedUsername());

const handleSubmit = () => {
    // Emit the event, optionally with a payload (e.g., a todo ID)
    emit('submit');
};

/**
 * Surface backend-unreachable errors to the parent so they appear in the
 * shared red error panel, while keeping a local copy here too.
 */
const reportError = (err: unknown) => {
    const message = (err as Error).message;
    oauthError.value = message;
    if (err instanceof BackendUnreachableError) {
        emit('backend-error', message);
    }
};

const handleOAuthLogin = async () => {
    oauthError.value = null;
    oauthLoading.value = true;
    try {
        await discogsAuth.beginLogin();
        // beginLogin redirects the browser, so execution stops here on success.
    } catch (err) {
        oauthLoading.value = false;
        reportError(err);
    }
};

const handleLogout = async () => {
    try {
        await discogsAuth.logout();
    } catch (err) {
        reportError(err);
    } finally {
        authedUsername.value = null;
    }
};

// On mount, sync auth state with the backend and (if applicable) finish the
// post-OAuth redirect handshake.
onMounted(async () => {
    if (discogsAuth.hasCallbackParams()) {
        oauthLoading.value = true;
        try {
            const identity = await discogsAuth.completeLogin();
            authedUsername.value = identity.username;
            // Pre-fill the username field for the user.
            if (props.formData) {
                props.formData.username = identity.username;
            }
            // Let the parent know so it can auto-load the collection if desired.
            emit('oauth-authenticated', identity.username);
        } catch (err) {
            reportError(err);
        } finally {
            oauthLoading.value = false;
        }
        return;
    }

    // Otherwise, ask the backend if there's already an active session.
    try {
        const status = await discogsAuth.refreshStatus();
        if (status.authenticated && status.username) {
            authedUsername.value = status.username;
            if (props.formData && !props.formData.username) {
                props.formData.username = status.username;
            }
        }
    } catch (err) {
        // If the backend is down we still want the user to be able to use the
        // public-collection flow, so don't lock the form -- just surface the
        // error to the parent so it shows up in the standard error panel.
        reportError(err);
    }
});
</script>