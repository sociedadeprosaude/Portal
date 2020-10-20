<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          <v-btn
              @click="close"
              text
              class="transparent"
              style="width: 32px; min-width: 0"
          >
            <v-icon>close</v-icon>
          </v-btn>
          <span class="hidden-xs-only">Confirmar Agendamento da Consulta</span>
          <span class="hidden-sm-and-up" style="font-size: 0.8em">Agendamento da Consulta</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap row class="align-center">
              <v-flex xs12>
                <v-text-field
                    readonly
                    hide-details
                    outlined
                    prepend-icon="person"
                    v-model="createConsultationForm.user.name"
                    label="Nome do Paciente">
                </v-text-field>
              </v-flex>
              <v-flex xs12 v-if="foundDependents && foundDependents.length > 0">
                <v-select
                    prepend-icon="person"
                    v-model="createConsultationForm.user.dependent"
                    :items="foundDependents"
                    return-object
                    item-text="name"
                    label="Selecionar dependente"
                    outlined
                    chips
                    color="blue"
                    clearable
                >
                  <template v-slot:selection="data">
                    <v-chip
                        :key="JSON.stringify(data.item)"
                        :input-value="data.selected"
                        :disabled="data.disabled"
                        class="v-chip--select-multi"
                        @click.stop="data.parent.selectedIndex = data.index"
                        @input="data.parent.selectItem(data.item)"
                        text-color="white"
                        color="info"
                    >{{ data.item.name }}
                    </v-chip>
                  </template>
                </v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    readonly
                    hide-details
                    outlined
                    prepend-icon="credit_card"
                    v-model="createConsultationForm.user.cpf"
                    label="CPF">
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    v-if="createConsultationForm.user.association_number"
                    readonly
                    hide-details
                    outlined
                    prepend-icon="credit_card"
                    v-model="createConsultationForm.user.association_number"
                    label="Nº do associado">
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12 lg12>
                <v-divider/>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    readonly
                    hide-details
                    outlined
                    prepend-icon="person"
                    v-model="createConsultationForm.consultation.doctor.name"
                    label="Nome do Médico">
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    readonly
                    hide-details
                    outlined
                    prepend-icon="credit_card"
                    v-model="createConsultationForm.consultation.doctor.crm"
                    label="CRM">
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    readonly
                    hide-details
                    outlined
                    prepend-icon="school"
                    v-model="createConsultationForm.consultation.product.name"
                    :label="createConsultationForm.consultation.product.type === 'SPECIALTY' ? 'Especialidade' : 'Tipo de exame'">
                </v-text-field>

               <!--  <v-text-field
                    v-else
                    readonly
                    hide-details
                    outlined
                    prepend-icon="school"
                    v-model="createConsultationForm.consultation.exam_type.name"
                    label="Tipo de exame">
                </v-text-field> -->
              </v-flex>

              <v-flex xs12 sm6>
                <v-text-field
                    prepend-icon="event"
                    label="Dia da Consulta"
                    v-model="computedDateFormatted"
                    readonly
                    hide-details
                    outlined>
                </v-text-field>
              </v-flex>

              <v-flex xs12
                      v-show="createConsultationForm.consultation.product.type === 'EXAM'">
                <v-combobox
                    prepend-icon="poll"
                    v-model="exam"
                    :items="createConsultationForm.consultation.product.others"
                    item-text="name"
                    return-object
                    label="Exame"
                    outlined
                    chips
                    color="blue"
                    clearable
                    hide-details
                >
                  <template v-slot:selection="data">
                    <v-chip
                        :key="JSON.stringify(data.item)"
                        :input-value="data.selected"
                        :disabled="data.disabled"
                        class="v-chip--select-multi"
                        @click.stop="data.parent.selectedIndex = data.index"
                        @input="data.parent.selectItem(data.item)"
                        text-color="white"
                        color="info"
                    >{{ data.item.name }}
                    </v-chip>
                  </template>
                </v-combobox>
              </v-flex>

              <v-flex xs12 sm4>
                <v-text-field
                    v-model="createConsultationForm.consultation.date.split(' ')[1]"
                    prepend-icon="access_alarm"
                    label="Hora da Consulta"
                    readonly
                    hide-details
                    outlined>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm8>
                <v-progress-circular
                    v-if="loaderPaymentNumber"
                    indeterminate
                    color="primary">
                </v-progress-circular>
                <v-select
                    v-else
                    prepend-icon="assignment_turned_in"
                    v-model="status"
                    :items="statusOptions"
                    label="Status"
                    chips
                    hide-details
                    outlined
                    readonly
                >
                  <template v-slot:selection="data">
                    <v-chip
                        :key="JSON.stringify(data.item)"
                        :input-value="data.selected"
                        :disabled="data.disabled"
                        class="v-chip--select-multi"
                        @click.stop="data.parent.selectedIndex = data.index"
                        @input="data.parent.selectItem(data.item)"
                        text-color="white"
                        :color="data.item.text === 'Pago' ? 'success' : data.item.text === 'Cancelado' ? 'error': 'warning'"
                    >{{ data.item.text }}
                    </v-chip>
                  </template>
                </v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    prepend-icon="assignment"
                    v-model="modalidade"
                    readonly
                    hide-details
                    outlined
                    label="Modalidade"
                    chips>
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    readonly
                    prepend-icon="receipt"
                    label="Nº do Recibo"
                    v-model="numberReceipt"
                    type="number"
                    :disabled="status!=='Pago'"
                    hide-details
                    outlined>
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-btn rounded class="error" @click="close">
            Cancelar
            <v-icon right>clear</v-icon>
          </v-btn>
          <v-spacer/>
          <submit-button
              color="success"
              rounded
              :disabled="loaderPaymentNumber || (createConsultationForm.consultation.product.type === 'EXAM' && !exam)"
              @reset="resetSchedule"
              :success="success"
              :loading="scheduleLoading"
              @click="saveConsultation"
              text="Confirmar">
          </submit-button>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-container>
