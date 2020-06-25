
import { Doughnut, mixins } from "vue-chartjs";
import 'chartjs-plugin-colorschemes';
const { reactiveProp } = mixins;

export default {
  extends: Doughnut,
  mixins: [reactiveProp],
  mounted() {
    this.renderChart(this.chartData, {
      legend: {

        position: "right"
      },
      plugins: {
        colorschemes: {
          scheme: 'brewer.SetOne9'
        }
      },
      responsive: true, maintainAspectRatio: false
    });
  },

};
