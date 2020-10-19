<template>
  <v-card class="py-5" elevation="2">
    <h1 class="title grey--text text--darken-2 font-weight-bold">{{days[day]}}</h1>
    <v-chip class="mt-2 primary subtitle-2 font-weight-bold">Horário:{{dayObj.hour}}</v-chip>
    <br/>
    <v-chip class="mt-1 primary subtitle-2 font-weight-bold">Vagas:{{dayObj.vacancy}}</v-chip>
    <v-chip v-if="dayObj.expiration_date.formatted" class="mt-1 primary subtitle-2 font-weight-bold">Validade:{{formatDate(dayObj.expiration_date.formatted)}}</v-chip>
    <br />
    <br />
    <v-spacer></v-spacer>
    <v-btn @click="openDialoaUpdateDay" x-small fab>
      <v-icon>edit</v-icon>
    </v-btn>
    <v-btn class="ml-2" x-small fab @click="dialogRemove = true">
      <v-icon>delete_outline</v-icon>
    </v-btn>

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
                <v-text-field type="time" min="05:00" max="18:00" v-model="newDay.hour" label="Horário" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="newDay.vacancy"
                  type="number"
                  label="Vagas"
                  hint="Digite o número de vagas para o dia"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <h1 class="title font-weight-bold">Data de validade</h1>
                <v-text-field
                  v-model="newDay.expiration_date"
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
  </v-card>
</template>

<script>
var moment = require('moment')
export default {
  props: ["schedule", "dayObj", "day"],
  name: "CardDaySchedule",
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
    dialogRemove: false,
    dialogUpdate: false,
    loading: false,
    newDay:{}
  }),
  methods: {
    formatDate(date) {
      return moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");
    },
    async removeDay() {
      this.loading = true;
      let copySchedule = Object.assign({}, this.schedule);
      console.log(this.dayObj.id)
      console.log(this.schedule.id)
      this.$apollo.mutate({
          mutation: require('@/graphql/schedules/RemoveRelationForDay.gql'),
          variables: {
            idSchedule:this.schedule.id,
            idDay: this.dayObj.id
          },
          
      }).then((data) => {
          this.cancelConsultations()
      }).catch((error) => {
          console.error(error)
      });

      this.$emit('removedDay',this.day)
      this.loading = false;
      this.dialogRemove = false;
    },
    openDialoaUpdateDay(){
        this.dialogUpdate = true;
        this.newDay=this.dayObj
    },
    async updateDay(){
        this.loading = true;
        console.log(this.newDay)
        this.$apollo.mutate({
          mutation: require('@/graphql/schedules/UpdateDaySchedule.gql'),
          variables: {
              idDay: this.newDay.id,
              vacancy: Number(this.newDay.vacancy),
          }
          
        })
        this.newDay = {}
        this.loading = false
        this.dialogUpdate = false;
    },
    cancelConsultations(){
      let consultations = this.schedule.consultations
      console.log(consultations)
      for (const key in consultations) {
        let consultation = consultations[key]

        if(moment(consultation.date).weekday() === Number(this.day) && moment(consultation.date).isAfter(moment())){
          this.$apollo.mutate({
              mutation: require('@/graphql/consultations/RemoveRelationCameFrom.gql'),
              variables: {
                idSchedule:this.schedule.id,
                idConsultation: consultation.id
              },
          })/* .then(data => {
            console.log('Removeu relação came from', consultation.id)
            console.log(this.schedule.id)
          }) */
        }
      }
    }

  }
};
</script>

<style>
</style>