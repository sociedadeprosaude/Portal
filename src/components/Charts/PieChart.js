
import { Pie, mixins } from "vue-chartjs";
import 'chartjs-plugin-colorschemes';

// import ChartDataLabels from 'chartjs-plugin-datalabels';
// Chart.plugins.unregister(ChartDataLabels);
const { reactiveProp } = mixins;

export default {
  extends: Pie,
  mixins: [reactiveProp],
  mounted() {
    //this.addPlugin(ChartDataLabels);
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
