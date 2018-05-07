<template>
  <div class="image-container" v-bind:style="style_object" >
    <span v-if="!src" class="loader" :width="width" :height="height"></span>
    <div v-else class="highlight">
      <img 
        v-bind:data-src="src" 
        :src="src" 
        @click="viewFullSize($event)" 
        :class="orientation">
    </div>
  </div>
</template>

<script>
export default {
  name: "images-single",
  props: {
    image: Object,
    min_height: Number,
    row_used: Number,
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
    adj_height () {
      if (this.min_height > this.position.adj_height) {
        return this.min_height
      }
      return this.position.adj_height
    },
    adj_width: {
      get () {
        return this.position.adj_width
      },
      set (w) {
        this.width = w
        this.height = this.min_height
      }
    },
    style_object () {
      let obj = {
        height: `${this.adj_height}px`,
        width: `${this.adj_width}px`,
        top: `${this.position.position.top}px`,
        left: `${this.position.position.left}px`,
      }
      return obj
    },
    orientation () {
      if (this.image.ratio < 1) {
        return 'portrait'
      }
      return 'landscape'
    },
  },
  methods: {
    loadImage () {
      // load the image if the position is within the viewable window.
    },
    getPosition () {
      return {
        top: this.$el.offsetTop,
        left: this.$el.offsetLeft
      }
    },
    viewFullSize (evt) {
      this.evtHub.$emit("view-full-size", this.image, this.idx)
    },
    adjustImage (e) {
    }
  },
  beforeCreate () {
  },
  created () {
  },
  mounted () {
    this.src = this.url
    this.evtHub.$emit("image-loaded")
  },
  destroyed () {
    this.evtHub.$off("image-added")
  }
}
</script>

<style scoped>
.image-container {
  overflow: hidden;
  position: absolute;
  display: inline-block;
  text-align: center;
  padding: 5px;
  transition: transform 0.25s;
}
img {
  display: inline-block;
  cursor: pointer;
}
img.portrait {
  height: 100%;
  max-width: 100%;
}
img.landscape {
  height: 100%;
  min-width: 100%;
}
.highlight{
  background-color: white;
  height: 100%;
  width: 100%;
  box-shadow: 0 0 3px -2px black;
}
.highlight img:hover {
  opacity: 0.6;
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
  animation: spin 1s linear infinite;
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
