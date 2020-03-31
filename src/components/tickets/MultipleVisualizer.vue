<template>
  <v-card class="pa-4" @click="$emit('close')" style="overflow: hidden !important;">
    <v-container fill-height fluid>
      <v-row>
        <v-col
          sm="4"
          class="fill-height align-start justify-center"
          style="margin-top: calc(50vh - 124px)"
        >
          <v-card flat>
            <v-flex xs12>
              <img :src="constants.ASSETS.logo" height="124px" />
            </v-flex>
            <v-flex xs12 class="font-weight-bold" style="font-size: 2em;">{{hour}}</v-flex>
          </v-card>
        </v-col>

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
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import constants from "../../utils/constants";

export default {
  name: "SingleVisualizer",
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
      animation: ""
    };
  },
  computed: {
    rooms() {
      return this.$store.getters.rooms;
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
            roomName: this.rooms[room].name
          };
          tickets.push(formattedTicket);
        }
      }
      console.log();
      return tickets.sort((ticketA, ticketB) => {
        return moment(ticketB.called_at).diff(
          moment(ticketA.called_at),
          "seconds"
        );
      });
    },
    lastTicketCalled() {
      const latest = this.calledTicketsInOrder[0];

      if (!this.lastRoomCalled || this.lastRoomCalled.number != latest.number) {
        this.animation = "animation";
        setTimeout(() => {
          this.animation = "";
        }, 5000);
        this.lastRoomCalled = latest;
      }
      return latest;
    },
    lastTicketsCalled() {
      return this.calledTicketsInOrder.splice(0, 8);
    }
  },
  methods: {
    cardStyleByIndex(index) {
      return index === 0 ? "height: 160px; width: 100%" : "height: 100px";
    }
  }
};
</script>

<style scoped>
</style>
