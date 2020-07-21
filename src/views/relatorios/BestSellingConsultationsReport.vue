<template>
  <v-container>
    <BestSellingConsultationsReport
      :date="date"
      :date2="date2"
      :search="search"
      :now="now"
      :total="total"
      :options="options"
      :optionSelected="optionSelected"
      :headers="headers"
      :subHeaders="subHeaders"
      :calcIntakeFromConsultation="calcIntakeFromConsultation"
      :intakesWithConsultation="intakesWithConsultation"
      :specialties="specialties"
      :intakesDividedBySpecialties="intakesDividedBySpecialties"
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
import moment from "moment";
import BestSellingConsultationsReport from "@/components/Reports2/BestSellingConsultationsReport";
export default {
  // name: "BestSellingConsultationsReports",
  components: { BestSellingConsultationsReport },
  props: ["date", "date2"],
  data() {
    return {
      search: "",
      now: moment().format("YYYY-MM-DD HH:mm:ss"),
      total: 0,
      options: ["Consultas", "Consultas por clínica", "Consultas por médico"],
      optionSelected: 0,
      headers: [
        {
          text: "CONSULTAS",
          align: "start",
          sortable: false,
          value: "name"
        },
        { text: "QUANTIDADE VENDIDA", value: "quantity", align: "center" },
        { text: "CUSTO TOTAL", value: "totalCost", align: "center" },
        { text: "VENDA TOTAL", value: "totalPrice", align: "center" },
        { text: "LUCRO LÍQUIDO", value: "profit" }
      ],
      subHeaders: [
        {
          text: "Código",
          align: "start",
          sortable: false,
          value: "idIntake"
        }
      ]
    };
  },
  methods: {
    calcIntakeFromConsultation(consultation, listIntakesSpecialties) {
      const sumCost = listIntakesSpecialties.reduce(
        (total, e) => total + e.cost,
        0
      );
      const sumPrice = listIntakesSpecialties.reduce(
        (total, e) => total + e.price,
        0
      );
      return {
        name: consultation.name,
        intakes: listIntakesSpecialties,
        quantity: listIntakesSpecialties.length,
        totalCost: sumCost,
        totalPrice: sumPrice,
        profit: sumPrice - sumCost
      };
    }
  },
  computed: {
    intakesWithConsultation() {
      return this.$store.getters.intakesWithConsultation;
    },
    specialties() {
      return this.$store.getters.specialties;
    },
    intakesDividedBySpecialties() {
      let listIntakesRemade = [];
      listIntakesRemade = this.intakesWithConsultation.map(intake =>
        intake.specialties.map(consultation => {
          return {
            idIntake: intake.id,
            clinicName:
              consultation.doctor.clinic != null
                ? consultation.doctor.clinic.name
                : "Erro, consulta sem clinica",
            cost: consultation.cost,
            specialtieName: consultation.name,
            price: consultation.price,
            doctorName: consultation.doctor.name
          };
        })
      );
      listIntakesRemade = [].concat.apply([], listIntakesRemade);
      let listIntakesGroupedBySpecialties = [];
      this.specialties.forEach(specialtie => {
        let listIntakesSpecialties = listIntakesRemade.filter(
          intake => intake.specialtieName === specialtie.name
        );
        if (listIntakesSpecialties.length !== 0)
          listIntakesGroupedBySpecialties.push(
            this.calcIntakeFromConsultation(specialtie, listIntakesSpecialties)
          );
      });
      return listIntakesGroupedBySpecialties;
    },
    numSales() {
      return this.intakesDividedBySpecialties.reduce(
        (total, e) => total + e.quantity,
        0
      );
    },
    totalPrice() {
      return this.intakesDividedBySpecialties.reduce(
        (total, e) => total + e.totalPrice,
        0
      );
    },
    totalCost() {
      return this.intakesDividedBySpecialties.reduce(
        (total, e) => total + e.totalCost,
        0
      );
    },
    totalProfit() {
      return this.intakesDividedBySpecialties.reduce(
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