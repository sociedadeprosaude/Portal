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
      //
      idUnity: undefined,
      sectors: undefined,
      //
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
      let unity = unitys.data.Clinic[0].has_sectors
      this.idUnity = unitys.data.Clinic[0].id
      console.log('unity:', unity)
      this.sectors = unity
/*      const generalInfo = await this.$store.dispatch("getTicketsGeneralInfo");
      this.$store.dispatch("listenTicketsSectors");*/
      /*this.lastTicket = generalInfo.ticket_number;*/
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
      const dataSector = await this.$apollo.mutate({
        mutation: require('@/graphql/sectors/CreateSector.gql'),
        variables: {
          name: name.toUpperCase(),
        },
      });
      const idSector = dataSector.data.CreateSector.id
      await this.$apollo.mutate({
        mutation: require('@/graphql/sectors/AddRelationsSectorUnity.gql'),
        variables: {
          idUnity: this.idUnity,
          idSector: idSector,
        },
      });
      this.resetCreation();
    },
    async deleteSector(sector) {
      console.log('deleting:', sector)
      let rooms = sector.has_rooms
      if( sector.has_rooms.length > 0){
        for (let room in rooms){
          console.log('RS',rooms[room])
          //mandar deletar as salas do setor
          if(rooms[room].room_has_tickets.length > 0){
            for(let ticketroom in rooms[room].room_has_tickets){
              console.log('TR',rooms[room].room_has_tickets[ticketroom])
              //mandar deletar os ticekts das salas dos setores
            }
          }
        }
      }
      let sector_has_tickets = sector.sector_has_tickets
      if(sector.sector_has_tickets.length > 0){
        for(let ticketsector in sector_has_tickets){
          console.log('TS',sector_has_tickets[ticketsector])
          //mandar deletar os ticktes do setor
        }
      }
      this.creation.choosed = sector;
      if (!this.creation.deletingDialog) {
        this.creation.deletingDialog = true;
        return;
      }
      this.creation.deleting = true;
/*      await this.$apollo.mutate({
        mutation: require('@/graphql/sectors/DeleteRoom.gql'),
        variables: {
          id: sector.id,
        },
      });*/
      this.creation.deleting = false;
      this.creation.deletingDialog = false;
      this.$router.push('/');
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
      this.$router.push('/')
    },
  },
  computed: {
/*    sectors() {
      console.log('firebase:',this.$store.getters.sectors)
      return this.$store.getters.sectors;
    },*/
    loading() {
      return !this.sectors;
    },
  },
};
</script>

<style>
</style>