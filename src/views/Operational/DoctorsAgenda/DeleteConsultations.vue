<template>
  <v-container>
    <v-layout row wrap>
      <v-card class="pa-4">
        <v-layout align-center wrap>
          <v-flex xs12 md12>
            <v-select
              prepend-icon="location_city"
              v-model="clinic"
              :items="clinics"
              item-text="name"
              return-object
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
          <v-flex xs12 sm5>
            <v-combobox
              label="Especialidade"
              prepend-icon="school"
              v-model="especialidade"
              :items="specialties"
              item-text="name"
              return-object
              outlined
              rounded
              filled
              chips
              color="pink"
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
          <v-flex xs12 sm5>
            <v-combobox
              prepend-icon="account_circle"
              v-model="doctor"
              :items="doctors"
              item-text="name"
              return-object
              label="Médico"
              no-data-text="Nenhum médico para esta especialidade"
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
            </v-combobox>
          </v-flex>

          <v-flex xs3 sm3>
            <v-menu
              ref="menu"
              v-model="startMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="startDateFormatted"
                  label="De"
                  prepend-icon="event_busy"
                  outline
                  hint="Do dia."
                  persistent-hint
                  color="error"
                  clearable
                  rounded
                  outlined
                  filled
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="picker"
                v-model="start_date"
                :min="new Date().toISOString().substr(0, 10)"
                locale="pt-br"
                color="red"
                @change="save"
              ></v-date-picker>
            </v-menu>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs3 sm3>
            <v-menu
              ref="menu"
              v-model="finishMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="finishDateFormatted"
                  label="Até"
                  prepend-icon="event_busy"
                  outline
                  hint="Até o dia."
                  persistent-hint
                  color="error"
                  clearable
                  rounded
                  outlined
                  filled
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="picker"
                v-model="final_date"
                :min="new Date().toISOString().substr(0, 10)"
                locale="pt-br"
                color="red"
                @change="save"
              ></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex class="my-3" xs12>
            <v-layout class="align-end justify-end">
              <v-btn color="black" dark @click="filterHour ? filterHour = false: filterHour = true">
                Filtro de Hora :
                <v-icon right>alarm</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="black"
                dark
                @click="filterDayWeek ? filterDayWeek = false: filterDayWeek = true"
              >
                Filtro de Dia da Semana :
                <v-icon right>today</v-icon>
              </v-btn>
            </v-layout>
          </v-flex>
          <v-flex class="mb-3" xs12>
            <v-layout class="align-end justify-end">
              <v-flex xs12 sm5 v-show="filterHour">
                <v-select
                  v-model="times"
                  prepend-icon="alarm_add"
                  :items="timesOptions"
                  label="Horários"
                  attach
                  outlined
                  rounded
                  filled
                  hint="Selecione o horario que deseja Apagar"
                  persistent-hint
                  chips
                  color="green"
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
                    >{{ data.item.text }}</v-chip>
                  </template>
                </v-select>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs12 sm5 v-show="filterDayWeek">
                <v-select
                  v-model="semana"
                  prepend-icon="event"
                  :items="semanaOptions"
                  label="Dias da Semana"
                  hint="Selecione o(s) dia(s) da semana que deseja apagar"
                  persistent-hint
                  outlined
                  rounded
                  multiple
                  filled
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
                    >{{ data.item.text }}</v-chip>
                  </template>
                </v-select>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>

        <v-layout align-center justify-center>
          <v-spacer></v-spacer>
          <v-btn
            @click="getConsultations"
            color="error"
            class="mx-3"
            rounded
            :disabled="!formIsValid"
          >
            Ver consultas
            <v-icon right>remove_red_eye</v-icon>
          </v-btn>
          <v-btn
            v-if="Object.keys(consultationsDeletionInfo).length === 0"
            @click="deleteConsultasDia"
            class="mr-3"
            :loading="loading"
            :success="success"
            color="error"
            rounded
            :disabled="!formIsValid"
          >
            DELETAR
            <v-icon right>delete_outline</v-icon>
          </v-btn>
          <v-btn
            v-if="Object.keys(consultationsDeletionInfo).length === 0"
            @click="deleteAllSchedule"
            :loading="loading"
            :success="success"
            color="error"
            rounded
            :disabled="!formIsValidDeleteAll && !formIsValidDeleteAllByClinic"
          >
            DELETAR TUDO
            <v-icon right>delete_forever</v-icon>
          </v-btn>
          <span
            v-else
            class="ml-4"
          >Deletando {{consultationsDeletionInfo.removed}}/{{consultationsDeletionInfo.total}}, dia {{consultationsDeletionInfo.day | dateFilter}}</span>
        </v-layout>

        <v-container v-if="consultas && consultas.lenght == 0">
          <v-layout row wrap justify-center align-center>
            <v-alert type="error">Não há Consultas ou Retornos Marcados para a especialidade:</v-alert>
          </v-layout>
        </v-container>

        <v-dialog v-model="dialog" width="700">
          <v-card>
            <v-card-title class="headline primary white--text" primary-title>Cancelamento de agendas</v-card-title>

            <v-card-text class="subtitle-1 font-weight-regular pt-2">{{this.messageDialog}}</v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialog = false">Cancelar</v-btn>
              <v-btn color="primary" text @click="finalizeDeleteAll">Prosseguir</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
