import '@unocss/reset/tailwind.css'
import './assets/main.scss'
import 'virtual:uno.css'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'


import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueVirtualScroller from 'vue-virtual-scroller'


import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
// @ts-ignore
app.use(VueVirtualScroller)
