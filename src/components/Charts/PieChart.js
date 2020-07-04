
import { Pie, mixins } from "vue-chartjs";
import 'chartjs-plugin-colorschemes';

// import ChartDataLabels from 'chartjs-plugin-datalabels';
// Chart.plugins.unregister(ChartDataLabels);
const { reactiveProp } = mixins;

export default {
  extends: Pie,
  mixins: [reactiveProp],
  props: ['chartData', 'options'],
  watch: {
    'options': {
      handler(newOption, oldOption) {
        this.$data._chart.destroy();
        this.renderChart(this.chartData, {
          plugins: {
            colorschemes: {
              scheme: 'brewer.SetOne9'
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          ...this.options
        })
      },
      deep: true
    }
  },
  mounted() {
    //this.addPlugin(ChartDataLabels);
 
    this.renderChart(this.chartData, {
      plugins: {
        colorschemes: {
          scheme: 'brewer.SetOne9'
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      ...this.options
    });
  },

};
