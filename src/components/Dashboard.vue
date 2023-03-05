<template>
  <div class="vue-template">
    <h1>Hello, {{this.user.username}}</h1>
    <div class="section">
      <h2 class="section-header">Welcome to P10 Racing</h2>
      <div class="output-container">
        <p>Basic Text Output:</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel eros eu libero sollicitudin vestibulum. Nam euismod tristique eros, sed faucibus lorem venenatis sed. Vivamus pharetra, enim sit amet sagittis ullamcorper, elit elit tristique elit, vel fermentum metus leo vitae orci. Sed dapibus sapien euismod mi blandit, vel laoreet nulla consequat. Mauris eget turpis id metus aliquam congue vel eu enim.</p>
      </div>
    </div>
    <div class="section" v-if="grandPrix">
      <form @submit.prevent="handleSubmit">
        <h2 class="section-header">Place your bet</h2>
        <p>Placing bet for <b>{{grandPrix}}</b> - Round Nr.: <b>{{roundNr}}</b></p>
        <div class="input-container">
          <label for="p10in">P10:</label>
          <input type="text" id="p10in" class="form-control form-control-lg" v-model='p10in' placeholder="Drivers Code (e.g. VER for Verstappen)">
          <label for="firstDNFin">First DNF:</label>
          <input type="text" id="firstDNFin" class="form-control form-control-lg" v-model='firstDNFin' placeholder="Drivers Code (e.g. HAM for Hamilton)">
          <button type="submit" class="btn btn-dark btn-lg btn-block button_alignment">Submit</button>
        </div>
      </form>
      <div class="alert alert-danger alert-dismissible fade show" v-if="bet_error">
        <strong> Error!</strong> {{bet_error_message}}
        <button type="button" class="btn-close" data-bs-dismiss="alert" @click="disableButton"></button>
      </div>
    </div>
    <div class="section" v-if="!grandPrix">
      <h2 class="section-header">Place your bet</h2>
      <p>No upcoming races within one week! Please come back later!</p>
      <div class="input-container">
        <label>P10:</label>
        <input type="text" name="text1" disabled>
        <label>First DNF:</label>
        <input type="text" name="text2" disabled>
        <button type="submit" class="btn btn-dark btn-lg btn-block button_alignment" disabled>Submit</button>
      </div>
    </div>
    <div class="section">
      <h2 class="section-header">Your Points:</h2>
      <div class="input-container">
        <p id="currentPoints">{{userPoints}}</p>
      </div>
    </div>
    <div class="section">
      <h2 class="section-header">Your Friends</h2>
      <div class="input-container">
        <label>Add a new Friend: (username)</label>
        <input type="text" id="ID" name="text1">
      </div>
    </div>
  </div>


</template>

<script>
import {mapGetters} from "vuex";
import axios from '../axios'

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters({
      user: 'user'
    })
  },
  data() {
    return {
      roundNr: '',
      grandPrix: '',
      userPoints: '',
      friendsLists: [],
      p10in:'',
      firstDNFin: '',
      bet_error: false,
      bet_error_message: ''
    }
  },
  async beforeMount() {
    try {
      const upcomingRaceInfo = await axios.get('/getCurrentRound')
      this.roundNr = upcomingRaceInfo.data.raceNr
      this.grandPrix = upcomingRaceInfo.data.raceName
    } catch (e) {
      console.log(e)
    }
    try {
      const user = await axios.get('/searchByUserName', {
        params: {
          username: this.user.username
        }
      })
      this.userPoints = user.data.points
    } catch (e) {
      console.log(e)
    }

  },
  methods: {
    async handleSubmit() {
      try {
        await axios({
          method: 'post',
          url: 'placeBet',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          data: {
            uid: this.user._id,
            p10: this.p10in,
            firstDNF: this.firstDNF
          }
        })

      } catch (e) {
        if(e.response.status === 403) {
          this.bet_error = true
          this.bet_error_message = e.response.data.message
        }
      }
    },
    disableButton(){
      this.bet_error = false
      this.bet_error_message = ''
    }
  }
}
</script>

<style scoped>

.vue-template {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
}

.inner-block {
  width: 90vw;
}

.section {
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 2vw;
  width: 90%;
}

.section-header {
  text-align: center;
  margin-top: 0;
  margin-bottom: 10px;
}

.input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input[type="text"],
textarea {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin-bottom: 10px;
  width: 100%;
}

.output-container {
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 10px;
}

p {
  margin: 0;
  margin-bottom: 10px;
}

</style>