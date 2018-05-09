import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App.vue'
import routes from './router.js'
import config from "../gallery.conf.json"

/* eslint-disable no-new */
const evtHub = new Vue()
Vue.mixin({
  data () {
    return {
      evtHub: evtHub
    }
  }
})

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    api: config.data.source,
  },
  getters: {
    albumsURL: (state) => {
      return `${state.api}/albums/all/1/`
    },
    imagesURL: (state) => {
      return `${state.api}/albums/`
    },
  },
})

Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
