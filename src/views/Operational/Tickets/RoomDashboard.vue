<template>
  <RoomDashboard
    :saveAndReset="saveAndReset"
    :getActualTicket="getActualTicket"
    :createRoom="createRoom"
    :setDoctorToRoom="setDoctorToRoom"
    :generateNextTicket="generateNextTicket"
    :generateSectorTicket="generateSectorTicket"
    :upgradeTicketNumber="upgradeTicketNumber"
    :callNextTicket="callNextTicket"
    :callSectorTicket="callSectorTicket"
    :favoriteRoom="favoriteRoom"
    :deleteRoom="deleteRoom"
    :alertActualTicket="alertActualTicket"
    :openSingleView="openSingleView"
    :favoritedRoom="favoritedRoom"
    :rooms="rooms"
    :roomsLoaded="roomsLoaded"
    :ticketInfo="ticketInfo"
    :doctors="doctors"
    :doctorsLoaded="doctorsLoaded"
    :sectorName="sectorName"
    :sector="sector"
    :doctorsListDialog="doctorsListDialog"
    :selectedRoom="selectedRoom"
    :room="room"
    :createRoomController="createRoomController"
    :loading="loading"
    :success="success"
    :singleViewDialog="singleViewDialog"
    :multipleViewDialog="multipleViewDialog"
    :deletionRoom="deletionRoom"
    :snackbar="snackbar"
    @open-multiple-view-dialog="multipleViewDialog = true"
    @open-selected-room="(room)=>{
      selectedRoom = room;
       doctorsListDialog.active = true
    }"
    @close-multiple-view-dialog="multipleViewDialog = false"
    @close-single-view-dialog="singleViewDialog.active = false"
    @close-doctors-list-dialog="doctorsListDialog = false"
    @toggle-create-room-controller="createRoomController = !createRoomController"
    @change-snackbar="(event)=>snackbar=event"
  />
</template>

<script>
import RoomDashboard from "@/components/tickets/RoomDashboard";

