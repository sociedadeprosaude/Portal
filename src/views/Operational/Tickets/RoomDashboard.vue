<template>
  <v-container>
    <v-row>
      <v-col sm="12" md="4">
        <v-tooltip top v-if="doctorsLoaded">
          <template v-slot:activator="{ on }">
            <v-btn width="100%" v-on="on" class="primary" rounded @click="generateSectorTicket">
              Proxima senha:
              {{ticketInfo.ticket_number}}
            </v-btn>
          </template>
          <span>Pular próxima senha</span>
        </v-tooltip>
      </v-col>

      <v-col sm="6" md="4">
        <v-btn width="100%" class="primary" rounded @click="multipleViewDialog = true">
          <span>Visualizador geral</span>
        </v-btn>
      </v-col>

      <v-col sm="6" md="4">
        <v-fade-transition mode="out-in">
          <v-card class="pa-4" v-if="createRoomController">
            <v-row>
              <v-col sm="8" class="text-left">
                <span class="my-headline">Adicionar sala</span>
              </v-col>
              <v-col sm="4" class="text-right">
                <v-btn small class="primary" fab @click="createRoomController = false">
                  <v-icon>minimize</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row cols="12">
              <v-text-field v-model="room.name" label="Nome da Sala" />
            </v-row>

            <v-row>
              <v-col cols="12" class="text-right">
                <submit-button
                  text="Criar Sala"
                  :loading="loading"
                  :success="success"
                  @click="createRoom(room)"
                />
              </v-col>
            </v-row>
          </v-card>
          <v-btn
            v-else
            rounded
            width="100%"
            class="primary"
            @click="createRoomController = !createRoomController"
          >Adicionar Sala</v-btn>
        </v-fade-transition>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" sm="6" lg="4" xl="3" v-for="room in rooms" :key="room.name">
        <v-card class="pa-4">
          <v-row class="justify-center">
            <v-col cols="8" class="text-left">
              <span class="my-sub-headline">{{room.name}}</span>
            </v-col>
            <v-col cols="4">
              <v-layout row wrap class="justify-end align-center">
                <v-btn x-small fab class="red" @click="deleteRoom(room)">
                  <v-icon class="white--text">delete</v-icon>
                </v-btn>
                <v-btn small fab icon @click="favoriteRoom(room)">
                  <v-icon class="warning--text" v-if="room.name === favoritedRoom.name">grade</v-icon>
                  <v-icon class="primary--text" v-else>grade</v-icon>
                </v-btn>
              </v-layout>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-tooltip top v-if="doctorsLoaded">
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    :disabled="loading"
                    @click="callNextTicket(room)"
                    text
                    fab
                    small
                    class="primary my-2"
                  >
                    <v-icon>add_alert</v-icon>
                  </v-btn>
                </template>
                <span>Chamar próxima senha</span>
              </v-tooltip>
              <v-tooltip top v-if="doctorsLoaded">
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    :disabled="loading"
                    @click="selectedRoom = room, doctorsListDialog.active = true"
                    text
                    fab
                    x-small
                    class="primary ml-2 my-2"
                  >
                    <v-icon>person</v-icon>
                  </v-btn>
                </template>
                <span>Selecionar médico</span>
              </v-tooltip>
              <v-progress-circular indeterminate class="primary--text" v-else></v-progress-circular>
              <v-tooltip top v-if="doctorsLoaded">
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    :disabled="loading"
                    @click="generateNextTicket(room)"
                    text
                    fab
                    x-small
                    class="primary ml-2 my-2"
                  >
                    <v-icon>post_add</v-icon>
                  </v-btn>
                </template>
                <span>Gerar senha</span>
              </v-tooltip>
              <v-tooltip top v-if="doctorsLoaded">
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    :disabled="loading"
                    @click="alertActualTicket(room)"
                    text
                    fab
                    x-small
                    class="primary ml-2 my-2"
                  >
                    <v-icon>notification_important</v-icon>
                  </v-btn>
                </template>
                <span>Alertar senha atual</span>
              </v-tooltip>
              <v-tooltip top v-if="doctorsLoaded">
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    :disabled="loading"
                    @click="openSingleView(room)"
                    text
                    fab
                    x-small
                    class="primary ml-2 my-2"
                  >
                    <v-icon>personal_video</v-icon>
                  </v-btn>
                </template>
                <span>Visualizador único</span>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row>
            <v-col v-if="room.doctor">{{room.doctor.name}}</v-col>
          </v-row>
          <v-row>
            <v-container class="pa-0">
              <v-row>
                <v-col class="pa-0">
                  <span style="font-size: 0.8em">Ultima senha:</span>
                  <br />
                  <span
                    v-if="room.tickets.length != 0"
                  >{{room.tickets[room.tickets.length - 1].number}}</span>
                  <span v-else>*</span>
                </v-col>
                <v-divider vertical></v-divider>
                <v-col class="pa-0">
                  <div>
                    <span style="font-size: 0.8em">Senha atual:</span>
                    <br />
                    <span
                      v-if="room.tickets.length != 0 && getActualTicket(room.tickets)"
                    >{{getActualTicket(room.tickets).number}}</span>
                    <span v-else>*</span>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog
      max-width="720px"
      content-class="bottom-dialog"
      transition="dialog-bottom-transition"
      v-model="doctorsListDialog.active"
    >
      <v-card>
        <v-layout row wrap>
          <v-flex xs12>
            <span class="my-headline">{{selectedRoom.name}}</span>
          </v-flex>
          <v-flex xs12>
            <v-text-field prepend-icon="search" label="Médico" v-model="doctorsListDialog.search"></v-text-field>
          </v-flex>
          <v-flex xs12 class="mt-2" v-for="doctor in doctors" :key="doctor.crm">
            <v-card flat @click="setDoctorToRoom(selectedRoom, doctor)">
              <v-divider class="mb-2"></v-divider>
              <span>{{doctor.name}}</span>
            </v-card>
          </v-flex>
          <v-divider></v-divider>
        </v-layout>
      </v-card>
    </v-dialog>
    <v-dialog v-model="singleViewDialog.active" fullscreen transition="dialog-bottom-transition">
      <single-visualizer
        :sector="sector"
        @close="singleViewDialog.active = false"
        :selectedRoom="singleViewDialog.room"
      ></single-visualizer>
    </v-dialog>
    <v-dialog v-model="multipleViewDialog" fullscreen transition="dialog-bottom-transition">
      <multiple-visualizer :sector="sector" @close="multipleViewDialog = false"></multiple-visualizer>
    </v-dialog>
    <v-dialog v-model="deletionRoom.deleteRoomDialog" max-width="500px">
      <v-card>
        <v-col cols="12">
          <span class="my-headline">Deletar {{deletionRoom.selectedRoom.name}}</span>
        </v-col>
        <v-col cols="12" align="end">
          <v-btn
            v-if="!deletionRoom.deleting"
            @click="deleteRoom(deletionRoom.selectedRoom)"
            rounded
            class="red"
          >
            <span class="white--text">Deletar</span>
          </v-btn>
          <v-progress-circular indeterminate color="primary" v-else></v-progress-circular>
        </v-col>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
