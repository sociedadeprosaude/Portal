<template>
  <v-layout row wrap>
    <v-spacer/>
    <v-flex xs12>
      <v-card class="pa-4" color="indigo darken-4">
        <v-layout row wrap aling-center>
          <v-flex xs12>
            <p class="white--text text-left title">Consultas</p>
            <v-divider color="white"/>
            <span class="white--text font-weight-bold">SETOR: {{sector === undefined ? 'NENHUM' : sector.name }} <v-divider color="white"/> SALA: {{room === undefined ? 'NENHUMA' : room.name}} <v-divider color="white"/> SENHA: {{ticket === undefined ? 'NENHUM' : ticket.name}}</span>
          </v-flex>
          <v-flex xs12 class="mb-2">
            <v-divider color="white"/>
          </v-flex>
          <v-flex xs12 class="mt-3 mx-7">
            <v-card class="cardw">
              <v-layout row wrap>
                <v-flex xs4>
                  <p class="font-weight-black">Paciente</p>
                </v-flex>
                <v-flex xs8>
                  <v-spacer/>
                </v-flex>
                <v-flex xs12>
                  <CardPatientManagementConsultations :dependent="consultation.dependent" :patient="patient"/>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
          <v-flex xs12 class="mt-4 mb-2">
            <v-divider color="white"/>
          </v-flex>
          <v-flex xs12 class="mt-3 mx-7">
            <v-card class="cardConsultation ">
              <v-layout row wrap>
                <v-flex xs4>
                  <p class="font-weight-black">Consulta</p>
                </v-flex>
                <v-flex xs8>
                  <v-spacer/>
                </v-flex>
                <v-flex xs12>
                  <card-consultation-management-consultations :consultation="consultation"/>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
          <v-card-actions class="mt-4 ml-n3">
            <v-btn
                color="white"
                rounded
                :disabled="disabledDelete(consultation)"
                @click="deletedConsultation(consultation)"
                :loading="cancelLoading"
            >Cancelar</v-btn>
            <v-btn
                color="white"
                rounded
                :to="{ name: 'AgendamentoConsultas', params: { q: consultation, type:'Retorno'}}"
                :disabled="consultation.status !== 'Pago' || consultation.regress"
                v-if="consultation.type !== 'Retorno' && consultation.product"
            >Retorno</v-btn>
            <v-btn
                color="white"
                rounded
                :loading="loadingCharge"
                :disabled="consultation.status !== 'Pago'"
                @click="setConsultationHour(consultation)"
            >Prontuário</v-btn>
            <v-btn
                color="white"
                rounded
                @click="ConsultationRecept(consultation)"
            >Comprovante</v-btn>
          </v-card-actions>
          <v-card-actions class="mt-3 ml-n3">
            <v-btn
                v-if="!ticket"
                color="white"
                rounded
                :disabled="consultation.status !== 'Pago'"
                @click="ConsultationTicket(consultation)"
            >Gerar Senha</v-btn>
          </v-card-actions>
          <v-flex xs12 class="mt-4 mb-2">
            <v-divider color="white"/>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
    <v-dialog v-model="documentDialog">
      <consultation-document @close="documentDialog=false" :consultation="consultation"/>
    </v-dialog>
    <v-dialog v-model="receptDialog">
      <consultation-receipt @close="receptDialog=false" :consultation="consultation"/>
    </v-dialog>

    <v-dialog v-model="dialogTicket" width="500">
      <gerenate-ticket-and-choose-type @close="dialogTicket=false" :consultation="consultation" :sector="sector" :room="room" :ticket="ticket"/>
    </v-dialog>

  </v-layout>
</template>


<script>
import CardConsultationManagementConsultations
  from '../../../components/doctorsAgenda/ManagementConsultations/CardConsultationManagementConsultations'
import CardPatientManagementConsultations
  from '../../../components/doctorsAgenda/ManagementConsultations/CardPatientManagementConsultations'
