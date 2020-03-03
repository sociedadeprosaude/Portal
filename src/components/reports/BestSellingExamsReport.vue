<template>
  <v-container>{{intakesWithExam}}</v-container>
</template>

<script>
import moment from "moment";
export default {
  name: "BestSellingExamsReport",
  props: ["report", "loading"],
  data() {
    return {
      now: moment().format("YYYY-MM-DD HH:mm:ss"),
      total: 0
    };
  },
  methods: {},
  computed: {
    intakes() {
      return this.$store.getters.intakesReport;
    },
    intakesWithExam() {
      let sorted = [];
      let examInIntakeMatched = [];
      let intakesOfExam = [];

      //  Percorrendo os exames existentes no banco
      this.exams.forEach(exam => {
        //Percorrendo os intakes que possuem exames salvo
        this.$store.getters.intakesWithExam.forEach(intake => {
          //retornando apenas o exame (da lista de exames) do intake que for igual ao exame procurado atual (o do exams.forEach ali)
          examInIntakeMatched = intake.exams.filter(
            examInINtake => exam.name == examInINtake.name
          );
          // Se o intake tem o exame procurado adiciona o exame do intake numa array auxiliar
          if (examInIntakeMatched.length != 0)
            // Ou examInIntakeMatched[0] e tirar o reduce ali embaixo se o banco só permitir 1 tipo de exame por venda
            // porque ta vindo do banco como uma array de um unico elemento
            intakesOfExam.push(examInIntakeMatched);
        });
        // Agrupando em uma array o exame do loop atual com os dados dos intakes que possuem este exame
        if (intakesOfExam.length != 0) {
          sorted.push({
            type: exam.name,
            intakes: intakesOfExam,
            quantity: intakesOfExam.length,
            totalCost: intakesOfExam.reduce(
              (total, exams) =>
                total + exams.reduce((subTotal, exam) => exam.cost, 0),
              0
            ),
            totalPrice: intakesOfExam.reduce(
              (total, exams) =>
                total + exams.reduce((subTotal, exam) => exam.price, 0),
              0
            )
          });
          intakesOfExam = [];
        }
      });
      console.log(sorted);

      //1582890529907
      return this.$store.getters.intakesWithExam.length;
    },
    intakesWithExamLen() {
      return this.$store.getters.intakesWithExam.length;
    },
    exams() {
      return this.$store.getters.exams;
    },
    divideIntakes() {
      return this.$store.getters.intakesWithExam;
    }
  }
};
</script>

<style scoped>
</style>
