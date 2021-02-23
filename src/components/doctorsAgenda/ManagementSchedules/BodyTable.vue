<template>
  <td :colspan="headers.length">
    <v-layout class="text-center pt-5" row wrap>
      <v-flex class="mb-0 pb-0 xs12">
         <ObservationsDialog :schedule="item" class="text-right"/>
      </v-flex>
      
      <v-flex class="mb-0 pb-0 xs12">
          <span class="text-left headline font-weight-bold">Dias da semana</span>
      </v-flex>

      <v-flex v-for="day in 6" :key="day" class="xs6 sm4 md2 lg2 pa-2">
        <CardDaySchedule
          v-if="findDay(day)"
          :schedule="item"
          :dayObj="findDay(day)"
          :day="day"
          @removedDay="removeDay($event)"
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
              <v-form ref="formDay">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      type="time"
                      min="05:00"
                      max="18:00"
                      v-model="newDay.hour"
                      label="Horário"
                      required
                      :rules="rules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="newDay.vacancy"
                      type="number"
                      label="Vagas"
                      hint="Digite o número de vagas para o dia"
                      :rules="rules"
                    ></v-text-field>
                  </v-col>
                </v-row>  
               </v-form>
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
        v-for="(period,index) in item.canceled_periods"
        :key="index"
        class="xs6 sm4 md2 lg2 pa-2"
      >
        <CardPeriodCanceledSchedule :periodObj="period" :schedule="item" :index="index" @removedPeriod="removePeriod($event)"></CardPeriodCanceledSchedule>
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
              <v-form ref="formPeriod">
                <v-row> 
                    <v-col cols="12">
                      <v-text-field
                        v-model="newPeriod.start_date"
                        type="date"
                        label="Data inicial"
                        hint="Selecione a data inicial do cancelamento"
                        required
                        :rules="rules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="newPeriod.final_date"
                        type="date"
                        label="Data final"
                        hint="Selecione a data final do cancelamento"
                        required
                        :rules="rules"
                      ></v-text-field>
                    </v-col>
                </v-row>
              </v-form>
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
import CardDaySchedule from "../../../components/doctorsAgenda/ManagementSchedules/CardDaySchedule";
import CardPeriodCanceledSchedule from "../../../components/doctorsAgenda/ManagementSchedules/CardPeriodCanceledSchedule";
import ObservationsDialog from './ObservationsDialog';
export default {
  props: ["headers", "item"],
  components: {
    CardDaySchedule,
    CardPeriodCanceledSchedule,
    ObservationsDialog
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
    newPeriod: {},
    rules:[
      v => !!v || 'Campo vazio!',
    ]
  }),
  methods: {
    findDay(target){
      if(this.item.days){
        let foundDay = this.item.days.find(value => value.day === target.toString());

        return foundDay;
      }
      return undefined
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
      if(this.$refs.formDay.validate()){
        this.loading = true;
        this.item.days.push(Object.assign({}, this.newDay));

        const data = await this.$apollo.mutate({
            mutation: require('@/graphql/schedules/NewDay.gql'),
            variables: {
              day: this.newDay.day.toString(),
              hour: this.newDay.hour,
              vacancy: Number(this.newDay.vacancy)
            },
            
          });
        await this.saveRelationDaySchedule(data.data.CreateDay.id, this.newDay.schedule.id);
        this.$emit('createNewDay');
        this.loading = false;
        this.dialog = false;
        this.newDay = {};
      }
    },

    async saveRelationDaySchedule(idDay, idSchedule){
      await  this.$apollo.mutate({
          mutation: require('@/graphql/schedules/AddRelationForDay.gql'),
          variables: {
            idSchedule: idSchedule,
            idDay: idDay
          },
          
      });
    },
    async createNewPeriod(){
      if(this.$refs.formPeriod.validate()){
        this.loading = true;

        const response = await this.$apollo.mutate({
          mutation: require('@/graphql/schedules/NewCanceledPeriod.gql'),
          variables:{
            start_date:{
              formatted: this.newPeriod.start_date
            },
            final_date:{
              formatted: this.newPeriod.final_date
            }
          }
        });
        
        await this.$apollo.mutate({
          mutation: require('@/graphql/schedules/AddRelationCanceledPeriod.gql'),
          variables:{
            idSchedule: this.newPeriod.schedule.id,
            idCanceledPeriod: response.data.CreateCanceledPeriod.id
          }
        });

        this.$emit('createNewPeriod')
        this.loading = false;
        this.dialogNewPeriod = false;
        this.newPeriod = {};
      }
    },
    removePeriod(index){
      this.item.canceled_periods.splice(index,1);
    },
    removeDay(day){
      const index = this.item.days.findIndex(value => value.day === day.toString())
      this.item.days.splice(index,1);
    }
  }
};
</script>

<style>
</style>