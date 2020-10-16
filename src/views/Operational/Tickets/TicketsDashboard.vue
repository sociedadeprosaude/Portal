<template>
  <v-container>
    <TicketsDashboard
      :creation="creation"
      :sector="sector"
      :sectors="sectors"
      :loading="loading"
      :choosed="choosed"
      :initialInfo="initialInfo"
      :createSector="createSector"
      :deleteSector="deleteSector"
      :choose="choose"
      :resetCreation="resetCreation"
      :dialogChangeTicket="dialogChangeTicket"
      :lastTicket="lastTicket"
      :updateLastTicket="updateLastTicket"
      :loadingChange="loadingChange"
      @change-dialog-change-ticket="(value)=>dialogChangeTicket=value"
      @change-last-ticket="(value)=>lastTicket=value"
    />
  </v-container>
</template>

<script>
import TicketsDashboard from "@/components/tickets/TicketsDashboard";
export default {
  components: {
    TicketsDashboard,
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
        deleting: false,
      },
      choosed: false,
      dialogChangeTicket: false,
      loadingChange: false,
      lastTicket: null,
      sector: null,
      production: null,
      //sectors: undefined,
    };
  },
  mounted() {
    this.initialInfo();
  },
  methods: {
    async initialInfo() {
      const clinicID  = this.$store.getters.user.clinic.id
      const unitys = await this.$apollo.mutate({
        mutation: require('@/graphql/sectors/LoadSectorsOfUnity.gql'),
        variables: {id: clinicID},
      })
      let unity = unitys.data.Clinic[0]
      console.log('unity:', unity)
      //this.sectors = unity.has_sectors
      const generalInfo = await this.$store.dispatch("getTicketsGeneralInfo");
      this.$store.dispatch("listenTicketsSectors");

      this.lastTicket = generalInfo.ticket_number;
    },

    async updateLastTicket(number) {
      this.loadingChange = true;
      await this.$store.dispatch("updateGeneralInfo", {
        ticket_number: number,
        last_updated: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
      await this.$store.dispatch("getTicketsGeneralInfo");
      this.loadingChange = false;
      this.dialogChangeTicket = false;
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
        deleting: false,
      };
    },
  },
  computed: {
    sectors() {
      return this.$store.getters.sectors;
    },
    loading() {
      return !this.sectors;
    },
  },
};
</script>

<style>
</style>