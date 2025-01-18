import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import './style.css'
import '/node_modules/primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import App from './App.vue'
import Aura from '@primevue/themes/aura';

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});

app.mount('#app')