<template>
  <v-container>
    <v-layout row wrap v-if="report">
      <v-flex xs12>
        <v-card class="pa-4 receipt-to-print">
          <v-layout row wrap>
            <v-flex xs6 class="text-left">
              <span class="my-sub-headline">Relatório Vendas</span>
            </v-flex>
            <v-flex xs6 class="text-right">
              <span
                class="font-italic font-weight-bold"
              >{{report.dataInicio | dateFilter}} até {{report.dataFinal | dateFilter}}</span>
            </v-flex>
            <v-flex
              xs12
              v-for="(intake, label) in report.intakes"
              :key="'intake' + label"
              class="my-1"
            >
              <v-flex xs12>
                <v-layout row wrap class="mt-2">
                  <v-flex xs12>
                    <v-divider />
                  </v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs5 class="font-weight-black">Código</v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs1 class="font-weight-black">Custo</v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs2 class="font-weight-black">Venda</v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs12>
                    <v-divider />
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-divider />
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical />
                </v-flex>
                <v-flex xs5>{{label}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical />
                </v-flex>
                <v-flex xs1>{{intake.cost | moneyFilter}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical />
                </v-flex>
                <v-flex xs2>{{intake.price | moneyFilter}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical />
                </v-flex>
                <v-flex xs12>
                  <v-divider />
                </v-flex>
              </v-layout>
              <v-flex xs12 v-if="intake.exams && intake.exams.length > 0">
                <v-layout row wrap class="mt-2">
                  <v-flex xs12>
                    <v-divider />
                  </v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs2 class="font-weight-bold">Exames</v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs2 class="font-weight-bold">Clinica</v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs1 class="font-weight-bold">Custo</v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs2 class="font-weight-bold">Venda</v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs12>
                    <v-divider />
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex
                xs12
                v-for="(examees, labels) in intake.exams"
                :key="'exams' + labels"
                class="my-1"
              >
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-divider />
                  </v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs2>{{examees.name}}</v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs2>{{examees.clinic.name}}</v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs1>{{examees.cost | moneyFilter}}</v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs2>{{examees.price | moneyFilter}}</v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs12>
                    <v-divider />
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12 v-if="intake.specialties && intake.specialties.length > 0">
                <v-layout row wrap class="mt-2">
                  <v-flex xs12>
                    <v-divider />
                  </v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs5 class="font-weight-bold">Especialidade</v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs1 class="font-weight-bold">Custo</v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs2 class="font-weight-bold">Venda</v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs12>
                    <v-divider />
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex
                xs12
                v-for="(specialtie, labels) in intake.specialties"
                :key="'specs'+labels"
                class="my-1"
              >
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-divider />
                  </v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs5>{{specialtie.name}}</v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs1>{{specialtie.cost | moneyFilter}}</v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs2>{{specialtie.price | moneyFilter}}</v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs12>
                    <v-divider />
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12 v-for="i in 3" :key="i">
                <v-divider color="black" />
              </v-flex>
            </v-flex>
            <v-flex xs12>
              <span class="my-headline">Relatório</span>
            </v-flex>

            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs12 class="my-1">
                  <v-layout row wrap class="mt-2">
                    <v-flex xs12>
                      <v-divider />
                    </v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs3 class="font-weight-bold">Total Crédito</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs3 class="font-weight-bold">Total Débito</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs2 class="font-weight-bold">Total Caixa</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs12>
                      <v-divider />
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12 class="my-1">
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-divider />
                    </v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs3>{{report.credito ? report.credito : 'X' | moneyFilter}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs3>{{report.debito ? report.debito : 'X' | moneyFilter}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs2>{{report.dinheiro ? report.dinheiro : 'X' | moneyFilter}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs12>
                      <v-divider />
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12 class="my-1">
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-divider />
                    </v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs3 class="font-weight-bold">Taxa Crédito</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs3 class="font-weight-bold">Taxa Débito</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs2 class="font-weight-bold">Total Bruto - Taxas</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs12>
                      <v-divider />
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12 class="my-1">
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-divider />
                    </v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex
                      xs3
                    >{{report.totalTaxaCredito ? parseFloat(report.totalTaxaCredito):'X' | moneyFilter}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex
                      xs3
                    >{{report.totalTaxaDebito ? parseFloat(report.totalTaxaDebito) :'X'| moneyFilter}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs2>
                      {{ (report.totalBruto && report.totalTaxaDebito && report.totalTaxaCredito) ?
                      (((report.totalBruto)- parseFloat(report.totalTaxaDebito)) - parseFloat(report.totalTaxaCredito) ):'X'| moneyFilter}}
                    </v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs12>
                      <v-divider />
                    </v-flex>
                  </v-layout>
                </v-flex>

                <v-flex xs12 class="my-1">
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-divider />
                    </v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs3 class="font-weight-bold">Total Bruto</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs3 class="font-weight-bold">Total Liquido</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs2 class="font-weight-bold">Saldo Final</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs12>
                      <v-divider />
                    </v-flex>
                  </v-layout>
                </v-flex>

                <v-flex xs12 class="my-1">
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-divider />
                    </v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs3>{{report.totalBruto ? this.report.totalBruto:'X' | moneyFilter}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs3>
                      {{(report.totalBruto && report.totalCusto && report.totalTaxaDebito && report.totalTaxaCredito)? (this.report.totalBruto -
                      this.report.totalCusto - parseFloat(report.totalTaxaDebito) - parseFloat(report.totalTaxaCredito)).toFixed(2):'X'}}
                    </v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex
                      xs2
                    >{{(report.totalBruto && report.totalCusto && report.totalTaxaDebito && report.totalTaxaCredito)?
                    (this.report.totalBruto - this.report.totalCusto - parseFloat(report.totalTaxaDebito) - parseFloat(report.totalTaxaCredito)).toFixed(2):'X'}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs12>
                      <v-divider />
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
    "now",
    "total",
    "colaborator",
    "proceduresQuantity",
    "examsQuantity"
  ]
};
</script>

<style scoped>
</style>
