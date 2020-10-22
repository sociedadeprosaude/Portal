<template>
  <v-card class="pa-4" @click="$emit('close')" style="overflow: hidden !important;">
    <v-container fill-height fluid class="one white--text">
      <v-row class="ml-2 indigo--text text--darken-4 font-weight-bold">
        <p style="font-size: 2em;">Últimas senhas</p>
        <!--{{sector.has_rooms.length}}-->
      </v-row>
      <v-row justify="center">
        <v-col
            class="py-2 px-0"
            cols="12"
            v-for="(ticket, index) in sector.has_rooms.slice(1,5)"
            :key="index"
        >
          <v-card elevation="0" :color="index%2 != 0? 'grey lighten-2':'grey lighten-4'">
            <v-row>
              <v-col align-self="center" class="font-weight-bold">
                <p
                    v-if="ticket.current_ticket"
                    style="font-size: 2em;"
                >Senha {{type(ticket.current_ticket)}} {{ticket.current_ticket}}</p>
                <p v-else style="font-size: 5em;">Senha *</p>
              </v-col>
              <v-col
                  class="font-weight-bold"
                  :style="[type(ticket.current_ticket) === 'PRIORITY' ?'color: rgb(35, 151, 118);':'color:#1A237E']"
              >
                <p style="font-size: 4em;">{{ticket.name}}</p>
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
    </v-container><!--:class="[lastTicketCalled.preferential?'three':'two', 'white&#45;&#45;text']"-->
    <v-container fluid class="white--text">
      <div v-for="(ticket, index) in sector.has_rooms.slice(0,1)"
           :key="index">
        <v-row class="pa-0 ma-0 half primary">
          <v-col align-self="center">
            <v-row justify="center">
              <v-col class="ma-0 pa-0">
                <p
                    style="font-size: 6em;"
                >{{ticket.name}}</p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <!--<v-divider class="white"></v-divider>-->
        <v-row class="pa-0 ma-0 half primary">
          <v-col align-self="center">
            <v-row
                justify="center"
                class="display-2"
            >Senha {{type(ticket.current_ticket)}} <!--atual--></v-row>
            <v-row justify="center">
              <v-col class="ma-0 pa-0">
                <p v-if="ticket.current_ticket" style="font-size: 7em;">{{ticket.current_ticket}}</p>
                <p v-else style="font-size: 5em;">*</p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-card>
</template>

<script>
import constants from "../../utils/constants";
export default {
  name: "MultipleVisualizer",
  props: ["sector"],
  apollo: {
    LoadRoomsOfSector: {
      query: require("@/graphql/rooms/LoadRoomsOfSector.gql"),
      variables () {
        return {
          name: this.sector.name,
        }
      },
      update(data){
        this.sector = Object.assign(data.Sector[0])
        //console.log('reativo:', this.sector)
      },
      pollInterval: 300, // ms
    },
  },
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
      playingAudio: false,
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
    },
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
        let filteredTickets = this.rooms[room].tickets
            ? this.rooms[room].tickets.filter((ticket) => {
              return ticket.called_at;
            })
            : [];
        for (let ticket in filteredTickets) {
          let formattedTicket = {
            ...filteredTickets[ticket],
            roomName: this.rooms[room].name,
            roomNumber: this.rooms[room].number,
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
          this.playTicketSound();
        }
        return latest;
      }
      return null;
    },
    //Aumentar o splice pra aparecer mais se der numa tela grande
    lastTicketsCalled() {
      return this.calledTicketsInOrder.splice(1, 4);
    },
  },
  methods: {
    type(name){
      let tikets = this.sector.sector_has_tickets
      for (let t in tikets){
        if(tikets[t].name === name){
          return tikets[t].type.toUpperCase()
        }
      }
    },
    /*    last(){
          console.log( this.sector.sector_has_tickets)
          let tikets = this.sector.sector_has_tickets
          let calleds = []
          let not_calleds = []
          for (let t in tikets){
            if(!tikets[t].called_at.formatted){
              this.not_calleds.push(tikets[t])
            } else{
              this.calleds.push(tikets[t])
            }
          }
          console.log('calleds:', calleds)
          console.log('nots:', not_calleds)
        },*/
    playTicketSound() {
      let sound = new Audio(
          "https://firebasestorage.googleapis.com/v0/b/prosaude-36f66.appspot.com/o/assets%2FCollected%20Coin%20A1.mp3?alt=media&token=57509b64-12aa-4946-9814-42995ac8ab41"
      );
      sound.play();
    },
    removeNumbers(str) {
      return str.replace(/[0-9]/g, "");
    },
    onlyNumbers(str) {
      return str.replace(/\D/g, "");
    },
  },
};
</script>

<style scoped>
.one,
.two,
.three {
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
.three {
  background-color: rgb(35, 151, 118);
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