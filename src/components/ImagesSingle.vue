<template>
  <div class="image" v-bind:style="style_object" >
    <span v-if="!src" class="loader" :width="width" :height="height"></span>
    <img v-else v-bind:data-src="src" :src="src" v-on:click="viewFullSize($event)">
  </div>
</template>

<script>

export default {
  name: "images-single",
  props: {
    image: Object,
    min_height: Number,
    row_used: Number,
    // src: String,
    idx: Number,
    position: Object,
  },
  data () {
    return {
      image_url: this.url,
      image_id: this.image.id,
      width: this.image.width,
      height: this.image.height,
      url: this.image.url,
      src: "",
    }
  },
  computed: {
    adj_height: function () {
      if (this.min_height > this.position.adj_height) {
        return this.min_height
      }
      return this.position.adj_height
    },
    adj_width: {
      get: function () {
        return this.position.adj_width
      },
      set: function (w) {
        this.width = w
        this.height = this.min_height
      }
    },
    style_object: function () {
      let obj = {
        height: `${this.adj_height}px`,
        width: `${this.adj_width}px`,
        top: `${this.position.position.top}px`,
        left: `${this.position.position.left}px`,
      }
      return obj         
    },
  },
  methods: {
    loadImage: function () {
      // load the image if the position is within the viewable window.
    },
    getPosition: function () {
      return {
        top: this.$el.offsetTop,
        left: this.$el.offsetLeft
      }
    },
    viewFullSize: function (evt) {
      this.evtHub.$emit("view-full-size", this.image, this.idx)
    },
    adjustImage: function (e) {
    }
  },
  beforeCreate () {
  },
  created () {
  },
  mounted () {
    this.src = this.url
    this.evtHub.$emit("images-loaded")
  },
  destroyed () {
    this.evtHub.$off("image-added")
  }
}
</script>

<style scoped>
div {
  /*display: flex;
  flex: auto;
  justify-content: center;
  align-items: center;
  margin: 2px;*/
  overflow: hidden;
  position: absolute;
  display: inline-block;
  text-align: center;
  transition: transform 0.25s;
  padding: 10px;
}
img {
  height: 100%;
  min-width: 100%;
  display: inline-block;
  cursor: pointer;
}
div:hover {
  transform: scale(1.15);
  z-index: 10;
}
img:hover {
  box-shadow: 0 0 5px 0 black;
}
span {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #eee;
}
.last img {
  min-width: 0;
  width: auto;
}
.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4caf50;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
