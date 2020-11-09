<template>
  <v-container fluid v-if="NumPatientsNotAddress">
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <MiniStatistic icon="mdi-counter" :title="Patient.length" sub-title="Nº Pacientes" color="blue" />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <MiniStatistic icon="mdi-counter" :title="NumPatientsNotAddress" sub-title="Nº Pacientes sem endereço" color="blue" />
      </v-col> <v-col cols="12" sm="6" md="3">
      <MiniStatistic icon="mdi-counter" :title="NumPatientsAddress" sub-title="Nº Pacientes com endereço" color="blue" />
    </v-col>

    </v-row>
    <!-- <v-row>
      <v-col cols="12" md="6">
        <h1>Comprados</h1>
        <v-card>
          <v-card-text>
            <div v-for="(item,i) in BudgetsPaid" :key="i">
              <v-row>
                <v-col class="text-left">
                  <span class="title">{{i+1}}. {{date(item.date.formatted)}}</span>
                </v-col>
                <v-col>
                  <span class="ml-auto font-weight-bold">R$ {{item.value}}</span>
                </v-col>
                <v-col>
                  <span class="ml-auto font-weight-bold">Vendendor :{{item.with_transaction.colaborator[0].name}}</span>
                </v-col>
              </v-row>
              <v-divider />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <h1>Total de Orçamentos</h1>
        <v-card elevation="0">
          <pie-chart
              :chart-data="NumTotal"
          ></pie-chart>
        </v-card>
      </v-col>
    </v-row> -->
  </v-container>
  <v-container v-else>loading</v-container>
</template>

<script>
import LineChart from "@/components/Charts/LineChart";
import BarChart from "@/components/Charts/BarChart";
import PieChart from "@/components/Charts/PieChart";
import MiniStatistic from "@/components/MiniStatistic";
import moment from 'moment'
export default {
  components: {
    MiniStatistic,
    LineChart,
    PieChart,
    BarChart
  },
  props: [
      "Patient",
      "NumPatientsNotAddress",
      "NumPatientsAddress"
  ],
  methods:{
    date(date){
      return moment(date).format('DD/MM/YYYY')
    }
  }
};
</script>