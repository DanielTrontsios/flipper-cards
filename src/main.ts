import { createApp } from 'vue'
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import './style.css'
import '/node_modules/primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import App from './App.vue'
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

const pinia = createPinia()
const app = createApp(App);
app.use(ToastService);
app.use(ConfirmationService);
app.use(pinia);
app.use(PrimeVue, {
  theme: {
    preset: Aura
  },
  locale: {
    choose: '',
  }
});

app.mount('#app')