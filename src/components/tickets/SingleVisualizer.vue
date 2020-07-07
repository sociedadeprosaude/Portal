<template>
  <v-card height="100%" class="pa-4" @click="$emit('close')" style="overflow: hidden !important;">
    <v-container fluid class="one white--text">
      <v-row class="ml-2 indigo--text text--darken-4 font-weight-bold">
        <p style="font-size: 2em;">Últimas senhas</p>
      </v-row>

      <v-row justify="center">
        <v-col
          class="py-2 px-0"
          cols="12"
          v-for="(ticket, index) in calledTicketsInOrder.slice(1,5)"
          :key="index"
        >
          <v-card elevation="0" :color="index%2 != 0? 'grey lighten-2':'grey lighten-4'">
            <v-row>
              <v-col align-self="center" class="font-weight-bold">
                <p style="font-size: 2em;">senha</p>
              </v-col>
              <v-col class="indigo--text text--darken-4 font-weight-bold">
                <p style="font-size: 4em;">{{ticket.number}}</p>
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
    </v-container>
    <v-container fluid class="two white--text">
      <v-row class="pa-0 ma-0 half">
        <v-col align-self="center">
          <v-row justify="center" class="display-2">{{removeNumbers( selectedRoom.name)}}</v-row>

          <v-row justify="center">
            <v-col sm="6" md="4" lg="3" xl="2" class="ma-0 pa-0">
              <p style="font-size: 6em;">{{onlyNumbers(selectedRoom.name)}}</p>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-divider class="white"></v-divider>
      <v-row class="pa-0 ma-0 half">
        <v-col align-self="center">
          <v-row justify="center" class="display-1">Senha</v-row>

          <v-row justify="center">
            <v-col sm="6" md="4" lg="3" xl="2" class="ma-0 pa-0">
              <p v-if="currentTicket" style="font-size: 7em;">{{currentTicket.number}}</p>
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
  props: ["selectedRoom", "sector"],
  data() {
    return {
      test: true,
      hour: moment().format("HH:mm"),
      clockInterval: undefined,
      constants: constants,
      animation: "",
      lastTicket: null
    };
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
          this.playTicketSound()
        }
        return latest;
      }
      return null;
    }
  },
  methods: {
    playTicketSound() {
      let sound = new Audio('https://firebasestorage.googleapis.com/v0/b/prosaude-36f66.appspot.com/o/assets%2FCollected%20Coin%20A1.mp3?alt=media&token=57509b64-12aa-4946-9814-42995ac8ab41')
      sound.play()
    },
    cardStyleByIndex(index) {
      return index === 0 ? "height: 160px; width: 100%" : "height: 100px";
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
.animation {
  animation: fade-in 1s infinite;
}

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
