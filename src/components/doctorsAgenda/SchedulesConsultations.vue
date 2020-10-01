<template>
  <v-container fluid>
    <v-flex xs12 v-if="loadingConsultations">
      <v-progress-circular class="primary--text" indeterminate/>
    </v-flex>
    <div  v-else class="container" id="app">
      <ul class="list-group" id="infinite-list">
        <v-layout row wrap style="width:100%"
                  class="align-center justify-center py-0"
                  v-for="(scheduleGroup, i) in Consultations"
                  :key="i">
          <v-flex xs12 class="align-start justify-start">
            <div v-bind:id="'group-' + i" class="text-left">
              <span class="my-sub-headline primary--text">{{ i | dateFilter }} - {{ dayDate(i) }}</span>
              <v-divider class="primary"/>
            </div>
          </v-flex>
          <v-container fluid grid-list-sm class="py-0 my-3 mx-2">
            <v-layout row wrap>
              <v-flex v-for="(schedule, j) in scheduleGroup" :key="j" sm12 xs12 class="px-2 py-2">
                <v-card class="pa-4 background" style="border-radius:20px; height: 100%">
                  <v-layout>
                    <v-layout row wrap>
                      <v-flex xs12 class="text-left">
                        <v-layout row wrap>
                          <span class="subtitle-2 font-weight-bold">{{ schedule.doctor.name }}</span>
                          <span class="subtitle-2 font-weight-bold mx-2">-</span>
                          <span class="subtitle-2 font-weight-bold subheading">
                              {{ schedule.product.name  /*schedule.specialty ? schedule.specialty.name : schedule.exam_type.name*/}}
                          </span>
                          <v-spacer/>
                          <v-chip color="primary_dark" class="mb-2" small text-color="white">
                            {{ schedule.clinic.name }}
                          </v-chip>
                        </v-layout>
                      </v-flex>
                      <v-flex xs12 class="mb-1">
                        <v-divider class="primary"/>
                      </v-flex>
                      <v-flex class="my-0" xs12>
                        <v-layout row wrap class="text-left font-weight-bold">
                          <v-flex xs12>
                            <v-chip small class="mx-2" color="primary_dark"
                                    @click="scheduleAppointment(schedule, moment(schedule.date))"
                                    text-color="white">
                              {{ moment(schedule.date).format('HH:mm') }}
                            </v-chip>
                            <v-chip small color="primary_dark" text-color="white">
                              Vagas :
                              {{ schedule.vacancy }}
                            </v-chip>
                            <v-chip v-if="schedule.product.type === 'SPECIALTY'" small class="mx-2" color="primary_dark"
                                    text-color="white">
                              Consultas :
                              {{
                                schedule.qtd_consultations ? schedule.qtd_consultations :
                                    0
                              }}
                            </v-chip>
                            <v-chip v-if="schedule.product.type === 'EXAM'" small class="mx-2" color="primary_dark"
                                    text-color="white">
                              Agendados :
                              {{
                                schedule.qtd_consultations ? schedule.qtd_consultations :
                                    0
                              }}
                            </v-chip>
                            <v-chip v-if="schedule.product.type === 'SPECIALTY'" class="mx-2" small color="primary_dark"
                                    text-color="white">
                              Retornos :
                              {{ schedule.qtd_returns ? schedule.qtd_returns : 0 }}
                            </v-chip>
                          </v-flex>
                        </v-layout>
                      </v-flex>
<!--                      <v-flex xs12 class="text-right">-->
<!--                        <v-fade-transition>-->
<!--                          <v-btn v-if="isOnline"-->
<!--                                 rounded-->
<!--                                 small-->
<!--                                 color="primary_dark white&#45;&#45;text"-->
<!--                                 class="mx-0"-->
<!--                                 :disabled="schedule.vacancy === 0"-->
<!--                                 @click="scheduleAppointment(schedule)"-->
<!--                          >Agendar-->
<!--                          </v-btn>-->
<!--                          <v-btn v-else-->
<!--                                 rounded-->
<!--                                 small-->
<!--                                 color="grey"-->
<!--                                 class="mx-0"-->
<!--                          >Sem conexão-->
<!--                          </v-btn>-->
<!--                        </v-fade-transition>-->
<!--                      </v-flex>-->
                    </v-layout>
                  </v-layout>
                </v-card>
              </v-flex>
            </v-layout>
            <div class="text-xs-center">
              <v-dialog v-model="dialog" persistent v-if="createConsultationForm" max-width="520">
                <SchedulingForm @close-dialog="closeDialog"
                                :createConsultationForm="createConsultationForm"
                                :loaderPaymentNumber="loaderPaymentNumber"
                                :exams="examsLoading"
                                :numberReceipt="numberReceipt"
                                :modalidade="modalidade"
                                :previousConsultation="previousConsultation"
                                :status="status"
                                :payment_numberFound="payment_numberFound"
                                :prolonged="prolonged"
                                @findPaymentNumberToExam="thereIsPaymentNumber($event)"
                />
              </v-dialog>
            </div>
          </v-container>
        </v-layout>
      </ul>
    </div>
    <v-flex xs12 v-if="!loadingConsultations">
      <v-btn class="primary" rounded text @click="listenMoreConsultations">Carregar mais</v-btn>
    </v-flex>

    
    <v-dialog v-model="prolongedDialog"   max-width="500px">
        <v-card>
          <v-card-title>
           Retorno Prolongado
          </v-card-title>
          <v-card-text>
            <v-text-field
                    v-model="prolonged"
                    label="Motivo do retorno prolongado"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn
                    color="primary"
                    @click="prolongedDialog= 0"
            >
              salvar
            </v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
  </v-container>
