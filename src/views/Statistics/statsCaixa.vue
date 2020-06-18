<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <CCard>
          <CCardHeader>Doughnut Chart</CCardHeader>
          <CCardBody>
            <CChartLine
    :datasets="defaultDatasets"
    labels="months"
  />
          </CCardBody>
        </CCard>
      </v-col>
      <v-col cols="6">
        <CCard>
          <CCardHeader>Doughnut Chart</CCardHeader>
          <CCardBody>
            <CChartBar :datasets="defaultDatasets" labels="months" />
          </CCardBody>
        </CCard>
      </v-col>
      <v-col cols="6">
        <CCard>
          <CCardHeader>Doughnut Chart</CCardHeader>
          <CCardBody>
            <CChartBar :datasets="defaultDatasets" labels="months" />
          </CCardBody>
        </CCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      currentAlertCounter: 10
    };
  },
  computed: {
    defaultDatasets () {
      return [
        {
          label: 'Data One',
          backgroundColor: 'rgb(228,102,81,0.9)',
          data: [30, 39, 10, 50, 30, 70, 35]
        },
        {
          label: 'Data Two',
          backgroundColor: 'rgb(0,216,255,0.9)',
          data: [39, 80, 40, 35, 40, 20, 45]
        }
      ]
    }
  }
};
</script>

<style scoped src="bootstrap/dist/css/bootstrap.min.css"></style>