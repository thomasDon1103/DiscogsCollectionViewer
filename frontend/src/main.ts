import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from "primevue/config";
import Aura from '@primeuix/themes/aura';

const app = createApp(App);

app.use(PrimeVue, {
    // theme: {
    //     preset: Aura,
    //     options: {
    //         cssLayer: {
    //             name: 'primevue',
    //             order: 'tailwind-base, primevue, tailwind-utilities'
    //         }
    //     }
    // }
    unstyled: true
});

app.mount('#app')