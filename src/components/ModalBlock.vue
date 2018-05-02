<template>
  <transition name="fade">
    <div v-if="active" class="modal-container">
      <div class="modal-content">
        <div class="modal-body" v-on:click="closeImage($event)">
          <img v-bind:src="src" v-on:click.stop="nextImage()">
        </div>
      </div>
      <div class="modal-close" v-on:click="closeImage($event)">
        <span>x</span>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "modal-block",
  props: {
  },
  data () {
    return {
      active: false,
      src: "",
      img: {},
      idx: 0,
    }
  },
  computed: {
  },
  methods: {
    showImage: function (img, imgIndex) {
      this.idx = imgIndex
      this.img = img
      this.src = img.sizes.lrg
      this.active = true
    },
    closeImage: function (evt) {
      this.active = false
    },
    nextImage: function () {
      this.evtHub.$emit("get-next-image", this.img, this.idx + 1)
    },
  },
  created () {
    this.evtHub.$on("view-full-size", this.showImage)
  },
  destroyed () {
    this.evtHub.$off("view-full-size")
  }
}
</script>

<style scoped>
.modal-container {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
}
.modal-content {
  height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-body {
  height: 100%;
  width: 100%;
  flex: 0 1 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-body img {
  max-height: 100%;
  max-width: 100%;
}
.modal-close {
  font-size: 30pt;
  color: rgba(255,255,255,.9);
  cursor: pointer;
  align-self: flex-start;
  padding-right: 10px;
  padding-top: 0px;
  position: fixed;
  top: 0;
  right: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