var moment = require("moment/moment");
export default {
  data: () => ({
    start_date: undefined,
    final_date: undefined,
    teste: 0,
    filterHour: false,
    filterDayWeek: false,
    moment: moment,
    startMenu: false,
    finishMenu: false,

    date_choose: "",
    especialidade: undefined,
    clinic: undefined,
    dialog: false,
    alert: false,
    doctor: null,
    dateFormatted: "",
    success: false,
    index_Selecionado: {},
    status_Selecionado: "",
    times: undefined,
    semana: undefined,
    timesOptions: [
      { text: "06:00" },
      { text: "06:30" },
      { text: "07:00" },
      { text: "07:30" },
      { text: "08:00" },
      { text: "08:30" },
      { text: "09:00" },
      { text: "09:30" },
      { text: "10:00" },
      { text: "10:30" },
      { text: "11:00" },
      { text: "11:30" },
      { text: "12:00" },
      { text: "12:30" },
      { text: "13:00" },
      { text: "13:30" },
      { text: "14:00" },
      { text: "14:30" },
      { text: "15:00" },
      { text: "15:30" },
      { text: "16:00" },
      { text: "16:30" },
      { text: "17:00" }
    ],

    semanaOptions: [
      { text: "segunda-feira", value: 1 },
      { text: "terça-feira", value: 2 },
      { text: "quarta-feira", value: 3 },
      { text: "quinta-feira", value: 4 },
      { text: "sexta-feira", value: 5 },
      { text: "sábado", value: 6 },
      { text: "domingo", value: 0 }
    ],
    attendanceOptions: [
      { text: "Aguardando Atendimento" },
      { text: "Atendimento Realizado" }
    ],
    statusOptions: [
      { text: "Aguardando pagamento" },
      { text: "Pago" },
      { text: "Cancelado" }
    ],
    messages: [],
    timeout: 4000,
    messageDialog: "",
    loading: false
  }),

  computed: {
    clinics() {
      let val = this.$store.getters.clinics.filter(a => {
        return a.property;
      });
      return val;
    },

    consultationsDeletionInfo() {
      return this.$store.getters.consultationsDeletionInfo;
    },

    formIsValid() {
      return (
        this.start_date &&
        this.final_date &&
        this.doctor &&
        this.especialidade &&
        this.clinic
      );
    },

    formIsValidDeleteAll() {
      return this.clinic && this.especialidade && this.doctor;
    },

    formIsValidDeleteAllByClinic() {
      return this.clinic && !this.especialidade && !this.doctor;
    },

    specialties() {
      let espArray = Object.values(this.$store.getters.specialties);
      espArray = espArray.filter(specialty => {
        if (!this.doctor) {
          return true;
        }
        var find = false;
        specialty.doctors.forEach(doctor => {
          if (doctor.cpf === this.doctor.cpf) {
            find = true;
            return true;
          }
        });

        return find;
      });
      return espArray;
    },

    doctors() {
      let doctors = Object.values(this.$store.getters.doctors);
      if (this.especialidade) {
        doctors = doctors.filter(a => {
          for (let spe in a.specialties) {
            if (a.specialties[spe].name === this.especialidade.name) {
              return true;
            }
          }
          return false;
        });
      }
      return doctors;
    },

    startDateFormatted: {
      set(val) {
        this.start_date = val;
      },
      get() {
        return this.formatDate(this.start_date);
      }
    },
    finishDateFormatted: {
      set(val) {
        this.final_date = val;
      },
      get() {
        return this.formatDate(this.final_date);
      }
    },

    computedDateFormattedSelecionado() {
      return this.formatDate(this.index_Selecionado.start_date);
    },

    consultas() {
      return this.$store.getters.consultations;
    },

    date: {
      get() {
        return this.date_choose;
      },
      set(val) {
        this.date_choose = val;
      }
    }
  },
  async mounted() {
    await this.$store.dispatch("getSpecialties");
    await this.$store.dispatch("getDoctors");
    this.start_date = moment().format("YYYY-MM-DD");
    this.dateFormatted = moment().format("YYYY-MM-DD");
  },

  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "MONTH"));
    }
  },

  methods: {
    async getConsultations() {
      let payload = {
        start_date: this.start_date + " 00:00",
        final_date: this.final_date ? this.final_date + " 23:59" : undefined,
        doctor: this.doctor,
        specialty: this.especialidade
      };
      this.loading = true;
      await this.$store.dispatch("listenConsultations", payload);
      this.loading = false;
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
      }
      return newArray;
    },
    checkConsultationIsInArray(array, consultation) {
      for (let i in array) {
        if (
          array[i].start_date === consultation.start_date &&
          array[i].doctor.name === consultation.doctor.name
        ) {
          return i;
        }
      }
      return -1;
    },

    consultasByDoctors(consultations) {
      let res = {};
      for (let cons in consultations) {
        let targetDate = consultations[cons].doctor.cpf;
        if (!res[targetDate]) {
          res[targetDate] = {
            doctor: consultations[cons].doctor,
            numConsultations: 0,
            numRegress: 0,
            vacancy: 0,
            consultations: []
          };
        }
        if (consultations[cons].type == "Consulta")
          res[targetDate].numConsultations += 1;
        else if (consultations[cons].type == "Retorno")
          res[targetDate].numRegress += 1;
        else res[targetDate].vacancy += 1;
        res[targetDate].consultations.push(consultations[cons]);
      }
      return res;
    },

    save(date) {
      this.$refs.menu.save(date);
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },

    async deleteAllSchedule() {
      if (this.formIsValidDeleteAllByClinic && !this.formIsValidDeleteAll)
        this.messageDialog = "Você escolheu somente a clínica. Portanto, ao prosseguir, estará removendo todas agendas médicas da " + this.clinic.name;
      else if (this.formIsValidDeleteAll)
        this.messageDialog =
          "Com os filtros escolhidos, ao prosseguir você estará removendo a agenda de " + this.especialidade.name + " do Dr(a) " + this.doctor.name +" na clínica " + this.clinic.name;
      this.dialog = true;
    },

    async finalizeDeleteAll() {
      this.dialog = false
      this.loading = true;
      var payload = {
        doctor: this.doctor,
        specialty: this.especialidade,
        clinic: this.clinic,
        start_date: this.start_date
      };
      await this.$store.dispatch("deleteAllSchedule", payload);
      this.success = true;
      this.loading = false;
    },

    async deleteConsultasDia() {
      this.loading = true;
      var deletar = {
        start_date: this.start_date,
        final_date: this.final_date,
        doctor: this.doctor,
        specialty: this.especialidade,
        hour: this.times,
        weekDays: this.semana,
        clinic: this.clinic
      };
      await this.$store.dispatch("removeAppointmentByDay", deletar);
      this.success = true;
      this.loading = false;
    },

    clear() {
      this.start_date = moment().format("YYYY-MM-DD");
      this.doctor = null;
      this.especialidade = "";
    }
  }
};
</script>

<style scoped>
</style>
