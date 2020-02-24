<template>
  <v-layout row wrap>
    <v-flex sm8 xs12 class="pr-2">
      <v-layout align-center row wrap class="ml-6">
        <v-flex xs12 md5>
          <v-combobox
            prepend-icon="school"
            v-model="especialidade"
            :items="specialties"
            item-text="name"
            return-object
            label="Especialidade"
            outlined
            rounded
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
          </v-combobox>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex xs12 md5>
          <v-combobox
            prepend-icon="person"
            v-model="selectedDoctor"
            :items="doctors"
            return-object
            item-text="name"
            label="Médicos"
            outlined
            rounded
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
          </v-combobox>
        </v-flex>

        <v-flex xs12 md12>
          <v-select
            prepend-icon="location_city"
            v-model="clinic"
            :items="clinics"
            item-text="name"
            label="Clínica"
            outlined
            rounded
            filled
            chips
            color="purple"
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
      </v-layout>
      <v-layout
        row
        wrap
        style="width:100%"
        class="align-center justify-center py-0"
        v-for="(consultaGroup, i) in consultasByDate(consultas)"
        :key="i"
      >
        <v-flex xs12>
          <div v-bind:id="'group-' + i">
            <v-card dark color="primary_dark" class="title">
              <v-card-text
                class="px-3 text-left my-sub-headline"
              >{{i | dateFilter}} - {{daydate(i)}}</v-card-text>
            </v-card>
          </div>
        </v-flex>
        <v-container fluid grid-list-sm class="py-0 my-3">
          <v-layout row wrap>
            <v-flex v-for="(consulta, j) in consultaGroup" :key="j" sm4 xs12>
              <v-card class="elevation-12" dark style="border-radius:20px">
                <v-card-text class="white text--primary">
                  <v-container class="py-0 px-0">
                    <v-layout row wrap>
                      <v-flex xs2 sm2 dm2 lg2>
                        <v-avatar>
                          <v-btn icon large color="primary_dark">
                            <v-icon medium color="grey">person</v-icon>
                          </v-btn>
                        </v-avatar>
                      </v-flex>

                      <v-flex id="teste" xs10 sm10 md10 lg10 class="pl-3 py-2 text-left mb-1">
                        <div style="height:60px">
                          <h4>
                            <span class="subheading font-weight-bold">{{consulta.doctor.name}}</span>
                            <br />
                            <span
                              class="body-2 font-weight-bold grey--text"
                            >{{consulta.specialty.name}}</span>
                            <br />
                            <span
                              class="body-2 font-weight-bold grey--text"
                            >CRM-AM: {{consulta.doctor.crm}}</span>
                          </h4>
                        </div>
                      </v-flex>

                      <v-flex class="my-0" xs12>
                        <v-layout row wrap>
                          <v-chip
                            class="mx-2"
                            color="primary_dark"
                            text-color="white"
                          >{{consulta.date.split(' ')[1]}}</v-chip>
                          <v-chip color="primary_dark" text-color="white">
                            Vagas :
                            {{consulta.vagas}}
                          </v-chip>
                          <v-chip class="mt-1 mr-1" color="primary_dark" text-color="white">
                            Consultas :
                            {{consulta.numConsultations}}
                          </v-chip>
                          <v-chip class="mt-1" color="primary_dark" text-color="white">
                            Retornos :
                            {{consulta.returns}}
                          </v-chip>
                          <v-chip
                            class="mt-1"
                            color="primary_dark"
                            text-color="white"
                          >{{consulta.clinic.name}}</v-chip>
                        </v-layout>
                      </v-flex>
                      <v-flex xs12 class="text-right">
                        <v-btn
                          rounded
                          color="primary_dark"
                          class="mx-0"
                          :disabled="consulta.vagas === 0"
                          @click="scheduleAppointment(consulta)"
                        >Agendar</v-btn>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
      <v-flex xs12 v-if="!consultationLoading">
        <v-btn class="primary" rounded @click="listenMoreConsultations">Carregar mais</v-btn>
      </v-flex>
      <v-flex xs12 v-else>
        <v-progress-circular class="primary--text" indeterminate></v-progress-circular>
      </v-flex>
    </v-flex>
    <v-flex v-if="!showAlert" xs4 class="text-center hidden-xs-only">
      <v-layout row wrap class="align-center justify-center">
        <v-flex xs12 class="text-center">
          <select-patient-card ref="patientCard" max-width="1000px"></select-patient-card>
        </v-flex>
        <v-flex xs12 class="text-center mt-4">
          <v-date-picker
            landscape
            full-width
            class="mx-4"
            v-model="date"
            :allowed-dates="allowedDates"
            locale="pt-br"
          ></v-date-picker>
        </v-flex>
      </v-layout>
    </v-flex>
    <template>
      <v-container>
        <v-layout>
          <div class="text-xs-center">
            <v-dialog v-model="dialog" v-if="createConsultationForm" max-width="520">
              <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>
                  <v-btn
                    @click="dialog = false"
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
                        <v-progress-circular
                          v-if="loaderPaymentNumber"
                          indeterminate
                          color="primary"
                        ></v-progress-circular>
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
                  <v-dialog v-model="loader" hide-overlay persistent width="300">
                    <v-card color="primary" dark>
                      <v-card-text>
                        Salvando...
                        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                  <v-btn rounded class="error" @click="dialog = false">
                    Cancelar
                    <v-icon right>clear</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <submit-button
                    color="success"
                    rounded
                    :disabled="loaderPaymentNumber"
                    @reset="resetSchedule"
                    :success="success"
                    :loading="scheduleLoading"
                    @click="save"
                    text="Confirmar"
                  ></submit-button>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
          <v-dialog v-model="dialogPaciente" width="1000">
            <pacientes></pacientes>
          </v-dialog>
        </v-layout>
      </v-container>
    </template>

    <v-dialog v-model="snackbar" hide-overlay max-width="500px">
      <v-card color="white">
        <v-card-title class="text-xs-center ma-1">
          <h3>
            {{this.mensagem}}
            <v-icon dark color="success">done_outline</v-icon>
          </h3>
        </v-card-title>
        <v-card-text class="text-xs-center">
          <div>
            <h4 class="text--primary">Você deseja continuar com o paciente selecionado?</h4>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="keepPatient">Sim</v-btn>
          <v-btn color="primary" flat @click="clearPatient">Não</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn
      v-if="offsetTop > 2"
      class="mr-2"
      fixed
      dark
      fab
      bottom
      right
      color="primary"
      @click="backTop"
    >
      <v-icon>keyboard_arrow_up</v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
