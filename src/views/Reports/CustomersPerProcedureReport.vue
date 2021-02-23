<template>
  <v-container>
    <CustomersPerProcedureReport
      :report="report"
      :loading="loading"
      :now="now"
      :reportProcedure="reportProcedure"
      :ReportTrue="ReportTrue"
      :ReportCustomersProcedure="ReportCustomersProcedure"
    />
  </v-container>
</template>

<script>
import CustomersPerProcedureReport from "@/components/Reports/CustomersPerProcedureReport";
import moment from "moment";
import axios from "axios";
export default {
  name: "CustomersPerProcedureReport",
  components: {
    CustomersPerProcedureReport
  },
  props: ["report", "loading"],
  data() {
    return {
      now: moment().format("YYYY-MM-DD HH:mm:ss"),
      reportProcedure: {},
      ReportTrue: false
    };
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    ReportCustomersProcedure() {
      // eslint-disable-next-line vue/no-async-in-computed-properties
      axios.get(
          "https://us-central1-prosaude-36f66.cloudfunctions.net/getConsultationsAndIntakesByDayPeriodAndWeekDays?start_date=2020-04-13%2000:00:00/json/"
        )
        .then(response => {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.reportProcedure = response.data;
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.ReportTrue = !this.ReportTrue;
          return;
        });
    }
  }
};
</script>

<style scoped>
</style>
