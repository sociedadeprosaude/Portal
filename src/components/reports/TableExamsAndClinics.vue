<template>
  <v-data-table
    :headers="headers"
    :items="intakesDividedByExamAndClinic"
    :sort-by="['quantity']"
    :sort-desc="[true]"
    item-key="examName"
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
          show-expand
          single-expand
          :headers="subHeaders"
          :items="item.clinics"
          item-key="clinicName"
          hide-default-footer
        >
          <template v-slot:item.totalPrice="{ item }">R$ {{item.totalPrice}}</template>
          <template v-slot:item.totalCost="{ item }">R$ {{item.totalCost}}</template>
          <template v-slot:expanded-item="{ item }">
            <td :colspan="subHeaders.length+1">
              <v-data-table
                class="subTable"
                dense
                single-expand
                :headers="triHeaders"
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
      </td>
    </template>
  </v-data-table>
</template>

<script>
import moment from "moment";

export default {
  name: "TableExamsAndClinics",
  props: ["intakesDividedByExam"],
  data() {
    return {
      headers: [
        {
          text: "Exame",
          align: "start",
          sortable: false,
          value: "examName"
        },
        { text: "Quantidade vendida", value: "quantity", align: "center" },
        { text: "Custo total", value: "totalCost", align: "center" },
        { text: "Venda total", value: "totalPrice", align: "center" },
        { text: "Lucro liquido", value: "profit" }
      ],
      subHeaders: [
        { text: "Clinica", value: "clinicName" },
        {
          text: "Quantidade enviada para clinica",
          value: "quantity",
          align: "center"
        },
        { text: "Custo", value: "totalCost", align: "center" },
        { text: "Venda", value: "totalPrice", align: "center" }
      ],
      triHeaders: [
        {
          text: "Codigo",
          align: "start",
          sortable: false,
          value: "idIntake"
        },
        { text: "Custo", value: "cost", align: "center" },
        { text: "Venda", value: "price", align: "center" }
      ]
    };
  },
  methods: {
    calcIntakeFromExam(clinicName, listIntakes) {
      const sumCost = listIntakes.reduce((sum, e) => sum + e.cost, 0);
      const sumPrice = listIntakes.reduce((sum, e) => sum + e.price, 0);
      return {
        clinicName: clinicName,
        totalCost: sumCost,
        totalPrice: sumPrice,
        quantity: listIntakes.length,
        intakes: listIntakes,
        profit: sumPrice - sumCost
      };
    },
    calcIntakeFromClinic(examName, listClinics) {
      const sumCost = listClinics.reduce((sum, e) => sum + e.totalCost, 0);
      const sumPrice = listClinics.reduce((sum, e) => sum + e.totalPrice, 0);
      const sumSales = listClinics.reduce((sum, e) => sum + e.quantity, 0);
      return {
        examName: examName,
        totalCost: sumCost,
        totalPrice: sumPrice,
        quantity: sumSales,
        clinics: listClinics,
        profit: sumPrice - sumCost
      };
    }
  },
  computed: {
    clinics() {
      return this.$store.getters.clinics;
    },
    intakesDividedByExamAndClinic() {
      let listIntakes = [];
      this.intakesDividedByExam.forEach(exam => {
        let listExamsGroupedByClinic = [];
        this.clinics.forEach(clinic => {
          let listIntakeFromClinic = exam.intakes.filter(
            intake => intake.clinicName == clinic.name
          );
          if (listIntakeFromClinic.length != 0)
            listExamsGroupedByClinic.push(
              this.calcIntakeFromExam(clinic.name, listIntakeFromClinic)
            );
        });
        if (listExamsGroupedByClinic.length != 0)
          listIntakes.push(
            this.calcIntakeFromClinic(exam.name, listExamsGroupedByClinic)
          );
      });
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
