<template>
  <v-container>
    <v-layout row wrap>
      <RegisterBill />
      <v-flex xs12 class="text-left mt-6">
        <span class="my-headline">{{pendingOuttakes.length}} Contas à pagar</span>
      </v-flex>
      <v-flex xs12>
        <outtake-order :outtakes="pendingOuttakes" />
      </v-flex>
      <v-flex xs12 class="text-left mt-6">
        <span class="my-headline">{{selectedPaidOuttakesList.length}} Contas pagas</span>
      </v-flex>
      <v-container>
        <v-row>
          <v-chip-group
            row
            mandatory
            v-bind:value="selectedOption"
            @change="(event)=>$emit('change-selectedOption',event)"
            active-class="primary--text"
          >
            <v-chip v-for="option in billsOptions" :key="option">{{ option }}</v-chip>
          </v-chip-group>
        </v-row>
        <div v-if="selectedOption === 1">
          <v-row dense no-gutters align="start" justify="start">
            <v-col>
              <v-switch
                :value="switchDate"
                @change="(event)=>$emit('change-switchDate',event)"
                label="Limitar por data"
              />
              <v-date-picker
                v-if="switchDate"
                locale="pt-br"
                v-bind:value="selectedDate"
                @change="(event)=>$emit('change-selectedDate',event)"
              />
            </v-col>
            <v-col>
              <v-switch
                v-bind:value="switchCategory"
                @change="(event)=>$emit('change-switchCategory',event)"
                label="Limitar por categoria"
              />
              <v-combobox
                v-if="switchCategory"
                label="categoria"
                v-bind:value="selectedCategory"
                @change="(event)=>$emit('change-selectedCategory',event)"
                :items="categoriesName"
                outlined
                clearable
              ></v-combobox>
            </v-col>
          </v-row>
        </div>
      </v-container>
      <v-container v-if="loadingFilter">
        <v-row align="center" justify="center">
          <v-col>
            <v-card elevation="10" class="pa-4">
              <v-progress-circular indeterminate color="primary" />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else-if="selectedPaidOuttakesList.length === 0 && selectedOption === 0">
        <v-row align="center" justify="center">
          <v-col>
            <v-card elevation="10" class="pa-4">Não há contas pagas hoje</v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else-if="selectedPaidOuttakesList.length === 0 && selectedOption === 1">
        <v-row align="center" justify="center">
          <v-col>
            <v-card elevation="10" class="pa-4">Não há contas pagas que se encaixam nestas condições</v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-flex xs12 class="mt-4" v-else>
        <v-card class="pa-4 my-4" v-for="bill in selectedPaidOuttakesList" :key="bill.id">
          <v-layout row wrap>
            <v-flex xs12>
              <v-layout row wrap>
                <span>{{bill.category}}</span>
                <br />
                <span>{{bill.subCategory}}</span>
                <v-divider vertical class="mx-4" />
                <span>{{bill.payment_method}}</span>
                <v-divider vertical class="mx-4" />
                <span class="font-weight-bold">{{bill.date_to_pay | dateFilter}}</span>
                <v-divider vertical class="mx-4" />
                <span class="font-weight-bold">{{bill.paid | dateFilter}}</span>
                <v-divider vertical class="mx-4" />
                <v-spacer />
                <span class="font-weight-bold">{{bill.value}}</span>

                <v-flex xs12>
                  <span>{{bill.description}}</span>
                </v-flex>
                <v-flex xs12 sm10 class="mt-4">
                  <v-layout row wrap>
                    <v-layout column wrap>
                      <span class="my-sub-headline mb-4">Anexos</span>
                      <v-layout row wrap>
                        <v-flex v-for="(append, i) in bill.appends" :key="i">
                          <v-card @click="openAppend(append)" flat>
                            <img :src="append" style="max-width: 124px; max-width: 124px" />
                          </v-card>
                        </v-flex>
                      </v-layout>
                    </v-layout>
                    <v-divider vertical />
                    <v-layout column wrap>
                      <span class="my-sub-headline mb-4">Comprovante</span>
                      <v-layout row wrap v-if="!loading">
                        <v-flex v-for="(append, i) in bill.receipts" :key="i">
                          <v-card @click="openAppend(append)" flat>
                            <img :src="append" style="max-width: 124px; max-width: 124px" />
                          </v-card>
                        </v-flex>
                      </v-layout>
                      <v-flex xs12 sm2 class="text-right" v-else>
                        <v-progress-circular indeterminate class="primary--text" />
                      </v-flex>
                    </v-layout>
                  </v-layout>
                </v-flex>
                <v-flex xs12 class="text-right" v-if="loadingDelete && outtakeSelect === bill">
                  <v-progress-circular indeterminate class="primary--text" />
                </v-flex>
                <v-flex xs12 class="text-right" v-else>
                  <v-btn @click="unpayOuttake(bill)" class="error mx-2" fab small>
                    <v-icon>money_off</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import OuttakeOrder from "../../components/reports/OuttakeOrder";
import RegisterBill from "../../components/Bills/RegisterBill";
import { mask } from "vue-the-mask";
import moment from "moment";
export default {
  name: "Bils",
  components: {
    OuttakeOrder,
    RegisterBill
  },
  props: {
    other: String,
    billsOptions: Array,
    dialogSelectDate: Boolean,
    dialogCategory: Boolean,
    switchDate: Boolean,
    switchCategory: Boolean,
    selectedOption: Number,
    selectedDate: String,
    selectedCategory: String,
    loading: Boolean,
    loadingFilter: Boolean,
    loadingDelete: Boolean,
    outtakeSelect: Object,
    files: Array,
    filesPreviews: Array,

    outtakesPaid: Array,
    outtakesPaidToday: Array,
    pendingOuttakes: Array,
    selectedPaidOuttakesList: Array,
    categories: Array,
    categoriesName: Array,

    getOuttakesPaid: Function,
    unpayOuttake: Function,
    openAppend: Function
  }
};
</script>
