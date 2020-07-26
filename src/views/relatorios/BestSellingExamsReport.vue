<template>
  <v-container>
    <BestSellingExamsReport
      :date="date"
      :date2="date2"
      :search="search"
      :now="now"
      :total="total"
      :options="options"
      :optionSelected="optionSelected"
      :headers="headers"
      :subHeaders="subHeaders"
      :dateBegin="dateBegin"
      :dateEnd="dateEnd"
      :calcIntakeFromExam="calcIntakeFromExam"
      :intakesWithExam="intakesWithExam"
      :exams="exams"
      :intakesDividedByExam="intakesDividedByExam"
      :numSales="numSales"
      :totalPrice="totalPrice"
      :totalCost="totalCost"
      :totalProfit="totalProfit"

      @change-search="(value)=>search=value"
      @change-optionSelected="(value)=>optionSelected=value"
    />
  </v-container>
</template>

<script>
import BestSellingExamsReport from "@/components/Reports/BestSellingExamsReport";
import moment from "moment";
export default {
  // name: "BestSellingExamsReport",
  components: { BestSellingExamsReport },
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