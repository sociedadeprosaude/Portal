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
      <div v-if="optionSelected === 0">
        <v-data-table
          :headers="headers"
          :items="intakesDividedByExam"
          item-key="name"
          show-expand
          single-expand
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
        </v-data-table>
      </div>
      <div v-else>
        <TableMostRequestedClinics />
      </div>
    </v-card>
  </v-container>
</template>

<script>
import moment from "moment";
import TableMostRequestedClinics from "./TableMostRequestedClinics";

export default {
  name: "BestSellingExamsReport",
  components: { TableMostRequestedClinics },
  props: ["date", "date2"],
  data() {
    return {
      now: moment().format("YYYY-MM-DD HH:mm:ss"),
      total: 0,
      options: ["Organizar por exames", "Organizar por clinicas"],
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
          value: "intakeId"
        },

        { text: "Custo", value: "cost", align: "center" },
        { text: "Venda", value: "price", align: "center" },
        { text: "Clinica", value: "clinic.name" }
      ],
      dateBegin: null,
      dateEnd: null
    };
  },

  computed: {
    intakes() {
      return this.$store.getters.intakesReport;
    },
    intakesWithExam() {
      return this.$store.getters.intakesWithExam;
    },
    intakesWithExamLen() {
      return this.$store.getters.intakesWithExam.length;
    },
    exams() {
      return this.$store.getters.exams;
    },
    intakesDividedByExam() {
      let sorted = [];
      let examInIntakeMatched = [];
      let intakesOfExam = [];

      //  Percorrendo os exames existentes no banco
      this.exams.forEach(exam => {
        //Percorrendo os intakes que possuem exames salvo
        this.intakesWithExam.forEach(intake => {
          //retornando apenas o exame (da lista de exames) do intake que for igual ao exame procurado atual (o do exams.forEach ali)

          examInIntakeMatched = intake.exams.filter(
            examInINtake => exam.name == examInINtake.name
          );
          // Se o intake tem o exame procurado adiciona o exame do intake numa array auxiliar

          if (examInIntakeMatched.length != 0)
            // Ou examInIntakeMatched[0] e tirar o reduce ali embaixo se o banco só permitir 1 tipo de exame por venda
            // porque ta vindo do banco como uma array de um unico elemento
            intakesOfExam.push(
              examInIntakeMatched.map(exam => {
                exam.intakeId = intake.id;
                return exam;
              })
            );
        });
        // Agrupando em uma array o exame do loop atual com os dados dos intakes que possuem este exame
        if (intakesOfExam.length != 0) {
          //juntando os exames em uma array de exames (minha logica ali de cima retorna uma array de array);
          var intakesOfExamMerged = [].concat.apply([], intakesOfExam);

          const sumCost = intakesOfExam.reduce(
            (total, exams) =>
              total + exams.reduce((subTotal, exam) => exam.cost, 0),
            0
          );
          const sumPrice = intakesOfExam.reduce(
            (total, exams) =>
              total + exams.reduce((subTotal, exam) => exam.price, 0),
            0
          );

          sorted.push({
            name: exam.name,
            intakes: intakesOfExamMerged,
            quantity: intakesOfExam.length,
            totalCost: sumCost,
            totalPrice: sumPrice,
            profit: sumPrice - sumCost
          });
          intakesOfExam = [];
        }
      });
     
      return sorted;
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