/* eslint-disable no-undef */

import SubmitButton from "../../../components/SubmitButton";
import SingleVisualizer from "../../../components/tickets/SingleVisualizer";
import MultipleVisualizer from "../../../components/tickets/MultipleVisualizer";

export default {
  name: "Tickets",
  components: {
    SubmitButton,
    SingleVisualizer,
    MultipleVisualizer
  },
  mounted() {
    this.initialInfo();
  },
  data() {
    return {
      doctorsListDialog: {
        active: false,
        search: ""
      },

      selectedRoom: {},
      room: {},
      createRoomController: false,
      loading: false,
      success: false,
      singleViewDialog: {
        active: false,
        room: {}
      },
      multipleViewDialog: false,
      deletionRoom: {
        deleteRoomDialog: false,
        deleting: false,
        selectedRoom: {}
      }
    };
  },
  computed: {
    favoritedRoom() {
      if (this.$store.getters.favoriteRoom)
        return this.$store.getters.favoriteRoom;
      else {
        return {
          name: ""
        };
      }
    },
    rooms() {
      return this.sector ? this.sector.rooms : [];
    },
    roomsLoaded() {
      return this.$store.getters.roomsLoaded;
    },
    ticketInfo() {
      return this.$store.getters.ticketGeneralInfo;
    },
    doctors() {
      return Object.values(this.$store.getters.doctors).filter(doctor => {
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
            sector => sector.name == this.sectorName
          )
        : undefined;
    }
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
      let calledTickets = tickets.filter(ticket => {
        return ticket.called_at;
      });
      if (calledTickets.length === 0) {
        return undefined;
      }
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
    async generateNextTicket(room) {
      if (!room.tickets) {
        room.tickets = [];
      }
      room.tickets.push({
        number: this.ticketInfo.ticket_number,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        doctor: room.doctor
      });
      await this.upgradeTicketNumber();
      const sector = this.sector;
      await this.$store.dispatch("updateSectorRoom", { sector, room });
    },
    async generateSectorTicket() {
      let sector = this.sector;
      if (!sector.tickets) {
        sector.tickets = [];
      }
      sector.tickets.push({
        number: this.ticketInfo.ticket_number,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss")
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
    async callNextTicket(room) {
      this.loading = true;

      let ticketIndex = room.tickets.findIndex(ticket => {
        return !ticket.called_at;
      });
      if (ticketIndex < 0) {
        await this.callSectorTicket(room);
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
    async callSectorTicket(room) {
      let ticketIndex = this.sector.tickets.findIndex(ticket => {
        return !ticket.called_at;
      });
      if (ticketIndex < 0) {
        //criando e chamando uma nova senha na sala se nao tiver nenhuma pra ser chamada
        await this.generateSectorTicket();
        await this.callNextTicket(room);
        return;
      }
      this.sector.tickets[ticketIndex].called_at = moment().format(
        "YYYY-MM-DD HH:mm:ss"
      );
      room.tickets.push(this.sector.tickets[ticketIndex]);
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
        sector: this.sector
      });
      this.deletionRoom.deleting = false;
      this.deletionRoom.deleteRoomDialog = false;
    },
    alertActualTicket(room) {},
    openSingleView(room) {
      this.singleViewDialog.room = room;
      this.singleViewDialog.active = true;
    }
  }
};
</script>

<style scoped>
</style>

