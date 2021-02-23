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
                :query="require('@/graphql/products/LoadAllProducts.gql')"
            >
              <template slot-scope="{ result: { data } }">
                <v-select
                    v-if="data"
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
  data: () => ({
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
        let idade = parseInt(now) - parseInt(moment(e.with_transactionPay.with_user[0].birth_date.formatted).format("YYYY"))
        PatientsArray.push({
          Nome: e.with_transactionPay.with_user[0].name,
          Telefone: e.with_transactionPay.with_user[0].telephones[0],
          Idade: idade
        })
    })
      return PatientsArray
    },
     PatientsForDate(){
      let DateForPatient= {}
      this.Patients.map(e =>{
        if(DateForPatient[e.with_transactionPay.date.formatted.substring(0, 10)]){
          DateForPatient[e.with_transactionPay.date.formatted.substring(0, 10)].NumPatients +=1
          DateForPatient[e.with_transactionPay.date.formatted.substring(0, 10)].Patients.push(e.with_transactionPay.with_user[0])
        .with_user}
        else{
                  DateForPatient[e.with_transactionPay.date.formatted.substring(0, 10)] = {
            Patients: [],
            NumPatients: 1,
            date: e.with_transactionPay.date.formatted.substring(0,10)
          }
          DateForPatient[e.with_transactionPay.date.formatted.substring(0, 10)].Patients.push(e.with_transactionPay.with_user[0])
        }
      return 1
      })
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
        let now = moment().format('YYYY')
        let date = parseInt(now) - parseInt(moment(this.selectedStartDate).format("YYYY"))
        return date
      },
      set(val) {
        val = moment().subtract(val,'years').format('YYYY-MM-DD')
        this.selectedStartDate = val
      }
    },
    formattedSelectedFinalDate: {
      get() {
        let now = moment().format('YYYY')
        let date = parseInt(now) - parseInt(moment(this.selectedFinalDate).format("YYYY"))
        return date
      },
      set(val) {
        val = moment().subtract(val,'years').format('YYYY-MM-DD')
        this.selectedFinalDate = val
      }
    }
  },
  apollo: {
    loadPatients: {
      query: require("@/graphql/patients/GetPatientsProduct.gql"),
      variables() {
        return {
          date_first: this.selectedStartDate,
          date_end:this.selectedFinalDate,
          sex: this.selectedSex,
          product: this.productName
        }
      },
      update(data) {
        this.PatientsFixed= data.ProductTransaction
        this.skipPatients = true
      },
      skip() {
        return this.skipPatients
      }
    }
  }
};
</script>