</template>
<script>

import SchedulingForm from "../doctorsAgenda/SchedulingForm"
import {infiniteScroll} from "vue-infinite-scroll"
import axios from "axios"

let moment = require("moment/moment");

export default {
  props: ['Consultations','loadingConsultations'],
  components: {SchedulingForm},
  directives: {infiniteScroll},
  data: () => ({
    moment: (data) => moment(data),
    semanaOptions: [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado"
    ],
    dialog: false,
    numberReceipt: "",
    payment_numberFound: undefined,
    status: "",
    type: '',
    prolongedDialog:false,
    prolonged:'',
    modalidade: "Consulta",
    previousConsultation: undefined,
    createConsultationForm: undefined,
    loaderPaymentNumber: false,
    daysToListen: 3,
    examsLoading: [],
    loading: false,
    nextItem: 1,
    skip:true,
    withExam:undefined,
    patient:undefined
  }),

  async mounted() {
    this.$emit('refreshDate', this.daysToListen);
    await this.listenMoreConsultations();

    const listElm = document.querySelector('#infinite-list');
    listElm.addEventListener('scroll', e => {
      if (listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight) {
        this.listenMoreConsultations()
      }
    });

    this.query = this.$route.params.q
    if (this.query && this.$route.params.type === 'Retorno') {
      if(moment().diff(moment(this.query.date, 'YYYY-MM-DD'), 'days') > 21){
        this.prolongedDialog= true
      }
      this.modalidade = "Retorno"
      this.previousConsultation = this.query.id
      this.status = this.query.status
      this.numberReceipt = this.query.payment_number
    } else if (this.query && this.$route.params.type === 'Remarcar') {
      this.modalidade = this.query.type
      this.previousConsultation = this.query.id
      this.status = this.query.status
      this.numberReceipt = this.query.payment_number
    }/*  else if (this.query && this.$route.params.reschedule) {
      this.modalidade = this.query.type
      this.previousConsultation = this.query.previousConsultation
      this.status = this.query.status
      this.numberReceipt = this.query.payment_number
      this.rescheduleConsultation = this.query.id
    } */ else {
      this.modalidade = "Consulta"
    }
  },
  computed: {

    isOnline() {
      return this.$store.getters.isOnline
    },
    selectedPatient() {
      return this.$store.getters.selectedPatient;
    },
    foundDependents() {
      return this.selectedPatient ? this.selectedPatient.dependents : undefined;
    },
  },

  methods: {
    getScheduleAvailableDates(schedule) {
      let dates = []
      for (let vacancy = 0; vacancy < schedule.vacancy + schedule.qtd_consultations + schedule.qtd_returns; vacancy++) {
        let dateToAdd = moment(schedule.date).add(schedule.interval * vacancy, 'minutes')
        if (schedule.scheduled_hours && schedule.scheduled_hours.indexOf(dateToAdd.format('YYYY-MM-DD HH:mm')) > -1) continue
        dates.push(dateToAdd)
      }
      if (dates.length > schedule.vacancy) {
        return dates.slice(dates.length - schedule.vacancy, dates.length)
      }
      return dates
    },

    dayDate(date) {
      let dateMoment = moment(date);
      return this.semanaOptions[dateMoment.day()];
    },

    scheduleAppointment(consultation, date) {
      if (!this.selectedPatient && !this.query.patient) {
        window.alert('Selecione um paciente')
        return;
      }
      this.exam = undefined;
      // this.fillConsultationForm(consultation);
      this.fillConsultationForm({
        ...consultation,
        date: date.format('YYYY-MM-DD HH:mm'),
      });
      this.dialog = true;
    },

    async fillConsultationForm(consultation) {
      this.selectedForm = {
        user: this.selectedPatient ? this.selectedPatient : this.query.patient,
        consultation: consultation
      };

      if (!this.query /* && !consultation.exam_type */) {
        this.thereIsPaymentNumber();
      }
      if (this.$route.params.reschedule && this.query.exam) {
        this.selectedForm.consultation.exam = this.query.exam
      }
      this.createConsultationForm = this.selectedForm;
    },

    async thereIsPaymentNumber(value) {
      this.payment_numberFound = undefined;
      this.numberReceipt = "";
      this.status = "Aguardando pagamento";

      if(this.selectedForm.consultation.product.type === "SPECIALTY" && this.selectedForm.consultation.product.price == 0){
        this.status = "Pago";
        //payment_number
      }else{
        this.skip = false;
        this.withExam = value
        this.loaderPaymentNumber = true;
        this.$apollo.queries.findProductTransaction.refresh()
      }

    },

    async listenMoreConsultations() {
      this.loading = true;
      this.daysToListen += 3;
      this.$emit('refreshDate', this.daysToListen);
      this.loading = false;
    },
    closeDialog() {
      this.dialog = false
      this.payment_numberFound = undefined
      this.status = ""
      this.numberReceipt = ""
      this.selectedForm = undefined
    }
  },
  apollo:{
    findProductTransaction:{
        query: require("@/graphql/transaction/FindProductTransaction.gql"),
        variables(){
          return {
            idProduct:this.withExam ? this.withExam.id : this.selectedForm.consultation.product.id,
            idPatient: this.selectedForm.user.id
          }
        },
        update(data){
          this.skip = true;
          if(data.ProductTransaction.length > 0){
            this.status = "Pago"
            this.selectedForm.productTransaction = data.ProductTransaction[0]
          }
          this.loaderPaymentNumber = false;
        },
        skip(){
          return this.skip;
        }
    }
  }
}

</script>

<style scoped>

.list-group {
  overflow: auto;
  height: 82vh;
}
</style>
