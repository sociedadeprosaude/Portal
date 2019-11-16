<template>
  <v-layout row wrap >

    <template>
      <v-container id = "top" class="py-0 mt-5">
        <v-layout align-center row wrap >

          <v-flex xs3>
            <v-select
              prepend-icon="school"
              v-model="especialidade"
              :items="specialties"
              item-text="name"
              return-object
              label="Especialidade"
              outline
              chips
              color="blue"
            ></v-select>
          </v-flex>
          <v-flex xs4 class="ml-3">
            <v-select
              prepend-icon="person"
              v-model="selectedDoctor"
              :items="doctors"
              return-object
              item-text="name"
              label="Médicos"
              outline
              chips
              color="blue"
            ></v-select>
          </v-flex>
        </v-layout>
      </v-container>
    </template>
    <v-flex xs12 class="ml-10">
      <v-container>

        <v-alert type="warning" :value="showAlert">Não há consultas para {{this.especialidade}}</v-alert>
      </v-container>
    </v-flex>
    <v-flex xs9>
      <v-container
        style="width:100%"
        class="align-center justify-center hidden-xs-only py-0"
        v-for="(consultaGroup, i) in consultas"
        :key="i"

      >
        <v-flex xs12>
          <div v-bind:id="'group-' + consultaGroup.date">
            <v-card dark :color="consultaGroup.color" class="title">
              <v-card-text
                class="px-3 text-xs-left"
              >{{consultaGroup.date | dateFilter}} - {{daydate(consultaGroup.date)}}</v-card-text>
            </v-card>
          </div>
        </v-flex>
        <v-container fluid grid-list-sm class="py-0 my-3">
          <v-layout row wrap>
            <v-flex v-for="(consulta, j) in consultaGroup.consultations" :key="j" xs4>
              <v-card class="elevation-12" dark style="border-radius:20px">
                <v-card-text class="white text--primary">
                  <v-container class="py-0">
                    <v-layout row wrap>
                      <v-flex x2 sm2 dm2 lg2>
                        <v-avatar>
                          <v-btn icon large :color="consultaGroup.color">
                            <v-icon medium color="white">person</v-icon>
                          </v-btn>
                        </v-avatar>
                      </v-flex>

                      <v-flex id="teste" xs10 sm10 md10 lg10 hidden-xs-only class="pl-3 py-2">
                        <div style="height:60px">
                          <h4>
                            <span class="subheading font-weight-bold">{{consulta.nome}}</span>
                            <br />
                            <span
                              class="body-2 font-weight-bold grey--text"
                            >CRM-AM: {{consulta.crm}}</span>
                          </h4>
                        </div>
                      </v-flex>

                      <v-flex class="my-0" x2 sm2 dm2 lg2>
                        <v-chip :color="consultaGroup.color" text-color="white">{{consulta.hora}}</v-chip>
                      </v-flex>
                      <v-flex x3 sm3 dm3 lg3 class="ml-4">
                        <v-chip
                          :color="consultaGroup.color"
                          text-color="white"
                        >Vagas : {{consulta.vaga}}</v-chip>
                      </v-flex>
                      <!-- <v-flex x3 sm3 dm3 lg3 class="ml-4">
                        <v-chip
                          :color="consultaGroup.color"
                          text-color="white"
                        >Vagas : {{consulta.vaga}}</v-chip>
                      </v-flex>-->
                    </v-layout>
                    <v-btn
                      dark
                      round
                      :color="consultaGroup.color"
                      class="mx-0"
                      @click="scheduleAppointment = {crm:consulta.crm,medico:consulta.nome, data:consulta.data,hora:consulta.hora}"
                    >Agendar</v-btn>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-container>
    </v-flex>
    <v-flex v-if="!showAlert" xs2 class="ml-3">
      <div style="position:fixed; top:25%">
        <v-date-picker v-model="date" :allowed-dates="allowedDates" locale="pt-br"></v-date-picker>
      </div>
    </v-flex>
    <template>
      <v-container>
        <v-layout>
          <div class="text-xs-center">
            <v-dialog v-model="dialog" width="500">
              <v-card>
                <v-card-title
                  class="headline grey lighten-2"
                  primary-title
                >Confirmar Agendamento da Consulta</v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6>
                        <v-text-field
                          readonly
                          prepend-icon="person"
                          v-model="index_Selecionado.nome"
                          label="Nome do Paciente"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field
                          v-if="index_Selecionado.cpf !== ''"
                          readonly
                          prepend-icon="credit_card"
                          v-model="index_Selecionado.cpf"
                          label="CPF"
                        ></v-text-field>
                        <v-text-field
                          v-else
                          readonly
                          prepend-icon="credit_card"
                          v-model="index_Selecionado.id"
                          label="Nº do associado"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12 lg12>
                        <v-divider></v-divider>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field
                          readonly
                          prepend-icon="person"
                          v-model="index_Selecionado.medico"
                          label="Nome do Médico"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field
                          readonly
                          prepend-icon="credit_card"
                          v-model="index_Selecionado.crm"
                          label="CRM"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field
                          readonly
                          prepend-icon="school"
                          v-model="this.especialidade"
                          label="Especialidade"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field
                          readonly
                          prepend-icon="event"
                          v-model="computedDateFormatted"
                          label="Dia da Consulta"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field
                          readonly
                          prepend-icon="access_alarm"
                          v-model="index_Selecionado.hora"
                          label="Hora da Consulta"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-select
                          prepend-icon="assignment_turned_in"
                          v-model="status"
                          :items="statusOptions"
                          label="Status"
                          chips
                        ></v-select>
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
                          prepend-icon="receipt"
                          label="Nº do Recibo"
                          v-model="num_recibo"
                          type="number"
                          :disabled="status === 'Pago' ? false : true"
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
                          disabled
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
                  <v-btn round class="error" @click="dialog = false">
                    Cancelar
                    <v-icon right>clear</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="success"
                    :disabled="loader"
                    :loading="loader"
                    round
                    @click="save"
                    v-if="status === 'Pago' && num_recibo !== ''"
                  >
                    Confirmar
                    <v-icon right>done</v-icon>
                    <template v-slot:loader>
                      <span>Aguarde...</span>
                    </template>
                  </v-btn>
                  <v-btn
                    color="success"
                    round
                    :disabled="loader"
                    :loading="loader"
                    @click="save"
                    v-if="status === 'Aguardando pagamento' && num_recibo === ''"
                  >
                    Confirmar
                    <v-icon right>done</v-icon>
                    <template v-slot:loader>
                      <span>Aguarde...</span>
                    </template>
                  </v-btn>
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

    <!-- <v-snackbar
        v-model="snackbar"
        :bottom="y === 'bottom'"
        :left="x === 'left'"
        color="success"
        :multi-line="mode === 'multi-line'"
        :right="x === 'right'"
        :top="y === 'top'"
        :timeout="timeout"
        :vertical="mode === 'vertical'"
      >
        {{this.mensagem}}
        <v-icon dark>done_outline</v-icon>
    </v-snackbar>-->
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
    <v-btn v-if="offsetTop > 2" class="mr-2" fixed dark fab bottom right color="primary" @click="backTop">
      <v-icon>keyboard_arrow_up</v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
