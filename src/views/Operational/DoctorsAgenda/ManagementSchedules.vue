<template>
  <v-data-table
    :headers="headers"
    :items="schedules"
    single-expand
    :expanded.sync="expanded"
    item-key="id"
    show-expand
    class="elevation-1 mx-10 mt-10"
    height="420"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Gerenciamento de agendas</v-toolbar-title>
          <v-row>
            <v-col cols="10">
              <v-select
            class="ml-5 mt-6"
            prepend-icon="location_city"
            v-model="clinic"
            :items="clinics"
            item-text="name"
            return-object
            label="Clínica"
            no-data-text="Nenhum médico para esta especialidade"
            outlined
            rounded
            
            chips
            dense
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
            </v-col>
          </v-row>

        <v-spacer></v-spacer>
        <v-btn class="primary" @click="dialogNewSchedule=true">
          <v-icon>add</v-icon>Criar nova agenda
        </v-btn>
        <v-dialog v-model="dialogNewSchedule">
          <v-card>
            <v-card-title>
              <span class="headline">Criar nova agenda</span>
            </v-card-title>
            <v-card-text>
              <CardAddSchedule ref="newSchedule"></CardAddSchedule>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialogNewSchedule = false">Cancelar</v-btn>
              <v-btn
                :loading="loading"
                color="blue darken-1"
                text
                @click="callSaveNewSchedule"
              >Criar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <v-row class="text-center">
          <v-spacer></v-spacer>
          <v-col class="mb-0 pb-0" cols="3"></v-col>
          <v-col class="mb-0 pb-0" cols="12">
            <h1 class="headline font-weight-bold">Dias da semana</h1>
          </v-col>

          <v-col v-for="day in 6" :key="day" :cols="2">
            <CardDaySchedule
              v-if="item.days && item.days[day]"
              :schedule="item"
              :dayObj="item.days[day]"
              :day="day"
            ></CardDaySchedule>
            <v-card
              v-else
              @click="openDialogNewDay(item,day)"
              class="py-7 grey--text"
              elevation="2"
            >
              <h1 class="title font-weight-bold">{{days[day]}}</h1>
              <v-icon class="font-weight-bold" size="80">add</v-icon>
              <h2 class="title font-weight-bold">Criar dia</h2>
            </v-card>
          </v-col>

          <v-dialog v-model="dialog" persistent max-width="300px">
            <v-card>
              <v-card-title>
                <span class="headline">Criar dia de consulta</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        type="time"
                        min="05:00"
                        max="18:00"
                        v-model="newDay.hour"
                        label="Horário"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="newDay.vacancy"
                        type="number"
                        label="Vagas"
                        hint="Digite o número de vagas para o dia"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">Cancelar</v-btn>
                <v-btn :loading="loading" color="blue darken-1" text @click="createNewDay">Criar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <v-row class="text-center">
          <v-col class="mb-0 pb-0" cols="12">
            <h1 class="headline font-weight-bold">Períodos cancelados</h1>
          </v-col>

          <v-col v-for="(period,index) in item.cancelations_schedules" :key="index" :cols="2">
            <CardPeriodCanceledSchedule :periodObj="period" :schedule="item" :index="index"></CardPeriodCanceledSchedule>
            <!-- <v-card class="py-10" elevation="2">
              <v-chip class="primary subtitle-2 font-weight-bold">{{formatDate(period.start_date)}}</v-chip>
              <h1 class="grey--text text-darken-2 subtitle-1 font-weight-bold">Até</h1>
              <v-chip class="primary subtitle-2 font-weight-bold">{{formatDate(period.final_date)}}</v-chip>
            </v-card>-->
          </v-col>
          <v-col :cols="2">
            <v-card @click="openDialogNewPeriod(item)" class="py-5 grey--text" elevation="2">
              <v-icon class="font-weight-bold" size="80">add</v-icon>
              <h2 class="subtitle-1 font-weight-bold">Criar período de cancelamento</h2>
            </v-card>
          </v-col>

          <v-dialog v-model="dialogNewPeriod" persistent max-width="600px">
            <v-card>
              <v-card-title>
                <span class="headline">Cria novo período de cancelamento</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="newPeriod.start_date"
                        type="date"
                        label="Data inicial"
                        hint="Selecione a data inicial do cancelamento"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="newPeriod.final_date"
                        type="date"
                        label="Data final"
                        hint="Selecione a data final do cancelamento"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogNewPeriod = false">Cancelar</v-btn>
                <v-btn :loading="loading" color="blue darken-1" text @click="createNewPeriod">Criar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </td>
    </template>

    <!-- <template v-slot:item.actions="{ item }">
      <v-icon small @click="deleteSchedule(item)">mdi-delete</v-icon>
    </template> -->
  </v-data-table>