import ConsultationDocument from "../commons/ConsultationDocument"
import ConsultationReceipt from "../commons/ConsultationReceipt"
import {uuid} from "vue-uuid";
import MutationBuilder from "@/classes/MutationBuilder";
import GerenateTicketAndChooseType from "../commons/GerenateTicketAndChooseType";
let moment = require('moment');
export default {
  name: "CardInformationManagementConsultations",
  props: ['patient', 'consultation', 'room', 'sector', 'ticket'],
  components: {
    GerenateTicketAndChooseType,
    CardConsultationManagementConsultations,
    CardPatientManagementConsultations,
    ConsultationDocument,
    ConsultationReceipt
  },

  data: () => ({
    item: 'NOVO',
    documentDialog: false,
    receptDialog: false,
    cancelLoading: false,
    loadingCharge: false,
    costDoctor: 0,
    idDoctor: '',
    idProduct: '',
    ConsultationSelect: {},
    skip: true,
    skipPatients: true,
    skipCost: true,
    dialogTicket: false,
  }),
  mounted() {
    //
  },
  computed: {
    selectedPatient() {
      return this.$store.getters.selectedPatient
    },
  },
  methods: {
    disabledDelete(consultation){
      if(consultation.status ){
        if(consultation.status === 'Cancelado' /* || consultation.consultation_hour.formatted !== null */){
          return true
        }else{
          return false
        }
      }
      return true
    },
    async deletedConsultation(consultation) {
      this.cancelLoading = true;
      let mutationBuilder = new MutationBuilder()
      mutationBuilder.addMutation({
        mutation: require('@/graphql/consultations/UpdateConsultationStatus.gql'),
        variables:{
          idConsultation:consultation.id,
          status: 'Cancelado'
        }
      })
      mutationBuilder.addMutation({
        mutation: require('@/graphql/consultations/RemoveOnlyRelationCameFrom.gql'),
        variables:{
          idConsultation:consultation.id,
          idSchedule: consultation.came_from.id
        }
      })
      if (this.consultation.type === "Retorno" && consultation.previous_consultation) {
        mutationBuilder.addMutation({
          mutation: require('@/graphql/consultations/RemoveRelationsAsRegress.gql'),
          variables: {
            idConsultation: consultation.id,
            idPreviousConsultation: consultation.previous_consultation.id
          }
        })
      }
      if(consultation.status === "Pago" && consultation.productTransaction){
        mutationBuilder.addMutation({
          mutation: require('@/graphql/consultations/RemoveRelationProductTransaction.gql'),
          variables: {
            idConsultation: consultation.id,
            idProductTransaction: consultation.productTransaction.id
          }
        })
        if(this.consultation.productTransaction.with_charge){
          mutationBuilder.addMutation({
            mutation: require('@/graphql/charge/DeleteCharge.gql'),
            variables: {
              id: consultation.productTransaction.with_charge.id
            }
          })
        }
      }
      await this.$apollo.mutate({
        mutation: mutationBuilder.generateMutationRequest(),
      })
      this.cancelLoading = false;
      this.skipPatients = false;
      this.$apollo.queries.loadPatient.refresh()
    },


    async setConsultationHour(consultation) {
      this.ConsultationSelect = consultation
      this.loadingCharge = true
      this.idDoctor = consultation.doctor.id
      this.idProduct = consultation.product.id
      if(consultation.consultation_hour && consultation.consultation_hour.formatted){
        this.loadingCharge = false
        this.documentDialog = true;
      }
      else{
        let mutationBuilder = new MutationBuilder()
        let consultation_hour = moment().format('YYYY-MM-DDTHH:mm:ss')
        if(!consultation.consultation_hour || !consultation.consultation_hour.formatted){
          mutationBuilder.addMutation({
            mutation: require('@/graphql/consultations/UpdateConsultationHour.gql'),
            variables:{
              idConsultation:consultation.id,
              consultation_hour: {formatted: consultation_hour}
            }
          })
        }
        if(consultation.productTransaction){
          if (!consultation.productTransaction.with_charge) {
            let CostProductDoctor = await this.$apollo.mutate({
              mutation: require('@/graphql/doctors/LoadCostProductDoctor.gql'),
              variables: {
                idDoctor: consultation.doctor.id,
                idProduct: consultation.product.id
              }
            })
            let ChargeId = uuid.v4()
            mutationBuilder.addMutation({
              mutation: require('@/graphql/charge/CreateCharge.gql'),
              variables: {
                id: ChargeId,
                value: -CostProductDoctor.data.CostProductDoctor[0].cost,
                date: {formatted: moment().format("YYYY-MM-DDTHH:mm:ss")},
                type: 'doctor'
              }
            })
            mutationBuilder.addMutation({
              mutation: require('@/graphql/charge/AddRelationsProductTransactionHasCharge.gql'),
              variables: {
                idProductTransaction: consultation.productTransaction.id,
                idCharge: ChargeId,
              }
            })
          }
        }
        let response = await this.$apollo.mutate({
          mutation: mutationBuilder.generateMutationRequest(),
        })
        this.skipPatients = false;
        this.$apollo.queries.loadPatient.refresh()
        console.log('response :', response)
        this.loadingCharge = false
        this.documentDialog = true;
      }
    },
    ConsultationRecept() {
      this.receptDialog = true;
    },
    ConsultationTicket(){
      this.dialogTicket = true;
    }
  },

  apollo: {
    findProductTransaction: {
      query: require("@/graphql/transaction/FindProductTransactionbyConsultation.gql"),
      variables() {
        return {
          idConsultation: this.consultation.id
        }
      },
      update(data) {
        this.$apollo.mutate({
          mutation: require('@/graphql/transaction/RemoveConsultationOfProductTransaction.gql'),
          variables: {
            idConsultation: this.consultation.id,
            idProductTransaction: data.ProductTransaction[0].id
          },

        })
        this.skip = true;
      },
      skip() {
        return this.skip
      }
    },

    loadPatient: {
      fetchPolicy: 'no-cache',
      query: require("@/graphql/patients/GetPatient.gql"),
      variables() {
        return {
          id: this.selectedPatient.id
        }
      },
      update(data) {
        this.$store.commit('setSelectedPatient', data.Patient[0]);
        this.skipPatients = true
      },
      skip() {
        return this.skipPatients
      }
    },
  }
}
</script>
<style scoped>
.cardw {
  width: 100%;
  height: 150px;
  align-self: center;
}

.cardConsultation {
  width: 100%;
  height: 350px;
}

.spacerH {
  height: 10px;
}
</style>
