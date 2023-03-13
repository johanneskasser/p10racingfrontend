<template>
  <div class="vue-template">
    <div class="section">
      <form @submit.prevent="handleSubmit">
        <h2 class="section-header">Place your updated bet</h2>
        <p>Placing bet for <b>{{grandPrix}}</b> - Round Nr.: <b>{{roundNr}}</b></p>
        <p>Previous Bet: P10 - <b>{{this.setBet[0].p10.code}}</b> | FirstDNF: <b>{{this.setBet[1].firstDNF.code}}</b></p>
        <div class="input-container">
          <label for="p10in">P10:</label>
          <input type="text" id="p10in" class="form-control form-control-lg" v-model='p10in' placeholder="Drivers Code (e.g. VER for Verstappen)" required>
          <label for="firstDNFin">First DNF:</label>
          <input type="text" id="firstDNFin" class="form-control form-control-lg" v-model='firstDNFin' placeholder="Drivers Code (e.g. HAM for Hamilton)" required>
          <button type="submit" id="btn_submit_bet" class="btn btn-dark btn-lg btn-block button_alignment">Update Bet</button>
        </div>
      </form>
      <div class="alert alert-danger alert-dismissible fade show" v-if="bet_error">
        <strong> Error!</strong> {{bet_error_message}}
        <button type="button" class="btn-close" data-bs-dismiss="alert" @click="disableButton"></button>
      </div>
    </div>

  </div>
</template>

<script>
import {mapGetters} from "vuex";
import axios from "../axios";
import buttonService from "../services/buttonService";

export default {
  name: "UpdateBet",
  computed: {
    ...mapGetters({
      user: 'user'
    })
  },
  data() {
    return {
      grandPrix: '',
      bet_error_message: '',
      bet_error: false,
      firstDNFin: '',
      p10in: '',
      setBet: ''
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
      this.bet_startDate = new Date(nextRace.getTime() - oneWeekMs);
      this.intervalId = setInterval(this.updateCountdown, 1000)

    }
    try {
      const betForUser = await axios.get('/getBets', {
        params: {
          uid: this.user._id
        }
      })
      this.setBet = betForUser.data
      console.log(this.setBet)
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
            firstDNF: this.firstDNFin
          }
        })
        let buttonSubmitBet = document.getElementById('btn_submit_bet')
        buttonService.buttonSuccess(buttonSubmitBet)
        await this.$router.push('/dashboard')

      } catch (e) {
        this.bet_error = true
        this.bet_error_message = e.response.data.message

      }
    },
    disableButton() {
      this.bet_error = false
      this.bet_error_message = ''
      this.add_friend_error_message = ''
      this.add_friend_error = false
    }
  }
}
</script>

<style scoped>

</style>