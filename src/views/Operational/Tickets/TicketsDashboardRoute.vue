<template>
  <v-container>
    <TicketsDashboard
      v-bind:creation="creation"
      v-bind:sector="sector"
      v-bind:sectors="sectors"
      v-bind:loading="loading"
      v-bind:choosed="choosed"
      :initialInfo="initialInfo"
      :createSector="createSector"
      :deleteSector="deleteSector"
      :choose="choose"
      :resetCreation="resetCreation"
    />
  </v-container>
</template>

<script>
import TicketsDashboard from "./TicketsDashboard";
export default {
  components: {
    TicketsDashboard
  },
  data() {
    return {
      creation: {
        creationDialog: false,
        deletingDialog: false,
        sectorName: undefined,
        creating: false,
        editing: false,
        choosed: undefined,
        deleting: false
      },
      choosed: false,
      sector: null,
      production: null
    };
  },
  mounted() {
    this.initialInfo();
  },
  methods: {
    async initialInfo() {
      this.$store.dispatch("getTicketsGeneralInfo");
      this.$store.dispatch("listenTicketsSectors");
    },

    async createSector(name) {
      if (!this.creation.creationDialog) {
        this.creation.creationDialog = true;
        return;
      }
      if (!name || name.lenght === 0) return;
      this.creation.creating = true;
      await this.$store.dispatch("createTicketsSector", name);
      this.resetCreation();
    },
    async deleteSector(sector) {
      this.creation.choosed = sector;
      if (!this.creation.deletingDialog) {
        this.creation.deletingDialog = true;
        return;
      }
      this.creation.deleting = true;
      await this.$store.dispatch("deleteSector", sector);
      this.creation.deleting = false;
      this.creation.deletingDialog = false;
    },
    async choose(sector) {
      this.$router.push("/senhas/" + sector.name);
    },
    resetCreation() {
      this.creation = {
        creationDialog: false,
        deletingDialog: false,
        sectorName: undefined,
        creating: false,
        editing: false,
        choosed: undefined,
        deleting: false
      };
    }
  },
  computed: {
    sectors() {
      return this.$store.getters.sectors;
    },
    loading() {
      return !this.sectors;
    }
  }
};
</script>

<style>
</style>