<template>
  <div class="image-container" style="" :class="gridClass" >
    <span v-if="!src" class="loader"></span>
    <img 
      v-else 
      :data-src="image.url" 
      :src="image.url" 
      @:click="viewFullSize($event)"
      :class="sizeClass">
  </div>
</template>

<script>
export default {
  name: 'images-single2',
  props: {
    image: Object,
  },
  data () {
    return {
      sizeClass: "full-height",
      gridClass: undefined,
    }
  },
  computed: {
    src () {
      return this.image.url
    }
  },
  methods: {
    imageRatio () {
      // image is portrait, change the sizing class
      if (this.image.ratio < 1) {
        this.sizeClass = 'full-width'
      }
    },
    imageSpan () {
      let pw = this.$paretn.width
      if (this.image.width / pw >= 0.75) {
        this.gridClass = 'grid-span-3'
      } else if (this.image.width / pw >= 0.4 && this.image.width / pw <= 0.6) {
        this.gridClass = 'grid-span-2'
      }
    },
    viewFullSize (evt) {
    },
  },
  created () {
    console.log(this)
    this.imageRatio()
    this.imageSpan()
  }
}
</script>

<style>
.image-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.image-container .full-height {
  height: 100%;
  width: auto;
}
.image-container .full-width {
  height: auto;
  width: 100%;
}
.grid-span-2 {
  grid-column-span: span 2;
}
.grid-span-3 {
  grid-column-span: span 3;
}
.image-container:hover {
  transform: scale(1.25);
  overflow: visible;
}
</style>
