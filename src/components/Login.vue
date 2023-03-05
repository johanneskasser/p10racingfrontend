<template>
  <div class="vue-template">
    <form @submit.prevent="handleSubmit">
      <h3>Login</h3>

      <div class="form-group">
        <label>E-Mail Address</label>
        <input type="email" class="form-control form-control-lg" v-model='email' placeholder="E-Mail Address"/>
      </div>

      <div class="form-group">
        <label>Password</label>
        <input type="password" class="form-control form-control-lg" v-model='password' placeholder="Password"/>
      </div>


      <button type="submit" class="btn btn-dark btn-lg btn-block button_alignment">Login</button>

      <p class="forgot-password text-right mt-2 mb-4">
        <router-link to="/forgot-password">Forgot password ?</router-link>
      </p>
    </form>
    <div class="alert alert-danger alert-dismissible fade show" v-if="error">
      <strong> Error!</strong> Please enter valid login credentials!
      <button type="button" class="btn-close" data-bs-dismiss="alert" @click="disableButton"></button>
    </div>
  </div>

</template>

<script>
import axios from '../axios'

export default {
  name: "Login",
  data() {
    return {
      email: '',
      password: '',
      error: false
    }
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await axios({
          method: 'post',
          url: 'login',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          data: {
            email: this.email,
            password: this.password
          }
        })
        await this.$store.dispatch('setUser', response.data)
        this.error = false
        //console.log(response)
        //localStorage.setItem('token', response.data.token)
        await this.$router.push('/dashboard')
      } catch (e) {
        this.error = true
      }
    },
    disableButton(){
      this.error = false
    }
  }
}
</script>

<style scoped>

</style>