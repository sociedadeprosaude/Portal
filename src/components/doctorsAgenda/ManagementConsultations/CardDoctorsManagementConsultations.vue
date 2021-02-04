<template>
  <v-container>
    <v-layout row wrap v-if="specialty || examType">
      <v-flex xs12 v-for="(consultation, i) in ConsultationsByDoctors" :key="i">
        <v-card>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card color="primary">
                <v-layout row wrap class="py-2 px-3">
                  <v-flex xs5>
                    <p class="white--text text-left font-weight-bold">
                      <v-icon dark left large>account_circle</v-icon>
                      {{consultation.doctor.name}}
                    </p>
                  </v-flex>
                  <v-spacer/>
                  <v-flex xs3>
                    <p class="white--text font-weight-bold text-left"> N° de Consultas:
                      {{consultation.numConsultations}}</p>
                  </v-flex>
                  <v-flex xs5>
                    <p class="white--text text-left font-weight-bold"> CRM:
                      {{consultation.doctor.crm}}</p>
                  </v-flex>
                  <v-spacer/>
                  <v-flex xs3>
                    <p class="white--text font-weight-bold text-left"> N° de Retorno:
                      {{consultation.numRegress}}</p>
                  </v-flex>
                  <v-flex xs5>
                    <p class="white--text text-left font-weight-bold"> CPF:
                      {{consultation.doctor.cpf}}</p>
                  </v-flex>
                  <v-spacer/>
                  <v-flex xs1>
                    <v-btn icon class="grey my-1 mx-1" dark x-small text fab>
                      <v-icon @click="deactivateDoctor(consultation.doctor)">power_settings_new
                      </v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
            <v-flex xs12 v-for="(days,index) in consultation.consultations ">
              <v-card>
                <v-layout row wrap>
            <v-flex xs12 class="mt-4 mb-3"  >
                                           <p class="text-left primary--text font-weight-bold ml-2"
                                             v-if="ConsultationsByDoctors.length !== 0">{{days.date |
                                              dateFilter}} - {{daydate(days.date)}}</p>
              <v-divider class="primary"/>
            </v-flex>
            <v-flex sm4 v-for="(item,index) in days.consultations " :key="index" class="mt-3 mb-2">
                <v-tooltip top color="white">
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <v-progress-circular v-if="loading" indeterminate color="primary" :size="120"><span style="font-size: small">CARREGANDO</span></v-progress-circular>
                      <v-card v-else outlined class="borderCard py-3 mx-2 mr-2 grey lighten-5 elevation-1" @click="patientSelect(item)">
                        <v-layout row wrap class="mt-2">
                          <v-flex xs4>
                            <v-icon large>person</v-icon>
                            <br>
                            <v-icon v-if="item.type === 'Retorno'"  color="primary" small class="mt-1">restore</v-icon>
                            <v-icon v-else small class="mt-1"  color="primary">event</v-icon>
                            <v-icon v-if="item.status === 'Pago'" color="green" small class="mt-1">attach_money</v-icon>
                            <v-icon v-if="item.status === 'Aguardando pagamento'" small class="mt-1" color="red">money_off</v-icon>
                            <v-icon v-if="item.status === 'Cancelado'" small class="mt-1" color="red">cancel</v-icon>

                          </v-flex>
                          <v-flex xs8 class="mb-3">
                            <v-flex xs12>
                              <h4 class="text-left font-weight-bold">{{item.patient.name}}</h4>
                              <h5 class="text-left mt-1">{{attended(item)}}</h5>
                              <h5 class="text-left mt-1">{{item.date.formatted.split('T')[1].substring(0,5)}}</h5>
                              <h5 class="text-left">Agendado em: {{item.date.formatted.split('T')[0] | dateFilter}}</h5>
                            </v-flex>
                          </v-flex>
                        </v-layout>
                      </v-card>
                    </div>
                  </template>
                  <v-layout v-if="item.clinic" class="align-center justify-center">
                    <v-flex xs6 v-if="item.clinic.logo">
                      <v-img
                          :src="item.clinic.logo"
                          width="400"
                      ></v-img>
                    </v-flex>
                  </v-layout>
                  <v-layout v-if="!item.clinic">
                    <span v-if="!item.clinic.logo" style="color: #003B8F; font-weight: bold">{{item.clinic.name}}</span>
                  </v-layout>
                </v-tooltip>
              <div v-if="!clinic">
                <v-tooltip top color="white">
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <v-progress-circular v-if="loading" indeterminate color="primary" :size="120"><span style="font-size: small">CARREGANDO</span></v-progress-circular>
                      <v-card v-else outlined class="borderCard mx-2 mr-2 grey lighten-5 elevation-1" @click="patientSelect(item)">
                        <template slot="progress">
                          <v-progress-linear
                              color="deep-purple"
                              height="10"
                              indeterminate
                          ></v-progress-linear>
                        </template>
                        <v-layout row wrap class="mt-2">
                          <v-flex xs4>
                            <v-icon large>person</v-icon>
                            <br>
                            <v-icon v-if="item.type === 'Retorno'"  color="primary" small class="mt-1">restore</v-icon>
                            <v-icon v-else small class="mt-1"  color="primary">event</v-icon>
                            <v-icon v-if="item.status === 'Pago'" color="green" small class="mt-1">attach_money</v-icon>
                            <v-icon v-if="item.status === 'Aguardando pagamento'" small class="mt-1" color="red">money_off</v-icon>
                            <v-icon v-if="item.status === 'Cancelado'" small class="mt-1" color="red">cancel</v-icon>

                          </v-flex>
                          <v-flex xs8 class="mb-3">
                            <v-flex xs12>
                              <h4 class="text-left font-weight-bold">{{item.patient.name}}</h4>
                              <h5 class="text-left mt-1">{{attended(item)}}</h5>
                              <h5 class="text-left mt-1">{{item.date.formatted.split('T')[1].substring(0,5)}}</h5>
                              <h5 class="text-left">Agendado em: {{item.date.formatted.split('T')[0] | dateFilter}}</h5>
                            </v-flex>
                          </v-flex>
                        </v-layout>
                      </v-card>
                    </div>
                  </template>
                  <v-layout v-if="item.clinic" class="align-center justify-center">
                    <v-flex xs6 v-if="item.clinic.logo">
                      <v-img
                          :src="item.clinic.logo"
                          width="400"
                      ></v-img>
                    </v-flex>
                  </v-layout>
                  <v-layout v-if="!item.clinic">
                    <span v-if="!item.clinic.logo" style="color: #003B8F; font-weight: bold">{{item.clinic.name}}</span>
                  </v-layout>
                </v-tooltip>
              </div>
            </v-flex>
                </v-layout>
              </v-card>
          </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex xs12 v-if="loadingConsultations">
        <v-progress-circular class="primary--text" indeterminate/>
      </v-flex>
      <v-flex xs12 v-if="consultations.length === 0 && loadingConsultations === false">
        <p>Não a consultas marcadas para hoje :(</p>
      </v-flex>

      <v-dialog v-if="selectedDoctor" v-model="confirmDeactivate" max-width="500px" persistent>
        <v-flex xs12 v-if="loading">
          <v-progress-circular class="primary--text" indeterminate/>
        </v-flex>
        <v-card v-else>
          <v-card-title>
            <v-spacer/>
            <v-btn text @click="confirmDeactivate = false, cleanSpecialtyToDeactivate()" x-small fab>
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-select :items="specialtiesDoctor" v-model="specialtyToDeactivate" outlined persistent-hint
                    item-text="name"
                    class="mx-5 mb-4" return-object chips
                    hint="Selecione as especialidades para desativar"/>
          <v-select :items="clinics" v-model="clinicsToDeactivate" outlined persistent-hint
                    item-text="name"
                    class="mx-5 mb-4" return-object chips hint="Selecione a unidade"/>
          <v-card-text>
            <span>Desativar </span>
            <span class="font-weight-bold justify-center">{{ selectedDoctor.name }}</span>
            <span> ?</span>
          </v-card-text>
          <v-card-actions class="mx-3">
            <v-spacer/>
            <submit-button text="Confirmar" :loading="loading" :success="success" @reset="success = false"
                           @click="deleteAllSchedule(doctor)">
            </submit-button>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="success" max-width="300px">
        <v-alert type="success">
          Médico apagado com sucesso.
        </v-alert>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment/moment'
import SubmitButton from '../../../components/SubmitButton'
import ConsultationDocument from "@/components/doctorsAgenda/commons/ConsultationDocument";

export default {
  name: "CardDoctorsManagementConsultations",
  components: {SubmitButton,ConsultationDocument,},

  props: ['clinic', 'specialty', 'date', 'examType', 'filterByExam'],
  data: () => ({
    semanaOptions: [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado"
    ],
    clinics: [],
    selectedDoctor: [],
    specialtiesDoctor: '',
    success: false,
    loading: false,
    loadingConsultations: false,
    confirmDeactivate: false,
    patientSelected: [],
    specialtyToDeactivate: {},
    clinicsToDeactivate: {},
    consultations: [],
    product: undefined,
    skipConsultationsExams: true,
    skipConsultations: true,
    room: undefined,
    ticket: undefined,
    sector: undefined,
    id: undefined,
    idConsultation: undefined,
    idDoctor: undefined,
  }),
  watch: {
    changeData: {
      handler: function (val) {
        this.loadingConsultations = true
        this.product = this.filterByExam ? this.examType : this.specialty
        if (this.product && this.clinic ) {
          this.consultations = []
         
          if (this.filterByExam) {
             this.skipConsultationsExams = false
            this.$apollo.queries.loadConsultationsExams.refresh()
          } else {
            this.skipConsultations = false
            this.$apollo.queries.loadConsultations.refresh()
          }
        }
      },
      deep: true
    },
  },
  computed: {
    /* consultations() {
        if (moment().format('YYYY-MM-DD') !== this.date) {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.loadingConsultations = !this.loadingConsultations
        }
        this.loadingConsultations = true
        let response =  this.$store.getters.consultations.filter((a) => {
            let filtedBySpecialty = !this.filterByExam && this.specialty && a.specialty && this.specialty.name === a.specialty.name
            let filtedByExamType = this.filterByExam && this.examType && a.exam && this.examType.name === a.exam.type
            return this.date && this.date === a.date.split(' ')[0] && a.user && (filtedBySpecialty || filtedByExamType)
        });
        this.loadingConsultations = false
        return response
    }, */

    ConsultationsByDoctors() {
      let res = {};
      for (let cons in this.consultations) {
        let targetDate = this.consultations[cons].doctor.id
        if (!res[targetDate]) {
          res[targetDate] = {
            doctor: this.consultations[cons].doctor,
            numConsultations: 0,
            numRegress: 0,
            consultations: {}
          }
        }
        if (this.consultations[cons].type === 'Consulta') res[targetDate].numConsultations += 1;
        else res[targetDate].numRegress += 1;
          let dateTimeConsultation = this.consultations[cons].date.formatted;
          const date = dateTimeConsultation.split("T")[0];
          if(!res[targetDate].consultations[date]){
            res[targetDate].consultations[date] = {
              consultations: [],
              date: date
            }
          }
          let consultation = this.consultations[cons]

          if(!consultation.type){
            consultation.type = 'Consulta'
          }

          res[targetDate].consultations[date].consultations.push(consultation)
        }
      console.log('res', JSON.parse(JSON.stringify(res)))
      return res
    },
    doctor() {
      return this.$store.getters.doctor
    },
    changeData() {
      const {specialty, examType, clinic, date, filterByExam} = this

      return {
        specialty,
        examType,
        clinic,
        date,
        filterByExam
      }
    },
  },
  methods: {
    attended(consultation){
      if(consultation.consultation_hour.formatted){
        return 'Atendido em : ' + moment(consultation.consultation_hour.formatted).format('DD/MM/YYYY - HH:mm:ss')
      }
      else{
        return 'Não Atendido'
      }
    },
    cleanSpecialtyToDeactivate() {
      this.specialtyToDeactivate = [];
      this.clinicsToDeactivate = []
    },
    async deactivateDoctor(item) {
      await this.$store.dispatch('getDoctor', item.cpf);
      if (this.doctor.cpf === item.cpf) {
        this.selectedDoctor = this.doctor;
        this.clinics = this.doctor.clinics;
        this.specialtiesDoctor = this.doctor.specialties;
        this.confirmDeactivate = true;
      }
    },
    daydate(date) {
      let dateMoment = moment(date);
      return this.semanaOptions[dateMoment.day()];
    },
     patientSelect: function (item) {
      this.loading = true;
      //"garantindo reatividade"
      this.room = undefined;
      this.ticket =  undefined;
      this.sector = undefined;
      //"garantindo reatividade"
       this.id = item.clinic.id;
       this.idConsultation = item.id;
       this.idDoctor = item.doctor.id;
       this.$apollo.queries.LoadSectorsOfUnity.refresh();
       setTimeout(() => {
         this.selectUser(item.user)
         this.$emit('patientSelect', item.patient);
         this.$emit('consultationSelect', item);
         this.$emit('roomSelect', this.room);
         this.$emit('sectorSelect', this.sector);
         this.$emit('ticketSelect', this.ticket);
         this.loading = false;
       }, 2000);
/*      this.selectUser(item.user)
      this.$emit('patientSelect', item.patient);
      this.$emit('consultationSelect', item);
      this.$emit('roomSelect', this.room);
      this.$emit('sectorSelect', this.sector);
      this.$emit('ticketSelect', this.ticket);*/
    },
    async deleteAllSchedule(doctor) {
      this.loading = true;
      let payload = {
        doctor: doctor,
        specialty: this.specialtyToDeactivate,
        clinic: this.clinicsToDeactivate,
      };
      await this.$store.dispatch('deleteAllSchedule', payload);
      this.success = true;
      this.loading = false;
      this.confirmDeactivate = false
    },
    async selectUser(user) {
      if (user) {
        let intakes = await this.$store.dispatch('getUserIntakes', user);
        if (intakes) {
          user.intakes = intakes
        }
        let budgets = await this.$store.dispatch('getUserBudgets', user);
        if (budgets) {
          user.budgets = budgets
        }
      }
      this.$store.commit('setSelectedPatient', user);
      this.$store.commit('clearSelectedDependent');
    },
  },
  apollo: {
    LoadSectorsOfUnity: {
      query: require("@/graphql/sectors/LoadSectorsOfUnity.gql"),
      variables () {
        return {
          id: this.id
        }
      },
      update(data){
        let sectors = Object.assign(data.Clinic[0].has_sectors)
        //console.log('G:', sectors)
        for (let sector in sectors){
          if(sectors[sector].has_rooms){
            for(let room in sectors[sector].has_rooms){
              if(sectors[sector].has_rooms[room].doctor){
                if(sectors[sector].has_rooms[room].doctor.id === this.idDoctor){
                  this.sector = sectors[sector]
                  this.room = sectors[sector].has_rooms[room]
                  if(sectors[sector].has_rooms[room].room_has_tickets.length > 0){
                    //procurar o id da consulta aqui
                    let result = sectors[sector].has_rooms[room].room_has_tickets.filter(a => {return a.consultation.id === this.idConsultation});
                    this.ticket = result[0];
                  }
                }
              }
            }
          }
        }
      },
    },
    loadConsultations: {
      query: require(`@/graphql/consultations/LoadConsultations.gql`),
      variables() {
        return {
          idClinic: this.clinic.id,
          idProduct: this.product.id,
          date:{formatted: moment().format("YYYY-MM-DD")}
        }
      },
      update(data) {
        this.consultations = data.Consultation
        this.loadingConsultations = false
        this.skipConsultations = true
      },
      skip() {
        return this.skipConsultations
      }
    },
    loadConsultationsExams: {
       query: require(`@/graphql/consultations/LoadConsultationsExams.gql`),
       variables() {
         return {
           idClinic: this.clinic.id,
           idProduct: this.product.id,
           date:{formatted: moment().format("YYYY-MM-DD")}
         }
       },
       update(data) {
         this.consultations = data.Consultation.filter(consultation => consultation.product.with_product_schedulable && consultation.product.with_product_schedulable.id === this.product.id)
         this.loadingConsultations = false
         this.skipConsultationsExams = true
       },
       skip (){
           return this.skipConsultationsExams
      }
    },
  }
}
</script>
<style scoped>
.borderCard {
  border-radius: 50%;
  border: #808080 solid;
}

</style>
