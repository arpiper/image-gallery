<template>
  <div class="album-block">
    <div class="message" v-if="statuscode !== 200">
      <span>{{ message }}</span>
    </div>
    <div v-for="album of albums" class="albums">
      <router-link :to="{name: 'one_album', params: { name: album.clean_name }}">
        <h4>{{ album.name }}</h4>
        <img :src="album.img.url" :alt="album.img.name" class="album-img">
      </router-link>
    </div>
    <transition name="fade">
      <div v-show="loading" class="loader-container">
        <span class="loader"></span>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: "albums-block",
  props: {
  },
  data () {
    return {
      albums: undefined,
      message: undefined,
      statuscode: undefined,
      loading: true,
    }
  },
  computed: {
    ...mapGetters([
      "albumsURL",
    ]),
  },
  methods: {
    getAlbums () {
      fetch(this.albumsURL)
        .then((res) => {
          return res.json()
        })
        .then((res) => {
          this.message = res.status.message
          this.statuscode = res.status.code
          if (res.status.code === 200) {
            this.albums = res.albums
          }
          this.loading = false
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
.loader {
  display: flex;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--color-main);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s ease-in-out infinite;
}
.loader-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--color-dark-75);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-leave-to {
  opacity: 0;
}
@media screen and (max-width: 768px) {
}
</style>
