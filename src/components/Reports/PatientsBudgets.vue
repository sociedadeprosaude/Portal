<template>
  <v-container>
    <v-row>
      <v-col>
        <span class="my-sub-headline mb-4 mx-4">Relatório Orçamentos Não Comprados</span>
      </v-col>
    </v-row>
    <v-card>
      <v-row row wrap class="mt-2">
        <v-col cols="12" >
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
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row row wrap class="mt-2" v-for="(budget, index) in Budgets" v-bind:key="index">
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
          <v-btn class="pa-0 " icon rounded  @click="Products(budget)"> <v-icon>arrow_drop_down</v-icon></v-btn>
        </v-col>
        <v-col cols="1" class="pa-0">
          <v-divider vertical></v-divider>
        </v-col>
        <v-col cols="12" >
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12" >
          <v-card  row wrap color="grey_light2" class="mt-0" v-if="budget.id === budgetSelected.id" >
            <v-row row wrap class="mt-2">
              <v-col cols="12" >
                <v-divider></v-divider>
              </v-col>
              <v-col cols="1" class="pa-0">
                <v-divider vertical></v-divider>
              </v-col>
              <v-col cols="5" class="font-weight-bold" >Produto</v-col>
              <v-col cols="1" class="pa-0">
                <v-divider vertical></v-divider>
              </v-col>
              <v-col cols="4" class="font-weight-bold" >Preço</v-col>
              <v-col cols="1" class="pa-0">
                <v-divider vertical></v-divider>
              </v-col>
              <v-col cols="12" >
                <v-divider></v-divider>
              </v-col>
            </v-row>
            <v-row  v-for="product in budgetSelected.products" v-bind:key="product.id">
              <v-col cols="12" >
                <v-divider></v-divider>
              </v-col>
              <v-col cols="1" class="pa-0">
                <v-divider vertical></v-divider>
              </v-col>
              <v-col cols="5">{{ product.with_product[0].name }}</v-col>
              <v-col cols="1" class="pa-0">
                <v-divider vertical></v-divider>
              </v-col>
              <v-col cols="4" class="pa-0">{{ product.price| moneyFilter }}</v-col>
              <v-col cols="1" class="pa-0">
                <v-divider vertical></v-divider>
              </v-col>
              <v-col cols="12">
                <v-divider></v-divider>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>

import moment from 'moment'
export default {
  props: [
      "Budgets",
  ],
  data: vm => ({
    budgetSelected: ''
  }),
  methods:{
    Products(budget){
      if(budget.id === this.budgetSelected.id){
        this.budgetSelected= {}
      }
      else{
        this.budgetSelected = budget
      }
    }
  }
};
</script>