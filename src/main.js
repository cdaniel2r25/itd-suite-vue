import Vue from 'vue'
import VueLoading from 'vue-loading-overlay'
import VueMask from 'v-mask'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { domain, clientId } from '../auth_config.json'
import { Auth0Plugin } from './auth'
import 'vue-loading-overlay/dist/vue-loading.css'

Vue.use(Auth0Plugin, {
  domain,
  clientId,
  onRedirectCallback: (appState) => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    )
  },
})

Vue.use(VueLoading)

Vue.use(VueMask)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')
