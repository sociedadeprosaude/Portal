<template>
  <v-container>
    <v-card>
      <v-card-title class="justify-center">
        <v-col cols="2">
          <v-menu v-model="dateMenuStart">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="formattedSelectedStartDate"
                  hint="Data inicial"
                  persistent-hint
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  dense
                  color="primary"
              />
            </template>
            <v-date-picker v-model="selectedStartDate" locale="pt-br"/>
          </v-menu>
        </v-col>
        <v-icon class="primary--text pb-5" large>event</v-icon>
        <v-col cols="2">
          <v-menu v-model="dateMenuFinal">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="formattedSelectedFinalDate"
                  hint="Data final"
                  persistent-hint
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  dense
                  color="primary"

              />
            </template>
            <v-date-picker v-model="selectedFinalDate" locale="pt-br"/>
          </v-menu>
        </v-col>
      </v-card-title>
      <v-row  class="py-0 justify-center">
        <ApolloQuery :query="require('@/graphql/clinics/LoadClinics.gql')"
                     :variables="{property: true}">
          <template v-slot="{result: {data, loading, error}}">
            <v-progress-linear v-if="loading" color="primary" indeterminate/>
            <strong class="red--text" v-else-if="error">
              Erro ao carregar as unidades, verifique sua conexão
            </strong>
            <v-chip-group mandatory v-else-if="data" active-class="primary--text">
              <v-chip v-for="unit in data.Clinic" :key="unit.name" @click="selectedUnit = unit">
                <strong style="font-size: 0.6em">{{ unit.name }}</strong>
              </v-chip>
            </v-chip-group>
          </template>
        </ApolloQuery>
      </v-row>
      <ApolloQuery v-if="selectedUnit" :query="require('@/graphql/transaction/GetTransactions.gql')"
                   :variables="{date_start: selectedStartDate + 'T00:00:00', date_final: selectedFinalDate + 'T23:59:59', unit_name: selectedUnit.name}"
      >
        <template v-slot="{result: {data, loading, error}}">
          <v-progress-circular indeterminate color="primary" v-if="loading"/>
          <strong class="red--text" v-else-if="error">
            Erro ao carregar relatorio, verifique sua conexão
          </strong>
          <GeneralReport v-else-if="data" :transactions="data.Transaction"/>
        </template>
      </ApolloQuery>
    </v-card>

  </v-container>
</template>

<script>
import GeneralReport from "@/components/Reports/GeneralReport";
import moment from "moment";
export default {
  components: {GeneralReport},
  data() {
    return {
      dateMenuStart: false,
      dateMenuFinal: false,
      selectedStartDate: moment().format("YYYY-MM-DD"),
      selectedFinalDate: moment().format("YYYY-MM-DD"),
      selectedUnit: undefined,
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