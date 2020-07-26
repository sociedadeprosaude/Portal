<template>
  <v-container v-if="!loading">
    <colaborators-production-report
      :loading="loading"
      :intakes="intakes"
      :colaborators="colaborators"
      :selectedColaborator="selectedColaborator"
      :paymentMethods="paymentMethods"
      :intakesResume="intakesResume"
    ></colaborators-production-report>
  </v-container>
</template>

<script>
import ColaboratorsProductionReport from "@/components/Reports/ColaboratorsProductionReport";
export default {
  // name: "ColabboratorsProductionReport",
  props: ["intakes", "loading"],
  components: {
    ColaboratorsProductionReport
  },
  data() {
    return {
      colaborators: undefined,
      selectedColaborator: undefined,
      paymentMethods: ["Dinheiro", "Crédito", "Débito"]
    };
  },
  computed: {
    intakesResume() {
      let resumes = {};
      for (let intake of this.intakes) {
        if (!resumes[intake.colaborator.name]) {
          resumes[intake.colaborator.name] = {
            Dinheiro: 0.0,
            Credito: 0.0,
            Debito: 0.0,
            Exames: 0,
            Consultas: 0
          };
        }
        if (intake.payments) {
          for (let i = 0; i < intake.payments.length; i++) {
            if (intake.payments[i] === "Dinheiro") {
              resumes[intake.colaborator.name].Dinheiro += parseFloat(
                intake.valuesPayments[i]
              );
            }
            if (intake.payments[i] === "Crédito") {
              resumes[intake.colaborator.name].Credito += parseFloat(
                intake.valuesPayments[i]
              );
            }
            if (intake.payments[i] === "Débito" || intake.payments[i] === "") {
              resumes[intake.colaborator.name].Debito += parseFloat(
                intake.valuesPayments[i]
              );
            }
          }
        } else {
          resumes[intake.colaborator.name].Dinheiro += parseFloat(intake.total);
        }
        resumes[intake.colaborator.name][intake.payment_method] += intake.total;
        if (intake.exams) {
          resumes[intake.colaborator.name].Exames = resumes[
            intake.colaborator.name
          ].Exames
            ? intake.exams.length + resumes[intake.colaborator.name].Exames
            : intake.exams.length;
        }
        if (intake.specialties) {
          resumes[intake.colaborator.name].Consultas = resumes[
            intake.colaborator.name
          ].Consultas
            ? intake.specialties.length +
              resumes[intake.colaborator.name].Consultas
            : intake.specialties.length;
        }
      }
      return resumes;
    }
  }
};
</script>
