import { createApp } from 'vue'
import './style.css' // Your Tailwind CSS file (might be named differently)
import App from './App.vue'
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App);

// Register ApexCharts globally
app.use(VueApexCharts);

app.mount('#app');