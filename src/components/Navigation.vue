<template>
  <div class="navigation">
    <ul>
      <li>
        <router-link :to="{name: 'home'}">Home</router-link>
      </li>
      <li>
        <router-link :to="{name: 'all_albums'}">Albums</router-link>
      </li>
      <li>
        <router-link :to="{name: 'one_album', params: { name: 'all' }}">
          All Images
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'navigation',
  data () {
    return {
    }
  },
  created () {
  },
}
</script>

<style>
.navigation,
.navigation ul,
.navigation li,
.navigation a {
  display: flex;
  align-items: center;
}
.navigation {
  width: 100%;
  height: 75px;
}
.navigation ul {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  margin-left: 100px;
  list-style: none;
}
.navigation li {
  height: 100%;
  font-size: 1.5em;
  justify-content: center;
}
.navigation a {
  color: var(--color-dark);
  text-decoration: none;
  padding: 10px;
}
.navigation a:hover {
  background-color: var(--color-main-75);
}
@media screen and (max-width: 768px) {
  .navigation ul {
    margin-left: 0;
    padding: 0 10px;
  }
}
</style>
