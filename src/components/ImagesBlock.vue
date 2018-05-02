<template>
  <div class="images-block-root">
    <div v-show="!loading" class="images-block" v-bind:style="style_object">
      <div class="images-header">
        <h3>{{ title }}</h3>
        <span v-on:click="goBack" class="vue-button">Back</span>
      </div>
      <div v-if="image_count > 0" class="images" v-bind:style="container_style">
        <transition-group
          name="images"
          v-on:beforeEnter="beforeEnter"
          v-on:enter="enter">
          <images-single 
            v-for="(img,index) in displayed_images" 
            v-bind:key="img[0].id"
            v-bind:image="img[0]"
            v-bind:idx="img[2].key"
            v-bind:data-index="index"
            v-bind:row_used="row_used"
            v-bind:position="img[2]"
            v-bind:min_height="min_height"
            ref="image">
          </images-single>
        </transition-group>
      </div>
      <div v-else class="images">
        <p>There are no images to show</p>
      </div>
    </div>
    <transition name="fade">
      <div v-show="loading" class="loader-container">
        <span class="loader"></span>
      </div>
    </transition>
  </div>
</template>

<script>
import ImagesSingle from "./ImagesSingle.vue"

export default {
  name: "images-block",
  props: {
    grid_width: Number,
    images_source_type: String,
    images_source: [String, Array],
    title: String,
    image_count: [Number, String],
  },
  data () {
    return {
      margin: {
        left: 100,
        right: 100,
        bottom: 50,
        top: 50
      },
      min_height: 275,
      row_used: 0,
      row: 0,
      images: [],
      displayed_images: [],
      scroll_position: window.innerHeight + window.scrollY,
      block_bottom: 0,
      current_row: [],
      loading: true,
    }
  },
  methods: {
    // set the image variable with data from server
    setImages (imageData) {
      imageData.then((res) =>  {
        this.displayImages(res.images)
      })
    },
    // sort the images by the upload date
    displayImages (imgs) {
      for (let idx in imgs) {
        let s = this.getAdjustedSize(imgs[idx])
        s.position = this.getPosition(s)
        s.key = parseInt(idx)
        this.current_row.push(s)
        if (this.checkViewable(s.position)) {
          this.displayed_images.push([imgs[idx], new Date(imgs[idx].upload_date), s])
          this.placeholder.splice(idx, 1)
          this.evtHub.$emit("image-added", Date.now())
          if (s.key === imgs.length - 1) {
            this.block_bottom += s.adj_height
          } 
        } else {
          this.images.push([imgs[idx], new Date(imgs[idx].upload_date), s])
        }
      }
    },
    loadImages () {
      let imgs = this.images
      imgs.forEach((v, i) => {
        if (vm.checkViewable(v[2].position)) {
          this.displayed_images.push(v)
          if (v[2].position.left === 0) {
            this.block_bottom += v[2].adj_height
          }
          this.images.splice(i, 1)
        }
      })
    },
    checkViewable (position) {
      return position.top < (window.innerHeight + window.scrollY)
    },
    getPosition (s) {
      let left = this.current_row.reduce((sum, v) => {
        return sum + v.adj_width
      }, 0)
      if ((this.width - left) / s.adj_width > 0.5 && (this.width - left) / s.adj_width < 1) {
        // end of row, scale down the current row
        s.adj_width = this.width - left
      } else if (left + s.adj_width > this.width) {
        // end of row reached, scale up current row.
        let h = this.scaleRowUp(left)
        // start new row with this image.
        left = 0
        this.row++
        this.current_row = []
        this.block_bottom += h
      }
      return {top: this.block_bottom, left: left}
    },
    scaleRowUp (w) {
      let space = this.width - w
      let vm = this
      let new_height = this.min_height
      let new_left = 0 
      this.current_row.forEach((v) => {
        let p = v.adj_width / vm.width
        v.adj_width += Math.floor(p * space)
        v.adj_height = Math.floor(v.adj_width / v.ratio)
        new_height = (vm.min_height > v.adj_height) ? vm.min_height : v.adj_height
        v.position.left = new_left
        new_left += v.adj_width
        vm.displayed_images[v.key][2] = v
      })
      return new_height
    },
    // calculate remaining space in the current row
    rowWidth () {
      let used = this.current_row.reduce((sum, v) => {
        return sum + v.adj_width
      }, 0)
      return this.width - used
    },
    getAdjustedSize (i) {
      return {
        ratio: i.ratio,
        adj_width: Math.floor(this.min_height * i.ratio),
        adj_height: Math.floor(this.min_height)
      }
    },
    checkScrollPosition (evt) {
      let new_position = window.scrollY + window.innerHeight
      if (this.images.length > 0) {
        let change = this.scroll_position - new_position
        if (change < 0) {
          this.loadImages()
        } 
      }
      this.scroll_position = new_position
    },
    // emit event to with the 'next' image to the Modal
    sendImage (img, imgIdx) {
      let nextImg
      if (imgIdx === this.displayed_images.length) {
        nextImg = this.displayed_images[0]
        imgIdx = 0
      } else {
        nextImg = this.displayed_images[imgIdx]
      }
      this.evtHub.$emit("view-full-size", nextImg[0], imgIdx)
    },
    beforeEnter (el) {
      el.style.opacity = 0
    },
    enter (el, done) {
      let d = el.dataset.index * 100
      setTimeout(() => {
        el.style.opacity = 1
      }, d)
    },
    imagesLoaded () {
      this.loading = false
    },
    // browse back to the album list page
    goBack () {
      this.evtHub.$emit("back-to-albums")
    },
  },
  computed: {
    item_width () {
      return this.width / this.grid_width
    },
    width () {
      return (window.innerWidth - this.margin.left - this.margin.right)
    },
    height () {
      return this.width * (4 / 3)
    },
    placeholder () {
      let count = parseInt(this.image_count)
      let p = []
      let w = this.width / 5
      let counter = 0
      for (let i = 0; i < count; i++) {
        if (i % 5 === 0 && i > 0) {
          counter++
        }
        let t = {
          style: {
            top: `${this.min_height * Math.floor(i / 5)}px`,
            left: `${w * (i - 5 * counter)}px`,
            width: `${w}px`,
            height: `${this.min_height}px`,
          }
        }
        p.push(t)
      }
      return p
    },
    container_style () {
      return {
        height: `${this.block_bottom}px`,
        width: "100%"
      }
    },
    style_object () {
      return {
        marginLeft: `${this.margin.left}px`,
        marginRight: `${this.margin.right}px`,
        marginTop: `${this.margin.top}px`,
        marginBottom: `${this.margin.bottom}px` 
      }
    },
  },
  watch: {
  },
  components: {
    ImagesSingle
  },
  created () {
    this.evtHub.$on("get-next-image", this.sendImage)
    this.evtHub.$on("images-loaded", this.imagesLoaded)
  },
  mounted () {
    window.addEventListener("scroll", this.checkScrollPosition)
    let imageData = fetch(this.images_source).then(res => res.json())
    this.setImages(imageData)
  },
  destroyed () {
    this.evtHub.$off("get-next-image")
    window.removeEventListener("scroll", this.checkScrollPosiiton)
  }
}
</script>

<style scoped>
.images-block-root {
  width: 100%;
  height: 100%;
}
.images-block { 
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow: hidden;
  flex: 1 0 100%;
}
.images-block .images-header {
  flex: 1 0 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.images-block .images {
  display: block;
  position: relative;
}
.vue-button {
  display: inline-block;
  background-color: var(--color-main);
  border: 3px solid var(--color-main);
  padding: 5px 10px;
  height: auto;
}
.vue-button:hover {
  cursor: pointer;
  background-color: var(--color-light);
}
.vue-button:active, .vue-button:focus {
  background-color: var(--color-main);
  opacity: 0.75;
  outline: none;
}
.loader {
  display: flex;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--color-main);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
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
.images-enter-active {
  transition: all 1s;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-leave-to {
  opacity: 0;
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