</template>

<script>
var moment = require("moment");
import CardDaySchedule from "../../../components/doctorsAgenda/ManagementSchedules/CardDaySchedule";
import CardPeriodCanceledSchedule from "../../../components/doctorsAgenda/ManagementSchedules/CardPeriodCanceledSchedule";
import CardAddSchedule from "../../../components/doctorsAgenda/ManagementSchedules/CardAddSchedule";
export default {
  components: {
    CardDaySchedule,
    CardPeriodCanceledSchedule,
    CardAddSchedule
  },
  data: () => ({
    expanded: [],
    moment: moment,
    clinic: undefined,
    dialog: false,
    dialogNewPeriod: false,
    dialogNewSchedule: false,
    editExpirationDate: false,
    loading: false,
    newDay: {},
    newPeriod: {},
    headers: [
      {
        text: "Médico",
        align: "start",
        sortable: true,
        value: "doctor.name"
      },
      { text: "Especialidade", value: "specialty.name" },
      { text: "Clínica", value: "clinic.name", sortable: true },
      { text: "Ações", value: "actions", sortable: false }
    ],
    days: [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado"
    ]
  }),

  mounted() {
    this.$store.dispatch("getAllSchedules");
    this.$store.dispatch("getClinics");
  },
  computed: {
    schedules() {
      let resp = this.$store.getters.AllSchedules.filter(schedule => {
        if (this.clinic) return schedule.clinic.name === this.clinic.name;
        return true;
      });
      return resp;
    },
    clinics() {
      return this.$store.getters.clinics.filter(a => {
        return a.property;
      });
    }
  },
  methods: {
    async callSaveNewSchedule() {
      this.loading = true;
      await this.$refs.newSchedule.saveNewSchedule();
      this.dialogNewSchedule = false;
      this.loading = false;
    },
    formatDate(date) {
      return moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");
    },
    openDialogNewDay(schedule, day) {
      this.dialog = true;
      this.newDay = {
        schedule: schedule,
        day: day
      };
    },
    openDialogNewPeriod(schedule) {
      this.dialogNewPeriod = true;
      this.newPeriod = {
        schedule: schedule
      };
    },
    async createNewDay() {
      this.loading = true;
      let days = this.newDay.schedule.days ? this.newDay.schedule.days : {};
      days[this.newDay.day] = {
        hour: this.newDay.hour,
        vacancy: this.newDay.vacancy
      };
      await this.$store.dispatch("newDaySchedule", {
        idSchedule: this.newDay.schedule.id,
        days: days
      });
      this.loading = false;
      this.dialog = false;
      this.newDay = {};
    },
    async createNewPeriod() {
      this.loading = true;
      let periods = this.newPeriod.schedule.cancelations_schedules
        ? this.newPeriod.schedule.cancelations_schedules
        : [];
      periods.push({
        start_date: this.newPeriod.start_date,
        final_date: this.newPeriod.final_date
      });
      await this.$store.dispatch("updateSchedulePeriods", {
        idSchedule: this.newPeriod.schedule.id,
        cancelations_schedules: periods
      });
      this.loading = false;
      this.dialogNewPeriod = false;
      this.newPeriod = {};
    },
    async updateExpirationDate(schedule) {
      this.loading = true;
      await this.$store.dispatch("updateExpirationDate", {
        idSchedule: schedule.id,
        expiration_date: schedule.expiration_date
      });
      this.loading = false;
    },
    deleteSchedule(item) {
      const index = this.schedules.indexOf(item);
      if (confirm("Você tem certeza que dejesa remover a agenda?")) {
        this.$store.dispatch("deleteSchedule", item.id);
      }
    }
  }
};
</script>

<style>
</style>