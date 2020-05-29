<template>
  <v-card height="100%" class="pa-4" @click="$emit('close')" style="overflow: hidden !important;">
    <v-container fill-height>
      <v-row align="center" justify="center">
        <v-col sm="4" class="my-4">
          <v-card flat>
            <img :src="constants.ASSETS.logo" height="124px" />
            <p class="font-weight-bold" style="font-size: 6em;">{{selectedRoom.name}}</p>
            <p class="font-weight-bold" style="font-size: 4em;">{{doctorName}}</p>
            <p class="font-weight-bold" style="font-size: 2em;">{{hour}}</p>
          </v-card>
        </v-col>
        <v-col sm="8">
          <v-row>
            <v-col>
              <div class="display-4 text-center">Última senha</div>
            </v-col>
          </v-row>
          <v-row justify="center" v-if="currentTicket">
            <v-col sm="6" md="4" lg="3" xl="2">
              <v-card :class="['primary  white--text',animation]">
                <p style="font-size: 5em;">{{currentTicket.number}}</p>
              </v-card>
            </v-col>
          </v-row>
          <v-row justify="center" v-else>
            <p style="font-size: 5em;">*</p>
          </v-row>

          <v-row justify="center">
            <v-col
              sm="6"
              md="4"
              lg="3"
              xl="2"
              v-for="(ticket, index) in calledTicketsInOrder.slice(1,5)"
              :key="index"
            >
              <v-card class="primary white--text">
                <p style="font-size: 5em;">{{ticket.number}}</p>
              </v-card>
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
  props: ["selectedRoom", "sector"],
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
      animation: "",
      lastTicket: null
    };
  },
  computed: {
    rooms() {
      return this.sector ? this.sector.rooms : []
    },
    room() {
      return this.rooms[this.selectedRoom.name]
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
      return this.room.tickets
        .filter(ticket => {
          return ticket.called_at;
        })
        .sort((ticketA, ticketB) => {
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
        }
        return latest;
      }
      return null;
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
.animation {
  animation: fade-in 1s infinite;
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
