<template>
  <v-layout row wrap>
    <v-flex xs8>
      <v-layout align-center row wrap class="ml-6">
        <v-flex xs12 md5>
          <v-text-field
            prepend-icon="school"
            v-model="especialidade.name"
            label="Especialidade"
            outlined
            rounded
            filled
          ></v-text-field>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex xs12 md6>
          <v-text-field
            prepend-icon="location_city"
            v-model="selectedDoctor.name"
            label="Clínica"
            outlined
            rounded
            filled
            disabled
          ></v-text-field>
        </v-flex>

        <v-flex xs12 md12>
          <v-text-field
            prepend-icon="location_city"
            v-model="clinic.name"
            label="Clínica"
            outlined
            rounded
            filled
            disabled
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout
        row
        wrap
        style="width:100%"
        class="align-center justify-center py-0"
        v-for="(scheduleGroup, i) in consultasByDate(schedules)"
        :key="i"
      >
        <v-flex xs12>
          <div v-bind:id="'group-' + i">
            <v-card color="primary_dark" class="mx-2">
              <v-card-text
                class="px-3 text-left my-sub-headline white--text"
              >{{i | dateFilter}} - {{daydate(i)}}</v-card-text>
            </v-card>
          </div>
        </v-flex>
        <v-container fluid grid-list-sm class="py-0 my-3 mx-2">
          <v-layout row wrap>
            <v-flex v-for="(schedule, j) in scheduleGroup" :key="j" sm4 xs12 class="px-2 py-2">
              <v-card class="pa-4" style="border-radius:20px; height: 100%">
                <v-layout fill-height>
                  <v-layout row wrap>
                    <v-flex id="teste" xs12 class="pl-3 text-left">
                      <h4>
                        <span class="subheading font-weight-bold">{{schedule.doctor.name}}</span>
                        <br />
                        <span
                          class="body-2 font-weight-bold dark_grey--text"
                        >{{schedule.specialty.name}}</span>
                        <br />
                      </h4>
                    </v-flex>
                    <v-flex xs12 class="mb-1">
                      <v-divider></v-divider>
                    </v-flex>

                    <v-flex class="my-0" xs12>
                      <v-layout row wrap class="text-left font-weight-bold">
                        <v-flex xs12>
                          <v-chip
                            class="mx-2"
                            color="primary_dark"
                            text-color="white"
                          >{{schedule.date.split(' ')[1]}}</v-chip>
                          <v-chip color="primary_dark" text-color="white">
                            Vagas :
                            {{schedule.vacancy}}
                          </v-chip>
                        </v-flex>
                        <v-flex xs12>
                          <v-chip class="mt-1 mr-1" color="primary_dark" text-color="white">
                            Consultas :
                            {{schedule.qtd_consultations ? schedule.qtd_consultations : 0}}
                          </v-chip>
                          <v-chip class="mt-1" color="primary_dark" text-color="white">
                            Retornos :
                            {{schedule.qtd_returns ? schedule.qtd_returns : 0}}
                          </v-chip>
                          <v-chip
                            class="mt-1"
                            color="primary_dark"
                            text-color="white"
                          >{{schedule.clinic.name}}</v-chip>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12 class="text-right">
                      <v-fade-transition>
                        <v-btn
                          v-if="isOnline"
                          rounded
                          color="primary_dark white--text"
                          class="mx-0"
                          :disabled="schedule.vacancy === 0"
                          @click="scheduleAppointment(schedule)"
                        >Agendar</v-btn>
                        <v-btn v-else rounded color="grey" class="mx-0">Sem conexão</v-btn>
                      </v-fade-transition>
                    </v-flex>
                  </v-layout>
                </v-layout>
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
    <v-flex v-if="!showAlert" xs4 class="text-center">
      <v-layout row wrap class="align-center justify-center">
        <v-flex xs12 class="text-center">
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
            <v-dialog v-model="dialog" v-if="createConsultationForm" width="500">
              <v-card>
                <v-card-title
                  class="headline grey lighten-2"
                  primary-title
                >Confirmar Agendamento da Consulta</v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap row class="align-center">
                      <v-flex xs12 sm12>
                        <v-text-field
                          readonly
                          prepend-icon="person"
                          v-model="createConsultationForm.user.name"
                          label="Nome do Paciente"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field
                          readonly
                          prepend-icon="credit_card"
                          v-model="createConsultationForm.user.cpf"
                          label="CPF"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field
                          v-if="createConsultationForm.user.association_number"
                          readonly
                          prepend-icon="credit_card"
                          v-model="createConsultationForm.user.association_number"
                          label="Nº do associado"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 v-if="createConsultationForm.user.dependent">
                        <v-text-field
                          readonly
                          hide-details
                          prepend-icon="person"
                          label="Nome do Dependente"
                          v-model="createConsultationForm.user.dependent.name"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 v-if="createConsultationForm.user.dependent">
                        <v-text-field
                          readonly
                          hide-details
                          prepend-icon="person"
                          label="Nascimento do Dependente"
                          v-model="createConsultationForm.user.dependent.birthDate"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 v-if="createConsultationForm.user.dependent">
                        <v-text-field
                          readonly
                          hide-details
                          prepend-icon="credit_card"
                          v-model="createConsultationForm.user.dependent.dependentDegree"
                          label=" Grau do Dependente"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12 lg12>
                        <v-divider></v-divider>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field
                          readonly
                          prepend-icon="person"
                          v-model="createConsultationForm.consultation.doctor.name"
                          label="Nome do Médico"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field
                          readonly
                          prepend-icon="credit_card"
                          v-model="createConsultationForm.consultation.doctor.crm"
                          label="CRM"
                        ></v-text-field>
                      </v-flex>
                      <v-flex
                        xs12
                        sm6
                        v-if="exames.indexOf(createConsultationForm.consultation.specialty.name) != -1"
                      >
                        <v-text-field
                          readonly
                          hide-details
                          outlined
                          prepend-icon="poll"
                          label="Exame"
                          v-model="createConsultationForm.exam.name"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 v-else>
                        <v-text-field
                          readonly
                          hide-details
                          outlined
                          prepend-icon="school"
                          label="Especialidade"
                          v-model="createConsultationForm.consultation.specialty.name"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12 sm6 class="text-left" style="position: relative; top: -12px">
                        <v-layout row wrap class="align-end ma-0">
                          <v-flex xs2>
                            <v-icon style="position: relative; bottom: -4px">event</v-icon>
                          </v-flex>
                          <v-layout column wrap>
                            <span style="font-size: 0.9em">Dia</span>
                            <span
                              style="font-size: 1.2em"
                              class="black--text"
                            >{{createConsultationForm.consultation.date.split(' ')[0] | dateFilter}}</span>
                            <v-divider class="mt-1 grey"></v-divider>
                          </v-layout>
                        </v-layout>
                      </v-flex>

                      <v-flex xs12 sm4 class="text-left" style="position: relative; top: -12px">
                        <v-layout row wrap class="align-end ma-0">
                          <v-flex xs4>
                            <v-icon style="position: relative; bottom: -4px">access_alarm</v-icon>
                          </v-flex>
                          <v-flex xs8>
                            <v-layout column wrap>
                              <span style="font-size: 0.9em">Hora</span>
                              <span
                                style="font-size: 1.2em"
                                class="black--text"
                              >{{createConsultationForm.consultation.date.split(' ')[1]}}</span>
                              <v-divider class="mt-1 grey"></v-divider>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                      </v-flex>

                      <v-flex xs12 sm8>
                        <v-select
                          readonly
                          prepend-icon="assignment_turned_in"
                          v-model="status"
                          :items="statusOptions"
                          label="Status"
                          chips
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
                        ></v-text-field>
                      </v-flex>
                      <v-flex
                        v-if="modalidade === 'Retorno' && justifyReturn(createConsultationForm.consultation.date.split(' ')[0])"
                        xs12
                      >
                        <v-textarea
                          v-model="justify"
                          outlined
                          name="input-7-4"
                          label="Justificativa de Retorno "
                          placeholder="O retorno tem mais de 21 dias. Justifique o motivo do agendamento para essa data."
                        ></v-textarea>
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
                          disabled
                        ></v-select>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-btn rounded class="error" @click="dialog = false">
                    Cancelar
                    <v-icon right>clear</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <submit-button
                    color="success"
                    rounded
                    :disabled="justifyReturn(createConsultationForm.consultation.date.split(' ')[0]) && justify == ''"
                    @reset="success = false"
                    :success="success"
                    :loading="loading"
                    @click="save"
                    text="Confirmar"
                  ></submit-button>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </v-layout>
      </v-container>
    </template>
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
import SelectPatientCard from "../../../components/Patient/SelectPatientCard";
import SubmitButton from "../../../components/SubmitButton";

