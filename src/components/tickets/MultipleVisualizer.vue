<template>
  <!--if-->
  <v-card class="pa-4" @click="$emit('close')" style="overflow: hidden !important;" v-if="this.$vuetify.breakpoint.xs">
    <div>
    <v-container fill-height fluid class="white--text align-center justify-center">
      <v-row class="ml-2 indigo--text text--darken-4 font-weight-bold align-center justify-center">
        <p style="font-size: 1em;">Últimas Senhas</p>
      </v-row>
      <v-row justify="center">
        <v-col
            class="py-3 px-2"
            cols="12"
            xs="12"
            v-for="(ticket, index) in sector.has_rooms"
            :key="index"
        >
          <v-card elevation="1" :color="index%2 != 0? 'grey lighten-2':'grey lighten-4'">
            <v-row>
              <v-col xs="12" cols="12" class="font-weight-bold" :style="[type(ticket.current_ticket) === 'PRIORITY' ?'color: rgb(35, 151, 118);':'color:#1A237E']">
                <p style="font-size: 2em;">{{ticket.name}}</p>
              </v-col>
              <v-col align-self="center" class="font-weight-bold">
                <v-expand-transition>
                  <p v-show="expand" v-if="ticket.current_ticket" style="font-size: 2em; color: deeppink">Senha {{ (type(ticket.current_ticket)) === 'normal' ? 'Normal' : 'Preferencial'}} {{ticket.current_ticket}}</p>
                </v-expand-transition>
                <v-expand-transition>
                  <p v-show="!expand" v-if="ticket.current_ticket" style="font-size: 2em;">Senha {{ (type(ticket.current_ticket)) === 'normal' ? 'Normal' : 'Preferencial'}} {{ticket.current_ticket}}</p>
                </v-expand-transition>
                <p v-if="!ticket.current_ticket" style="font-size: 2em;">Senha *</p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    </div>
  </v-card>
  <!--else-->
  <v-card class="pa-4" @click="$emit('close')" style="overflow: hidden !important;" v-else>
    <v-container fill-height fluid class="one white--text">
      <v-row class="ml-2 indigo--text text--darken-4 font-weight-bold">
        <p style="font-size: 2em;">Últimas senhas</p>
      </v-row>
      <v-row justify="center">
        <v-col
            class="py-2 px-0"
            cols="12"
            v-for="(ticket, index) in rooms"
            :key="index"
        >
          <v-card elevation="0" :color="index%2 != 0? 'grey lighten-2':'grey lighten-4'" height="125">
            <v-row>
              <v-col class="font-weight-bold" :style="[type(ticket.current_ticket) === 'PRIORITY' ?'color: rgb(35, 151, 118);':'color:#1A237E']">
                <p style="font-size: 4em;">{{ticket.name}}</p>
              </v-col>
              <v-col align-self="center" class="font-weight-bold">
<!--                <v-expand-transition>
                <p v-show="expand" v-if="ticket.current_ticket" style="font-size: 3em; color: deeppink">SENHA {{ (type(ticket.current_ticket)) === 'normal' ? 'Normal' : 'Preferencial'}} {{ticket.current_ticket}}</p>
                </v-expand-transition>
                <v-expand-transition>
                  <p v-show="!expand" v-if="ticket.current_ticket" style="font-size: 3em;">SENHA {{ (type(ticket.current_ticket)) === 'normal' ? 'Normal' : 'Preferencial'}} {{ticket.current_ticket}}</p>
                </v-expand-transition>-->
                <p v-if="ticket.current_ticket" style="font-size: 3em;">SENHA {{ (type(ticket.current_ticket)) === 'normal' ? 'Normal' : 'Preferencial'}} {{ticket.current_ticket}}</p>
                <p v-else style="font-size: 5em;">SENHA *</p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center" v-if="size_off <= 5">
        <v-card flat>
          <img :src="constants.ASSETS.logo" height="124px" />
        </v-card>
      </v-row>
    </v-container>
    <v-container fluid class="white--text">
      <div v-if="room.length > 0">
        <div v-for="(ticket, index) in room" :key="index">
        <v-row class="pa-0 ma-0 half primary">
          <v-col align-self="center">
            <v-row justify="center">
              <v-col class="ma-0 pa-0">
                <p style="font-size: 6em;">{{ticket.name}}</p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="pa-0 ma-0 half primary">
          <v-col align-self="center">
            <v-row
                justify="center"
                class="display-2"
            >SENHA {{ (type(ticket.current_ticket)) === 'normal' ? 'Normal' : 'Preferencial'}} </v-row>
            <v-row justify="center">
              <v-col class="ma-0 pa-0">
                <v-expand-transition>
                  <p v-show="expand" v-if="ticket.current_ticket" style="font-size: 5em; color: deeppink">{{ticket.current_ticket}}</p>
                </v-expand-transition>
                <v-expand-transition>
                  <p v-show="!expand" v-if="ticket.current_ticket" style="font-size: 5em;">{{ticket.current_ticket}}</p>
                </v-expand-transition>
                <p v-if="!ticket.current_ticket" style="font-size: 5em;">*</p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        </div>
      </div>
      <div else>
        <v-row justify="center">
          <v-card flat>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <img :src="constants.ASSETS.logo" height="175px"/>
          </v-card>
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
        this.size_off = this.sector.has_rooms.length
        this.room = this.sector.has_rooms.filter(a => {
          return a.show === true;
        });
        this.rooms = this.sector.has_rooms.filter(a => {
          return a.show === false;
        });
        let rooms  = this.sector.has_rooms
        for (let room in rooms ){
          if(rooms[room].show === true){
            this.room[0].expand = false
            this.soundAndAnimation();
          }
        }
        //console.log('true apollo', this.room)
        //console.log('false apollo', this.rooms)
      },
      pollInterval: 150, // ms
    },
  },
  mounted() {
/*    this.size_off = this.sector.has_rooms.length
    this.room = this.sector.has_rooms.filter(a => {
      return a.show === true;
    });
    this.rooms = this.sector.has_rooms.filter(a => {
      return a.show === false;
    });
    let rooms  = this.sector.has_rooms
    for (let room in rooms ){
      if(rooms[room].show === true){
        this.room[0].expand = false
        this.soundAndAnimation();
      }
    }
    console.log('true mounted', this.room)
    console.log('false mounted', this.rooms)*/
/*    this.clockInterval = setInterval(() => {
      this.$nextTick(() => {
        this.hour = moment().format("HH:mm");
      });
    }, 1000);
    window.addEventListener("beforeunload", () => {
      clearInterval(this.clockInterval);
    });*/
  },
  data() {
    return {
      hour: moment().format("HH:mm"),
      clockInterval: undefined,
      constants: constants,
      lastRoomCalled: null,
      animation: "",
      playingAudio: false,
      size_off: undefined,
      room: undefined,
      rooms: undefined,
      expand: false,
      old: undefined,
      new: undefined,
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
/*    rooms() {
      return this.sector ? this.sector.rooms : [];
    },*/
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
          return tikets[t].type
        }
      }
    },
    soundAndAnimation(){
      this.playTicketSound();
      this.expand = true;
      setTimeout(() => {
        this.expand = false;
      }, 15000);
    },
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