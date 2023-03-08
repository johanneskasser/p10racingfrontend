<template>
  <div class="vue-template">
    <div class="dashboard-header">
      <h1 class="title"><b>Hello, {{this.user.username}}</b></h1>
    </div>
    <div class="sections">
      <div class="section">
        <h2 class="section-header">Welcome to P10 Racing</h2>
        <div class="output-container">
          <p>P10 Racing takes a new approach to enjoying Formula 1 racing.<br> More excitement through a new way of looking at things. P10 Racing is about taking a closer look at the midfield of the paddock instead of betting on the first and best drivers. This is where it gets really exciting. Every week, before a Grand Prix starts, P10 Racing players have to make a bet on who will finish the race in 10th place this weekend. The one who guesses it gets 20 points. Additional points will be given to those who guess the first DNF. On Monday after each race the points will be evaluated and saved. Add you colleagues and compete against them.<br>
            Developed by: <a href="mailto:johanneskasser@outlook.de">Johannes Kasser</a></p>
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
        <p><b>Next Bet Voting starts in:</b></p>
        <p><b>{{bet_days}}</b> days, <b>{{bet_hours}}</b> hours, <b>{{bet_minutes}}</b> minutes, <b>{{bet_seconds}}</b> seconds.  </p>
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
      <div class="section-right">
        <h2 class="section-header">Your Friends:</h2>
        <div class="output-container">
          <table class="table table-striped" v-if="friendsLists">
            <thead>
              <tr>
                <th>Username</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in this.friendsLists" :key="user.username">
                <td>{{user.username}}</td>
                <td>{{ user.points }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="!friendsLists">
            <p>Looks like, you have not added Friends yet! :(</p>
          </div>

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
      add_friend_error_message: '',
      bet_days: '',
      bet_hours: '',
      bet_minutes: '',
      bet_seconds: '',
      bet_startDate: '',
      intervalId: null
    }
  },
  async beforeMount() {
    try {
      const upcomingRaceInfo = await axios.get('/getCurrentRound')
      this.roundNr = upcomingRaceInfo.data.raceNr
      this.grandPrix = upcomingRaceInfo.data.raceName
    } catch (e) {
      const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
      const nextRace = new Date(e.response.data.nextRaceDate)
      this.bet_startDate = new Date(nextRace.getTime()- oneWeekMs);
      this.intervalId = setInterval(this.updateCountdown, 1000)

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
    try {
      const currentUser = await axios.get('/getFriends', {
        params: {
          _id: this.user._id
        }
      })
      this.friendsLists = currentUser.data
      console.log(this.friendsLists)
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
    },
    updateCountdown() {
      const now = new Date();
      const difference = this.bet_startDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(this.intervalId);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      this.bet_days = days;
      this.bet_hours = hours;
      this.bet_minutes = minutes;
      this.bet_seconds = seconds;

      if(days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
        this.$forceUpdate()
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

.section-right {
  float: right;
  height: 100%;
  flex: 1 1 100%;
  max-width: 250px;
  margin: 20px;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 0.8vw;
  width: 50%;
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
  padding: 1vh;
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