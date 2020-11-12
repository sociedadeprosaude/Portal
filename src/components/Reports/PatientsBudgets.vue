<template>
  <v-container>
    <v-row>
      <v-col>
        <span class="my-sub-headline mb-4 mx-4">Relatório Orçamentos Não Comprados</span>
      </v-col>
    </v-row>
    <v-row row wrap class="mt-2">
      <v-col cols="12" class="pa-0">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="1" class="pa-0">
        <v-divider vertical></v-divider>
      </v-col>
      <v-col cols="3">Paciente</v-col>
      <v-col cols="1" class="pa-0">
        <v-divider vertical></v-divider>
      </v-col>
      <v-col cols="3" class="pa-0">Telefone</v-col>
      <v-col cols="1" class="pa-0">
        <v-divider vertical></v-divider>
      </v-col>
      <v-col cols="2" class="pa-0">Preço</v-col>
      <v-col cols="1" class="pa-0">
        <v-divider vertical></v-divider>
      </v-col>
      <v-col cols="12" class="pa-0">
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row row wrap class="mt-2" v-for="(budget, index) in Budgets" v-bind:key="index" @click="Products(budget)">
      <v-col cols="1" class="pa-0">
        <v-divider vertical></v-divider>
      </v-col>
      <v-col cols="3">{{budget.user[0] ? budget.user[0].name : 'Error'}}</v-col>
      <v-col cols="1" class="pa-0">
        <v-divider vertical></v-divider>
      </v-col>
      <v-col cols="3" class="pa-0">{{budget.user[0]? budget.user[0].telephones[0] : 'Error'}}</v-col>
      <v-col cols="1" class="pa-0">
        <v-divider vertical></v-divider>
      </v-col>
      <v-col cols="2" class="pa-0">{{budget.value | moneyFilter}}
      <v-icon>arrow_drop_down</v-icon>
      </v-col>
      <v-col cols="1" class="pa-0">
        <v-divider vertical></v-divider>
      </v-col>
      <v-col cols="12" class="pa-0">
        <v-divider></v-divider>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>

import moment from 'moment'
export default {
  props: [
      "Budgets",
  ],
  data(){
    return{

    }
  },
  methods:{
    Products(){

    }
  }
};
</script>