<template>
  <v-card height="100%" class="pa-4" @click="$emit('close')" style="overflow: hidden !important;">
    <!--if-->
    <v-container fluid class="white--text" v-if="this.$vuetify.breakpoint.xs">
      <v-row class="pa-0 ma-0 primary">
        <v-col align-self="center">
          <v-row justify="center">
            <v-col class="ma-0 pa-0 title">
              <p class="display-2" >{{selectedRoom.name}}</p>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-divider class="white"></v-divider>
      <v-row class="pa-0 ma-0 half primary">

        <v-flex xs12>
        <v-col align-self="center">
          <v-row justify="center" class="title font-weight-bold">Senha Anterior: {{type(selectedRoom.previos_ticket) ===  'PRIORITY'? 'Preferencial' : type(selectedRoom.previos_ticket)}}</v-row>
          <v-row justify="start">
            <v-col class="ma-0 pa-0">
              <p v-if="selectedRoom.previos_ticket" style="font-weight: bold; font-size: x-large">{{selectedRoom.previos_ticket}}</p>
              <p v-else style="font-weight: bold">*</p>
            </v-col>
          </v-row>
          <v-divider class="white"></v-divider>
        </v-col>
        </v-flex>

        <v-flex xs12>
        <v-col align-self="center">
          <v-row justify="center" class="title font-weight-bold">Senha Atual: {{type(selectedRoom.current_ticket) ===  'PRIORITY'? 'Preferencial' : type(selectedRoom.current_ticket)}}</v-row>
          <v-row justify="start">
            <v-col class="ma-0 pa-0">
              <v-expand-x-transition>
                <p v-show="expand" v-if="selectedRoom.current_ticket" style="font-weight: bold; font-size: x-large; color: deeppink">{{ (selectedRoom.current_ticket) }}</p>
              </v-expand-x-transition>
              <v-expand-x-transition>
                <p v-show="!expand" v-if="selectedRoom.current_ticket" style="font-weight: bold; font-size: x-large">{{ selectedRoom.current_ticket }}</p>
              </v-expand-x-transition>
              <p v-if="!selectedRoom.current_ticket" style="font-weight: bold">*</p>
            </v-col>
          </v-row>
          <v-divider class="white"></v-divider>
        </v-col>
        </v-flex>

        <v-flex xs12>
        <v-col align-self="center" xs="12">
          <v-row justify="center" class="title font-weight-bold">Proxima Senha Normal</v-row>
          <v-row justify="start">
            <v-col class="ma-0 pa-0" xs="12">
              <p v-if="sector.next_ticket_normal" style="font-weight: bold; font-size: x-large">{{sector.next_ticket_normal}}</p>
              <p v-else style="font-weight: bold">*</p>
            </v-col>
          </v-row>
          <v-divider class="white"></v-divider>
        </v-col>
        </v-flex>

        <v-flex xs12>
        <v-col align-self="center" >
          <v-row justify="center" class="title font-weight-bold">Proxima Senha Preferencial</v-row>
          <v-row justify="start">
            <v-col class="ma-0 pa-0">
              <p v-if="sector.next_ticket_priority" style="font-weight: bold; font-size: x-large">{{sector.next_ticket_priority}}</p>
              <p v-else style="font-weight: bold">*</p>
            </v-col>
          </v-row>
          <v-divider class="white"></v-divider>
        </v-col>
        </v-flex>

      </v-row>
    </v-container>
    <!--end if-->
    <!--else-->
    <v-container fluid class="white--text" v-else>
      <v-row class="pa-0 ma-0 half primary">
        <v-col align-self="center">
          <v-row justify="center">
            <v-col class="ma-0 pa-0">
              <p style="font-size: 6em;">{{selectedRoom.name}}</p>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-divider class="white"></v-divider>
      <v-row class="pa-0 ma-0 half primary">

        <v-col align-self="center">
          <v-row justify="center" class="display-2">Senha Anterior: {{type(selectedRoom.previos_ticket) ===  'PRIORITY'? 'Preferencial' : type(selectedRoom.previos_ticket)}}</v-row>
          <v-row justify="start">
            <v-col class="ma-0 pa-0">
              <p v-if="selectedRoom.previos_ticket" style="font-size: 7em;">{{selectedRoom.previos_ticket}}</p>
              <p v-else style="font-size: 5em;">*</p>
            </v-col>
          </v-row>
        </v-col>

        <v-divider class="white" vertical></v-divider>

        <v-col align-self="center">
          <v-row justify="center" class="display-2">Senha Atual: {{type(selectedRoom.current_ticket) ===  'PRIORITY'? 'Preferencial' : type(selectedRoom.current_ticket)}}</v-row>
          <v-row justify="start">
            <v-col class="ma-0 pa-0">
              <v-expand-x-transition>
                <p v-show="expand" v-if="selectedRoom.current_ticket" style="font-size: 7em;color: deeppink">{{selectedRoom.current_ticket}}</p>
              </v-expand-x-transition>
              <v-expand-x-transition>
                <p v-show="!expand" v-if="selectedRoom.current_ticket" style="font-size: 7em;">{{selectedRoom.current_ticket}}</p>
              </v-expand-x-transition>
              <p v-if="!selectedRoom.current_ticket" style="font-size: 5em;">*</p>
            </v-col>
          </v-row>
        </v-col>

        <v-divider class="white" vertical></v-divider>

        <v-col align-self="center">
          <v-row justify="center" class="display-2">Proxima Senha Normal</v-row>
          <v-row justify="start">
            <v-col class="ma-0 pa-0">
              <div v-if="selectedRoom.next_ticket_normal">
                <p v-if="selectedRoom.next_ticket_normal" style="font-size: 7em;">{{selectedRoom.next_ticket_normal}}</p>
                <p v-else style="font-size: 5em;">*</p>
              </div>
              <div v-if="!selectedRoom.next_ticket_normal">
                <p v-if="sector.next_ticket_normal" style="font-size: 7em;">{{sector.next_ticket_normal}}</p>
                <p v-else style="font-size: 5em;">*</p>
              </div>
            </v-col>
          </v-row>
        </v-col>

        <v-divider class="white" vertical></v-divider>

        <v-col align-self="center">
          <v-row justify="center" class="display-2">Proxima Senha Preferencial</v-row>
          <v-row justify="start">
            <v-col class="ma-0 pa-0">
              <div v-if="selectedRoom.next_ticket_priority">
                <p v-if="selectedRoom.next_ticket_priority" style="font-size: 7em;">{{selectedRoom.next_ticket_priority}}</p>
                <p v-else style="font-size: 5em;">*</p>
              </div>
              <div v-if="!selectedRoom.next_ticket_priority">
                <p v-if="sector.next_ticket_priority" style="font-size: 7em;">{{sector.next_ticket_priority}}</p>
                <p v-else style="font-size: 5em;">*</p>
              </div>
            </v-col>
          </v-row>
        </v-col>

      </v-row>
      <br/><br/><br/><br/>
      <v-row justify="center">
        <v-card flat>
          <img :src="constants.ASSETS.logo" height="200px" />
        </v-card>
      </v-row>
    </v-container>
    <!--end else-->
  </v-card>
