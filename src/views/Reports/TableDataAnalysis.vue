<template>
  <v-container>
    <v-card>
      <v-card-title class="justify-center">

        <v-col cols="2">
          <ApolloQuery :query="require('@/graphql/clinics/LoadClinics.gql')"
                       :variables="{property: true}">
            <template v-slot="{result: {data, loading, error}}">
              <v-progress-linear v-if="loading" color="primary" indeterminate/>
              <strong class="red--text" v-else-if="error">
                Erro ao carregar as unidades, verifique sua conexão
              </strong>
              <v-combobox
                  v-model="selectedUnit"
                  :items="data.Clinic"
                  item-text="name"
                  return-object
                  label="Unidades"
                  outlined
                  clearable
                  dense
              >
                <template v-slot:selection="data">
                  <v-chip
                      small
                      :key="JSON.stringify(data.item)"
                      :input-value="data.selected"
                      :disabled="data.disabled"
                      class="v-chip--select-multi"
                      @click.stop="data.parent.selectedIndex = data.index"
                      @input="data.parent.selectItem(data.item)"
                      text-color="white"
                      color="purple"
                  >{{ data.item.name }}
                  </v-chip>
                </template>
              </v-combobox>
            </template>
          </ApolloQuery>
        </v-col>

        <v-col cols="3">
          <ApolloQuery :query="require('@/graphql/doctors/LoadDoctors.gql')">
            <template v-slot="{result: {data, loading, error}}">
              <v-progress-linear v-if="loading" color="primary" indeterminate/>
              <strong class="red--text" v-else-if="error">
                Erro ao carregar as unidades, verifique sua conexão
              </strong>
              <v-combobox
                  v-model="selectedDoctor"
                  :items="data.Doctor"
                  item-text="name"
                  return-object
                  label="Medicos"
                  outlined
                  clearable
                  dense
              >
                <template v-slot:selection="data">
                  <v-chip
                      small
                      :key="JSON.stringify(data.item)"
                      :input-value="data.selected"
                      :disabled="data.disabled"
                      class="v-chip--select-multi"
                      @click.stop="data.parent.selectedIndex = data.index"
                      @input="data.parent.selectItem(data.item)"
                      text-color="white"
                      color="purple"
                  >{{ data.item.name }}
                  </v-chip>
                </template>
              </v-combobox>
            </template>
          </ApolloQuery>
        </v-col>

        <v-col cols="3">
          <ApolloQuery :query="require('@/graphql/products/LoadProducts.gql')"
                       :variables="{type: 'SPECIALTY', schedulable: false}">
            <template v-slot="{result: {data, loading, error}}">
              <v-progress-linear v-if="loading" color="primary" indeterminate/>
              <strong class="red--text" v-else-if="error">
                Erro ao carregar as unidades, verifique sua conexão
              </strong>
              <v-combobox
                  v-model="selectedSpecialty"
                  :items="data.Product"
                  item-text="name"
                  return-object
                  label="Especialidades"
                  outlined
                  clearable
                  dense
              >
                <template v-slot:selection="data">
                  <v-chip
                      small
                      :key="JSON.stringify(data.item)"
                      :input-value="data.selected"
                      :disabled="data.disabled"
                      class="v-chip--select-multi"
                      @click.stop="data.parent.selectedIndex = data.index"
                      @input="data.parent.selectItem(data.item)"
                      text-color="white"
                      color="purple"
                  >{{ data.item.name }}
                  </v-chip>
                </template>
              </v-combobox>
            </template>
          </ApolloQuery>
        </v-col>

        <v-col cols="2">
          <v-text-field
              outlined
              dense
              clearable
              v-model="selectedStartDate"
              v-mask="mask.date"
              prepend-icon="event"
              label="Data inicial"
              hint="Data inicial"
              persistent-hint
              placeholder="__/__/____">
          </v-text-field>
        </v-col>

        <v-col cols="2">
          <v-text-field
              outlined
              dense
              clearable
              v-model="selectedFinalDate"
              v-mask="mask.date"
              prepend-icon="event"
              label="Data final"
              hint="Data final"
              persistent-hint
              placeholder="__/__/____">
          </v-text-field>
        </v-col>
<!--        {{ selectedUnit }}<br/>
        {{ selectedDoctor }}<br/>
        {{ selectedSpecialty }}<br/>-->
        {{ selectedStartDate }}<br/>
        {{ selectedFinalDate }}<br/>
        <v-btn @click="filterData" dark color="purple">gerar relatório <v-icon right>analytics</v-icon></v-btn>
      </v-card-title>
    </v-card>
    <v-row>
      <table-with-temporal-data :loading="loading" :desserts="desserts" />
    </v-row>
  </v-container>
</template>

<script>
import moment from "moment";
import TableWithTemporalData from "@/components/Reports/TableWithTemporalData";
import {mask} from "vue-the-mask";
export default {
  name: "TableDataAnalysis",
  directives: {
    mask,
  },
  components: {TableWithTemporalData},
  data() {
    return {
      loading: false,
      mask: { date: '##/##/####' },
      selectedStartDate: undefined,
      selectedFinalDate: undefined,
      selectedUnit: undefined,
      selectedDoctor: undefined,
      selectedSpecialty: undefined,
      desserts: undefined,
    };
  },
  watch:{
    //
  },
  computed: {
    //
  },
  methods:{
    filterData(){
      this.loading = true
      //this.selectedStartDate = moment(this.selectedStartDate,'DD/MM/YYYY').format('YYYY-MM-DD')
      setTimeout(() => (this.loading = false), 5000);

      this.desserts = [
        {
          doctor: 'Jackson kelvin de souza',
          unity:'MEDIKON',
          specialty: 'DERMATOLOGIA',
          qtds: '90 / 15',
          durations: '14 / 11',
          overallDuration: 13,
          waitingTimes: '55 / 37',
          overallWaitingTime: 50,
        },
        {
          doctor: 'Jackson kelvin de souza',
          unity:'MEDIKON',
          specialty: 'UROLOGIA',
          qtds: '90 / 15',
          durations: '14 / 11',
          overallDuration: 13,
          waitingTimes: '55 / 37',
          overallWaitingTime: 50,
        },
        {
          doctor: 'Jackson kelvin de souza',
          unity:'MEDIKON',
          specialty: 'PEDIATRIA',
          qtds: '90 / 15',
          durations: '14 / 11',
          overallDuration: 13,
          waitingTimes: '55 / 37',
          overallWaitingTime: 50,
        },
        {
          doctor: 'Jackson kelvin de souza',
          unity:'MEDIKON',
          specialty: 'CLINICO GERAL',
          qtds: '90 / 15',
          durations: '14 / 11',
          overallDuration: 13,
          waitingTimes: '55 / 37',
          overallWaitingTime: 50,
        },

      ]
    },
  },
};
</script>