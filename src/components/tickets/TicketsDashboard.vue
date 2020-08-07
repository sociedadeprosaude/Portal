<template>
  <v-container>
    <v-row>
      <v-col cols="12" align="start">
        <v-btn fab @click="createSector">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn
          :color="creation.editing ? 'amber' : ''"
          fab
          @click="creation.editing = !creation.editing"
          class="ml-2"
        >
          <v-icon>edit</v-icon>
        </v-btn>
        <v-btn fab @click="$emit('change-dialog-change-ticket',true)" class="ml-2">
          <v-icon>mdi-ticket-confirmation</v-icon>
        </v-btn>
      </v-col>

      <v-row v-if="!loading" justify="center" align="center" align-content="center">
        <v-col align-self="center" cols="12" sm="4" v-for="sector in sectors" :key="sector.name">
          <v-expand-transition>
            <v-col cols="12" v-if="creation.editing" align="end">
              <v-btn fab x-small class="red" @click="deleteSector(sector)">
                <v-icon class="white--text">delete</v-icon>
              </v-btn>
            </v-col>
          </v-expand-transition>
          <v-card class="card mx-3" @click="choose(sector)">
            <v-container>
              <v-row align="center" justify="center">
                <v-col cols="12">
                  <span
                    style="font-size: 2.0em"
                    class="mt-10 font-weight-bold"
                  >{{sector.name.substring(0, 1)}}</span>
                </v-col>
                <v-col cols="12">
                  <span class="text-center my-headline">{{sector.name}}</span>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
      <v-progress-circular indeterminate color="primary" v-else></v-progress-circular>
    </v-row>
    <v-dialog v-model="creation.creationDialog" max-width="500px">
      <v-card>
        <v-col cols="12" align="start">
          <span class="my-headline">Criar setor</span>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="creation.sectorName" label="Nome do setor" />
        </v-col>
        <v-col cols="12" align="end">
          <v-btn
            @click="createSector(creation.sectorName)"
            color="primary"
            rounded
            v-if="!creation.creating"
          >Criar</v-btn>
          <v-progress-circular indeterminate color="primary" v-else />
        </v-col>
      </v-card>
    </v-dialog>
    <v-dialog v-model="creation.deletingDialog" max-width="500px">
      <v-card>
        <v-col cols="12" align="start">
          <span class="my-headline">Deletar setor {{creation.choosed ? creation.choosed.name : ''}}?</span>
        </v-col>
        <v-col cols="12" align="end">
          <v-btn
            @click="deleteSector(creation.choosed)"
            color="primary"
            rounded
            v-if="!creation.deleting"
          >Deletar</v-btn>
          <v-progress-circular indeterminate color="primary" v-else />
        </v-col>
      </v-card>
    </v-dialog>

    <v-dialog
      v-bind:value="dialogChangeTicket"
      @click:outside="$emit('change-dialog-change-ticket',false)"
      width="500"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>Trocar último ticket chamado?</v-card-title>
        <v-card-text>
          <v-text-field
            type="number"
            label="Último ticket"
            v-bind:value="lastTicket"
            @change="(event)=>$emit('change-last-ticket',Number(event))"
          ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="$emit('change-dialog-change-ticket',false)">Cancelar</v-btn>
          <v-btn
            :loading="loadingChange"
            text
            @click="updateLastTicket(lastTicket)"
          >Trocar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "TicketsDashboard",
  props: {
    creation: Object,
    choosed: Boolean,
    sector: Object,
    createSector: Function,
    deleteSector: Function,
    choose: Function,
    resetCreation: Function,
    dialogChangeTicket: Boolean,
    loadingChange: Boolean,
    lastTicket: Number,
    updateLastTicket: Function,
    sectors: Array,
    loading: Boolean,
  },
};
</script>
