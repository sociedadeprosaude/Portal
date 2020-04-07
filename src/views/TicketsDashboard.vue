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

    <v-container fill-height style="height:800px">
      <v-row v-if="!sector" justify="center" align="center" align-content="center">
        <v-col align-self="center" cols="12" sm="4" v-for="sector in sectors" :key="sector.title">
          <v-card class="card mx-3" @click="choose(sector)">
            <v-container>
              <v-row align="center" justify="center">
                <v-col cols="12">
                  <v-icon size="72" class="mt-10">{{sector.icon}}</v-icon>
                </v-col>
                <v-col cols="12">
                  <span class="text-center my-headline">{{sector.title}}</span>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-else align="center" justify="center">
        <div>
          <span class="text-center my-headline">{{sector.title}}</span>
          <transition name="slide-fade" mode="out-in" appear>
            <tickets :sector="sector" />
          </transition>
        </div>
      </v-row>
      
    </v-container>
  </v-container>
</template>

<script>
import tickets from "@/components/tickets/Tickets";
import constants from "..//utils/constants";
export default {
  name: "TicketsDashboard",
  components: {
    tickets
  },

  data() {
    return {
      choosed: false,
      sector: null,
      production: null,
      sectors: [
        {
          title: "Consultório",
          sectorName: "consultorio",
          icon: "assignment_ind"
        },
        {
          title: "Recepção",
          sectorName: "recepcao",
          icon: "group"
        },
        {
          title: "Recepção2",
          sectorName: "recepcao2",
          icon: "group"
        }
      ]
    };
  },
  mounted() {
    this.$store.dispatch("getTicketsGeneralInfo");
    this.production = constants.IN_PRODUCTION;
  },
  methods: {
    saveTickets() {
      this.$store.dispatch("saveTicketsHistory");
    },
    resetLine() {
      this.$store.dispatch("resetTickets");
    },
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
</style>
