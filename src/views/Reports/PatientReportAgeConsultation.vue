<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="justify-center">
        <v-row>
          <v-col cols="5">
            <v-text-field
            label="Idade inicial"
            v-model="formattedSelectedStartDate"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
              <v-icon class="primary--text pb-5" large>event</v-icon>
          </v-col>
          <v-col cols="5">
            <v-text-field
                label="Idade final"
                v-model="formattedSelectedFinalDate"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-autocomplete
            v-model="selectedSex"
            label="selecione o sexo"
            :items="sexos"
            >
            </v-autocomplete>
          </v-col>
          <v-col cols="3">
            <apollo-query
                :query="require('@/graphql/products/LoadProducts.gql')"
                :variables="{type:'SPECIALTY'}"
            >
              <template slot-scope="{ result: { data } }">
                <v-select
                    v-model="productName"
                    :items="data.Product"
                    label="selecione a especialidade"
                    item-text="name"
                    item-value="name"
                >
                </v-select>
              </template>
            </apollo-query>
          </v-col>
          <v-col cols="3">
            <v-btn
            @click="searchUser()"
            >
              Pesquisar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
    </v-card>
    <v-card v-if="skipPatients">
      <PatientsReportAgeExam
          v-if="PatientsFixed"
          :patients="Patients"
          :PatientsArray="PatientsArray"
          :dates="dates"
          :PatientsForDate="PatientsForDate"
      >
      </PatientsReportAgeExam>
    </v-card>
    <v-progress-circular v-else indeterminate size="64"></v-progress-circular>
  </v-container>
</template>

<script>
import moment from "moment";
import PatientsReportAgeExam from "@/components/Reports/PatientsReportAgeExam";
export default {
  components: {PatientsReportAgeExam},
  data: vm => ({
    PatientsFixed: '',
    skipPatients: true,
    dateMenuStart: false,
    dateMenuFinal: false,
    selectedStartDate: moment().format("YYYY-MM-DD"),
    selectedFinalDate: moment().format("YYYY-MM-DD"),
    sexos:['Masculino', 'Feminino', ''],
    selectedSex: '',
    selectedUnit: undefined,
    sex: '',
    productName: ''
  }),
  methods:{
    searchUser(){
      this.skipPatients = false
    }
  },
  computed: {
    Patients(){
      return this.PatientsFixed
    },
    NumPatients(){
      return this.Patients.length
    },
    selectedUnit() {
      return this.$store.getters.selectedUnit
    },
    PatientsArray(){
      let PatientsArray= []
      this.Patients.map(e =>{
        let now = moment().format('YYYY')
        console.log('date end: ', parseInt(moment(e.birth_date.formatted).format("YYYY")))
        let idade = parseInt(now) - parseInt(moment(e.birth_date.formatted).format("YYYY"))
        PatientsArray.push({
          Nome: e.name,
          Telefone: e.telephones[0],
          Idade: idade
        })
    })
      console.log('patientsArray: ', PatientsArray)
      return PatientsArray
    },
     PatientsForDate(){
      let DateForPatient= {}
      this.Patients.map(e =>{
        if(DateForPatient[e.with_consultation[0].date.formatted.substring(0, 10)]){
          DateForPatient[e.with_consultation[0].date.formatted.substring(0, 10)].NumPatients +=1
          DateForPatient[e.with_consultation[0].date.formatted.substring(0, 10)].Patients.push(e)
        }
        else{
                  DateForPatient[e.with_consultation[0].date.formatted.substring(0, 10)] = {
            Patients: [],
            NumPatients: 1,
            date: e.with_consultation[0].date.formatted.substring(0,10)
          }
          DateForPatient[e.with_consultation[0].date.formatted.substring(0, 10)].Patients.push(e)
        }
      return 1
      })
      console.log('DateForBudget', DateForPatient)
      const ordered = {};

      Object.keys(DateForPatient).sort(function (a,b){ if (a > b) {
        return -1;
      }
        if (a < b) {
          return 1;
        }
        return 0;}).forEach(function(key) {
        ordered[key] = DateForPatient[key];
      });

      return ordered
    },
    dates(){
      let dates = []
      dates.push('')
      for(let i in this.PatientsForDate){
        dates.push( moment(i).format('DD/MM/YYYY'))
      }
      return dates
    },
    formattedSelectedStartDate: {
      get() {
        //this.skipPatients = false
        let now = moment().format('YYYY')
        console.log('now: ', now)
        console.log('date Start: ', parseInt(moment(this.selectedStartDate).format("YYYY")))
        let date = parseInt(now) - parseInt(moment(this.selectedStartDate).format("YYYY"))
        return date
      },
      set(val) {
        console.log('val', val)
        val = moment().subtract(val,'years').format('YYYY-MM-DD')
        console.log('val depois: ', val)
        this.selectedStartDate = val
        //this.skipPatients = false
      }
    },
    formattedSelectedFinalDate: {
      get(val) {
        console.log('val get: ', val)
        //this.skipPatients = false
        let now = moment().format('YYYY')
        console.log('date end: ', parseInt(moment(this.selectedFinalDate).format("YYYY")))
        let date = parseInt(now) - parseInt(moment(this.selectedFinalDate).format("YYYY"))
        return date
      },
      set(val) {
        console.log('val', val)
        val = moment().subtract(val,'years').format('YYYY-MM-DD')
        console.log('val depois: ', val)
        this.selectedFinalDate = val
        //this.skipPatients = false
      }
    }
  },
  apollo: {
    loadPatients: {
      query: require("@/graphql/patients/GetPatientsAgeExam.gql"),
      variables() {
        return {
          date_first: this.selectedStartDate,
          date_end:this.selectedFinalDate,
          sex: this.selectedSex,
          product: this.productName
        }
      },
      update(data) {
        console.log('data: ', data)
        console.log('data start: ', this.selectedStartDate)
        console.log('data end: ', this.selectedFinalDate)
        console.log('product: ', this.productId)
        this.PatientsFixed= data.Patient
        this.skipPatients = true
      },
      skip() {
        return this.skipPatients
      }
    }
  }
};
</script>