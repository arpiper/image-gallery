<template>
  <div id="app">
    <router-view></router-view>
    <modal-block>
    </modal-block>
  </div>
</template>

<script>
import AlbumsBlock from "./components/AlbumsBlock.vue"
import ImagesBlock from "./components/ImagesBlock.vue"
import ModalBlock from "./components/ModalBlock.vue"
import { mapState } from "vuex"

export default {
  name: "app",
  data () {
    return {
      // number of images to show in a row
      grid_width: 3,
      albums: "",
      source: "",
      count: 0,
    }
  },
  computed: {
    ...mapState([
      'api',
    ]),
  },
  methods: {
  },
  components: {
    AlbumsBlock,
    ImagesBlock,
    ModalBlock
  },
  created () {
  },
  destroyed () {
  }
}
</script>

<style>
#app {
  font-family: arial, titillium, sans-serif;
  height: 100%;
  width: 100%;
  display: inline-block;
}
</style>
