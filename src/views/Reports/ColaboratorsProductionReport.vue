<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="4" class="pa-0">
        <v-menu v-model="dateMenuStart">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
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
      <v-col cols="12" class="py-0">
        <ApolloQuery :query="require('@/graphql/clinics/LoadClinics.gql')"
                     :variables="{property: true}">
          <template v-slot="{result: {loading, error, data}}">
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
      <v-col cols="12">
      <ApolloQuery v-if="selectedUnit" :query="require('@/graphql/transaction/GetTransactions.gql')"
                   :variables="{date_start: selectedStartDate + 'T00:00:00', date_final: selectedFinalDate + 'T23:59:59', unit_name: selectedUnit.name}"
      >
        <template v-slot="{result: {loading, error, data}}">
          <v-progress-circular indeterminate color="primary" v-if="loading"></v-progress-circular>
          <strong class="red--text" v-else-if="error">Erro ao carregar relatorio, verifique sua conexão</strong>
          <colaborators-production-report
              v-else-if="data"
              :transactions="data.Transaction"
          ></colaborators-production-report>
        </template>
      </ApolloQuery>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ColaboratorsProductionReport from "@/components/Reports/ColaboratorsProductionReport";
import moment from "moment";

export default {
  // name: "ColaboratorsProductionReport",
  components: {
    ColaboratorsProductionReport
  },
  data() {
    return {
      dateMenuStart: false,
      dateMenuFinal: false,
      selectedStartDate: moment().format("YYYY-MM-DD"),
      selectedFinalDate: moment().format("YYYY-MM-DD"),
      selectedUnit: null
    };
  },
  computed: {
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
  }
};
</script>
