<template>
  <v-content>
    <v-container>
      {{ selectedStartDate }}
      {{ selectedFinalDate }}
      <v-row class="align-center justify-center">
        <v-col cols="4" class="pa-0">
          <v-menu v-model="dateMenuStart">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  outlined
                  v-model="formattedSelectedStartDate"
                  label="Data"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
                v-model="selectedStartDate"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="4">
          <v-menu v-model="dateMenuFinal">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  outlined
                  v-model="formattedSelectedFinalDate"
                  label="Data"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
                v-model="selectedFinalDate"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" xs="12" class="py-0">
          <ApolloQuery :query="require('@/graphql/clinics/LoadClinics.gql')"
                       :variables="{property: true}">
            <template v-slot="{result: {data, loading, error}}">
              <v-progress-linear v-if="loading" color="primary" indeterminate></v-progress-linear>
              <strong class="red--text" v-else-if="error">Erro ao carregar as unidades, verifique sua conexão</strong>
              <v-chip-group mandatory v-else-if="data" active-class="primary white--text">
                <v-chip v-for="unit in data.Clinic" :key="unit.name" @click="selectedUnit = unit">
                  <strong style="font-size: 0.6em">{{ unit.name }}</strong>
                </v-chip>
              </v-chip-group>
            </template>
          </ApolloQuery>
        </v-col>
      </v-row>
      <v-layout class="align-center justify-center" row wrap>
        <table-tickets-report v-if="collaborators && selectedUnit" :collaborators="collaborators" :selectedUnit="selectedUnit"></table-tickets-report>
        <v-row v-else class="align-center justify-center">
          <v-alert type="warning">
            <strong>Nenhum Ticket chamado Neste Período</strong>
          </v-alert>
        </v-row>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import TableTicketsReport from "@/components/Reports/TableTicketsReport";
import moment from "moment";
export default {
  components: {TableTicketsReport},
  data: () => ({
    collaborators: undefined,
    dateMenuStart: false,
    dateMenuFinal: false,
    selectedStartDate: moment().format("YYYY-MM-DD"),
    selectedFinalDate: moment().format("YYYY-MM-DD"),
    selectedUnit: undefined,
  }),
  apollo: {
    LoadColaborators: {
      query: require("@/graphql/colaborators/LoadColaborators.gql"),
      update(data){
        this.collaborators = Object.assign(data.Colaborator)
        //console.log('reativo:', this.collaborators)
      },
    }
  },
  computed:{
    formattedSelectedStartDate: {
      get() {
        return moment(this.selectedStartDate).format("DD/MM/YYYY")
      },
      set(val) {
        this.selectedDate = val
      }
    },
    formattedSelectedFinalDate: {
      get() {
        return moment(this.selectedFinalDate).format("DD/MM/YYYY")
      },
      set(val) {
        this.selectedDate = val
      }
    }
  },
  watch:{
    //
  },
  methods: {
    //
  }
};
</script>
<style scoped>
</style>