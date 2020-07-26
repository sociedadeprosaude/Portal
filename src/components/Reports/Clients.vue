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
              <v-progress-linear
                rounded
                :value="genderClientsServed.Masculino"
                color="#FFAB00"
                height="15"
              >
                <template v-slot="{ value }">
                  <strong>{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>

              <br />

              <h1 class="subtitle-1">Feeminino</h1>
              <v-progress-linear
                rounded
                :value="genderClientsServed.Feminino"
                color="#D81B60"
                height="15"
              >
                <template v-slot="{ value }">
                  <strong>{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>

              <br />

              <h1 class="subtitle-1">Outros</h1>
              <v-progress-linear
                rounded
                :value="genderClientsServed.others"
                color="#00E5FF"
                height="15"
              >
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
import BarChart from "@/components/Charts/BarChart";
import Gmaps from "@/components/Maps/Gmaps";
export default {
  components: {
    LineChart,
    BarChart,
    Gmaps
  },
  props: [
    "dataset",
    "clientsServed",
    "newClients",
    "ageClientsServed",
    "genderClientsServed",
    "generateDatasetServed",
    "generateDatasetNewClients",
    "generateDatasetClientsAge",
    "options"
  ]
};
</script>

<style>
</style>