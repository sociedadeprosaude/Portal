<template>
  <div>
    <strong v-for="(index,i) in schedules" :key="i">
      <br />
      <v-tooltip
        bottom
        v-if="index.canceled_periods && index.canceled_periods.length > 0 && todayInPeriods(index.canceled_periods)"
        color="primary"
      >
        <template v-slot:activator="{ on }">
          <v-card v-on="on" class="white--text pa-1 my-n2" color="grey">
            {{index.doctor.name}} - {{index.product.name}} - {{index.clinic.name}}
            <br />
            <br />
            <v-btn @click="openDialoaUpdateDay(index)" x-small fab>
              <v-icon>edit</v-icon>
            </v-btn>
            <!-- <v-btn class="ml-2" x-small fab @click="openDialogDelete(index)">
              <v-icon>delete_outline</v-icon>
            </v-btn> -->
          </v-card>
        </template>
        <span>
          <strong>Períodos de cancelamento:</strong>
          <div v-for="(period,index) in index.canceled_periods" :key="index">
            <strong>{{period.start_date.formatted | dateFilter}} a {{period.final_date.formatted | dateFilter}}</strong>
          </div>
        </span>
      </v-tooltip>
      <v-card
        v-else
        class="white--text pa-1 my-n2"
        :color="i === 0 ? 'blue' : i === 1 ? 'green' : i === 2 ? 'red' : i === 3 ? 'purple' : i === 4 ? 'orange' : 'pink'"
      >
        {{index.doctor.name}} - {{index.product.name}} - {{index.clinic.name}}
        <br />
        <br />
        <v-btn @click="openDialoaUpdateDay(index)" x-small fab>
          <v-icon>edit</v-icon>
        </v-btn>
        <!-- <v-btn class="ml-2" x-small fab @click="openDialogDelete(index)">
          <v-icon>delete_outline</v-icon>
        </v-btn> -->
      </v-card>
    </strong>
    <br />

    <v-dialog v-model="dialogRemove" max-width="400px">
      <v-card class="text-left">
        <v-card-title>
          <span class="headline">Remover dia da agenda</span>
        </v-card-title>
        <v-card-text>
          <p>Você deseja remover o dia da agenda médica?</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogRemove = false">Não</v-btn>
          <v-btn :loading="loading" color="blue darken-1" text @click="removeDay">Sim</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogUpdate" max-width="400px">
      <v-card class="text-left">
        <v-card-title>
          <span class="headline">Alterar dia da agenda</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  readonly
                  type="time"
                  min="05:00"
                  max="18:00"
                  v-model="editDay.hour"
                  label="Horário"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editDay.vacancy"
                  type="number"
                  label="Vagas"
                  hint="Digite o número de vagas para o dia"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <h1 class="title font-weight-bold">Data de validade</h1>
                <v-text-field
                  v-model="editDay.expiration_date"
                  type="date"
                  hint="Selecione a data de validade da agenda"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogUpdate = false">Não</v-btn>
          <v-btn :loading="loading" color="blue darken-1" text @click="updateDay">Sim</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  props: ["schedules","day"],

  data: () => ({
    dialogUpdate: false,
    dialogRemove: false,
    loading:false,
    scheduleSelected:undefined,
    dayScheduleSelected:undefined,
    editDay:{},
  }),

  methods: {
    openDialoaUpdateDay(schedule) {
      this.scheduleSelected = schedule;
      this.editDay = schedule.days[this.day];
      this.dialogUpdate = true;

      console.log
    },
    openDialogDelete(schedule) {
      this.dialogRemove = true;
      this.scheduleSelected = schedule;
    },
    removeDay(){
      this.loading = true
      this.$emit('removeDay',{
        scheduleSelected:this.scheduleSelected,
        dayScheduleSelected:this.scheduleSelected.days[this.day].id
      })
      this.loading = false
      this.dialogRemove = false
    },
    async updateDay(){
      this.loading = true
      this.$emit("updateDay",{
        editDay:this.editDay
      })

      this.editDay = {}
      this.loading = false
      this.dialogUpdate = false;
    },
    todayInPeriods(periods){
      const today  = moment();
      for (const key in periods) {
        const start_date = moment(periods[key].start_date.formatted)
        const final_date = moment(periods[key].final_date.formatted)
        if(today.isSameOrAfter(start_date) && today.isSameOrBefore(final_date))
          return true;
      }

      return false;
    }
  }
};
</script>

<style>
</style>