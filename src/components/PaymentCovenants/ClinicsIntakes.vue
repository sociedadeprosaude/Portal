<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-select
              v-model="selectedDate"
              label="Escolha uma data"
              :items="dates"
          ></v-select>
        </v-card>
        <v-card v-for="(patient,i) in patientsOuttakes" :key="i">
          <v-layout row wrap class="primary">
            <v-flex xs12>
              <v-divider class="primary"></v-divider>
            </v-flex>
            <v-flex xs6 md4 class="align-center font-weight-bold justify-center">
              <p class="white--text mt-5">
                Paciente: {{ patient.name }}
              </p>
            </v-flex>
            <v-flex xs6 md3>
              <p class="mt-5  body-2  white--text"> N° DE EXAMES: {{ patient.outtakes.length }}</p>
            </v-flex>
            <v-flex xs6 md4 class="text-center align-center justify-center">
              <p class="mt-5 white--text  body-2"> PREÇO TOTAL: {{ allPrices(patient) }}</p>
            </v-flex>
            <v-flex xs12>
              <v-divider class="primary"></v-divider>
            </v-flex>
          </v-layout>
          <v-layout v-for="outtake in patient.outtakes">
            <v-flex xs8 md7 class="align-start justify-start">
              <p class="font-weight-black mt-5">
                {{ outtake.ProductTransaction[0].Product.name }}
              </p>
            </v-flex>
            <v-flex xs4 md4 class="text-center align-center justify-center">
              <p class="mt-5"> PREÇO: {{ -outtake.value }}</p>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex xs12>
        <v-divider class="my-3"/>
      </v-flex>
      <v-spacer/>
      <v-flex xs11/>
      <v-flex xs12 v-if="loading">
        <v-progress-linear color="primary" indeterminate/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {mask} from "vue-the-mask";
import moment from "moment"

export default {
  props: ['clinic', 'outtakes'],
  name: "ClinicsIntakes",
  directives: {
    mask
  },
  data() {
    return {
      numberIntake: '',
      selectedDate:'',
      loading: false,
      successUpdateExams: false,
      dialogContestValue: false,
      ContestExam: [],
      NewValue: '',
    };
  },
  methods: {
    allPrices(patient){
      let price = 0
      for(let i=0; i< patient.outtakes.length; i++){
        price +=  patient.outtakes[i].value
      }
      return - price
    },
    PriceIntake(intake) {
      let price = 0;
      for (let exam of intake.exams) {
        price += exam.price
      }
      return price
    },

    closeDialog: function () {
      this.$emit('close-dialog')
    },
    formattedDate(date){
      return moment(date,'YYYY-MM-DD').format('DD/MM/YYYY')
    }
  },
  mounted() {
    this.$store.dispatch('GetReceiptsClinic', this.clinic)

  },
  computed: {
    dates(){
      var dates = []
      this.outtakes.map((outtake) => {
        if(!dates.includes(outtake.date.formatted.substring(0,10))){
          dates.push(this.formattedDate(outtake.date.formatted.substring(0,10)))
        }
      })
      this.selectedDate= dates[0]
      return dates
    },
    outtakesFilter(){
      let date = moment(this.selectedDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
      if(this.selectedDate !== ''){
        return this.outtakes.filter(el => el.date.formatted.substring(0,10) === date)
      }
      else{
        return this.outtakes
      }
    },
    patientsOuttakes(){
      let patients= []
      this.outtakesFilter.map(out => {
        let patient = {}
        patient.name = ''
        let transaction= out.ProductTransaction[0].with_transaction ? out.ProductTransaction[0].with_transaction.with_user : null
        if(transaction !== null){
          transaction = transaction[0]? transaction[0].name : 'Sem Usuario'
          if(transaction !== 'Sem Usuario'){
            patient.name = transaction
          }
        }
        let transactionPay= out.ProductTransaction[0].with_transactionPay ? out.ProductTransaction[0].with_transactionPay.with_user : null
        if(transactionPay !== null){
          transactionPay = transactionPay[0]? transactionPay[0].name : 'Sem Usuario'
          if(patient.name === ''){
            patient.name = transactionPay
          }
        }
        if(patients.find(x => x.name === patient.name)){
          let index = patients.findIndex(x => x.name === patient.name);
          patients[index].outtakes.push(out)
        }
        else{
          patient.outtakes = []
          patient.outtakes.push(out)
          patients.push(patient)
        }
      })
      return patients
    },
  }
};
</script>
