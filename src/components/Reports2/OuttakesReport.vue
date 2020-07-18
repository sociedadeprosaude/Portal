<template>
  <v-container>
    <v-row cols="12">
      <v-chip-group row mandatory v-model="optionSelected" active-class="primary--text">
        <v-chip v-for="option in options" :key="option">{{ option }}</v-chip>
      </v-chip-group>
    </v-row>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Procurar"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <span class="float-right">{{date }} 00:00:00 até {{date2}} 23:59:59</span>
      </v-card-title>

      <v-data-table
        :search="search"
        :headers="headers"
        :items=" actualList"
        :sort-by="['quantity']"
        :sort-desc="[true]"
        item-key="name"
        show-expand
        single-expand
        no-data-text="Sem saídas no intervalo escolhido"
        :footer-props="{
      itemsPerPageText:'Categorias por página',
      pageText:'{0}-{1} de {2}'
    }"
      >
        <template v-slot:item.totalCost="{ item }">R$ {{item.totalCost}}</template>
        <template v-slot:item.percentage="{ item }">{{item.percentage}} %</template>

        <template v-slot:expanded-item="{ item }">
          <td :colspan="headers.length+1">
            <v-data-table
              class="subTable"
              dense
              single-expand
              :headers="subHeaders"
              :items="item.outtakes"
              item-key="idOuttake"
              :footer-props="{
      itemsPerPageText:'Saídas por página',
      pageText:'{0}-{1} de {2}'
    }"
            >
              <template v-slot:item.cost="{ item }">R$ {{item.cost}}</template>
              <template v-slot:item.CRUD="{ item }">
                <v-row>
                  <ReadOuttake :item="item" />
                  <DeleteOuttake :item="item" :cb="cb" />
                </v-row>
              </template>
              <template v-slot:item.status="{ item }">
                <div v-if="item.status" class="green">Pago</div>
                <div v-else class="red white--text">Pendente</div>
              </template>
            </v-data-table>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <v-card>
      <div class="Chart">
        <PieOuttake :chart-data="dataCollection" :options="options" />
      </div>
    </v-card>

    <v-card class="mt-4">
      <v-container>
        <v-row>
          <v-col>
            <span class="my-headline">{{numOuttakes}}</span>
            <br />total de saídas
          </v-col>
          <v-divider vertical />
          <v-col>
            <span class="my-headline">R$ {{totalCost}}</span>
            <br />Custo total das saídas
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import moment from "moment";
import PieOuttake from "@/components/Charts/PieChart.js";
import DeleteOuttake from "@/components/reports/CRUD/DeleteOuttake";
import ReadOuttake from "@/components/reports/CRUD/ReadOuttake";

export default {
  name: "OuttakesReport",
  components: {
    PieOuttake,
    DeleteOuttake,
    ReadOuttake
  },
  props: [
    "date",
    "date2",
    "cb",
    "search",
    "paid",
    "now",
    "total",
    "options",
    "optionSelected",
    "headers",
    "subHeaders",
    "dateBegin",
    "dateEnd",
    "colors",
    "formatDate",
    "formatDateHour",
    "calcPercentage",
    "calcOuttakeInfo",
    "calcTotalCost",
    "calcCost",
    "updatePercentage",
    "outtakes",
    "listOuttakesRemade",
    "categories",
    "outtakesDividedByCategory",
    "outtakesToPayList",
    "outtakesPaidList",
    "dataCollection",
    "actualList",
    "numOuttakes",
    "totalCost"
  ]
};
</script>

<style scoped>
.subTable {
  border-radius: 0px;
  border: 1px solid black;
}
.Chart {
  padding: 20px;
  margin: 50px 0;
}
</style>