import Pacientes from "./Patient";
var moment = require("moment");
// import * as easings from "vuetify/es5/util/easing-patterns";
export default {
  components: { Pacientes },

  data: () => ({
    y: "top",
    x: null,
    mode: "",
    alert: false,
    menu: false,
    dialog: false,
    dialog2: false,
    dialogPaciente: false,
    selectedDoctor: undefined,
    num_recibo: "",
    type: "",
    index_Selecionado: {},
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
    especialidadeOption: "",
    showAlert: false,
    snackDialogDone: false,
    snack: false,
    changeDoctorsOptions: true,

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
    offsetTop: 0,
    //---------------------------------------------------------------------------------------------------
  }),

  computed: {
    specialties() {
      return this.$store.getters.specialties;
    },
    computedDateFormatted() {
      return this.formatDate(this.index_Selecionado.data);
    },
    consultas() {
      let consultas = this.$store.getters.consultations;
      // this.showAlert = consultas.length == 0;
      // this.dates = [];
      //
      // for (var i in consultas) {
      //   this.dates.push(consultas[i].date);
      //   for (var j = 0; j < consultas[i].consultations.length; j++) {
      //     this.doctors.push(consultas[i].consultations[j].nome);
      //   }
      // }

      return consultas;
    },
    doctors: {
      set: function(val) {
          this.selectedDoctor = val
      },
      get: function() {
        if (this.selectedDoctor) {
          return this.selectedDoctor
        }
        let doctors = {
          0: {
            name: 'Todos'
          },
          ...this.$store.getters.doctors
        }
        return Object.values(doctors)
      }
    },
    pacienteSelecionado() {
      let paciente = this.$store.getters.selectedPatient;
      if (paciente === null) {
        paciente = { nome: null, num_associado: null };
        return null;
      }
      return paciente;
    },

    scheduleAppointment: {
      get: function() {
        return this.index_Selecionado;
      },
      set: function(index) {
        if (this.pacienteSelecionado !== null) {
          if (this.especialidade !== "") {
            this.index_Selecionado = { ...this.pacienteSelecionado, ...index };
            this.dialog = true;
          }
        } else {
          this.dialogPaciente = true;
        }
      }
    },
    loader() {
      return this.$store.getters.statusLoaderAC;
    },
    snackbar: {
      get: function() {
        var snack = this.$store.getters.onSnackbarAC;
        if (!this.snack && this.snackDialogDone) {
          this.snackDialogDone = false;
        } else if (snack) {
          this.dialog = false;
          this.snack = snack;
        }
        return this.snack;
      },
      set: function(val) {
        this.snack = val;
      }
    },
    mensagem() {
      return this.$store.getters.onMensagem;
    },
    especialidade: {
      set: function(value) {
        this.especialidadeOption = value;
        this.dates = [];
      },
      get: function() {
        return this.especialidadeOption;
      }
    },
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
    pacienteSelecionado(val) {
      if (this.$store.getters.selectedPatient != null)
        this.dialogPaciente = false;
    },
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
      if(val == this.consultas[0].date)
         this.$vuetify.goTo(0, this.options)
      else
        this.$vuetify.goTo("#group-" + val, this.options);
    }
  },

  mounted() {
    this.showAlert = false;
    this.initialConfig()
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    async initialConfig() {
      this.loading = true
      await this.$store.dispatch('getDoctors')
      await this.$store.dispatch('getConsultations')
      await this.$store.dispatch("getSpecialties")
      // this.$store.dispatch("stopSnack", false);
      //this.$store.dispatch('setLoader',{loader:false,view:"AgendamentoConsulta"})
      this.especialidade = "Clinico Geral"
      this.loading = false
    },
    backTop(){
      this.$vuetify.goTo(0, this.options)
      this.date = this.consultas[0].date
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
    allowedDates: function(val) {
      return this.dates.indexOf(val) !== -1;
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
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    call() {
      var consulta = this.$store.getters.idConsultation({
        data: this.index_Selecionado.data,
        hora: this.index_Selecionado.hora,
        crm: this.index_Selecionado.crm,
        status: this.status,
        modalidade: this.modalidade,
        num_recibo: this.num_recibo
      });

      console.log(consulta);
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
    save() {
      this.$store.dispatch("setLoader", {
        loader: true,
        view: "AgendamentoConsulta"
      });
      setTimeout(() => this.call(), 1000);
    }
  }
};
</script>

<style scoped>
</style>
