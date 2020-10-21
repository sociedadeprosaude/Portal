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
    :normal="normal"
    :priority="priority"
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
      sector: undefined,
      sectorName: undefined,
      normal: 0,
      priority: 0,
      new: undefined,
      old: undefined,
      //gffdgdf
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
      return this.sector ? this.sector.has_rooms : [];
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
      return true;
    },
/*    sectorName() {
      return this.$route.params["sector_name"];
    },*/
/*    sector() {
/!*      return this.$store.getters.sectors
        ? this.$store.getters.sectors.find(
            (sector) => sector.name == this.sectorName
          )
        : undefined;*!/
    },*/
  },
  apollo: {
    LoadRoomsOfSector: {
      query: require("@/graphql/rooms/LoadRoomsOfSector.gql"),
      variables () {
        return {
          name: this.$route.params["sector_name"]
        }
      },
      update(data){
        this.sector = Object.assign(data.Sector[0])
        let n = this.sector.sector_has_tickets.filter(a => {
          return a.type === 'normal';
        });
        this.normal = n.length
        let p = this.sector.sector_has_tickets.filter(a => {
          return a.type === 'priority';
        });
        this.priority = p.length
        console.log('reativo:', this.sector)
      },
    },
  },
  methods: {
    async initialInfo() {
      //
    },
    async saveAndReset() {
      // this.$store.dispatch("updateGeneralInfo", {
      //   ticket_number: 1,
      //   last_updated: moment().format("YYYY-MM-DD HH:mm:ss")
      // });
      //resetTickets faz isso aqui em cima
/*      await this.$store.dispatch("resetTickets");
      await this.$store.dispatch("saveTicketsHistory");*/
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
      const idSector = this.sector.id;
      const dataRoom = await this.$apollo.mutate({
        mutation: require('@/graphql/rooms/CreateRoom.gql'),
        variables: {
          name: room.name.toUpperCase(),
        },
      });
      const idRoom = dataRoom.data.CreateRoom.id
      await this.$apollo.mutate({
        mutation: require('@/graphql/rooms/AddRelationsRoomSector.gql'),
        variables: {
          idSector: idSector,
          idRoom: idRoom,

        },
      });
      this.loading = false;
      this.success = true;
      setTimeout(() => {
        this.success = false;
      }, 1000);
      this.$apollo.queries.LoadRoomsOfSector.refresh();
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
      this.loading = true;
      this.$apollo.queries.LoadRoomsOfSector.refresh();
      let count = 0;
      if(this.sector.sector_has_tickets.length > 0){ count = this.sector.sector_has_tickets.length + 1 }
      count = count.toString();
      if(preferential === true) {
        const dataTicket = await this.$apollo.mutate({
          mutation: require('@/graphql/tickets/CreateTicket.gql'),
          variables: {
            name: count,
            type: "priority",
            created_at: { formatted : moment().format('YYYY-MM-DDTHH:mm:ss')}
          },
        });
        const idTicket = dataTicket.data.CreateTicket.id
        await this.$apollo.mutate({
          mutation: require('@/graphql/tickets/AddRelationsSectorTicket.gql'),
          variables: {
            idTicket: idTicket,
            idSector: this.sector.id,
          },
        });
      } else {
        const dataTicket = await this.$apollo.mutate({
          mutation: require('@/graphql/tickets/CreateTicket.gql'),
          variables: {
            name: count,
            type: "normal",
            created_at: { formatted : moment().format('YYYY-MM-DDTHH:mm:ss')}
          },
        });
        const idTicket = dataTicket.data.CreateTicket.id
        await this.$apollo.mutate({
          mutation: require('@/graphql/tickets/AddRelationsSectorTicket.gql'),
          variables: {
            idTicket: idTicket,
            idSector: this.sector.id,
          },
        });
      }
      this.$apollo.queries.LoadRoomsOfSector.refresh();
      this.loading = false;
    },
    async upgradeTicketNumber() {
      let ticketInfo = this.ticketInfo;
      ticketInfo.ticket_number++;
      ticketInfo.last_updated = moment().format("YYYY-MM-DD HH:mm:ss");
      await this.$store.dispatch("updateGeneralInfo", this.ticketInfo);
    },
    async callNextTicket(room, preferential) {
      this.loading = true;
      console.log('r',room.room_has_tickets);
      console.log('bool',preferential);
      if(room.room_has_tickets.length > 0){
        console.log('chamar ticket do sala')
      } else {
        console.log('chamar ticket do setor')
        await this.callSectorTicket(room, preferential);
      }
      //update in room e update ticket
      //const sector = this.sector;
      //await this.$store.dispatch("updateSectorRoom", { sector, room });
      this.loading = false;
    },
    async callSectorTicket(room, preferential) {
      this.$apollo.queries.LoadRoomsOfSector.refresh();
      if(preferential === true) {
        let prioritys = this.sector.sector_has_tickets.filter(a => {
          return a.type === 'priority';
        });
        prioritys.reverse()
        let priority = []
        for(let p in prioritys) { if(!prioritys[p].called_at.formatted) { priority.push(prioritys[p]) }}
        if(priority[0] !== undefined){
        await this.$apollo.mutate({
          mutation: require('@/graphql/tickets/UpdateTicket.gql'),
          variables: {
            id: priority[0].id,
            called_at: { formatted : moment().format('YYYY-MM-DDTHH:mm:ss')}
          },
        });
        if(!room.previos_ticket) {
          await this.$apollo.mutate({
            mutation: require('@/graphql/rooms/UpdateRoom.gql'),
            variables: {
              id: room.id,
              previos_ticket: '*',
              current_ticket: priority[0].name,
            },
          });
        } else {
          await this.$apollo.mutate({
            mutation: require('@/graphql/rooms/UpdateRoom.gql'),
            variables: {
              id: room.id,
              previos_ticket: room.current_ticket,
              current_ticket: priority[0].name,
            },
          });
        } } else { alert("todas as senhas 'preferencial' foram chamadas, crie novas senhas preferenciais!") }
      } else {
        let normals = this.sector.sector_has_tickets.filter(a => {
          return a.type === 'normal';
        });
        normals.reverse()
        let normal = []
        for(let n in normals){ if(!normals[n].called_at.formatted){ normal.push(normals[n]) }}
        if(normal[0] !== undefined){
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/UpdateTicket.gql'),
            variables: {
              id: normal[0].id,
              called_at: { formatted : moment().format('YYYY-MM-DDTHH:mm:ss')}
            },
          });
          if(!room.previos_ticket) {
            await this.$apollo.mutate({
              mutation: require('@/graphql/rooms/UpdateRoom.gql'),
              variables: {
                id: room.id,
                previos_ticket: '*',
                current_ticket: normal[0].name,
              },
            });
          } else {
            await this.$apollo.mutate({
              mutation: require('@/graphql/rooms/UpdateRoom.gql'),
              variables: {
                id: room.id,
                previos_ticket: room.current_ticket,
                current_ticket: normal[0].name,
              },
            });
          }
        } else { alert("todas as senhas 'normal' foram chamadas, crie novas senhas normais!") }
      }
      this.$apollo.queries.LoadRoomsOfSector.refresh();
    },
    favoriteRoom(room) {
      this.$store.commit("setFavoriteRoom", room);
      this.$store.commit("setFavoriteRoomSection", this.sector);
    },
    async deleteRoom(room) {
      console.log('del sala:', room)
      this.deletionRoom.selectedRoom = room;
      if (!this.deletionRoom.deleteRoomDialog) {
        this.deletionRoom.deleteRoomDialog = true;
        return;
      }
      this.deletionRoom.deleting = true;
      if(room.room_has_tickets.length > 0){
        for (let ticket in room.room_has_tickets){
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/DeleteTicket.gql'),
            variables: {
              id: room.room_has_tickets[ticket].id,
            },
          });
        }
      }
      await this.$apollo.mutate({
        mutation: require('@/graphql/rooms/DeleteRoom.gql'),
        variables: {
          id: room.id,
        },
      });
      this.deletionRoom.deleting = false;
      this.deletionRoom.deleteRoomDialog = false;
      this.$apollo.queries.LoadRoomsOfSector.refresh();
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

