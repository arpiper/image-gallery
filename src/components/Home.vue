<template>
  <div id="home">
    <!--a href="/">Home</a>
    <a href="/albums" >Albums</a-->
    <navigation></navigation>
    <router-view></router-view>
  </div>
</template>

<script>
import Navigation from './Navigation.vue'

export default {
  name: 'home',
  components: {
    Navigation,
  }
}
</script>

<style>
</style>
