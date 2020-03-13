
import { Doughnut, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Doughnut,
  mixins: [reactiveProp],
  mounted() {
    this.renderChart(this.chartData, {
      legend: {
        display: true,
        text: 'Outtakes',
        position: "right"
      },
      responsive: true, maintainAspectRatio: false
    });
  },

};
