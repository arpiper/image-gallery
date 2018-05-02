import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

/* eslint-disable no-new */
const evtHub = new Vue()
Vue.mixin({
  data () {
    return {
      evtHub: evtHub
    }
  }
})

Vue.use(VueRouter)

new Vue({
  el: '#app',
  render: h => h(App)
})
