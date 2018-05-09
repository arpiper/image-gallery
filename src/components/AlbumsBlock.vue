<template>
  <div class="album-block">
    <!--div v-for="album in albums" v-if="album.img" class="albums" >
      <div v-on:click="selectAlbum(album)" class="album">
        <h4>{{ album.name }}</h4>
        <img :src="album.img.url" :alt="album.img.name" class="album-img">
      </div>
    </div>
    <div class="message" v-else-if="statuscode !== 200">
      <span>{{ message }}</span>
    </div-->
    <div v-for="album of albums" class="albums">
      <router-link :to="{name: 'one_album', params: { name: album.clean_name }}">
        <h4>{{ album.name }}</h4>
        <img :src="album.img.url" :alt="album.img.name" class="album-img">
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: "albums-block",
  props: {
    name: String,
    album_list: [Object, String],
    album_source: String,
  },
  data () {
    return {
      albums: undefined,
      message: undefined,
      statuscode: undefined,
    }
  },
  computed: {
    ...mapGetters([
      "albumsURL",
    ]),
  },
  methods: {
    selectAlbum (album) {
      this.evtHub.$emit("selectAlbum", album)
    },
    getAlbums () {
      fetch(this.albumsURL)
        .then((res) => {
          return res.json()
        })
        .then((res) => {
          this.message = res.status.message
          this.message = res.status.code
          if (res.status.code === 200) {
            this.albums = res.albums
          }
        })
    },
  },
  created () {
    this.getAlbums()
  },
  mounted () {
  },
}
</script>

<style scoped>
div.album-block { 
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1000px;
  margin: 0 auto;
  padding: 50px 0;
}
.albums {
  display: flex;
  flex: auto;
  align-items: center;
  text-align: center;
  margin: 2px;
  overflow: hidden;
  justify-content: center;
}
.albums a {
  text-decoration: none;
  color: var(--color-dark);
}
.album {
  padding: 10px;
  cursor: pointer;
}
img {
  display: flex;
  height: 100%;
  min-width: 100%;
}
.album:hover img {
  box-shadow: 0 0 10px 0 black;
}
span {
  display: inline-block;
}
.last img {
  min-width: 0;
  width: auto;
}
</style>
