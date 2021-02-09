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
                  color="purple"
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
                  color="purple"
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
                  color="purple"
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
              color="purple"
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
              color="purple"
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
        {{ formattedStartDate }}<br/>
        {{ formattedFinalDate }}<br/>
        <v-btn @click="filterData" dark color="purple">gerar relatório <v-icon right>analytics</v-icon></v-btn>
      </v-card-title>
    </v-card>
    <v-row>
      <table-with-temporal-data :desserts="desserts" />
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
      mask: { date: '##/##/####' },
      selectedStartDate: '',
      formattedStartDate: '2020-11-01'+'T00:00',
      selectedFinalDate: '',
      formattedFinalDate: '2021-12-31'+'T23:59',
      selectedUnit: '',
      selectedDoctor: '',
      selectedSpecialty: '',
      desserts: undefined,
    };
  },
  watch:{
    //
  },
  computed: {
    //
  },
  apollo:{
    GetData: {
      query: require('@/graphql/dataAnalysis/GetData.graphql'),
      variables() {
        return {
          unity: this.selectedUnit ? this.selectedUnit.id : '',
          doctor: this.selectedDoctor ? this.selectedDoctor.id : '',
          specialty: this.selectedSpecialty ? this.selectedSpecialty.id : '',
          dateStart: {formatted: this.formattedStartDate },
          dateEnd: {formatted: this.formattedFinalDate },
        }
      },
      update(data) {
        console.log('veio?:', data.Consultation)
        let consultations = Object.assign(data.Consultation)
        let array2 = consultations.reduce((objetoFinal, consultaAtual ) => {
          if(!objetoFinal[consultaAtual.of_clinic.name]) objetoFinal[consultaAtual.of_clinic.name] = []
          objetoFinal[consultaAtual.of_clinic.name].push(consultaAtual);
          return objetoFinal
        }, {})

        let keys = Object.keys(array2);
        keys.forEach((key) =>{
          array2[key] = array2[key].reduce((objetoFinal, consultaAtual ) => {
            if(!objetoFinal[consultaAtual.attended_by.name]) objetoFinal[consultaAtual.attended_by.name] = []
            objetoFinal[consultaAtual.attended_by.name].push(consultaAtual);
            return objetoFinal
          }, {})
        })

        console.log('separado:', array2)

/*        let filters = Object.keys(array2)
        filters.forEach((key) =>{
          array2[key] = array2[key].reduce((objetoFinal, consultaAtual ) => {
            if(!objetoFinal[consultaAtual.has_product.name]) objetoFinal[consultaAtual.has_product.name] = []
            objetoFinal[consultaAtual.has_product.name].push(consultaAtual);
            return objetoFinal
          }, {})
        })*/

      }
    },
  },
  methods:{
    filterData(){
      console.log('BEFORE:')
      this.formattedStartDate = this.selectedStartDate ? moment(this.selectedStartDate,'DD/MM/YYYY').format('YYYY-MM-DD') + 'T00:00' : '2020-11-01'+'T00:00'
      this.formattedFinalDate = this.selectedFinalDate ? moment(this.selectedFinalDate,'DD/MM/YYYY').format('YYYY-MM-DD') + 'T23:59' : '2021-12-31'+'T23:59'
      this.$apollo.queries.GetData.refresh();
      console.log('AFTER:')
      this.desserts = [
        {
          doctor: 'JACKSON KELVIN DE SOUZA',
          unity:'MEDIKON',
          specialty: 'DERMATOLOGIA',
          qtd: 210,
          duration: 13,
          waitingTime: 50,
        },
        {
          doctor: 'JACKSON KELVIN DE SOUZA',
          unity:'MEDIKON',
          specialty: 'UROLOGIA',
          qtd: 90,
          duration: 15,
          waitingTime: 49,
        },
        {
          doctor: 'JACKSON KELVIN DE SOUZA',
          unity:'MEDIKON',
          specialty: 'PEDIATRIA',
          qtd: 110,
          duration: 12,
          waitingTime: 55,
        },
        {
          doctor: 'JACKSON KELVIN DE SOUZA',
          unity:'MEDIKON',
          specialty: 'CLINICO GERAL',
          qtd: 155,
          duration: 14,
          waitingTime: 59,
        },
      ]
    },
  },
};
</script>