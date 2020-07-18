<template>
  <v-container>
    <ProceduresPricesAnalises
      :loading="loading"
      :idealProfitPercentage="idealProfitPercentage"
      :selectedType="selectedType"
      :types="types"
      :showOptions="showOptions"
      :showOption="showOption"
      :exams="exams"
      :clinics="clinics"
      :allLoaded="allLoaded"
      :filterExams="filterExams"
      :filterClinics="filterClinics"
      :getClinicExams="getClinicExams"
      :beginAnalises="beginAnalises"
      :turnClinicsInExams="turnClinicsInExams"
      :getIdealCost="getIdealCost"
      :getIdealPrice="getIdealPrice"
      :getProfitPercentage="getProfitPercentage"
    />
  </v-container>
</template>

<script>
import ProceduresPricesAnalises from "@/components/Reports2/ProceduresPricesAnalises";
export default {
  //   name: "ProceduresPricesAnalises",
  components: { ProceduresPricesAnalises },
  data() {
    return {
      loading: false,
      idealProfitPercentage: 105,
      selectedType: 0,
      types: ["Por Clinicas", "Por Exames"],
      showOptions: ["Tudo", "Somente as falhas"],
      showOption: 0
    };
  },
  computed: {
    exams() {
      return this.$store.getters.exams;
    },
    clinics() {
      return this.$store.getters.clinics;
    },
    allLoaded() {
      return this.$store.getters.clinicsLoaded && !this.loading;
    }
  },
  methods: {
    filterExams(exams) {
      if (this.showOption === 0) {
        return exams;
      }
      return exams.filter(exam => {
        return (
          this.getProfitPercentage(exam) < this.idealProfitPercentage / 100
        );
      });
    },
    filterClinics(clinics) {
      if (this.showOption === 0) {
        return clinics;
      }
      return clinics.filter(exam => {
        return (
          this.getProfitPercentage(exam) < this.idealProfitPercentage / 100
        );
      });
    },
    async getClinicExams(clinic) {
      let exams = await this.$store.dispatch("getClinicExams", clinic);
      clinic.exams = exams;
    },
    async beginAnalises() {
      this.loading = true;
      for (let clinic in this.clinics) {
        await this.getClinicExams(this.clinics[clinic]);
      }
      this.$store.commit("setExams", this.turnClinicsInExams());
      this.loading = false;
    },
    turnClinicsInExams() {
      let exams = {};
      for (let clinic of this.clinics) {
        for (let exam of clinic.exams) {
          if (!exams[exam.name]) {
            exams[exam.name] = {
              name: exam.name,
              clinics: [
                {
                  ...clinic,
                  cost: exam.cost,
                  price: exam.price
                }
              ]
            };
          } else {
            exams[exam.name].clinics.push({
              ...clinic,
              cost: exam.cost,
              price: exam.price
            });
          }
        }
      }
      return exams;
    },
    getIdealCost(exam) {
      return (exam.price / (1 + this.idealProfitPercentage / 100)).toFixed(2);
    },
    getIdealPrice(exam) {
      return (
        exam.cost +
        (this.idealProfitPercentage / 100) * exam.cost
      ).toFixed(2);
    },
    getProfitPercentage(exam) {
      return (exam.price - exam.cost) / exam.cost;
    }
  }
};
</script>

<style scoped>
</style>