export default {
  name: "Tickets",
  components: {
    RoomDashboard,
  },
  mounted() {
    this.initialInfo();
  },
  data() {
    return {
      doctorsListDialog: {
        active: false,
        search: "",
      },
      snackbar: false,
      selectedRoom: {},
      room: {},
      createRoomController: false,
      loading: false,
      success: false,
      singleViewDialog: {
        active: false,
        room: {},
      },
      multipleViewDialog: false,
      deletionRoom: {
        deleteRoomDialog: false,
        deleting: false,
        selectedRoom: {},
      },
    };
  },
  computed: {
    favoritedRoom() {
      if (this.$store.getters.favoriteRoom)
        return this.$store.getters.favoriteRoom;
      else {
        return {
          name: "",
        };
      }
    },
    rooms() {
      return this.sector ? this.sector.rooms : {};
    },
    roomsLoaded() {
      return this.$store.getters.roomsLoaded;
    },
    ticketInfo() {
      return this.$store.getters.ticketGeneralInfo;
    },
    doctors() {
      return Object.values(this.$store.getters.doctors).filter((doctor) => {
        return doctor.name.includes(
          this.doctorsListDialog.search.toUpperCase()
        );
      });
    },
    doctorsLoaded() {
      return this.$store.getters.doctorsLoaded;
    },
    sectorName() {
      return this.$route.params["sector_name"];
    },
    sector() {
      return this.$store.getters.sectors
        ? this.$store.getters.sectors.find(
            (sector) => sector.name == this.sectorName
          )
        : undefined;
    },
  },
  methods: {
    async initialInfo() {
      if (
        moment(this.$store.getters.ticketGeneralInfo.last_updated).dayOfYear !==
        moment().dayOfYear
      ) {
        await this.saveAndReset();
      }
      if (!this.sector) {
        this.$store.dispatch("getTicketsGeneralInfo");
        this.$store.dispatch("listenTicketsSectors");
      }
      this.$store.dispatch("listenLastTicket");
    },
    async saveAndReset() {
      // this.$store.dispatch("updateGeneralInfo", {
      //   ticket_number: 1,
      //   last_updated: moment().format("YYYY-MM-DD HH:mm:ss")
      // });
      //resetTickets faz isso aqui em cima
      await this.$store.dispatch("resetTickets");
      await this.$store.dispatch("saveTicketsHistory");
    },
    getActualTicket(tickets) {
      let calledTickets = tickets
        .filter((ticket) => ticket.called_at)
        .sort((a, b) => new Date(a.called_at) - new Date(b.called_at));
      if (calledTickets.length === 0) return undefined;

      return calledTickets[calledTickets.length - 1];
    },
    async createRoom(room) {
      this.loading = true;
      const sector = this.sector;
      await this.$store.dispatch("createSectorRoom", { sector, room });
      this.loading = false;
      this.success = true;
      setTimeout(() => {
        this.success = false;
      }, 1000);
    },
    async setDoctorToRoom(room, doctor) {
      room.doctor = doctor;
      this.loading = true;
      const sector = this.sector;
      await this.$store.dispatch("updateSectorRoom", { sector, room });
      this.loading = false;
    },
    async generateNextTicket(room, preferential) {
      if (!room.tickets) {
        room.tickets = [];
      }
      room.tickets.push({
        number: this.ticketInfo.ticket_number,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        doctor: room.doctor,
        preferential: preferential,
      });
      await this.upgradeTicketNumber();
      const sector = this.sector;
      await this.$store.dispatch("updateSectorRoom", { sector, room });
    },
    async generateSectorTicket(preferential) {
      let sector = this.sector;
      if (!sector.tickets) {
        sector.tickets = [];
      }
      sector.tickets.push({
        number: this.ticketInfo.ticket_number,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        preferential: preferential,
      });
      await this.upgradeTicketNumber();
      await this.$store.dispatch("updateSector", sector);
    },
    async upgradeTicketNumber() {
      let ticketInfo = this.ticketInfo;
      ticketInfo.ticket_number++;
      ticketInfo.last_updated = moment().format("YYYY-MM-DD HH:mm:ss");
      await this.$store.dispatch("updateGeneralInfo", this.ticketInfo);
    },
    async callNextTicket(room, preferential) {
      // console.log(room.tickets);
      // console.log(preferential);
      this.loading = true;

      let ticketIndex = room.tickets
        ? room.tickets.findIndex(
            (ticket) =>
              !ticket.called_at &&
              (preferential ? ticket.preferential : !ticket.preferential)
          )
        : -1;
      if (ticketIndex < 0) {
        await this.callSectorTicket(room, preferential);
        this.loading = false;
        return;
      }

      room.tickets[ticketIndex].called_at = moment().format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const sector = this.sector;
      await this.$store.dispatch("updateSectorRoom", { sector, room });
      this.loading = false;
    },
    async callSectorTicket(room, preferential) {
      let ticketIndex = this.sector.tickets
        ? this.sector.tickets.findIndex((ticket) => {
            return (
              !ticket.called_at &&
              (preferential ? ticket.preferential : !ticket.preferential)
            );
          })
        : -1;
      if (ticketIndex < 0) {
        this.snackbar = true;

        //criando e chamando uma nova senha na sala se nao tiver nenhuma pra ser chamada
        //await this.generateSectorTicket(preferential);
        //await this.callNextTicket(room, preferential);
        return;
      }
      this.sector.tickets[ticketIndex].called_at = moment().format(
        "YYYY-MM-DD HH:mm:ss"
      );
      room.tickets
        ? room.tickets.push(this.sector.tickets[ticketIndex])
        : (room.tickets = [this.sector.tickets[ticketIndex]]);
      const sector = this.sector;
      await this.$store.dispatch("updateSectorRoom", { sector, room });
      this.sector.tickets.splice(ticketIndex, 1);
      await this.$store.dispatch("updateSector", this.sector);
    },
    favoriteRoom(room) {
      this.$store.commit("setFavoriteRoom", room);
      this.$store.commit("setFavoriteRoomSection", this.sector);
    },
    async deleteRoom(room) {
      this.deletionRoom.selectedRoom = room;
      if (!this.deletionRoom.deleteRoomDialog) {
        this.deletionRoom.deleteRoomDialog = true;
        return;
      }
      this.deletionRoom.deleting = true;
      await this.$store.dispatch("deleteSectorRoom", {
        room: room,
        sector: this.sector,
      });
      this.deletionRoom.deleting = false;
      this.deletionRoom.deleteRoomDialog = false;
    },
    alertActualTicket(room) {},
    openSingleView(room) {
      this.singleViewDialog.room = room;
      this.singleViewDialog.active = true;
    },
  },
};
</script>

<style scoped>
</style>

