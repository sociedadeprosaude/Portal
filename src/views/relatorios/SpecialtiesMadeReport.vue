 <template>
  <v-container>
    <SpecialtiesMadeReport
      :report="report"
      :loading="loading"
      :now="now"
      :total="total"
      :reportOptions="reportOptions"
      :reportSelected="reportSelected"
      :QuantityTotal="QuantityTotal"
      :CostTotal="CostTotal"
    />
  </v-container>
</template>

<script>
import SpecialtiesMadeReport from "@/components/Reports2/SpecialtiesMadeReport";
import moment from "moment";

export default {
  // name: "SpecialtiesMadeReport",
  props: ["report", "loading"],
  components: { SpecialtiesMadeReport },
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
    }
  }
};
</script>

<style scoped>
.border {
  border: 1px solid grey;
}
</style>
