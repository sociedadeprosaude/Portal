<template>
    <v-container class="ma-0 pa-0">
        <v-navigation-drawer v-if="doctorsAgendaToobar" class="hidden-print-only" dark absolute temporary v-model="drawer">
            <v-list>
                <v-list-item
                        v-for="item in menuItems"
                        :key="item.title"
                        @click.native="goRoute(item.link)">
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>{{ item.title }}</v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar color="primary_dark hidden-xs-only" fixed dark class="hidden-print-only" v-if="selectedUnit">
            <v-app-bar-nav-icon v-if="doctorsAgendaToobar" @click.stop="drawer = !drawer"/>

      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
          <v-img v-if="selectedUnit" :src="selectedUnit.logo" aspect-radio="1" width="240"></v-img>
        </router-link>
      </v-toolbar-title>
      <v-toolbar-items>
        <v-layout row wrap class="justify-center align-center">
          <v-btn rounded text @click="selectUnit()">
            <v-icon>cached</v-icon>
          </v-btn>
        </v-layout>
      </v-toolbar-items>
      <v-spacer />
      <v-toolbar-items>
        <v-flex class="mt-n2">
          <v-card class="transparent" flat v-if="selectedPatient">
            <v-list-item>
              <v-icon left>person</v-icon>
              <v-list-item-content>
                <v-list-item-title>Nome: {{selectedPatient.name}}</v-list-item-title>
                <v-list-item-subtitle v-if="selectedPatient.cpf !== ''">
                  CPF: {{selectedPatient.cpf}}
                  <br />
                  TELEFONE: {{selectedPatient.telephones ? selectedPatient.telephones[0] : 'Número não informado'}}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
      </v-toolbar-items>
    </v-app-bar>
    <v-app-bar
      dense
      flat
      color="white hidden-sm-and-up"
      light
      fixed
      class="hidden-print-only"
      v-if="selectedUnit"
    >
      <v-app-bar-nav-icon hidden v-if="doctorsAgendaToobar" @click.stop="drawer = !drawer" />
      <v-toolbar-title class="ma-0 pa-0">
        <router-link to="/" tag="span" style="cursor: pointer">
          <v-img v-if="selectedUnit" :src="selectedUnit.logo" aspect-radio="1" width="100"></v-img>
        </router-link>
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-layout row wrap class="justify-center align-center">
          <v-btn rounded text @click="selectUnit()">
            <v-icon class="black--text">cached</v-icon>
          </v-btn>
          <v-btn class="hidden-sm-and-up" text @click="patientDialog = !patientDialog">
            <v-icon class="primary_light--text">people</v-icon>
          </v-btn>
        </v-layout>
      </v-toolbar-items>
      <v-spacer />
    </v-app-bar>
    <v-dialog v-model="patientDialog" transition="dialog-bottom-transition">
      <select-patient-card />
    </v-dialog>
    <v-dialog v-model="selectUnitDialog">
      <v-card>
        <v-layout row wrap class="align-center justify-center">
          <v-flex xs12 sm4 v-for="unit in units" :key="unit.id" class="text-center">
            <v-btn @click="selectUnit(unit)" height="124px">
              <img :src="unit.logo" width="256px" />
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import SelectPatientCard from "../Patient/SelectPatientCard";
export default {
  name: "AgendaToolbar",
  components: {
    SelectPatientCard
  },
  data() {
    return {
      drawer: false,
      dialog: false,
      selectUnitDialog: false,
      patientDialog: false,
      menuItems: [
        {
          icon: "delete_forever",
          title: "Apagar Consultas do dia",
          link: "/agenda/DeletarConsultas"
        },
        {
          icon: "event_note",
          title: "Agendamento de Consultas",
          link: "/agenda/agendamento"
        },
        {
          icon: "date_range",
          title: "Gerenciamento de Consultas do Médico",
          link: "/agenda/GerenciamentoConsultas"
        },
        {
          icon: "event",
          title: "Gerenciamento de Consultas do Paciente",
          link: "/agenda/ConsultasPacientes"
        },
        {
          icon: "event_busy",
          title: "Gerenc. de Consultas Canceladas de Todas as Especilidades",
          link: "/agenda/ConsultasCanceladas"
        },
        { icon: "translate", title: "Pesquisa de CIDs", link: "/agenda/Cids" }
      ]
    };
  },
  computed: {
    examsLoaded() {
      return this.$store.getters.examsLoaded;
    },
    units() {
      return this.$store.getters.units;
    },
    selectedUnit() {
      return this.$store.getters.selectedUnit;
    },
    selectedPatient() {
      return this.$store.getters.selectedPatient;
    },
    doctorsAgendaToobar() {
      return this.$store.getters.showDoctorsAgendaToolbar;
    }
  },
  methods: {
    goRoute(route) {
      this.$router.push(route);
    },

    selectUnit(unit) {
      if (!this.selectUnitDialog) {
        this.selectUnitDialog = true;
        return;
      }
      this.$store.commit("setSelectedUnit", unit);
    }
  }
};
</script>

<style scoped>
</style>