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
    <div class="login" v-if="!getToken">
      <form @submit.prevent="api_login()">
        <input type="text" name="username" v-model="username" placeholder="username" autocomplete="off">
        <input type="password" name="password" v-model="password" placeholder="password">
        <button class="button">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'navigation',
  data () {
    return {
      username: '',
      password: '',
    }
  },
  computed: {
    ...mapGetters([
      'loginURL',
      'getToken',
    ]),
  },
  methods: {
    api_login (form) {
      let data = {
        username: this.username,
        password: this.password,
      }
      console.log(this.loginURL)
      fetch(`${this.loginURL}`, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST',
      }).then(res => {
        return res.json()
      }).then(res => {
        this.setToken(res.token)
      })
    },
    ...mapMutations([
      'setToken',
    ])
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
  padding: 0 100px;
  justify-content: space-between;
}
.navigation ul {
  height: 100%;
  margin: 0;
  padding: 0;
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
.login {
  display: flex;
  height: 100%;
  align-items: center;
}
.login input,
.login form {
  height: 32px;
}
@media screen and (max-width: 768px) {
  .navigation ul {
    margin-left: 0;
    padding: 0 10px;
  }
}
</style>
