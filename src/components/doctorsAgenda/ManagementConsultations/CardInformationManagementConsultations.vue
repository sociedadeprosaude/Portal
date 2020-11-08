<template>
  <v-layout row wrap>
    <v-spacer/>
    <v-flex xs12>
      <v-card class="pa-4" color="indigo darken-4">
        <v-layout row wrap aling-center>
          <v-flex xs12>
            <p class="white--text text-left title">Consultas</p>
            <v-divider color="white"/>
            <span class="white--text font-weight-bold">SETOR: {{sector === undefined ? 'NENHUM' : sector }} <v-divider color="white"/> SALA: {{room === undefined ? 'NENHUMA' : room}} <v-divider color="white"/> SENHA: {{ticket === undefined ? 'NENHUM' : ticket}}</span>
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
          <v-card-actions class="mt-4 ">
            <v-btn
                color="white"
                rounded
                :disabled="consultation.status === 'Cancelado'"
                @click="deletedConsultation()"
                :loading="cancelLoading"
            > Cancelar
            </v-btn>
            <v-btn
                color="white"
                rounded
                :to="{ name: 'AgendamentoConsultas', params: { q: consultation, type:'Retorno'}}"
                :disabled="/*consultation.status !== 'Pago' ||*/ consultation.regress"
                v-if="consultation.type !== 'Retorno' && consultation.product"
            >Retorno
            </v-btn>
            <v-btn
                color="white"
                rounded
                :disabled="consultation.status !== 'Pago'"
                @click="ConsultationTicket(consultation)"
            >
              Gerar Senha
            </v-btn>
            <v-btn
                color="white"
                rounded
                :loading="loadingCharge"
                :disabled="consultation.status !== 'Pago'"
                @click="setConsultationHour(consultation)"
            >
              Prontuário
            </v-btn>
            <v-btn
                color="white"
                rounded
                @click="ConsultationRecept(consultation)"
            >
              Comprovante
            </v-btn>
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

    <v-dialog v-model="dialogTicket">
      <gerenate-ticket-and-choose-type @close="dialogTicket=false" :consultation="consultation"/>
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
import gql from "graphql-tag";
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

    async deletedConsultation() {
      this.cancelLoading = true;

      this.$apollo.mutate({
        mutation: require('@/graphql/consultations/CancelConsultation.gql'),
        variables: {
          idConsultation: this.consultation.id,
          idSchedule: this.consultation.came_from.id
        },

      }).then((data) => {
        this.cancelLoading = false

        if (this.consultation.type === "Retorno" && this.consultation.previous_consultation)
          this.removeRelationAsRegress(this.consultation.id, this.consultation.previous_consultation.id)

        if (this.consultation.status === "Pago") {
          this.skip = false;
          this.$apollo.queries.findProductTransaction.refresh()
        }

        this.skipPatients = false;
        this.$apollo.queries.loadPatient.refresh()

      }).catch((error) => {
        console.error(error)
        this.cancelLoading = false
      })
    },

    removeRelationAsRegress(idConsultation, idPreviousConsultation) {
      this.$apollo.mutate({
        mutation: require('@/graphql/consultations/RemoveRelationsAsRegress.gql'),
        variables: {
          idConsultation: idConsultation,
          idPreviousConsultation: idPreviousConsultation
        },

      });
    },

    async setConsultationHour(consultation) {
      this.ConsultationSelect = consultation
      this.loadingCharge = true
      this.idDoctor = consultation.doctor.id
      this.idProduct = consultation.product.id
      let idProductTransaction = await this.$apollo.mutate({
        mutation: require('@/graphql/productTransaction/GetProductTransactionId.gql'),
        variables: {
          idConsultation: consultation.id
        }
      })
      let Charge
      if (idProductTransaction.data.ProductTransaction[0]) {
        idProductTransaction = idProductTransaction.data.ProductTransaction[0].id

        Charge = await this.$apollo.mutate({
          mutation: require('@/graphql/charge/GetChargeProductTransactionId.gql'),
          variables: {
            idProductTransaction: idProductTransaction
          }
        })
        Charge = Charge.data.Charge
      }
      if (Charge && Charge.length === 0) {
        let CostProductDoctor = await this.$apollo.mutate({
          mutation: require('@/graphql/doctors/LoadCostProductDoctor.gql'),
          variables: {
            idDoctor: consultation.doctor.id,
            idProduct: consultation.product.id
          }
        })
        let ChargeId = uuid.v4()
        let mutationBuilder = new MutationBuilder()
        mutationBuilder.addMutation(`
                  CreateCharge(
                      id:"${ChargeId}"
                      value:${-CostProductDoctor.data.CostProductDoctor[0].cost}
                      date:
                        {
                          formatted: "${moment().format("YYYY-MM-DDTHH:mm:ss")}"
                        }
                            ){
                            id,value,date{formatted}
                            }
                        `),
            mutationBuilder.addMutation(`
                          AddChargeWith_ProductTransaction(
                          from:{
                          id:"${ChargeId}"
                      },
                      to:{
                          id:"${idProductTransaction}"
                      }
                  ){
                      from{id},
                      to{id}
                  } `)
        let finalString = mutationBuilder.generateMutationRequest()
        await this.$apollo.mutate({
          mutation: gql`${finalString}`,
        })
        this.loadingCharge = false
        this.documentDialog = true;
      } else {
        this.loadingCharge = false
        this.documentDialog = true;
      }
      /*  let charge = await this.$apollo.mutate({
         mutation: require ('@/graphql/charge/FindChargeDoctor'),
         variables:{
           consultationId: consultation.id,
           type:'doctor'
         }
       })
       console.log('charge: ', charge)
       this.documentDialog = true;
       this.ConsultationSelect = consultation
       this.idDoctor = consultation.doctor.id
       this.idProduct = consultation.product.id */
      /* this.skipCost=false
      this.$apollo.queries.loadCostProductDoctor.refresh() */
      /* let consultation_hour = moment().format('YYYY-MM-DD HH:mm:ss');
      if(!consultation.user)
          consultation.user = this.selectedPatient
      let data = {
          consultation_hour: consultation_hour,
          consultation: consultation,
          id: consultation.id,
      };
      let specialty = await this.$store.dispatch('getDoctorSpecialty', consultation)
      let outtake = {
          intake_id: consultation.payment_number,
          user: consultation.user,
          unit: consultation.clinic,
          doctor: consultation.doctor,
          specialties: specialty,
          paid: false,
          realized:moment().format('YYYY-MM-DD'),
          crm: consultation.doctor.crm
      }

      console.log('outtake: ', outtake)
      await this.$store.dispatch('addSpecialtyOuttakes', outtake)
      if(!consultation.consultation_hour)
          await this.$store.dispatch('addConsultationHourInConsultation', data);
      this.consultation.consultation_hour = consultation_hour; */
    },
    ConsultationRecept(consultation) {
      //console.log('consultation: ', consultation)
      this.receptDialog = true;
    },
    ConsultationTicket(consultation){
      this.dialogTicket = true;
      //console.log('bol:', this.dialogTicket)
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
      query: require("@/graphql/reactivity/ReloadConsultationsPatient.gql"),
      variables() {
        return {
          idPatient: this.selectedPatient.id
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
