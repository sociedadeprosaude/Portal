<template>
  <v-container>
    <v-row cols="12">
      <v-chip-group
        row
        mandatory
        v-bind:value="optionSelected"
        @change="(event)=>$emit('change-optionSelected',event)"
        active-class="primary--text"
      >
        <v-chip v-for="option in options" :key="option">{{ option }}</v-chip>
      </v-chip-group>
    </v-row>
    <v-card id="card-to-print">
      <v-card-title>
        <v-text-field
          v-bind:value="search"
          @input="(event)=>$emit('change-search',event)"
          append-icon="mdi-magnify"
          label="Procurar"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <span class="float-right">{{date }} 00:00:00 até {{date2}} 23:59:59</span>
      </v-card-title>
      <div v-if="optionSelected === 0">
        <v-data-table
          :headers="headers"
          :search="search"
          :items="ExamsFormatArray"
          :sort-by="['quantity']"
          :sort-desc="[true]"
          item-key="name"
          show-expand
          single-expand
          no-data-text="Sem exames no intervalo escolhido"
          :footer-props="{
      itemsPerPageText:'Exames por página',
      pageText:'{0}-{1} de {2}'
    }"
        >
          <template v-slot:item.price="{ item }">R$ {{item.price.toFixed(2)}}</template>
          <template v-slot:item.cost="{ item }">R$ {{item.cost.toFixed(2)}}</template>
          <template v-slot:item.profit="{ item }">R$ {{item.profit.toFixed(2)}}</template>

          <template v-slot:expanded-item="{ item }">
            <td :colspan="headers.length+1">
              <v-data-table
                class="subTable"
                dense
                single-expand
                :headers="subHeaders"
                :items="item.intakes"
                item-key="intakeId"
                :footer-props="{
      itemsPerPageText:'Itens por página',
      pageText:'{0}-{1} de {2}'
    }"
              >
                <template v-slot:item.price="{ item }">R$ {{item.price.toFixed(2)}}</template>
                <template v-slot:item.cost="{ item }">R$ {{item.cost.toFixed(2)}}</template>
              </v-data-table>
            </td>
          </template>
        </v-data-table>
      </div>
      <div v-else>
        <TableExamsAndClinics :intakesDividedByExam="intakesDividedByExam" :search="search" />
      </div>
    </v-card>

    <v-card class="mt-4">
      <v-container>
        <v-row>
          <v-col>
            <span class="my-headline">{{numSales}}</span>
            <br />total de exames vendidos
          </v-col>
          <v-divider vertical />
          <v-col>
            <span class="my-headline">R$ {{totalCost.toFixed(2)}}</span>
            <br />Custo total dos exames
          </v-col>
          <v-divider vertical />
          <v-col>
            <span class="my-headline">R$ {{totalPrice.toFixed(2)}}</span>
            <br />Preço de venda total dos exames
          </v-col>
          <v-divider vertical />
          <v-col>
            <span class="my-headline">R$ {{totalProfit.toFixed(2)}}</span>
            <br />Lucro liquido total
          </v-col>
          <v-divider vertical />
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import moment from "moment";
import TableExamsAndClinics from "@/components/Reports/TableExamsAndClinics";
export default {
  components: { TableExamsAndClinics },
  props: [
    "date",
    "date2",
    "search",
    "now",
    "total",
    "options",
    "optionSelected",
    "headers",
    "subHeaders",
    "calcIntakeFromExam",
    "ExamsFormatArray",
    "exams",
    "numSales",
    "totalPrice",
    "totalCost",
    "totalProfit"
  ]
};
</script>

<style scoped>
.subTable {
  border-radius: 0px;
  border: 1px solid black;
}
</style>