<template>
  <td :colspan="headers.length">
    <v-layout class="text-center pt-5" row wrap>
      <v-flex class="mb-0 pb-0 xs12">
        <h1 class="headline font-weight-bold">Dias da semana</h1>
      </v-flex>

      <v-flex v-for="day in 6" :key="day" class="xs6 sm4 md2 lg2 pa-2">
        <CardDaySchedule
          v-if="item.days && item.days[day]"
          :schedule="item"
          :dayObj="item.days[day]"
          :day="day"
        ></CardDaySchedule>
        <v-card v-else @click="openDialogNewDay(item,day)" class="py-7 grey--text" elevation="2">
          <h1 class="title font-weight-bold">{{days[day]}}</h1>
          <v-icon class="font-weight-bold" size="80">add</v-icon>
          <h2 class="title font-weight-bold">Criar dia</h2>
        </v-card>
      </v-flex>

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
            <v-btn :loading="loading" color="blue darken-1" text @click="createNewDay()">Criar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-layout class="text-center pt-5" row wrap>
      <v-flex class="mb-0 pb-0 xs12">
        <h1 class="headline font-weight-bold">Períodos cancelados</h1>
      </v-flex>

      <v-flex
        v-for="(period,index) in item.cancelations_schedules"
        :key="index"
        class="xs6 sm4 md2 lg2 pa-2"
      >
        <CardPeriodCanceledSchedule :periodObj="period" :schedule="item" :index="index"></CardPeriodCanceledSchedule>
      </v-flex>
      <v-flex :cols="2" class="xs6 sm4 md2 lg2 pa-2">
        <v-card @click="openDialogNewPeriod(item)" class="py-5 grey--text" elevation="2">
          <v-icon class="font-weight-bold" size="80">add</v-icon>
          <h2 class="subtitle-1 font-weight-bold">Criar período de cancelamento</h2>
        </v-card>
      </v-flex>

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
            <v-btn :loading="loading" color="blue darken-1" text @click="createNewPeriod()">Criar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </td>
</template>

<script>
var moment = require("moment");
import CardDaySchedule from "../../../components/doctorsAgenda/ManagementSchedules/CardDaySchedule";
import CardPeriodCanceledSchedule from "../../../components/doctorsAgenda/ManagementSchedules/CardPeriodCanceledSchedule";
export default {
  props: ["headers", "item"],
  components: {
    CardDaySchedule,
    CardPeriodCanceledSchedule
  },
  data: () => ({
    days: [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado"
    ],
    dialog: false,
    dialogNewPeriod: false,
    editExpirationDate: false,
    loading: false,
    newDay: {},
    newPeriod: {}
  }),
  methods: {
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
    createNewDay(){
        this.loading = true;
        this.$emit('createNewDay',this.newDay)
        this.loading = false;
        this.dialog = false;
        this.newDay = {};
    },
    createNewPeriod(){
        this.loading = true;
        this.$emit('createNewPeriod',this.newPeriod)
        this.loading = false;
        this.dialog = false;
        this.newPeriod = {};
    }
  }
};
</script>

<style>
</style>