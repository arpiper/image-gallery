<template>
  <div id="app">
    <!--albums-block
      v-if="!album_selected"
      v-bind:album_list="albums"
      :album_source="api">
    </albums-block>
    <images-block 
      v-else-if="album_selected"
      v-bind:title="album_title"
      v-bind:images_source="source" 
      v-bind:images_source_type="type" 
      v-bind:grid_width="grid_width"
      v-bind:image_count="count">
    </images-block-->
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
      type: 'url',
      //album_uri: config.data.source,
      album_selected: false,
      album_title: "",
      albums: "",
      source: "",
      count: 0,
    }
  },
  computed: {
    source2 () {
      if (imageData) {
        return imageData
      }
      return config.data.source
    },
    album_list () {
    },
    asource () {
      if (this.album_uri) {
        return this.album_uri
      }
      return albumData
    },
    ...mapState([
      'api',
    ]),
  },
  methods: {
    openAlbum (album) {
      this.type = "url"
      this.album_title = album.name
      this.source = `${this.album_uri}/images/api/albums/${album.clean_name}`
      this.album_selected = true
      this.count = album.count
    },
    closeAlbum () {
      this.album_selected = false
    }
  },
  components: {
    AlbumsBlock,
    ImagesBlock,
    ModalBlock
  },
  created () {
    this.evtHub.$on("selectAlbum", this.openAlbum)
    this.evtHub.$on("back-to-albums", this.closeAlbum)
  },
  destroyed () {
    this.evtHub.$off("selectAlbum")
    this.evtHub.$off("back-to-albums")
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
