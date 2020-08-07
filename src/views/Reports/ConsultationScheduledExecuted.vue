<template>
  <v-container>
    <ConsultationScheduledExecuted
      :report="report"
      :loading="loading"
      :now="now"
      :total="total"
      :reportOptions="reportOptions"
      :reportSelected="reportSelected"
      :QuantityTotal="QuantityTotal"
      :CostTotal="CostTotal"
      :PercentageTotal="PercentageTotal"
      :QuantityTotalExecuted="QuantityTotalExecuted"
      :QuantityTotalScheduled="QuantityTotalScheduled"


       @change-reportSelected="(value)=>reportSelected=value"
    />
  </v-container>
</template>

<script>
import ConsultationScheduledExecuted from "@/components/Reports/ConsultationScheduledExecuted";
import moment from "moment";

export default {
  // name: "ConsultationScheduledExecuted",
  components: {
    ConsultationScheduledExecuted
  },
  props: ["report", "loading"],
  data() {
    return {
      now: moment().format("YYYY-MM-DD HH:mm:ss"),
      total: 0,
      reportOptions: [
        "Relatorio Especialidades",
        "Relatorio Especialidades Detalhado"
      ],
      reportSelected: 0
    };
  },
  computed: {
    QuantityTotal() {
      let quantidade = 0;
      for (let doctor in this.report.doctors) {
        quantidade += this.report.doctors[doctor].quantityTotal;
      }
      return quantidade;
    },
    CostTotal() {
      let custo = 0;
      for (let doctor in this.report.doctors) {
        custo += this.report.doctors[doctor].payment;
      }
      return custo;
    },
    PercentageTotal() {
      let porcentagem = 0;
      porcentagem =
        (parseFloat(this.QuantityTotalExecuted) /
          parseFloat(this.QuantityTotalScheduled)) *
        100;
      return porcentagem;
    },
    QuantityTotalExecuted() {
      let executed = 0;
      for (let consultation in this.report.consultations) {
        executed += this.report.consultations[consultation].executed;
      }
      return executed;
    },
    QuantityTotalScheduled() {
      let scheduled = 0;
      for (let consultation in this.report.consultations) {
        scheduled += this.report.consultations[consultation].scheduled;
      }
      return scheduled;
    }
  }
};
</script>

<style scoped>
.border {
  border: 1px solid grey;
}
</style>
