<template>
  <v-container>
    <v-row class="mt-2">
      <h1 class="headline">Clientes Atendidos por dia a partir de </h1>

      <v-col class="ml-3 mt-n8" cols="2">
        <v-menu
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="dateFormatted"
            prepend-icon="event"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date" @input="menu2 = false"></v-date-picker>
      </v-menu>
      </v-col>
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
      <h1 class="headline">Novos Clientes</h1>
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
      <h1 class="headline">Clientes Atendidos por hora</h1>
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="0">
          <v-row v-if="clientsServed">
            <v-col>
              <line-chart :chart-data="generateDatasetServedByHour(clientsServedByHour)" :options="options"></line-chart>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <h1 class="headline">Clientes Atendidos por dia da semana</h1>
    </v-row>
    <v-row>
      <v-col>
        <v-card elevation="0">
          <v-row v-if="clientsServedByWeekDay">
            <v-col>
              <line-chart :chart-data="generateDatasetClientsWeekDay(clientsServedByWeekDay)" :options="options"></line-chart>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <h1 class="headline">Idade dos visitantes</h1>
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
      <h1 class="headline">Gênero dos visitantes</h1>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5" elevation="0">
          <v-row v-if="genresClientsServed">
            <v-col>
              <h1 class="subtitle-1">Masculino</h1>
              <v-progress-linear
                rounded
                :value="genresClientsServed.male"
                color="#FFAB00"
                height="15"
              >
                <template v-slot="{ value }">
                  <strong>{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>

              <br />

              <h1 class="subtitle-1">Feminino</h1>
              <v-progress-linear
                rounded
                :value="genresClientsServed.feminine"
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
                :value="genresClientsServed.others"
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

    <!-- <v-row class="mt-2">
      <h1 class="headline">Localidade dos visitantes</h1>
      <v-spacer></v-spacer>
      <v-menu
        ref="menu"
        v-bind:value="menu"
        @input="(event)=>$emit('change-menu',event)"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        width="100px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            label="Escolha o período dos usuários atendidos"
            prepend-icon="event"
            readonly
            v-bind="attrs"
            v-on="on"
            :value="dateFormatted"
          ></v-text-field>
        </template>
        <v-date-picker
          v-bind:value="date"
          @input="(event)=>$emit('change-date',event)"
          type="month"
          no-title
          scrollable
          locale="pt-br"
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
          <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </v-row> -->
    <v-row>
      <v-col>
        <Gmaps :geopoints="geopoints" :period_report="date"></Gmaps>
      </v-col>
    </v-row> 
  </v-container>
</template>

<script>
import LineChart from "@/components/Charts/LineChart";
import BarChart from "../../components/Charts/BarChart";
import Gmaps from "../../components/Maps/Gmaps";
import moment from "moment";
export default {
  props: [
    "dataset",
    "menu",
    "clientsServed",
    "clientsServedByHour",
    "clientsServedByWeekDay",
    "newClients",
    "ageClientsServed",
    "genresClientsServed",
    "geopoints",
    "generateDatasetServed",
    "generateDatasetServedByHour",
    "generateDatasetNewClients",
    "generateDatasetClientsAge",
    "generateDatasetClientsWeekDay",
    "options",
  ],
  components: {
    LineChart,
    BarChart,
    Gmaps,
  },

  data: () => ({
    menu2:false,
    date:undefined
  }),
  mounted(){
    this.date = moment().subtract(7,'days').format('YYYY-MM-DD')
  },
  watch:{
    date(value){
      if(value){
        this.$emit('changeDateReport',value)
      }
    }
  },
  computed:{
    dateFormatted() {
      return this.date ? moment(this.date, "YYYY-MM-DD").format("DD/MM/YYYY") : "";
    },
  }
};
</script>

<style>
</style>