<template>
  <div class="vue-template">
    <div class="dashboard-header">
      <h1 class="title"><b>Hello, {{this.user.username}}</b></h1>
    </div>
    <div class="sections">
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
            <button type="submit" id="btn_submit_bet" class="btn btn-dark btn-lg btn-block button_alignment">Submit</button>
          </div>
        </form>
        <div class="alert alert-danger alert-dismissible fade show" v-if="bet_error">
          <strong> Error!</strong> {{bet_error_message}}
          <button type="button" class="btn-close" data-bs-dismiss="alert" @click="disableButton"></button>
        </div>
      </div>
      <div class="section" v-if="!grandPrix">
        <h2 class="section-header">Place your bet:</h2>
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
        <div class="points-output-container">
          <p id="currentPoints"><b>{{userPoints}}</b></p>
        </div>
      </div>
      <div class="section">
        <h2 class="section-header">Add a new Friend:</h2>
        <div class="input-container">
          <label for="username_friend">Enter Username:</label>
          <form @submit.prevent="handleFriendSubmit">
            <div class="containerForInputandButton">
              <input type="text" id="username_friend" v-model="username_friend" placeholder="Username">
              <button type="submit" id="add_friend_button" class="btn btn-dark input-button">Send</button>
            </div>
          </form>
          <div class="alert alert-danger alert-dismissible fade show" v-if="add_friend_error">
            <strong> Error!</strong> {{add_friend_error_message}}
            <button type="button" class="btn-close" data-bs-dismiss="alert" @click="disableButton"></button>
          </div>
        </div>
      </div>
      <div class="section">
        <h2 class="section-header">Your Friends:</h2>
        <div class="output-container">

        </div>
      </div>
    </div>
  </div>


</template>

<script>
import {mapGetters} from "vuex";
import axios from '../axios'
import buttonService from '../services/buttonService'

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
      bet_error_message: '',
      username_friend: '',
      add_friend_error: false,
      add_friend_error_message: ''
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
        let buttonSubmitBet = document.getElementById('btn_submit_bet')
        buttonService.buttonSuccess(buttonSubmitBet)

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
      this.add_friend_error_message = ''
      this.add_friend_error = false
    },
    async handleFriendSubmit() {
      try {
        await axios({
          method: 'put',
          url: 'addFriend',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          data: {
            requestingFriend: this.user._id,
            requestedFriend: this.username_friend,
          }
        })
        let friendAddButton = document.getElementById('add_friend_button')
        buttonService.buttonSuccess(friendAddButton)
      } catch (e) {
        console.log(e)
        this.add_friend_error = true
        this.add_friend_error_message = e.response.data.message
      }
    }
  }
}
</script>

<style scoped>

.vue-template {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.sections {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 2vh;
}

.inner-block {
  width: 90vw;
}

.dashboard-header {
  display: flex;
  justify-content: center; /* center horizontally */
  align-items: center; /* center vertically */
  height: 5vh; /* set container height to full viewport height */
}

.title {
  font-size: 2.0em;
}

.section {
  flex: 1 1 100%;
  max-width: 500px;
  margin: 20px;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 2vw;
  width: 90%;
}

@media (min-width: 768px) {
  .section {
    flex: 1 1 calc((100% - 60px) / 3);
    margin: 20px 30px;
  }
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
  max-height: 20vh;
  overflow-y: auto;
}

p {
  margin: 0 0 10px;
  font-size: 0.8em;
}

h1 {
  font-size: 0.9em;
}

h2 {
  font-size: 1.5em;
}

.points-output-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

#currentPoints {
  font-size: 1.9em;
  display: inline-block;
}

.containerForInputandButton {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

#username_friend {
  width: 70%;
  padding: 0.5rem;
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid black;
}

.input-button {
  width: 30%;
  padding: 0.4rem;
  font-size: 1rem;
  transition: background-color 0.5s ease;
}

</style>