</template>

<script>
import constants from "../../utils/constants";

export default {
  name: "SingleVisualizer",
  props: ["selectedRoom", "sector"],
  data() {
    return {
      test: true,
      hour: moment().format("HH:mm"),
      clockInterval: undefined,
      constants: constants,
      lastTicket: null,
      expand: false,
      old: undefined,
      new: undefined,
    };
  },
  apollo: {
    LoadSectorOnly: {
      query: require("@/graphql/sectors/LoadSectorOnly.gql"),
      variables () {
        return {
          name: this.sector.name,
        }
      },
      update(data){
        this.sector = Object.assign(data.Sector[0])
        //console.log('Sector:', this.sector)
      },
      pollInterval: 300, // ms
    },
    LoadRoomOnly: {
      query: require("@/graphql/rooms/LoadRoomOnly.gql"),
      variables () {
        return {
          name: this.selectedRoom.name,
        }
      },
      update(data){
        this.old = this.selectedRoom.current_ticket
        this.selectedRoom = Object.assign(data.Room[0])
        this.new = this.selectedRoom.current_ticket
        if(this.old !== this.new){
          this.soundAndAnimation();
        }
        //console.log('Room:', this.selectedRoom)
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

  computed: {
    rooms() {
      return this.sector ? this.sector.rooms : [];
    },
    room() {
      return this.rooms[this.selectedRoom.name];
    },
    doctorName() {
      if (this.room.doctor) {
        let names = this.room.doctor.name.split(" ");
        let finalName = "Dr. ";
        for (let name in names) {
          finalName =
            finalName +
            names[name].substring(0, 1) +
            names[name].substring(1, names[name].length).toLowerCase() +
            " ";
        }
        return finalName;
      }
      return "";
    },
    calledTicketsInOrder() {
      return (this.room.tickets
        ? this.room.tickets.filter((ticket) => {
            return ticket.called_at;
          })
        : []
      ).sort((ticketA, ticketB) => {
        return moment(ticketB.called_at).diff(
          moment(ticketA.called_at),
          "seconds"
        );
      });
    },

    currentTicket() {
      const latest = this.calledTicketsInOrder[0];
      if (latest) {
        if (!this.lastTicket || this.lastTicket.number != latest.number) {
          this.animation = "animation";
          setTimeout(() => {
            this.animation = "";
          }, 5000);
          this.lastTicket = latest;
          this.playTicketSound();
        }
        return latest;
      }
      return null;
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
    cardStyleByIndex(index) {
      return index === 0 ? "height: 160px; width: 100%" : "height: 100px";
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
