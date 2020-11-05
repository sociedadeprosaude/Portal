<template>
  <v-container fluid v-if="statistics && months && years">
    <v-row justify="start" align="center">
      <v-col cols="12" md="3">
        <p>
          <span style="font-size: 2em;">Overview</span>
        </p>
      </v-col>
      <v-col cols="6" md="2">
        <v-select
          :items="years"
          label="Ano"
          v-bind:value="year"
          @change="(event)=>$emit('change-year',event)"
        ></v-select>
      </v-col>
      <v-col cols="6" md="2">
        <v-select
          :items="months"
          label="Mês"
          v-bind:value="month"
          @change="(event)=>$emit('change-month',event)"
        >
          <template v-slot:selection>{{monthName(month)}}</template>
          <template v-slot:item="data">{{monthName(data.item)}}</template>
        </v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" md="3">
        <MiniStatistic
          icon="mdi-currency-usd-off"
          :title="`R$ ${totalToPay}`"
          sub-title="Contas total"
          color="red"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <MiniStatistic
          icon="mdi-update"
          :title="`R$ ${totalRecurrent}`"
          sub-title="Custos recorrentes"
          color="blue-grey darken-2"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <MiniStatistic
          icon="mdi-counter"
          :title="numOfOuttakesToPay"
          sub-title="Nº de contas pendentes"
          color="blue"
        />
      </v-col>
    </v-row>
    <v-row class="mt-2">
      <h1>Gastos (R$)</h1>
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="0">
          <v-row>
            <v-col>
              <line-chart
                :chart-data="this.$vuetify.breakpoint.xs?spentDataset:spentDatasetMonthly"
                :options="options"
              ></line-chart>
              <div v-if="this.$vuetify.breakpoint.xs">
                <v-icon @click="week -= week == 0 ? 0:1">mdi-minus</v-icon>
                semana {{week+1}}
                <v-icon @click="week += week == 3 ? 0:1">mdi-plus</v-icon>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <h1>Maiores gastos</h1>

        <v-card>
          <v-card-text>
            <div v-for="(item,i) in higherCostDataset" :key="i">
              <v-row>
                <v-col class="text-left">
                  <span class="title">{{i+1}}. {{item.name}}</span>
                </v-col>
                <v-col>
                  <span class="ml-auto font-weight-bold">R$ {{item.totalToPay}}</span>
                </v-col>
              </v-row>
              <v-divider />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <h1>Maiores gastos (Nº)</h1>

        <v-card elevation="0">
          <pie-chart
            :chart-data="mostSpentDataset"
            :options="{
            legend: {
     display:mostSpentDataset.labels.length > 15 ? false:true
}}"
          ></pie-chart>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-2">
      <h1>Número de gastos</h1>
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="0">
          <v-row v-if="mostSpentDatasetMontly">
            <v-col>
              <bar-chart
                :chart-data="mostSpentDatasetMontly"
                :options="{
                legend: {
          display: false
        },
        scales: {
            xAxes: [{
                stacked: true
            }],
          
        }
     
              }"
              ></bar-chart>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>loading</v-container>
</template>

<script>
import LineChart from "@/components/Charts/LineChart";
import BarChart from "@/components/Charts/BarChart";
import PieChart from "@/components/Charts/PieChart";
import MiniStatistic from "@/components/MiniStatistic";
export default {
  components: {
    MiniStatistic,
    LineChart,
    PieChart,
    BarChart
  },
  props: [
    "years",
    "year",
    "months",
    "month",
    "week",
    "monsthsName",
    "monthName",
    "round2",
    "statistics",
    "info",
    "totalToPay",
    "totalRecurrent",
    "numOfOuttakesToPay",
    "maisVendidos",
    "labels",
    "spentDatasetMonthly",
    "spentDataset",
    "higherCostDataset",
    "mostSpentDataset",
    "mostSpentDatasetMontly",
    "options"
  ]
};
</script>