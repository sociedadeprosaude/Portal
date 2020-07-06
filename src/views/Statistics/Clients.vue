<template>
  <v-container>
    <v-row class="mt-2">
      <h1>Clientes</h1>
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="0">
          <v-row v-if="clientsServed">
            <v-col>
              <line-chart :chart-data="generateDatasetServed(clientsServed)" :options="options"></line-chart>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <h1>Novos Clientes</h1>
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="0">
          <v-row v-if="newClients">
            <v-col>
              <line-chart :chart-data="generateDatasetNewClients(newClients)" :options="options"></line-chart>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <h1>Idade dos visitantes</h1>
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="0">
          <v-row v-if="ageClientsServed">
            <v-col>
              <BarChart
                :chart-data="generateDatasetClientsAge(ageClientsServed)"
                :options="options"
              ></BarChart>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <h1>Gênero dos visitantes</h1>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5" elevation="0">
          <v-row v-if="genderClientsServed">
            <v-col>
              <h1 class="subtitle-1">Masculino</h1>
              <v-progress-linear rounded :value="genderClientsServed.Masculino" color="#FFAB00" height="15">
                <template v-slot="{ value }">
                  <strong>{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>

              <br/>

              <h1 class="subtitle-1">Feeminino</h1>
              <v-progress-linear rounded :value="genderClientsServed.Feminino" color="#D81B60" height="15">
                <template v-slot="{ value }">
                  <strong>{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>

              <br />

              <h1 class="subtitle-1">Outros</h1>
              <v-progress-linear rounded :value="genderClientsServed.others" color="#00E5FF" height="15">
                <template v-slot="{ value }">
                  <strong>{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <h1>Localidade dos visitantes</h1>
    </v-row>
    <v-row>
      <v-col>
        <Gmaps></Gmaps>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LineChart from "@/components/Charts/LineChart";
import BarChart from "../../components/Charts/BarChart";
import Gmaps from '../../components/Maps/Gmaps';
import moment from "moment";
export default {
  data: () => ({
    dataset: null
  }),
  components: {
    LineChart,
    BarChart,
    Gmaps
  },
  mounted() {},
  computed: {
    clientsServed() {
      return this.$store.getters.getClientsServed;
    },
    newClients() {
      return this.$store.getters.getNewClients;
    },
    ageClientsServed() {
      let data = this.$store.getters.getAgeClientsServed;
      return this.$store.getters.getAgeClientsServed;
    },
    genderClientsServed() {
      return this.$store.getters.getGenderClientsServed;
    }
  },
  methods: {
    generateDatasetServed(dataset) {
      return {
        labels: Object.keys(dataset),
        datasets: [
          {
            label: "Novos clientes",
            backgroundColor: "#81C784",
            borderColor: "#fff",
            data: Object.values(dataset)
          }
        ]
      };
    },
    generateDatasetNewClients(dataset) {
      return {
        labels: Object.keys(dataset),
        datasets: [
          {
            label: "Novos clientes",
            backgroundColor: "#81C784",
            borderColor: "#fff",
            data: Object.values(dataset)
          }
        ]
      };
    },
    generateDatasetClientsAge(dataset) {
      console.log("labes->", Object.keys(dataset));
      console.log("values->", Object.values(dataset));
      return {
        labels: Object.keys(dataset),
        datasets: [
          {
            label: "Idade dos clientes",
            backgroundColor: "#0288D1",
            borderColor: "#fff",
            data: Object.values(dataset)
          }
        ]
      };
    },
    options() {
      return {
        legend: {
          display: true
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        },
        tooltips: {
          enabled: true,
          callbacks: {
            title: (items, data) => "R$ " + items[0],
            label: (items, data) => data
          }
        }
      };
    }
  }
};
</script>

<style>
</style>