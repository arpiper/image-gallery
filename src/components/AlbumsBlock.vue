<template>
  <div class="album-block">
    <div class="message">
      <span>{{ message }}</span>
    </div>
    <div v-for="album in albums" v-if="album.img" class="album-link" >
      <div v-on:click="selectAlbum(album)">
        <h4>{{ album.name }}</h4>
        <img :src="album.img.url" :alt="album.img.name">
      </div>
    </div>
  </div>
</template>

<script>
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
    }
  },
  computed: {
  },
  methods: {
    selectAlbum (album) {
      this.evtHub.$emit("selectAlbum", album)
    },
    getAlbums () {
      let url = `${this.album_source}/albums/all/1`
      fetch(url)
        .then((res) => {
          return res.json()
        })
        .then((res) => {
          this.message = res.status.message
          console.log(res)
          if (res.status.code === 200) {
            this.albums = res.albums
          }
        })
    },
  },
  created () {
    //let vm = this
    this.getAlbums()
    console.log(this.albums)
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
  padding-top: 50px;
}
.album-link {
  display: flex;
  flex: auto;
  align-items: center;
  text-align: center;
  margin: 2px;
  overflow: hidden;
  justify-content: center;
  cursor: pointer;
}
.album-link a {
  text-decoration: none;
  color: var(--color-dark);
}
img {
  display: flex;
  height: 100%;
  min-width: 100%;
}
span {
  display: inline-block;
}
.last img {
  min-width: 0;
  width: auto;
}
</style>
