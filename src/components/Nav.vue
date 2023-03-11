<template>
  <nav class="navbar shadow bg-white rounded justify-content-between flex-nowrap flex-row fixed-top">
    <div class="container">
      <div id="btn_navbar" class="navbar-brand float-left"><h1 id="movie" @click="handleClick">P10<span id="match">Racing</span></h1></div>
      <ul class="nav navbar-nav flex-row float-right" v-if="!user">
        <li class="nav-item">
          <router-link to="/" class="btn btn-outline-primary navbar_button">Login</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/register" class="btn btn-outline-primary">Sign Up</router-link>
        </li>
      </ul>
      <ul class="nav navbar-nav flex-row float-right" v-if="user">
        <li class="nav-item">
          <button @click="logout" class="btn btn-outline-primary">Logout</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import {mapGetters} from "vuex";
import axios from '../axios.js'

export default {
  name: "Nav",
  computed: {
    ...mapGetters({user: 'user'})
  },
  methods: {
    async handleClick() {
      if(this.user) {
        await this.$router.push('/dashboard')
      } else {
        await this.$router.push('/')
      }
    },
    async logout() {
      await axios({
        method: 'post',
        url: '/logout',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      })
      await this.$store.dispatch('removeUser', '')
      await this.$router.push('/')
    }
  }
}
</script>

<style scoped>
  #btn_navbar:hover {
    cursor: pointer;
  }
</style>