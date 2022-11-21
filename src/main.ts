import { createApp } from 'vue'
import VueGtag from 'vue-gtag'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'

import 'uno.css'

const app = createApp(App)

loadFonts()

app
  .use(vuetify)
  .use(VueGtag, {
    config: {
      id: import.meta.env.VITE_GTAG_ID,
    },
  })
  .mount('#app')
