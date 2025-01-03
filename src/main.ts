import { createPinia } from 'pinia'
import { createApp } from 'vue'
import VueVirtualScroller from 'vue-virtual-scroller'
import App from './App.vue'

import router from './router'
import '@unocss/reset/tailwind.css'
import './assets/main.scss'

import 'virtual:uno.css'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
// @ts-expect-error missing types
app.use(VueVirtualScroller)
