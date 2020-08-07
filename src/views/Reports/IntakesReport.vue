<template>
  <v-container>
    <IntakesReport
      v-if="report"
      :report="report"
      :loading="loading"
      :now="now"
      :total="total"
      :colaborator="colaborator"
      :proceduresQuantity="proceduresQuantity"
      :examsQuantity="examsQuantity"
    />
  </v-container>
</template>

<script>
import IntakesReport from "@/components/Reports/IntakesReport";
import moment from "moment";
export default {
  //   name: "IntakesReport",
  props: ["report", "loading"],
  components: { IntakesReport },
  data() {
    return {
      now: moment().format("YYYY-MM-DD HH:mm:ss"),
      total: 0,
      colaborator: null
    };
  },

  mounted() {
    this.initialInfo();
  },
  methods: {
    async initialInfo() {
      await this.$store.dispatch("getColaborators");
    }
  },
  computed: {
    proceduresQuantity() {
      let procQt = 0;
      for (let specialty in this.report.specialties) {
        procQt += this.report.specialties[specialty].quantidade;
      }
      return procQt;
    },
    examsQuantity() {
      let quantidade = 0;
      for (let exam in this.report.exams) {
        quantidade += this.report.exams[exam].quantidade;
      }

      return quantidade;
    },
    colaborators() {
      return this.$store.getters.colaborators;
    },
    intakesReport() {
      return this.$store.getters.intakesReport;
    }
  }
};
</script>

<style scoped>
</style>