var moment = require("moment/moment");
export default {
  components: {SelectPatientCard, SubmitButton },

  data: () => ({
    y: "top",
    x: null,
    mode: "",
    alert: false,
    menu: false,
    dialog: false,
    dialog2: false,
    selectedDoctor: "",
    num_recibo: "",
    justify: "",
    type: "",
    exames: [
      "ULTRASSONOGRAFIA",
      "ELETROCARDIOGRAMA",
      "ELETROENCEFALOGRAMA",
      "ECOCARDIOGRAMA",
      "VIDEOLARIGONSCOPIA"
    ],
    createConsultationForm: undefined,
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
    modalidade: "",
    date: moment().format("YYYY-MM-DD"),
    dates: [],
    times: "",
    timesOptions: [],
    medicosOptions: ["Todos"],
    pacientes: "",
    timeout: 4000,
    clinic: "",
    especialidadeOption: "",
    especialidade: "",
    showAlert: false,
    snackDialogDone: false,
    snack: false,
    changeDoctorsOptions: true,
    success: false,
    loading: false,
    pacienteSelecionado: undefined,
    consultationsListenerUnsubscriber: undefined,
    daysToListen: 3,
    type: "number",
    number: 9999,
    selector: "#first",
    selected: "Button",
    elements: ["Button", "Radio group"],
    duration: 500,
    offset: 15,
    easing: "easeInQuint",
    offsetTop: 0
  }),

  computed: {
    isOnline() {
      return this.$store.getters.isOnline;
    },
    consultationLoading() {
      return this.$store.getters.consultationsLoading;
    },

    schedules() {
      let schedules = this.$store.getters.schedules.filter(a => {
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
          if (this.clinic.name !== a.clinic.name) {
            response = false;
          }
        }
        return response;
      });

      return this.consultationsOfSchedules(schedules);
    },
    consultas() {
      let consultas = this.$store.getters.consultations.filter(a => {
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
          if (this.clinic.name !== a.clinic.name) {
            response = false;
          }
        }
        return response;
      });
      return consultas;
    },
    doctors: {
      get: function() {
        let docArray = Object.values(this.$store.getters.doctors);
        docArray = docArray.filter(doctor => {
          if (!this.especialidade) {
            return true;
          }
          var find = false;
          doctor.specialties.forEach(specialty => {
            if (specialty.name === this.especialidade.name) {
              find = true;
              return true;
            }
          });

          return find;
        });
        return docArray;
      }
    },
    selectedPatient() {
      let paciente = this.$store.getters.selectedPatient;
      return paciente;
    },
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
    datesOfInterval(payload) {
      let days = payload.days;
      let weekDays = Object.keys(days);
      let startDate = moment();
      let dates = [];
      weekDays = weekDays.map(day => {
        return Number(day);
      });
      let day = startDate;
      for (let i = 0; i < this.daysToListen; i++) {
        let expiration_date = days[day.weekday().toString()]
          ? days[day.weekday().toString()].expiration_date
          : undefined;
        if (
          weekDays.indexOf(day.weekday()) > -1 &&
          (!expiration_date ||
            day.isSameOrBefore(moment(expiration_date, "YYYY-MM-DD")))
        ) {
          dates.push(day.format("YYYY-MM-DD"));
        }
        day = startDate.add(1, "days");
      }
      return dates;
    },
    numberVacancyAndReturns(schedule) {
      let consultations = this.consultas;
      let cont = 0;
      return consultations.reduce(
        (obj, item) => {
          let qtd_consultations = obj.qtd_consultations;
          let qtd_returns = obj.qtd_returns;

          if (
            schedule.clinic.cnpj === item.clinic.cnpj &&
            schedule.specialty.name === item.specialty.name &&
            schedule.doctor.cpf === item.doctor.cpf &&
            schedule.date === item.date &&
            item.user
          ) {
            if (item.type === "Consulta") {
              obj.qtd_consultations = obj.qtd_consultations + 1;
            } else obj.qtd_returns += 1;
          }
          return obj;
        },
        { qtd_consultations: 0, qtd_returns: 0 }
      );
    },
    consultationsOfSchedules(schedules) {
      let consultations = [];
      schedules.forEach(schedule => {
        if(schedule.days){
          let dates = this.datesOfInterval({days: schedule.days});

          dates.forEach(date => {
            let hourConsultation = schedule.days[moment(date).weekday()].hour;
            if (
              schedule.cancelations_schedules.indexOf(date) == -1 &&
              schedule.cancelations_schedules.indexOf(
                date + " " + hourConsultation
              ) == -1
            ) {
              let scheduleObj = {
                clinic: schedule.clinic,
                doctor: schedule.doctor,
                date: date + " " + hourConsultation,
                routine_id: schedule.routine_id,
                specialty: schedule.specialty,
                vacancy: schedule.days[moment(date).weekday()].vacancy,
                id_schedule: schedule.id
              };
              let obj = {
                ...scheduleObj,
                ...this.numberVacancyAndReturns(scheduleObj)
              };
              obj.vacancy = obj.vacancy - obj.qtd_consultations - obj.qtd_returns;
              consultations.push(obj);
            }
          });
        }
      });
      return consultations;
    },
    justifyReturn(date) {
      var dateConsultation = moment(this.query.data);
      var today = moment(date);
      var diff = today.diff(dateConsultation, "days");
      return diff > 21;
    },
    scheduleAppointment(consultation) {
      this.fillConsultationForm(consultation);
      this.dialog = true;
    },
    fillConsultationForm(consultation) {
      let patient = this.query.pacienteObj;
      let form = {
        user: patient,
        consultation: consultation
      };
      this.justify = "";
      this.createConsultationForm = form;
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
            consultations: [consultations[consultation]]
          });
        } else {
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
          array[i].doctor.name === consultation.doctor.name
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
      this.query = this.$route.params.q;
      this.selectedDoctor = this.query.doctor;
      this.especialidade = this.query.especialidade;
      this.clinic = this.query.consultation.clinic;
      await this.listenConsultations();

      this.pacienteSelecionado = this.query.pacienteObj;
      this.status = this.query.status;
      this.num_recibo = this.query.num_recibo;
      this.modalidade = this.query.modalidade;
      this.loading = false;
    },
    async listenConsultations() {
      this.consultationsListenerUnsubscriber = await this.$store.dispatch(
        "getSchedules",
        {
          specialty: this.especialidade,
          doctor: this.selectedDoctor,
          clinic: this.clinic,
          start_date: moment()
            .subtract(5, "hours")
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
      this.daysToListen += 10;
      this.listenConsultations();
    },
    backTop() {
      this.$vuetify.goTo(0, this.options);
      this.date = this.consultas[0].date;
    },
    handleScroll(event) {
      var scrollPos = window.scrollY;
      var winHeight = window.innerHeight;
      var docHeight = document.documentElement.scrollHeight;
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
    },
    clearPatient() {
      this.snackDialogDone = true;
      this.$store.dispatch("selecionarPaciente", null);
    },
    clearRecibo() {
      this.num_recibo = "";
    },
    clear() {
      this.num_recibo = "";
      this.status = "Aguardando pagamento";
    },
    async save() {
      let form = this.createConsultationForm;
      form.user = {
        ...form.user,
        status: this.status,
        type: this.modalidade,
        payment_number: this.num_recibo,
        exam: this.query.pacienteObj.exam
      };
      form.consultation = {
        ...form.consultation,
        status: this.status,
        type: this.modalidade,
        payment_number: this.num_recibo,
        idConsultationCanceled: this.query.idConsultation,
        exam: this.query.pacienteObj.exam
      };

      if (this.modalidade == "Retorno")
        form.consultation = {
          ...form.consultation,
          previousConsultation: this.query.consultation.previousConsultation
        };
      if (this.justify != "") {
        form.user.justifyReturn = this.justify;
        form.consultation.justifyReturn = this.justify;
      }
      this.loading = true;
      await this.$store.dispatch("addUserToConsultationReschedule", form);
      this.loading = false;
      this.success = true;
      this.dialog = false;
      this.$router.back();
    }
  }
};
</script>

<style scoped>
</style>
