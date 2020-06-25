<template>
  <v-card class="pa-4" @click="$emit('close')" style="overflow: hidden !important;">
    <v-container fill-height fluid class="one white--text">
      <v-row class="ml-2 indigo--text text--darken-4 font-weight-bold">
        <p style="font-size: 2em;">Últimas senhas</p>
      </v-row>

      <v-row justify="center">
        <v-col
          class="py-2 px-0"
          cols="12"
          v-for="(ticket, index) in lastTicketsCalled"
          :key="index"
        >
          <v-card elevation="0" :color="index%2 != 0? 'grey lighten-2':'grey lighten-4'">
            <v-row>
              <v-col align-self="center" class="font-weight-bold">
                <p style="font-size: 2em;">senha {{ticket.number}}</p>
              </v-col>
              <v-col class="indigo--text text--darken-4 font-weight-bold">
                <p style="font-size: 4em;">{{ticket.roomName}}</p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-card flat>
          <img :src="constants.ASSETS.logo" height="124px" />
        </v-card>
      </v-row>
      <!-- <v-row>
        <v-col sm="8">
          <v-card
            v-if="lastTicketCalled"
            :class="['primary  white--text ml-n3',animation]"
            style="height: 160px; width: 100%"
          >
            <v-row justify="center" align="center" style="height: 160px; width: 100%">
              <v-col class="font-weight-bold" style="font-size: 3em">{{lastTicketCalled.roomName}}</v-col>
              <v-col
                class="font-weight-bold"
                style="font-size: 4em"
              >Senha {{lastTicketCalled.number}}</v-col>
            </v-row>
          </v-card>

          <v-card
            v-for="(ticket, index) in lastTicketsCalled"
            style="height: 100px"
            class="my-4 mx-12 primary white--text"
            :key="index"
          >
            <v-row justify="center" align="center" style="height: 100px">
              <v-col class="font-weight-bold" style="font-size: 2em">{{ticket.roomName}}</v-col>
              <v-col class="font-weight-bold" style="font-size: 3em">Senha {{ticket.number}}</v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>-->
    </v-container>
    <v-container fluid class="two white--text">
      <v-row class="pa-0 ma-0 half">
        <v-col align-self="center">
          <v-row justify="center" class="display-2">{{removeNumbers(lastTicketCalled.roomName)}}</v-row>

          <v-row justify="center">
            <v-col sm="6" md="4" lg="3" xl="2" class="ma-0 pa-0">
              <p style="font-size: 6em;">{{onlyNumbers(lastTicketCalled.roomName)}}</p>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-divider class="white"></v-divider>
      <v-row class="pa-0 ma-0 half">
        <v-col align-self="center">
          <v-row justify="center" class="display-1">Senha atual</v-row>

          <v-row justify="center">
            <v-col sm="6" md="4" lg="3" xl="2" class="ma-0 pa-0">
              <p v-if="lastTicketCalled" style="font-size: 7em;">{{lastTicketCalled.number}}</p>
              <p v-else style="font-size: 5em;">*</p>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import constants from "../../utils/constants";

export default {
  name: "SingleVisualizer",
  props: ["sector"],
  mounted() {
    this.clockInterval = setInterval(() => {
      this.$nextTick(() => {
        this.hour = moment().format("HH:mm");
      });
    }, 1000);
    window.addEventListener("beforeunload", () => {
      clearInterval(this.clockInterval);
    });
  },
  data() {
    return {
      hour: moment().format("HH:mm"),
      clockInterval: undefined,
      constants: constants,
      lastRoomCalled: null,
      animation: "",
      playingAudio: false
    };
  },
  watch: {
    lastTicketCalled() {
      // let sound = new Audio('https://firebasestorage.googleapis.com/v0/b/prosaude-36f66.appspot.com/o/assets%2FCollected%20Coin%20A1.mp3?alt=media&token=57509b64-12aa-4946-9814-42995ac8ab41')
      // sound.play()
      // if (!this.playingAudio) {
      //   let sound = new Audio('https://firebasestorage.googleapis.com/v0/b/prosaude-36f66.appspot.com/o/assets%2FCollected%20Coin%20A1.mp3?alt=media&token=57509b64-12aa-4946-9814-42995ac8ab41')
      //   sound.play()
      //   this.playingAudio = true
      //   setTimeout(() => {
      //     this.playingAudio = false
      //   }, 1000)
      // }
    }
  },
  computed: {
    // rooms() {
    //   return this.$store.getters.rooms;
    // },
    rooms() {
      return this.sector ? this.sector.rooms : [];
    },
    doctorName() {
      let names = this.room.doctor.name.split(" ");
      let finalName = "";
      for (let name in names) {
        finalName =
          finalName +
          names[name].substring(0, 1) +
          names[name].substring(1, names[name].length).toLowerCase() +
          " ";
      }
      return finalName;
    },
    calledTicketsInOrder() {
      let tickets = [];
      for (let room in this.rooms) {
        let filteredTickets = this.rooms[room].tickets.filter(ticket => {
          return ticket.called_at;
        });
        for (let ticket in filteredTickets) {
          let formattedTicket = {
            ...filteredTickets[ticket],
            roomName: this.rooms[room].name,
            roomNumber: this.rooms[room].number
          };
          tickets.push(formattedTicket);
        }
      }
      return tickets.sort((ticketA, ticketB) => {
        return moment(ticketB.called_at).diff(
          moment(ticketA.called_at),
          "seconds"
        );
      });
    },
    lastTicketCalled() {
      const latest = this.calledTicketsInOrder[0];
      if (latest) {
        if (
          !this.lastRoomCalled ||
          this.lastRoomCalled.number != latest.number
        ) {
          this.animation = "animation";
          setTimeout(() => {
            this.animation = "";
          }, 5000);
          this.lastRoomCalled = latest;
          this.playTicketSound()
        }
        console.log('latest', latest)
        return latest;
      }
      return null;
    },
    //Aumentar o splice pra aparecer mais se der numa tela grande
    lastTicketsCalled() {
      return this.calledTicketsInOrder.splice(1, 4);
    }
  },
  methods: {
    playTicketSound() {
      let sound = new Audio('https://firebasestorage.googleapis.com/v0/b/prosaude-36f66.appspot.com/o/assets%2FCollected%20Coin%20A1.mp3?alt=media&token=57509b64-12aa-4946-9814-42995ac8ab41')
      sound.play()
    },
    removeNumbers(str) {
      return str.replace(/[0-9]/g, "");
    },
    onlyNumbers(str) {
      return str.replace(/\D/g, "");
    }
  }
};
</script>

<style scoped>
.one,
.two {
  float: left;
  width: 50%;
  min-height: 100vh;
}

.half {
  min-height: 50vh;
}

.strechAll {
  min-height: 100vh;
}

.two {
  background-color: rgb(21, 21, 99);
}
@keyframes fade-in {
  0% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}
</style>
