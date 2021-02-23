

import CoreuiVueCharts from '@coreui/vue-chartjs'

import { CSwitch, CButton, CAlert, CBadge } from '@coreui/vue';
import { CChartBar } from '@coreui/vue-chartjs'



export default {
  install(Vue) {
    Vue.use(CoreuiVueCharts)
    Vue.component('CButton', CButton)
    Vue.component('CSwitch', CSwitch)
    Vue.component('CAlert', CAlert)
    Vue.component('CBadge', CBadge)
    Vue.component('CChartBar', CChartBar)
  }
};