import Pacientes from "./Patient";
import SelectPatientCard from "../../components/SelectPatientCard";
import SubmitButton from "../../components/SubmitButton";

var moment = require("moment");
// import * as easings from "vuetify/es5/util/easing-patterns";
export default {
  components: { Pacientes, SelectPatientCard, SubmitButton },

  data: () => ({
    y: "top",
    x: null,
    mode: "",
    alert: false,
    loaderPaymentNumber: false,
    menu: false,
    clinic: undefined,
    dialog: false,
    dialog2: false,
    dialogPaciente: false,
    selectedDoctor: undefined,
    num_recibo: "",
    type: "",
    createConsultationForm: undefined,
    payment_numberFound: undefined,
    attendance: "Aguardando Atendimento",
    attendanceOptions: [
      { text: "Aguardando Atendimento" },
      { text: "Atendimento Realizado" }
    ],
    semanaOptions: [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado"
    ],
    status: "Aguardando pagamento",
    statusOptions: [{ text: "Aguardando pagamento" }, { text: "Pago" }],
    modalidade: "Consulta",
    date: moment().format("YYYY-MM-DD"),
    dates: [],
    times: "",
    timesOptions: [],
    medicosOptions: ["Todos"],
    pacientes: "",
    timeout: 4000,
    dateFormatted: "",
    especialidadeOption: "",
    especialidade: undefined,
    showAlert: false,
    snackDialogDone: false,
    snack: false,
    changeDoctorsOptions: true,
    success: false,
    loading: false,
    scheduleLoading: false,
    dependent: undefined,
    consultationsListenerUnsubscriber: undefined,
    daysToListen: 3,
    selectedForm:undefined,

    //-------------------------------------------Scroll------------------------------------------------
    type: "number",
    number: 9999,
    selector: "#first",
    selected: "Button",
    elements: ["Button", "Radio group"],
    duration: 500,
    offset: 15,
    easing: "easeInQuint",
    // easings: Object.keys(easings),
    offsetTop: 0
    //---------------------------------------------------------------------------------------------------
  }),

  computed: {
    consultationLoading() {
      return this.$store.getters.consultationsLoading;
    },
    clinics() {
      let val = this.$store.getters.clinics.filter(a => {
        return a.property;
      });
      return val;
      //return this.$store.getters.clinics;
    },
    specialties() {
      //return this.$store.getters.specialties;

      let espArray = Object.values(this.$store.getters.specialties);
      espArray = espArray.filter(specialty => {
        //console.log('Teeeee',specialty)
        if (!this.selectedDoctor) {
          return true;
        }
        var find = false;
        specialty.doctors.forEach(doctor => {
          if (doctor.cpf === this.selectedDoctor.cpf) {
            find = true;
            return true;
          }
        });

        return find;
      });
      //docArray.unshift({name:'Todos'})
      return espArray;
    },
    computedDateFormatted() {
      return this.formatDate(
        this.createConsultationForm.consultation.date.split(" ")[0]
      );
    },
    consultas() {
      let consultas = this.formatConsultationsArray(
        this.$store.getters.consultations
      ).filter(a => {
        //console.log("selecionado:", this.clinic)
        //console.log("do banco:", a.clinic.name)
        let response = true;
        if (this.selectedDoctor) {
          if (this.selectedDoctor.cpf !== a.doctor.cpf) {
            response = false;
          }
        }
        if (this.especialidade) {
          if (this.especialidade.name !== a.specialty.name) {
            response = false;
          }
        }
        if (this.clinic) {
          if (this.clinic !== a.clinic.name) {
            response = false;
          }
        }
        //console.log("resposta:", response)
        return response;
      });
      return consultas;
    },
    doctors: {
      get: function() {
        /* let docs = {
                                    0: {
                                        name: 'Todos'
                                    },
                                    ...this.$store.getters.doctors
                                }
                                return Object.values(docs) */

        let docArray = Object.values(this.$store.getters.doctors);
        docArray = docArray.filter(doctor => {
          if (!this.especialidade) {
            return true;
          }
          var find = false;
          doctor.specialties.forEach(specialty => {
            //console.log(doctor.name,specialty.name)
            if (specialty.name === this.especialidade.name) {
              find = true;
              return true;
            }
          });

          return find;
        });
        //docArray.unshift({name:'Todos'})
        return docArray;
      }
    },
    selectedPatient() {
      let paciente = this.$store.getters.selectedPatient;
      return paciente;
    },
    foundDependents() {
      return this.selectedPatient.dependents;
    },
    mensagem() {
      return this.$store.getters.onMensagem;
    },
    // especialidade: {
    //     set: function (value) {
    //         this.especialidadeOption = value;
    //         this.dates = [];
    //     },
    //     get: function () {
    //         return this.especialidadeOption;
    //     }
    // },
    //------------------------------------------Scroll-------------------------------------------------
    target() {
      const value = this[this.type];
      if (!isNaN(value)) return Number(value);
      else return value;
    },
    options() {
      return {
        duration: this.duration,
        offset: this.offset,
        easing: this.easing
      };
    },
    element() {
      if (this.selected === "Button") return this.$refs.button;
      else if (this.selected === "Radio group") return this.$refs.radio;
    }
    //-----------------------------------------------------------------------------------------------------
  },
  watch: {
    medico(value) {
      this.dates = [];
      this.$store.dispatch("loadAppointment", {
        especialidade: this.especialidadeOption,
        medico: value
      });
    },
    date(val) {
      /* window.scrollTo(
                            0,
                            this.findPos(document.getElementById("group-" + val), "group-" + val)
                          ); */
      if (val == this.consultas[0].date) this.$vuetify.goTo(0, this.options);
      else this.$vuetify.goTo("#group-" + val, this.options);
    }
  },

  mounted() {
    this.showAlert = false;
    this.initialConfig();
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    this.consultationsListenerUnsubscriber();
  },
  methods: {
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    scheduleAppointment(consultation) {
      if (!this.selectedPatient) {
        this.$refs.patientCard.$el.classList.add("shaking-ease-anim");
        setTimeout(() => {
          this.$refs.patientCard.$el.classList.remove("shaking-ease-anim");
        }, 1000);
        return;
      }
      this.fillConsultationForm(consultation);
      this.dialog = true;
    },
    async fillConsultationForm(consultation) {
       this.selectedForm = {
        user: this.selectedPatient,
        consultation: consultation.consultations.find(a => {
          return !a.user;
        })
      }      

      this.thereIsPaymentNumber()

      this.createConsultationForm = this.selectedForm;
    },

     specialtyCost() {
                let espArray = Object.values(this.$store.getters.specialties);
                let cost = undefined
                espArray.forEach(specialty => {
                    if(specialty.name === this.selectedForm.consultation.specialty.name){
                        
                         specialty.doctors.forEach(doctor => {
                            if (doctor.cpf === this.selectedForm.consultation.doctor.cpf) {
                                cost = {
                                    cost : doctor.cost,
                                    price :doctor.price,
                                    doctorConsultation :doctor
                                }
                                return cost
                            }
                        });
                    }
                });
                return cost
            },

    async thereIsPaymentNumber(){
      this.payment_numberFound = undefined;
      this.num_recibo = "";
      this.status = "Aguardando pagamento";

      this.loaderPaymentNumber = true;

      if (this.selectedForm.consultation.specialty.name != "ULTRASSONOGRAFIA") {
        
            this.$store
            .dispatch("thereIsIntakes", {
               user: this.selectedForm.user,
                doctor: this.selectedForm.consultation.doctor,
                specialty: this.selectedForm.consultation.specialty,
            })
            .then(obj => {
                this.payment_numberFound = obj;
                this.num_recibo = obj.payment_number;
                this.status = "Pago"
                this.loaderPaymentNumber = false;
            })
            .catch(response => {
              let cost = this.specialtyCost()
              console.log(cost);
              if ( cost && cost.price == 0){
                  this.status = "Pago"
                  this.loaderPaymentNumber = false 
              }
              
                this.loaderPaymentNumber = false;
                
            });
        
      } else {
        this.status = "Pago";
      }

    },
    formatConsultationsArray(consultations) {
      let newArray = [];
      for (let consultation in consultations) {
        let inArrayIndex = this.checkConsultationIsInArray(
          newArray,
          consultations[consultation]
        );
        if (inArrayIndex === -1) {
          newArray.push({
            ...consultations[consultation],
            // vagas: consultations[consultation].user ? 0 : 1,
            consultations: [consultations[consultation]]
          });
        } else {
          // newArray[inArrayIndex].vagas++
          newArray[inArrayIndex].consultations.push(
            consultations[consultation]
          );
        }
      }
      for (let i in newArray) {
        newArray[i].vagas = newArray[i].consultations.filter(a => {
          return !a.user;
        }).length;
        newArray[i].numConsultations = newArray[i].consultations.filter(a => {

          return a.user && a.type === "Consulta";
        }).length;
        newArray[i].returns = newArray[i].consultations.filter(a => {

          return a.user && a.type === "Retorno";
        }).length;
      }
      return newArray;
    },
    checkConsultationIsInArray(array, consultation) {
      for (let i in array) {
        if (
          array[i].date === consultation.date &&
          array[i].doctor.cpf === consultation.doctor.cpf &&
          array[i].specialty.name === consultation.specialty.name
        ) {
          return i;
        }
      }
      return -1;
    },
    consultasByDate(consultations) {
      let res = {};
      for (let cons in consultations) {
        let targetDate = consultations[cons].date.split(" ")[0];
        if (!res[targetDate]) {
          res[targetDate] = [];
        }
        res[targetDate].push(consultations[cons]);
      }
      return res;
    },
    async initialConfig() {
      this.loading = true;
      // this.$store.dispatch("getClinics");
      // await this.$store.dispatch("getDoctors");
      await this.listenConsultations();
      // await this.$store.dispatch("getSpecialties");
      this.loading = false;
    },
    async listenConsultations() {
      this.consultationsListenerUnsubscriber = await this.$store.dispatch(
        "listenConsultations",
        {
          start_date: moment()
            .subtract(4, "hours")
            .format("YYYY-MM-DD HH:mm:ss"),
          final_date: moment()
            .add(this.daysToListen, "days")
            .format("YYYY-MM-DD 23:59:59")
        }
      );
    },
    async listenMoreConsultations() {
      if (this.consultationsListenerUnsubscriber) {
        this.consultationsListenerUnsubscriber();
      }
      this.daysToListen += 3;
      this.listenConsultations();
    },
    backTop() {
      this.$vuetify.goTo(0, this.options);
      this.date = this.consultas[0].date;
    },
    handleScroll(event) {
      var scrollPos = window.scrollY;
      var winHeight = window.innerHeight;
      var docHeight = document.documentElement.scrollHeight; // instead document.body.clientHeight
      this.offsetTop = (100 * scrollPos) / (docHeight - winHeight);
    },
    findPos(obj, elementId) {
      var curtop = 0;
      if (elementId == "group-" + this.dates[0]) {
        return [0];
      } else if (obj.offsetParent) {
        do {
          curtop += obj.offsetTop;
        } while ((obj = obj.offsetParent));
        return [curtop - 70];
      }
    },
    allowedDates(val) {
      return (
        Object.keys(this.consultasByDate(this.consultas)).indexOf(val) !== -1
      );
    },
    daydate(date) {
      var dateMoment = moment(date);
      return this.semanaOptions[dateMoment.day()];
    },
    keepPatient() {
      this.snackDialogDone = true;
      this.snackbar = false;
    },
    clearPatient() {
      this.snackDialogDone = true;
      this.snackbar = false;
      this.$store.dispatch("selecionarPaciente", null);
    },
    clearRecibo() {
      this.num_recibo = "";
    },
    // formatDate(date) {
    //     if (!date) return null;
    //     const [year, month, day] = date.split("-");
    //     return `${day}/${month}/${year}`;
    // },
    call() {
      var consulta = this.$store.getters.idConsultation({
        data: this.index_Selecionado.data,
        hora: this.index_Selecionado.hora,
        crm: this.index_Selecionado.crm,
        status: this.status,
        modalidade: this.modalidade,
        num_recibo: this.num_recibo
      });

      this.$store.dispatch("scheduleAppointment", {
        pacienteSelecionado: this.pacienteSelecionado,
        status: this.status,
        modalidade: this.modalidade,
        consulta: consulta,
        especialidade: this.especialidade,
        num_recibo: this.num_recibo
      });
      this.clear();
    },
    clear() {
      this.num_recibo = "";
      this.status = "Aguardando pagamento";
    },
    resetSchedule() {
      this.dialog = false;
      this.success = false;
    },

    async finalizeSaveConsultation(){
        let form = this.createConsultationForm;
        form.user = {
            ...form.user,
            status: this.status,
            type: this.modalidade,
            payment_number: this.num_recibo
        };
        form.consultation = {
            ...form.consultation,
            status: this.status,
            type: this.modalidade,
            payment_number: this.num_recibo
        };

        if (this.payment_numberFound)
            form = { ...form, payment_numberFound: this.payment_numberFound };
        if (form.user.dependent)
            form.consultation = {
            ...form.consultation,
            dependent: form.user.dependent
            };
        // return
        this.loading = true;
        await this.$store.dispatch("addConsultationAppointmentToUser", form);
        //Realizar essa funcao pelo cloud functions
        await this.$store.dispatch("addUserToConsultation", form);
        this.scheduleLoading = false;
        this.success = true;
        this.dependent = undefined;
    },
    async save() {
      this.scheduleLoading = true;
      this.finalizeSaveConsultation()
    }
  }
};
</script>

<style scoped>
</style>
