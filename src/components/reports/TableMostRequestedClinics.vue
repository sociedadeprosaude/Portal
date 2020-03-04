<template>
  <div>
    {{intakesDivided}}
    <br />
    {{intakesWithExam.length}}
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "TableMostRequestedClinics",

  props: [],
  data() {
    return {
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
      ]
    };
  },

  computed: {
    intakesWithExam() {
      return this.$store.getters.intakesWithExam;
    },
    exams() {
      return this.$store.getters.exams;
    },
    clinics() {
      return this.$store.getters.clinics;
    },
    intakesDivided() {
      let listIntakes = [];
      let listClinics = [];

      listIntakes = this.intakesWithExam.map(intake =>
        intake.exams.map(exam => {
          return {
            idIntake: intake.id,
            clinic: exam.clinic.name,
            cost: exam.cost,
            exam: exam.name,
            price: exam.price
          };
        })
      );

      listIntakes = [].concat.apply([], listIntakes);

      let listClinicsGrouped = [];
      let filtered = [];
      let listAll = [];

      // this.clinics.forEach(clinic => {
      //   this.exams.forEach(exam => {
      //     filtered = listIntakes.filter(
      //       intake => intake.clinic == clinic.name && intake.exam == exam.name
      //     );
      //     if (filtered.length != 0) listClinicsGrouped.push(filtered);
      //   });
      //   if (listClinicsGrouped.length != 0) {
      //     console.log(listClinicsGrouped)

      //     listClinicsGrouped = [];
      //   }
      // });

      this.exams.forEach(exam => {
        filtered = listIntakes.filter(
          intake => intake.exam == exam.name
        );
        if (filtered.length != 0) listClinicsGrouped.push(filtered);
      });
      if (listClinicsGrouped.length != 0) {
        console.log(listClinicsGrouped);
        

        listClinicsGrouped = [];
      }

      return listIntakes;
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
