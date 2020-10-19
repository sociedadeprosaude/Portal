<template>
  <v-container>
    <v-row>
      <v-col sm="12" md="6">
        <v-tooltip top >
          <template v-slot:activator="{ on }">
            <v-btn
              width="100%"
              v-on="on"
              class="primary"
              rounded
              @click="()=>generateSectorTicket(false)"
            >
              Proxima senha:
              {{normal}}
            </v-btn>
          </template>
          <span>Pular próxima senha</span>
        </v-tooltip>
      </v-col>

      <v-col sm="12" md="6">
        <v-tooltip top >
          <template v-slot:activator="{ on }">
            <v-btn
              width="100%"
              v-on="on"
              class="primary"
              rounded
              @click="()=>generateSectorTicket(true)"
            >
              Proxima senha preferencial:
              {{priority}}
            </v-btn>
          </template>
          <span>Pular próxima senha</span>
        </v-tooltip>
      </v-col>

      <v-col sm="12" md="6">
        <v-btn width="100%" class="primary" rounded @click="$emit('open-multiple-view-dialog')">
          <span>Visualizador geral</span>
        </v-btn>
      </v-col>

      <v-col sm="12" md="6">
        <v-fade-transition mode="out-in">
          <v-card class="pa-4" v-if="createRoomController">
            <v-row>
              <v-col sm="8" class="text-left">
                <span class="my-headline">Adicionar sala</span>
              </v-col>
              <v-col sm="4" class="text-right">
                <v-btn small class="primary" fab @click="$emit('toggle-create-room-controller')">
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
            @click="$emit('toggle-create-room-controller')"
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
              <v-tooltip top v-if="normal > 0">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      v-bind="attrs"
                      v-on="on"
                    :disabled="loading"
                    @click="callNextTicket(room,false)"
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
              <v-tooltip top v-if="priority > 0">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      v-bind="attrs"
                      v-on="on"
                    :disabled="loading"
                    @click="callNextTicket(room,true)"
                    text
                    fab
                    small
                    class="primary ml-2 my-2"
                  >
                    <v-icon>notification_important</v-icon>
                  </v-btn>
                </template>
                <span>Chamar próxima senha preferencial</span>
              </v-tooltip>
              <!--<v-tooltip top v-if="doctorsLoaded">
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    :disabled="loading"
                    @click="$emit('open-selected-room',room)"
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
              <v-progress-circular indeterminate class="primary&#45;&#45;text" v-else></v-progress-circular>
              <v-tooltip top v-if="doctorsLoaded">
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                    :disabled="loading"
                    @click="generateNextTicket(room,false)"
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
                    @click="generateNextTicket(room,true)"
                    text
                    fab
                    x-small
                    class="primary ml-2 my-2"
                  >
                    <v-icon>elderly</v-icon>
                  </v-btn>
                </template>
                <span>Gerar senha preferencial</span>
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
              </v-tooltip>-->
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
                  <span v-if="room.previos_ticket">{{room.previos_ticket}}</span>
                  <span v-else>*</span>
                </v-col>
                <v-divider vertical></v-divider>
                <v-col class="pa-0">
                  <div>
                    <span style="font-size: 0.8em">Senha atual:</span>
                    <br />
                    <span v-if="room.current_ticket">{{room.current_ticket}}</span>
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
          <v-flex xs12 class="mt-2" v-for="(doctor,i) in doctors" :key="i">
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
        @close="$emit('close-single-view-dialog')"
        :selectedRoom="singleViewDialog.room"
      ></single-visualizer>
    </v-dialog>
    <v-dialog v-model="multipleViewDialog" fullscreen transition="dialog-bottom-transition">
      <multiple-visualizer :sector="sector" @close="$emit('close-multiple-view-dialog')"></multiple-visualizer>
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

    <v-snackbar
      v-bind:value="snackbar"
      @input="(event)=>$emit('change-snackbar',event)"
      top
      vertical
      color="cyan darken-2"
      :timeout="3000"
    >
      Sem tickets para serem chamados, crie um novo antes de chamar
      <template
        v-slot:action="{ attrs }"
      >
        <v-btn v-bind="attrs" @click="$emit('change-snackbar',false)" fab>
          <v-icon>mdi-ticket-confirmation</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import SubmitButton from "@/components/SubmitButton";
import SingleVisualizer from "@/components/tickets/SingleVisualizer";
import MultipleVisualizer from "@/components/tickets/MultipleVisualizer";

export default {
  name: "Tickets",
  components: {
    SubmitButton,
    SingleVisualizer,
    MultipleVisualizer,
  },
  props: {
    snackbar: Boolean,
    doctorsListDialog: Object,
    selectedRoom: Object,
    room: Object,
    singleViewDialog: Object,
    deletionRoom: Object,
    createRoomController: Boolean,
    loading: Boolean,
    success: Boolean,
    multipleViewDialog: Boolean,
    favoritedRoom: String,
    rooms: Array,
    normal: Number,
    priority: Number,
    roomsLoaded: Boolean,
    ticketInfo: Object,
    doctors: Array,
    doctorsLoaded: Boolean,
    sectorName: String,
    sector: Object,
    favoriteRoom: Function,
    initialInfo: Function,
    saveAndReset: Function,
    getActualTicket: Function,
    createRoom: Function,
    setDoctorToRoom: Function,
    generateNextTicket: Function,
    generateSectorTicket: Function,
    upgradeTicketNumber: Function,
    callNextTicket: Function,
    callSectorTicket: Function,
    favoritedRoom: Object,
    deleteRoom: Function,
    alertActualTicket: Function,
    openSingleView: Function,
  },
};
</script>