</template>
<script>

import SubmitButton from "../SubmitButton";
import gql from 'graphql-tag'
import MutationBuilder from "../../classes/MutationBuilder"
import {uuid} from 'vue-uuid'

export default {

  props: ['createConsultationForm','prolonged' ,'loaderPaymentNumber', 'exams', 'numberReceipt', 'status', 'payment_numberFound', 'modalidade', 'previousConsultation'],
  components: {SubmitButton},

  data: () => ({
    success: false,
    scheduleLoading: false,
    statusOptions: [{text: "Aguardando pagamento"}, {text: "Pago"}],
    exam: undefined,
    findPaymentToExam: true,
    skipPatients:true
  }),
  mounted(){
    //console.log(this.createConsultationForm)
  },
  computed: {
    selectedPatient() {
      return this.$store.getters.selectedPatient;
    },
    foundDependents() {
      return this.selectedPatient ? this.selectedPatient.dependents : undefined;
    },
    computedDateFormatted() {
      let date = this.createConsultationForm.consultation.date.formatted;
      return this.formatDate(date.split("T")[0]);
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    resetSchedule() {
      this.success = false;
      this.close()
    },

    async saveConsultation() {
      this.scheduleLoading = true;
      let form = this.createConsultationForm;
      form.consultation = {
        ...form.consultation,
        status: this.status,
        type: this.modalidade,
        payment_number: this.numberReceipt,
      };

      form.consultation.date = {formatted:form.consultation.date.replace(" ", "T")}
      
      const consultationId = uuid.v4();
      let mutationBuilder = new MutationBuilder();
      mutationBuilder.addMutation(
        `CreateConsultation(id:"${consultationId}" type:"${form.consultation.type}", date:"${form.consultation.date}",payment_number:"${form.consultation.payment_number}",status:"${form.consultation.status}"){
            id
          }
        `
      )

      mutationBuilder.addMutation(
        `AddPatientWith_consultation(from:{id:"${form.user.id}"},to:{id:"${consultationId}"}){
          from{id},to{id}
        }
      `);

      mutationBuilder.addMutation(
        `AddConsultationCame_from(from:{id:"${consultationId}"},to:{id:"${form.consultation.id_schedule}"}){
          from{id},to{id}
        }
      `);

      mutationBuilder.addMutation(
        `AddConsultationHas_product(from:{id:"${consultationId}"},to:{id:"${this.exam ? this.exam.id : form.consultation.product.id}"}){
          from{id},to{id}
        }
      `);

      mutationBuilder.addMutation(
        `AddConsultationOf_clinic(from:{id:"${consultationId}"},to:{id:"${form.consultation.clinic.id}"}){
          from{id},to{id}
        }
      `);

      mutationBuilder.addMutation(
        `AddConsultationAttended_by(from:{id:"${consultationId}"},to:{id:"${form.consultation.doctor.id}"}){
          from{id},to{id}
        }
      `);

      if(form.user.dependent){
        mutationBuilder.addMutation(
          `AddDependentWith_consultations(from:{id:"${form.user.dependent.id}"},to:{id:"${consultationId}"}){
              from{id},to{id}
            }
        `);
      }

      if(form.consultation.type === "Retorno" && this.previousConsultation){
        mutationBuilder.addMutation(
          `AddConsultationRegress(from:{id:"${this.previousConsultation}"},to:{id:"${consultationId}"}){
              from{id},to{id}
            }
        `);

        mutationBuilder.addMutation(
          `AddConsultationPrevious_consultation(from:{id:"${consultationId}"},to:{id:"${this.previousConsultation}"}){
              from{id},to{id}
            }
        `);
      }

      if(form.productTransaction){
        mutationBuilder.addMutation(
          `AddProductTransactionWith_consultation(from:{id:"${form.productTransaction.id}"},to:{id:"${consultationId}"}){
              from{id},to{id}
            }
        `);

        mutationBuilder.addMutation(
          `UpdateConsultation(id:"${consultationId}",status:"Pago"){
              id
            }
        `);
      }

      const reescheduleConsultation = this.$route.params.q && this.$route.params.type === 'Remarcar'

      if(reescheduleConsultation){
        mutationBuilder.addMutation(
          `DeleteConsultation(id:"${this.previousConsultation}"){
              id
            }
        `);
      }
      
      let finalString = mutationBuilder.generateMutationRequest()

      await this.$apollo.mutate({
        mutation: gql`${finalString}`,
      })
      
      this.scheduleLoading = false;
      this.success = true;

      if(reescheduleConsultation){
        this.$router.back()
      }else{
        this.skipPatients = false
        this.$apollo.queries.loadPatient.refresh()
      }
    },
    
    close: function () {
      this.exam = undefined
      this.$emit('close-dialog')
    }
  },
  watch: {
    createConsultationForm(value) {
      //this.setExamFromCreatedForm()
    },
    exam(value) {
      if (value && this.findPaymentToExam) {
        this.$emit('findPaymentNumberToExam', value)
      } else {
        this.findPaymentToExam = true
      }
    },
    payment_numberFound(value) {
      if (value && value.exam) {
        this.exam = Object.assign({}, value.exam)
        this.findPaymentToExam = false
      }

    }
  },

  apollo: {
    loadPatient: {
      fetchPolicy: 'no-cache',
      query: require("@/graphql/reactivity/ReloadConsultationsPatient.gql"),
      variables(){
        return {
          idPatient: this.createConsultationForm.user.id
        }
      },
      update(data) {
        this.$store.commit('setSelectedPatient', data.Patient[0]);
        this.skipPatients = true
      },
      skip (){
        return this.skipPatients
      }
    }
  }
}
</script>
