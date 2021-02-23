<template>
  <v-card class="py-5" elevation="2">
    <v-chip class="primary subtitle-2 font-weight-bold">{{formatDate(periodObj.start_date.formatted)}}</v-chip>
    <h1 class="grey--text text-darken-2 subtitle-1 font-weight-bold">Até</h1>
    <v-chip class="primary subtitle-2 font-weight-bold">{{formatDate(periodObj.final_date.formatted)}}</v-chip>
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
          <span class="headline">Remover Período</span>
        </v-card-title>
        <v-card-text>
          <p>Você deseja remover o período de cancelamento da agenda médica?</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogRemove = false">Não</v-btn>
          <v-btn :loading="loading" color="blue darken-1" text @click="removePeriod">Sim</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogUpdate" max-width="400px">
      <v-card class="text-left">
        <v-card-title>
          <span class="headline">Alterar período de cancelamento da agenda</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="newPeriod.start_date " type="date" label="Data inicial" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="newPeriod.final_date" type="date" label="Data final"
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
  props: ["schedule", "periodObj", "index"],
  name: "CardPeriodCanceledSchedule",
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
    newPeriod: {}
  }),
  methods: {
    formatDate(date) {
      return moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");
    },
    async removePeriod() {
      this.loading = true;
      console.log(this.periodObj)
      await this.$apollo.mutate({
        mutation: require('@/graphql/schedules/RemoveCanceledPeriod.gql'),
        variables:{
          idCanceledPeriod: this.periodObj.id
        }
      });
      this.loading = false;
      this.dialogRemove = false;
      this.$emit('removedPeriod',this.index);

    },
    openDialoaUpdateDay() {
      this.dialogUpdate = true;
      this.newPeriod = { 
        start_date: this.periodObj.start_date.formatted,
        final_date: this.periodObj.final_date.formatted
       };
    },
    async updateDay() {
      this.dialogRemove = false;
    }
  }
};
</script>

<style>
</style>