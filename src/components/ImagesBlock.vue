<template>
  <div class="images-block-root">
    <div v-show="!loading" class="images-block" v-bind:style="style_object">
      <div class="images-header">
        <h3>{{ title }}</h3>
        <span @click="goBack" class="vue-button">Back</span>
      </div>
      <div class="images" v-bind:style="container_style" ref="images">
        <images-single 
          v-for="(img,index) in displayed_images" 
          :key="img[0].id"
          :idx="img[2].key"
          :data-index="index"
          :image="img[0]"
          :row_used="row_used"
          :position="img[2]"
          :init_height="init_height"
          ref="image">
        </images-single>
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
import { mapGetters } from "vuex"

export default {
  name: "images-block",
  props: {
    grid_width: Number,
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
      init_height: 325,
      row_used: 0,
      row: 0,
      images: [],
      displayed_images: [],
      scroll_position: window.innerHeight + window.scrollY,
      block_bottom: 0,
      block_height: 0,
      current_row: [],
      loading: true,
      title: this.$route.params.name,
    }
  },
  methods: {
    // get the images from api server
    getImages (imageData) {
      fetch(this.source).then(res => {
        return res.json()
      }).then((res) =>  {
        this.title = res.album.name
        this.displayImages(res.images)
      })
    },
    // sort the images by the upload date and place into relavent array displayed/images
    displayImages (imgs) {
      imgs.forEach((v,i) => {
        let image_size = this.getAdjustedSize(v)
        image_size.position = this.getPosition(image_size, v)
        image_size.key = i
        this.current_row.push(image_size)
        // check whether image is in the viewable area
        if (this.checkViewable(image_size.position)) {
          this.displayed_images.push([v, new Date(v.upload_date), image_size])
          //this.evtHub.$emit("image-added", Date.now())
          if (image_size.key === imgs.length - 1) {
            // set proper height when no scrolling needed.
            this.block_bottom += image_size.adj_height
          }          
          if (image_size.position.left === 0) {
            this.block_height += image_size.adj_height
          }
        } else {
          this.images.push([v, new Date(v.upload_date), image_size])
        }
      })
    },
    // load more images as they scroll into view.
    loadImages () {
      this.images.forEach((v, i) => {
        if (this.checkViewable(v[2].position)) {
          this.displayed_images.push(v)
          if (v[2].position.left === 0) {
            this.block_height += v[2].adj_height
          }
          this.images.splice(i, 1)
        }
      })
    },
    checkViewable (position) {
      return position.top <= (window.innerHeight + window.scrollY)
    },
    getPosition (s, img) {
      let top = this.block_bottom
      let left = this.rowSpaceUsed()
      // can more than half the image fit in space remaining?
      if ((this.width - left) / s.adj_width > 0.5 && (this.width - left) / s.adj_width < 1) {
        // end of row, scale down the current row
        let down = this.scaleRow(left + s.adj_width)
        s.adj_width = this.width - down.l
        s.adj_height = down.h
        this.block_bottom += down.h
        left = down.l
      // is more than half the row remaining, and will be filled?
      } else if (this.width / 2 > left && this.width - left < s.adj_width) {
        s.adj_width = this.width - left
        this.block_bottom += this.init_height
      } else if (this.width - left < s.adj_width) {
        if (this.width < s.adj_width) { // further check for full width image
          s.adj_width = this.width
          this.block_bottom += this.init_height
        } else if (this.width > left) {
          let up = this.scaleRow(left)
          top += up.h
          this.block_bottom += up.h
        }
        left = 0
        this.row++
        this.current_row = []
      }
      return {top: top, left: left}
    },
    // scale the current row up/down in height when next image wont fit.
    scaleRow (row_width) {
      let new_height = Math.floor(this.width / (row_width / this.init_height))
      let new_left = 0
      this.current_row.forEach((v,i) => {
        v.adj_width = Math.floor(v.ratio * new_height)
        v.adj_height = new_height
        v.position.left = new_left
        new_left += v.adj_width
        this.current_row[i] = v
      })
      this.block_height += new_height - this.init_height
      return {h: new_height, l: new_left}
    },
    // calculate remaining space in the current row
    rowSpaceUsed () {
      return this.current_row.reduce((sum, v) => {
        return sum + v.adj_width
      }, 0)
    },
    // create object with calculated size/ratio values for the image
    getAdjustedSize (i) {
      return {
        ratio: i.ratio,
        adj_width: Math.floor(this.init_height * i.ratio),
        adj_height: Math.floor(this.init_height)
      }
    },
    // check if any new images have scrolled into view
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
    // transition functions
    beforeEnter (el) {
      el.style.opacity = 0
    },
    enter (el, done) {
      let d = el.dataset.index * 100
      setTimeout(() => {
        el.style.opacity = 1
      }, d)
    },
    imageLoaded () {
      this.loading = false
    },
    // browse back to the album list page
    goBack () {
      this.$router.go(-1)
    },
  },
  computed: {
    source () {
      if (this.$route.params.name === 'all') {
        return `${this.imagesAllURL}`
      }
      return `${this.imagesURL}${this.$route.params.name}`
    },
    item_width () {
      return this.width / this.grid_width
    },
    width () {
      return (document.body.offsetWidth - this.margin.left - this.margin.right)
    },
    height () {
      return this.width * (4 / 3)
    },
    container_style () {
      return {
        height: `${this.block_height}px`,
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
    ...mapGetters([
      'imagesURL',
      'imagesAllURL',
    ])
  },
  watch: {
  },
  components: {
    ImagesSingle,
  },
  created () {
    this.evtHub.$on("get-next-image", this.sendImage)
    this.evtHub.$on("image-loaded", this.imageLoaded)
  },
  mounted () {
    window.addEventListener("scroll", this.checkScrollPosition)
    this.getImages()
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
  overflow: auto;
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
