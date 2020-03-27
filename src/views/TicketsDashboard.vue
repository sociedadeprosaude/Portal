<template>
  <v-container>
    <v-row>
      <v-btn fab @click="back()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-btn v-if="sector" fab @click="close()" class="ml-2">
        <v-icon>mdi-close-outline</v-icon>
      </v-btn>
    </v-row>

    <v-container fill-height v-if="!sector" class="box">
      <v-row align="center" justify="center">
        <v-card
          v-for="sector in sectors"
          :key="sector.title"
          min-width="300"
          min-height="250"
          class="card hidden-xs-only mx-3"
          @click="choose(sector)"
        >
          <v-row align="center" justify="center">
            <v-col cols="12">
              <v-icon size="72" class="mt-10">{{sector.icon}}</v-icon>
            </v-col>
            <v-col cols="12">
              <span class="text-center my-headline">{{sector.title}}</span>
            </v-col>
          </v-row>
        </v-card>
      </v-row>
    </v-container>

    <v-row v-else align="center" justify="center">
      <div>
        <span class="text-center my-headline">{{sector.title}}</span>
        <transition name="slide-fade" mode="out-in" appear>
          <tickets :sector="sector" />
        </transition>
      </div>
    </v-row>
  </v-container>
</template>

<script>
import tickets from "@/components/tickets/Tickets";
export default {
  name: "TicketsDashboard",
  components: {
    tickets
  },

  data() {
    return {
      choosed: false,
      sector: null,
      sectors: [
        {
          title: "Consultório",
          sectorName: "consultorio",
          icon: "calendar_today"
        },
        {
          title: "Recepção",
          sectorName: "recepcao",
          icon: "monetization_on"
        },
        {
          title: "Recepção2",
          sectorName: "recepcao2",
          icon: "monetization_on"
        }
      ]
    };
  },
  mounted() {
    this.$store.dispatch("getTicketsGeneralInfo");
  },
  methods: {
    async choose(sector) {
      this.$store.dispatch("listenRooms", sector).then(() => {

        this.sector = sector;
      });
    },
    close() {
      this.sector = null;
    },
    back() {
      this.$router.back();
    }
  }
};
</script>

<style scoped>
.box {
  height: 600px;
}
</style>
