<template>
  <v-container>
    <v-row cols="12">
      <v-chip-group row mandatory v-model="optionSelected" active-class="primary--text">
        <v-chip v-for="option in options" :key="option">{{ option }}</v-chip>
      </v-chip-group>
    </v-row>
    <v-card id="card-to-print">
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
      <div v-if="optionSelected === 0">
        <v-data-table
          :headers="headers"
          :search="search"
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
          <template v-slot:item.totalPrice="{ item }">R$ {{item.totalPrice.toFixed(2)}}</template>
          <template v-slot:item.totalCost="{ item }">R$ {{item.totalCost.toFixed(2)}}</template>
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
        <TableExamsAndClinics :intakesDividedByExam="intakesDividedByExam" />
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
import TableExamsAndClinics from "./TableExamsAndClinics";
export default {
  name: "BestSellingExamsReport",
  components: { TableExamsAndClinics },
  props: ["date", "date2"],
  data() {
    return {
      search: "",
      now: moment().format("YYYY-MM-DD HH:mm:ss"),
      total: 0,
      options: ["Exames", "Exames separados por clinica"],
      optionSelected: 0,
      headers: [
        {
          text: "Exame",
          align: "start",
          sortable: false,
          value: "name"
        },
        { text: "Quantidade vendida", value: "quantity", align: "center" },
        { text: "Custo total", value: "totalCost", align: "center" },
        { text: "Venda total", value: "totalPrice", align: "center" },
        { text: "Lucro liquido", value: "profit" }
      ],
      subHeaders: [
        {
          text: "Codigo",
          align: "start",
          sortable: false,
          value: "idIntake"
        },
        { text: "Custo", value: "cost", align: "center" },
        { text: "Venda", value: "price", align: "center" },
        { text: "Clinica", value: "clinicName" }
      ],
      dateBegin: null,
      dateEnd: null
    };
  },
  methods: {
    calcIntakeFromExam(exam, listIntakesExam) {
      const sumCost = listIntakesExam.reduce((total, e) => total + e.cost, 0);
      const sumPrice = listIntakesExam.reduce((total, e) => total + e.price, 0);
      return {
        name: exam.name,
        intakes: listIntakesExam,
        quantity: listIntakesExam.length,
        totalCost: sumCost,
        totalPrice: sumPrice,
        profit: sumPrice - sumCost
      };
    }
  },
  computed: {
    intakesWithExam() {
      return this.$store.getters.intakesWithExam;
    },
    exams() {
      return this.$store.getters.exams;
    },
    intakesDividedByExam() {
      let listIntakesRemade = [];
      listIntakesRemade = this.intakesWithExam.map(intake =>
        intake.exams.map(exam => {
          return {
            idIntake: intake.id,
            clinicName:
              exam.clinic != null
                ? exam.clinic.name
                : "Erro, exame sem clinica",
            cost: exam.cost,
            examName: exam.name,
            price: exam.price
          };
        })
      );
      listIntakesRemade = [].concat.apply([], listIntakesRemade);
      let listIntakesGroupedByExam = [];
      this.exams.forEach(exam => {
        let listIntakesExam = listIntakesRemade.filter(
          intake => intake.examName == exam.name
        );
        if (listIntakesExam.length != 0)
          listIntakesGroupedByExam.push(
            this.calcIntakeFromExam(exam, listIntakesExam)
          );
      });
      return listIntakesGroupedByExam;
    },
    numSales() {
      return this.intakesDividedByExam.reduce(
        (total, e) => total + e.quantity,
        0
      );
    },
    totalPrice() {
      return this.intakesDividedByExam.reduce(
        (total, e) => total + e.totalPrice,
        0
      );
    },
    totalCost() {
      return this.intakesDividedByExam.reduce(
        (total, e) => total + e.totalCost,
        0
      );
    },
    totalProfit() {
      return this.intakesDividedByExam.reduce(
        (total, e) => total + e.profit,
        0
      );
    }
  }
};
</script>

<style scoped>
.subTable {
  border-radius: 0px;
  border: 1px solid black;
}
</style>