import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from "primevue/config";
import dragScroll from 'drag-scroll-vue3';

const app = createApp(App);

app.use(PrimeVue, {
    unstyled: true
});
app.directive('drag-scroll', dragScroll);

app.mount('#app')