<template class="panel">
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
    :resetSectorTicketNormal="resetSectorTicketNormal"
    :resetSectorTicketPriority="resetSectorTicketPriority"
    :removeDoctorRoom="removeDoctorRoom"
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
    @open-selected-room="(room)=>{selectedRoom = room;doctorsListDialog.active = true;}"
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
      rooms: undefined,
      sectorName: undefined,
      normal: '0',
      priority: '0',
      new: undefined,
      old: undefined,
      doctors: undefined,
      doctorsListDialog: {
        active: false,
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
/*    rooms() {
      return this.sector ? this.sector.has_rooms : [];
    },*/
    roomsLoaded() {
      return this.$store.getters.roomsLoaded;
    },
    ticketInfo() {
      return this.$store.getters.ticketGeneralInfo;
    },
/*    doctors() {

      return Object.values(this.$store.getters.doctors).filter((doctor) => {
        return doctor.name.includes(
          this.doctorsListDialog.search.toUpperCase()
        );
      });
    },*/
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
        console.log('sector and rooms:', this.sector)
        this.rooms = this.sector.has_rooms

        let normals = this.sector.sector_has_tickets.filter(a => {
          return a.type === 'normal';
        });
        if(normals[0] !== undefined){ this.normal = normals[0].name }

        let prioritys = this.sector.sector_has_tickets.filter(a => {
          return a.type === 'priority';
        });
        if(prioritys[0] !== undefined) {this.priority = prioritys[0].name}

      },
    },
    LoadDoctors: {
      query: require("@/graphql/doctors/LoadDoctors.gql"),
      update(data){
        this.doctors = Object.assign(data.Doctor)
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
          show: false,
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
      await this.$apollo.queries.LoadRoomsOfSector.refresh();
    },
    async setDoctorToRoom(room, doctor) {
      this.loading = true;
      await this.$apollo.mutate({
        mutation: require('@/graphql/rooms/AddRelationsRoomDoctor.gql'),
        variables: {
          idRoom: room.id,
          idDoctor: doctor.id,
        },
      });
      await this.$apollo.queries.LoadRoomsOfSector.refresh();
      this.doctorsListDialog.active = false
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

    async removeDoctorRoom(room){
      this.loading = true;
      if(room && room.doctor){
        await this.$apollo.mutate({
          mutation: require('@/graphql/rooms/RemoveRoomDoctor.gql'),
          variables: {
            idRoom: room.id,
            idDoctor: room.doctor.id,
          },
        });
      }
      //remover tickets da room se houver
      if(room.room_has_tickets.length > 0){
        //console.log('tem tickets na sala, removendo.')
        for(let tr in room.room_has_tickets){
          await this.$apollo.mutate({
            mutation: require('@/graphql/rooms/RemoveRoomRoom_has_tickets.gql'),
            variables: {
              idRoom: room.id,
              idTicket: room.room_has_tickets[tr].id,
            },
          });
        }
      }
      await this.$apollo.queries.LoadRoomsOfSector.refresh();
      this.loading = false;
    },
    async resetSectorTicketNormal(number) {
      this.loading = true;
      await this.$apollo.queries.LoadRoomsOfSector.refresh();
      let normals = this.sector.sector_has_tickets.filter(a => {
        return a.type === 'normal';
      });
      let count = number.toString()
      let rooms = this.sector.has_rooms
      let ticketsSector = normals
      //start
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
          idSector: this.sector.id,
          idTicket: idTicket,
        },
      });
      await this.$apollo.mutate({
        mutation: require('@/graphql/sectors/UpdateSector.gql'),
        variables: {
          id: this.sector.id,
          counter_reset: 0,
          counter_normal: number,//number count inicial //counter_priority: 0,next_ticket_priority: null,
          next_ticket_normal: null,
        },
      });
      if(ticketsSector.length > 0){
        for(let ts in ticketsSector) {
          //console.log('tem tickets no setor', ticketsSector)
          await this.$apollo.mutate({
            mutation: require('@/graphql/sectors/RemoveSectorSector_has_tickets.gql'),
            variables: {
              idSector:  this.sector.id,
              idTicket: ticketsSector[ts].id,
            },
          });
        }
      }
      if(rooms.length > 0){
        for(let room in rooms){
          await this.$apollo.mutate({
            mutation: require('@/graphql/rooms/UpdateRoom.gql'),
            variables: {
              id: rooms[room].id,
              current_ticket: null,
              previos_ticket: null,
              show: false,
            },
          });
          if(rooms[room].room_has_tickets.length > 0){
            //console.log('tem tickets na sala', rooms[room].name)
            for(let tr in rooms[room].room_has_tickets){
              await this.$apollo.mutate({
                mutation: require('@/graphql/rooms/RemoveRoomRoom_has_tickets.gql'),
                variables: {
                  idRoom: rooms[room].id,
                  idTicket: rooms[room].room_has_tickets[tr].id,
                },
              });
            }
          }
        }
      }
      //end
      await this.$apollo.queries.LoadRoomsOfSector.refresh();
      this.loading = false;
    },
    async resetSectorTicketPriority(number){
      this.loading = true;
      await this.$apollo.queries.LoadRoomsOfSector.refresh();
      let prioritys = this.sector.sector_has_tickets.filter(a => {
        return a.type === 'priority';
      });
      let count = 'P'+' '+ number.toString()
      let rooms = this.sector.has_rooms
      let ticketsSector = prioritys
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
          idSector: this.sector.id,
          idTicket: idTicket,
        },
      });
      await this.$apollo.mutate({
        mutation: require('@/graphql/sectors/UpdateSector.gql'),
        variables: {
          id: this.sector.id,
          counter_reset: 0,
          counter_priority: number,//number count inicial //counter_priority: 0,next_ticket_priority: null,
          next_ticket_priority: null,
        },
      });
      if(ticketsSector.length > 0){
        for(let ts in ticketsSector) {
          //console.log('tem tickets no setor', ticketsSector)
          await this.$apollo.mutate({
            mutation: require('@/graphql/sectors/RemoveSectorSector_has_tickets.gql'),
            variables: {
              idSector:  this.sector.id,
              idTicket: ticketsSector[ts].id,
            },
          });
        }
      }
      if(rooms.length > 0){
        for(let room in rooms){
          await this.$apollo.mutate({
            mutation: require('@/graphql/rooms/UpdateRoom.gql'),
            variables: {
              id: rooms[room].id,
              current_ticket: null,
              previos_ticket: null,
              show: false,
            },
          });
          if(rooms[room].room_has_tickets.length > 0){
            //console.log('tem tickets na sala', rooms[room].name)
            for(let tr in rooms[room].room_has_tickets){
              await this.$apollo.mutate({
                mutation: require('@/graphql/rooms/RemoveRoomRoom_has_tickets.gql'),
                variables: {
                  idRoom: rooms[room].id,
                  idTicket: rooms[room].room_has_tickets[tr].id,
                },
              });
            }
          }
        }
      }
      //end
      await this.$apollo.queries.LoadRoomsOfSector.refresh();
      this.loading = false;
    },
    async generateSectorTicket(preferential) {
      this.loading = true;
      await this.$apollo.queries.LoadRoomsOfSector.refresh();

      if(preferential === true) {
        let count;
        this.sector.counter_priority = this.sector.counter_priority + 1
        count = this.sector.counter_priority.toString()
        count = 'P'+' '+count
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
        //ultima prioridade do setor
        await this.$apollo.mutate({
          mutation: require('@/graphql/sectors/UpdateSector.gql'),
          variables: {
            id: this.sector.id,
            counter_reset: 0,
            counter_normal: this.sector.counter_normal,
            counter_priority: this.sector.counter_priority = this.sector.counter_priority + 1,
          },
        });
      } else {
        this.sector.counter_normal = this.sector.counter_normal + 1
        const dataTicket = await this.$apollo.mutate({
          mutation: require('@/graphql/tickets/CreateTicket.gql'),
          variables: {
            name: this.sector.counter_normal.toString(),
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
        //ultima normal do setor
        await this.$apollo.mutate({
          mutation: require('@/graphql/sectors/UpdateSector.gql'),
          variables: {
            id: this.sector.id,
            counter_reset: 0,
            counter_normal: this.sector.counter_normal = this.sector.counter_normal + 1,
            counter_priority: this.sector.counter_priority,
          },
        });
      }
      await this.$apollo.queries.LoadRoomsOfSector.refresh();
      this.loading = false;
    },
    async upgradeTicketNumber() {
      let ticketInfo = this.ticketInfo;
      ticketInfo.ticket_number++;
      ticketInfo.last_updated = moment().format("YYYY-MM-DD HH:mm:ss");
      await this.$store.dispatch("updateGeneralInfo", this.ticketInfo);
    },
    async callRoomTicket(room, preferential) {
      await this.$apollo.queries.LoadRoomsOfSector.refresh();
      //star
      if(preferential === true) {
        let prioritys = room.room_has_tickets.filter(a => {
          return a.type === 'priority';
        });
        prioritys.reverse()
        let priority = []
        for(let p in prioritys) { if(!prioritys[p].called_at.formatted) { priority.push(prioritys[p]) }}
        //proxima senha prioridade
        if(priority[1] !== undefined){
          await this.$apollo.mutate({
            mutation: require('@/graphql/rooms/UpdateRoom.gql'),
            variables: {
              id: room.id,
              next_ticket_priority: priority[1].name,
            },
          });
        }
        //proxima senha prioridade
        if(priority[0] !== undefined){
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/UpdateTicket.gql'),
            variables: {
              id: priority[0].id,
              called_at: { formatted : moment().format('YYYY-MM-DDTHH:mm:ss')}
            },
          });
          //falar com luis
/*          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddTicketColaborator.gql'),
            variables: {
              idColaborator: this.$store.getters.user.id,
              idTicket: priority[0].id,
            },
          });*/
          //falar com luis
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
          } } else { alert("todas as senhas 'preferencial' foram chamadas, tente novamente mais tarde (depois)!") }
      } else {
        let normals = room.room_has_tickets.filter(a => {
          return a.type === 'normal';
        });
        normals.reverse()
        let normal = []
        for(let n in normals){ if(!normals[n].called_at.formatted){ normal.push(normals[n]) }}
        //proxima senha normal
        if(normal[1] !== undefined){
          await this.$apollo.mutate({
            mutation: require('@/graphql/rooms/UpdateRoom.gql'),
            variables: {
              id: room.id,
              next_ticket_normal: normal[1].name,
            },
          });
        }
        //proxima senha normal
        if(normal[0] !== undefined){
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/UpdateTicket.gql'),
            variables: {
              id: normal[0].id,
              called_at: { formatted : moment().format('YYYY-MM-DDTHH:mm:ss')}
            },
          });
          //falar com luis
/*          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddTicketColaborator.gql'),
            variables: {
              idColaborator: this.$store.getters.user.id,
              idTicket: normal[0].id,
            },
          });*/
          //falar com luis
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
        } else { alert("todas as senhas 'normal' foram chamadas, tente novamente mais tarde (depois) !") }
      }
      //end
      await this.$apollo.queries.LoadRoomsOfSector.refresh();
    },
    async callNextTicket(room, preferential) {
      this.loading = true
      if(room.room_has_tickets.length > 0){
        await this.callRoomTicket(room, preferential)
      } else {
        await this.callSectorTicket(room, preferential)
      }
      this.loading = false
    },
    async callSectorTicket(room, preferential) {
      await this.$apollo.queries.LoadRoomsOfSector.refresh();

      let rooms  = this.sector.has_rooms.filter(a => {
        return a.id !== room.id;
      });

      for (let room in rooms ){
        if(rooms[room].show === true){
          await this.$apollo.mutate({
            mutation: require('@/graphql/rooms/UpdateRoom.gql'),
            variables: {
              id: rooms[room].id,
              show: false,
            },
          });
        }
      }

      if(preferential === true) {
        let prioritys = this.sector.sector_has_tickets.filter(a => {
          return a.type === 'priority';
        });
        prioritys.reverse()
        let priority = []
        for(let p in prioritys) { if(!prioritys[p].called_at.formatted) { priority.push(prioritys[p]) }}
        //proxima senha prioridade
        if(priority[1] !== undefined){
          await this.$apollo.mutate({
            mutation: require('@/graphql/sectors/UpdateSector.gql'),
            variables: {
              id: this.sector.id,
              next_ticket_priority: priority[1].name,
            },
          });
        }
        //proxima senha prioridade
        if(priority[0] !== undefined){
        await this.$apollo.mutate({
          mutation: require('@/graphql/tickets/UpdateTicket.gql'),
          variables: {
            id: priority[0].id,
            called_at: { formatted : moment().format('YYYY-MM-DDTHH:mm:ss')}
          },
        });
        await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddTicketColaborator.gql'),
            variables: {
              idColaborator: this.$store.getters.user.id,
              idTicket: priority[0].id,
            },
          });
        if(!room.previos_ticket) {
          await this.$apollo.mutate({
            mutation: require('@/graphql/rooms/UpdateRoom.gql'),
            variables: {
              id: room.id,
              previos_ticket: '*',
              current_ticket: priority[0].name,
              show: true,
            },
          });
        } else {
          await this.$apollo.mutate({
            mutation: require('@/graphql/rooms/UpdateRoom.gql'),
            variables: {
              id: room.id,
              previos_ticket: room.current_ticket,
              current_ticket: priority[0].name,
              show: true,
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
        //proxima senha normal
        if(normal[1] !== undefined){
          await this.$apollo.mutate({
            mutation: require('@/graphql/sectors/UpdateSector.gql'),
            variables: {
              id: this.sector.id,
              next_ticket_normal: normal[1].name,
            },
          });
        }
        //proxima senha normal
        if(normal[0] !== undefined){
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/UpdateTicket.gql'),
            variables: {
              id: normal[0].id,
              called_at: { formatted : moment().format('YYYY-MM-DDTHH:mm:ss')}
            },
          });
          await this.$apollo.mutate({
            mutation: require('@/graphql/tickets/AddTicketColaborator.gql'),
            variables: {
              idColaborator: this.$store.getters.user.id,
              idTicket: normal[0].id,
            },
          });
          if(!room.previos_ticket) {
            await this.$apollo.mutate({
              mutation: require('@/graphql/rooms/UpdateRoom.gql'),
              variables: {
                id: room.id,
                previos_ticket: '*',
                current_ticket: normal[0].name,
                show: true,
              },
            });
          } else {
            await this.$apollo.mutate({
              mutation: require('@/graphql/rooms/UpdateRoom.gql'),
              variables: {
                id: room.id,
                previos_ticket: room.current_ticket,
                current_ticket: normal[0].name,
                show: true,
              },
            });
          }
        } else { alert("todas as senhas 'normal' foram chamadas, crie novas senhas normais!") }
      }
      await this.$apollo.queries.LoadRoomsOfSector.refresh();
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
      await this.$apollo.mutate({
        mutation: require('@/graphql/rooms/DeleteRoom.gql'),
        variables: {
          id: room.id,
        },
      });
      this.deletionRoom.deleting = false;
      this.deletionRoom.deleteRoomDialog = false;
      await this.$apollo.queries.LoadRoomsOfSector.refresh();
    },
    async alertActualTicket(room) {
      await this.$apollo.queries.LoadRoomsOfSector.refresh();
      let rooms  = this.sector.has_rooms
      for (let room in rooms ){
        if(rooms[room].show === true){
          await this.$apollo.mutate({
            mutation: require('@/graphql/rooms/UpdateRoom.gql'),
            variables: {
              id: rooms[room].id,
              show: false,
            },
          });
        }
      }
      await this.$apollo.mutate({
        mutation: require('@/graphql/rooms/UpdateRoom.gql'),
        variables: {
          id: room.id,
          show: true,
        },
      });
      await this.$apollo.queries.LoadRoomsOfSector.refresh();
    },
    openSingleView(room) {
      this.singleViewDialog.room = room;
      this.singleViewDialog.active = true;
    },
  },
};
</script>

<style scoped>
.panel{
  overflow-y:hidden;
  overflow-x:hidden;
}
html{
  overflow-y:hidden;
  overflow-x:hidden;
}
body {
  overflow-x: hidden;
  overflow-y: hidden;
}
</style>

