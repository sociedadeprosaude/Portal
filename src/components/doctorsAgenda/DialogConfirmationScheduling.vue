<template>
    <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>
              <v-btn
                @click="$emit('close')"
                text
                class="transparent"
                style="width: 32px; min-width: 0px"
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
                      label="Nome do Paciente"
                    ></v-text-field>
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
                        >{{ data.item.name }}</v-chip>
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
                      label="CPF"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field
                      v-if="createConsultationForm.user.association_number"
                      readonly
                      hide-details
                      outlined
                      prepend-icon="credit_card"
                      v-model="createConsultationForm.user.association_number"
                      label="Nº do associado"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12 lg12>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field
                      readonly
                      hide-details
                      outlined
                      prepend-icon="person"
                      v-model="createConsultationForm.consultation.doctor.name"
                      label="Nome do Médico"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field
                      readonly
                      hide-details
                      outlined
                      prepend-icon="credit_card"
                      v-model="createConsultationForm.consultation.doctor.crm"
                      label="CRM"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field
                      readonly
                      hide-details
                      outlined
                      prepend-icon="school"
                      v-model="createConsultationForm.consultation.specialty.name"
                      label="Especialidade"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6>
                    <v-text-field
                      prepend-icon="event"
                      label="Dia da Consulta"
                      v-model="computedDateFormatted"
                      readonly
                      hide-details
                      outlined
                    ></v-text-field>
                  </v-flex>

                  <v-flex
                    xs12
                    v-show="exames.indexOf(createConsultationForm.consultation.specialty.name) != -1"
                  >
                    <v-combobox
                      prepend-icon="poll"
                      v-model="exam"
                      :items="listExam"
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
                        >{{ data.item.name }}</v-chip>
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
                      outlined
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm8>
                    <v-progress-circular v-if="loaderPaymentNumber" indeterminate color="primary"></v-progress-circular>
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
                        >{{ data.item.text }}</v-chip>
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
                      chips
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field
                      readonly
                      prepend-icon="receipt"
                      label="Nº do Recibo"
                      v-model="num_recibo"
                      type="number"
                      :disabled="status === 'Pago' ? false : true"
                      hide-details
                      outlined
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12 lg12>
                    <v-divider></v-divider>
                  </v-flex>
                  <v-flex xs12>
                    <v-select
                      prepend-icon="device_unknown"
                      v-model="attendance"
                      :items="attendanceOptions"
                      label="Atendimento"
                      chips
                      readonly
                      hide-details
                      outlined
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <!-- <v-dialog v-model="loader" hide-overlay persistent width="300">
                                        <v-card color="primary" dark>
                                            <v-card-text>
                                                Salvando...
                                                <v-progress-linear indeterminate color="white"
                                                                   class="mb-0"></v-progress-linear>
                                            </v-card-text>
                                        </v-card>
              </v-dialog>-->
              <v-btn rounded class="error" @click="$emit('close')">
                Cancelar
                <v-icon right>clear</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <submit-button
                color="success"
                rounded
                :disabled="loaderPaymentNumber || (exames.indexOf(createConsultationForm.consultation.specialty.name) != -1 && !exam)"
                @reset="resetSchedule"
                :success="success"
                :loading="scheduleLoading"
                @click="save"
                text="Confirmar"
              ></submit-button>
            </v-card-actions>
          </v-card>
</template>
          

<script>
    export default {
        name: "DialogConfirmation",
        props: ['createConsultationForm'],
        data:()=>({
            exames: ['ULTRASSONOGRAFIA', 'ELETROCARDIOGRAMA', 'ELETROENCEFALOGRAMA', 'ECOCARDIOGRAMA', 'VIDEOLARIGONSCOPIA'],
        }),
        computed:{
            computedDateFormatted() {
                return this.formatDate(
                    this.createConsultationForm.consultation.date.split(" ")[0]
                );
            },
            listExam() {
              let val = this.$store.getters.exams.filter(a => {
                  return a.type === this.createConsultationForm.consultation.specialty.name;
              });
              return val;
              //return this.$store.getters.exams;
            },
        },
        methods: {
            selectedPatient() {
                let paciente = this.$store.getters.selectedPatient;
                return paciente;
            },
            foundDependents() {
                return this.selectedPatient ? this.selectedPatient.dependents:undefined;
            }, 
            formatDate(date) {
                if (!date) return null;
                const [year, month, day] = date.split("-");
                return `${day}/${month}/${year}`;
            },
        }
    }
</script>