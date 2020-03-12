<template>
  <v-container>
    <v-row cols="12">
      <v-chip-group row mandatory v-model="optionSelected" active-class="primary--text">
        <v-chip v-for="option in options" :key="option">{{ option }}</v-chip>
      </v-chip-group>
    </v-row>
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <span class="float-right">{{date }} 00:00:00 até {{date2}} 23:59:59</span>
      </v-card-title>
      <div v-if="optionSelected !== 0">
        <!-- <v-data-table
          :headers="headers"
          :items="intakesDividedByExam"
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
          <template v-slot:item.totalPrice="{ item }">R$ {{item.totalPrice}}</template>
          <template v-slot:item.totalCost="{ item }">R$ {{item.totalCost}}</template>
          <template v-slot:item.profit="{ item }">R$ {{item.profit}}</template>

          <template v-slot:expanded-item="{ item }">
            <td :colspan="headers.length+1">
              <v-data-table
                class="subTable"
                dense
                single-expand
                :headers="subHeaders"
                :items="item.intakes"
                item-key="intakeId"
                hide-default-footer
              >
                <template v-slot:item.price="{ item }">R$ {{item.price}}</template>
                <template v-slot:item.cost="{ item }">R$ {{item.cost}}</template>
              </v-data-table>
            </td>
          </template>
        </v-data-table>-->
      </div>
      <div v-else>
        <div v-for="x in outtakesList" :key="x">
          {{x.paidIn}}
          <br />
        </div>
      </div>
    </v-card>

    <!-- <v-card class="mt-4">
      <v-container>
        <v-row>
          <v-col>
            <span class="my-headline">{{numSales}}</span>
            <br />total de saídas
          </v-col>
          <v-divider vertical />
          <v-col>
            <span class="my-headline">R$ {{totalCost}}</span>
            <br />Custo total
          </v-col>
        </v-row>
      </v-container>
    </v-card>-->
  </v-container>
</template>

<script>
import moment from "moment";

export default {
  name: "OuttakesReport",
  props: ["date", "date2"],
  data() {
    return {
      now: moment().format("YYYY-MM-DD HH:mm:ss"),
      total: 0,
      options: ["Saídas", "Saídas 2"],
      optionSelected: 0,
      headers: [
        {
          text: "Saída",
          align: "start",
          sortable: false,
          value: "name"
        },
        { text: "Quantidade", value: "quantity", align: "center" },
        { text: "Custo total", value: "totalCost", align: "center" }
      ],
      subHeaders: [
        {
          text: "Codigo",
          align: "start",
          sortable: false,
          value: "idIntake"
        },

        { text: "Custo", value: "cost", align: "center" }
      ],
      dateBegin: null,
      dateEnd: null
    };
  },

  methods: {},
  computed: {
    outtakes() {
      return this.$store.getters.outtakes;
    },
    outtakesList() {
      return this.outtakes.map(e => ({
        id: e.id,
        category: e.category,
        subCategory: e.subCategory,
        cost: e.value,
        paidIn: e.paid,
        toPayIn: e.date_to_pay,
        info: e.description
      }));
    }
    // numOuttakes() {
    //   return this.intakesDividedByExam.reduce(
    //     (total, e) => total + e.quantity,
    //     0
    //   );
    // },
    // totalCost() {
    //   return this.intakesDividedByExam.reduce(
    //     (total, e) => total + e.totalCost,
    //     0
    //   );
    // }
  }
};
</script>

<style scoped>
.subTable {
  border-radius: 0px;
  border: 1px solid black;
}
</style>
