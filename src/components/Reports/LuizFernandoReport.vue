<template>
  <v-container>
    <v-layout row wrap v-if="report">
      <v-flex xs12>
        <v-chip-group
          row
          mandatory
          v-bind:value="reportSelected"
          @change="(event)=>$emit('change-reportSelected',event)"
          active-class="primary--text"
        >
          <v-chip v-for="report in reportOptions" :key="report">{{ report }}</v-chip>
        </v-chip-group>
      </v-flex>
      <v-flex xs12 v-if="reportSelected === 0">
        <v-card class="pa-4 receipt-to-print">
          <v-layout row wrap>
            <v-flex xs6 class="text-left">
              <img :src="report.unit.logo" height="64px" />
            </v-flex>
            <v-flex xs6 class="text-right">
              <v-layout column wrap>
                <span class="my-sub-headline mb-4">Relatório Geral</span>
                <span>{{report.dataInicio | dateFilter}} até {{report.dataFinal | dateFilter}}</span>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap class="mt-2">
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs2>Procedimento</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>Quantidade</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>Custo</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>Venda</v-flex>
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

            <v-flex xs12 v-for="(spec, label) in Procedures" :key="label" class="my-1">
              <v-layout row wrap>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs2>{{label}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{spec.quantity}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{spec.cost | moneyFilter}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{spec.price | moneyFilter}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>
                  <span
                    v-if="spec.price > 0"
                  >{{((spec.price - spec.cost) / spec.price) * 100 | moneyFilter}}%</span>
                  <span v-else>0%</span>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12 v-for="(clinics, label) in report.clinics" :key="label" class="my-1">
              <v-layout row wrap v-if="clinics.property !== true">
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs2>
                  <span>{{label}}</span>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{clinics.quantidade}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{clinics.cost | moneyFilter}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{clinics.price | moneyFilter}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>
                  <span
                    v-if="clinics.price > 0"
                  >{{((clinics.price - clinics.cost) / clinics.price) * 100 | moneyFilter}}%</span>
                  <span v-else>0%</span>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap class="mt-2">
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs2 class="font-weight-bold">Total</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1 class="font-weight-bold">{{QuantityTotalFinish}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1 class="font-weight-bold">{{CostTotalFinish | moneyFilter}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1 class="font-weight-bold">{{PriceTotalFinish | moneyFilter}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1 class="font-weight-bold">
                  <span
                    v-if="PriceTotalFinish > 0"
                  >{{((PriceTotalFinish - CostTotalFinish) / PriceTotalFinish) * 100 | moneyFilter}}%</span>
                  <span v-else>0%</span>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <span class="my-headline">Gastos</span>
            </v-flex>
            <v-flex xs12 v-for="(outtake,i) in report.outtakes" :key="i" class="my-1">
              <v-layout row wrap>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs2>{{outtake.category}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{outtake.quantidade}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs2>{{outtake.value | moneyFilter}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs2></v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs12 class="mt-4" v-if="reportSelected === 1">
                  <v-layout row wrap>
                    <v-flex xs12>
                      <span>- {{outtake.description}}</span>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap class="mt-2">
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs2 class="font-weight-bold">Total</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1 class="font-weight-bold">{{report.quantidadeOuttakes}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex
                  xs2
                  class="font-weight-bold"
                >{{totalOuttakesInMoney + totalOuttakesNotMoney | moneyFilter}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs2></v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs12 class="mt-2">
              <v-layout row wrap v-if="report.financialSupportIntakes.length > 0">
                <v-flex xs12>
                  <span class="my-headline">Aportes Financeiros</span>
                </v-flex>
                <v-flex
                  xs12
                  v-for="intake in report.financialSupportIntakes"
                  :key="intake.date"
                  class="my-1"
                >
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-divider></v-divider>
                    </v-flex>
                    <v-flex xs1>
                      <v-divider vertical></v-divider>
                    </v-flex>
                    <v-flex xs2 class="font-weight-bold">{{intake.category}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical></v-divider>
                    </v-flex>
                    <v-flex xs1></v-flex>
                    <v-flex xs1>
                      <v-divider vertical></v-divider>
                    </v-flex>
                    <v-flex xs2>{{intake.value | moneyFilter}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical></v-divider>
                    </v-flex>
                    <v-flex xs2></v-flex>
                    <v-flex xs1>
                      <v-divider vertical></v-divider>
                    </v-flex>
                    <v-flex xs12 class="mt-4" v-if="reportSelected === 1">
                      <v-layout row wrap>
                        <v-flex xs12>
                          <span>{{intake.description}}</span>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12>
                      <v-divider></v-divider>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs12>
              <span class="my-headline">Relatório</span>
            </v-flex>

            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs12 class="my-1">
                  <v-layout row wrap class="justify-center">
                    <v-flex xs3 class="border">Total Bruto</v-flex>
                    <v-flex xs3 class="border">Custos</v-flex>
                    <v-flex xs2 class="border">Saldo Final</v-flex>
                  </v-layout>
                </v-flex>

                <v-flex xs12 class="my-1">
                  <v-layout row wrap class="justify-center">
                    <v-flex xs3 class="border">{{ this.PriceTotalFinish | moneyFilter}}</v-flex>
                    <v-flex xs3 class="border">
                      {{totalCost | moneyFilter}} ({{(totalCost / this.totalProfit *
                      100).toFixed(2)}}%)
                    </v-flex>
                    <v-flex xs2 class="border">
                      {{finalProfit | moneyFilter}} ({{(finalProfit / this.totalProfit *
                      100).toFixed(2)}}%)
                    </v-flex>
                  </v-layout>
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
    "reportAllUnits",
    "now",
    "total",
    "reportOptions",
    "reportSelected",
    "finalProfit",
    "totalProfit",
    "totalCost",
    "totalFinancialSupport",
    "proceduresQuantity",
    "examsQuantity",
    "totalExamsIntakes",
    "totalCostExamsIntakes",
    "totalSpecialtiesIntakes",
    "totalOuttakesInMoney",
    "totalOuttakesNotMoney",
    "totalRawIntake",
    "totalCredit",
    "totalTaxaCredit",
    "totalDebit",
    "totalTaxaDebit",
    "totalMoney",
    "Procedures",
    "QuantityTotalFinish",
    "CostTotalFinish",
    "PriceTotalFinish"
  ]
};
</script>

<style scoped>
.border {
  border: 1px solid grey;
}
</style>
