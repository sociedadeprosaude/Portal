<template>
  <v-container>
    <v-layout row wrap v-if="report">
      <v-flex xs12>
        <v-chip-group row mandatory v-model="reportSelected" active-class="primary--text">
          <v-chip v-for="report in reportOptions" :key="report">{{ report }}</v-chip>
        </v-chip-group>
      </v-flex>
      <v-flex xs12>
        <v-card class="pa-4 receipt-to-print">
          <v-layout row wrap>
            <v-flex xs6 class="text-left">
              <img :src="report.unit.logo" height="64px" />
            </v-flex>
            <v-flex xs6 class="text-right">
              <v-layout column wrap>
                <span class="my-sub-headline mb-4">Relatório Consulta Marcada x Consulta Realizada</span>
                <span>{{report.dataInicio | dateFilter}} até {{report.dataFinal | dateFilter}}</span>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <span class="my-headline">Consultas</span>
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap class="mt-2">
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs4>Consulta</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>Quantidade Marcada</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>Quantidade Realizada</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>%</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex
              xs12
              v-for="(consultation, label) in report.consultations"
              :key="label"
              class="my-1"
            >
              <v-layout row wrap>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs4>
                  <span class="font-weight-bold">{{consultation.name}}</span>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{consultation.scheduled}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{consultation.executed}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{((consultation.executed/consultation.scheduled)*100).toFixed(2)}}%</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-divider vertical></v-divider>
            <v-divider></v-divider>
            <v-flex xs12>
              <span class="my-headline">Total</span>
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap class="mt-2">
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs4>
                  <span class="font-weight-bold">TOTAL</span>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>Quantidade Marcada Total</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>Quantidade Realizada Total</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>%</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs12 class="my-1">
              <v-layout row wrap>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs4>--</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{QuantityTotalScheduled}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{QuantityTotalExecuted}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{PercentageTotal.toFixed(2)}}%</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from "moment";

export default {
  props: [
    "report",
    "loading",
    "now",
    "total",
    "reportOptions",
    "reportSelected",
    "QuantityTotal",
    "CostTotal",
    "PercentageTotal",
    "QuantityTotalExecuted",
    "QuantityTotalScheduled"
  ]
};
</script>

<style scoped>
.border {
  border: 1px solid grey;
}
</style>
