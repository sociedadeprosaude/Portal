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
              >{{dateStart | dateFilter}} até {{dateEnd | dateFilter}}</span>
            </v-flex>
            <v-flex
              xs12
              v-for="(intake, label) in report"
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
                <!-- <v-flex xs1>{{intake.cost | moneyFilter}}</v-flex> -->
                <v-flex xs1>{{report[label].cost | moneyFilter}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical />
                </v-flex>
                <v-flex xs2>{{intake.value | moneyFilter}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical />
                </v-flex>
                <v-flex xs12>
                  <v-divider />
                </v-flex>
              </v-layout>
              <v-flex xs12 v-if="intake.produts && intake.produts.length > 0">
                <v-layout row wrap class="mt-2">
                  <v-flex xs12>
                    <v-divider />
                  </v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs2 class="font-weight-bold">Produto</v-flex>
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
                v-for="(product, labels) in intake.produts"
                :key="'products' + labels"
                class="my-1"
              >
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-divider />
                  </v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs2>{{product.with_product ? product.with_product.name : 'error'}}</v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs2>{{product.with_clinic ? product.with_clinic.name : 'error' }}</v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs1 v-if="!product.with_product">:) 1</v-flex>
                  <v-flex xs1 v-else-if="product.with_product.type === 'EXAM'">
                    <ApolloQuery v-if="product.with_product && product.with_clinic && product.with_product.type === 'EXAM' "
                                 :query="require('@/graphql/clinics/LoadCostProductClinic.gql')"
                                 :variables="{idClinic: product.with_clinic.id, idProduct: product.with_product.id}"
                    >
                      <template v-slot="{result: {data, loading, error}}">
                        <v-flex v-if="data">{{SetCost(label,labels,data.CostProductClinic[0].cost) | moneyFilter}}</v-flex>
                        <v-flex v-if="error">error</v-flex>
                      </template>
                    </ApolloQuery>
                    <v-flex v-else> :) 2</v-flex>
                  </v-flex>
                  <v-flex xs1 v-else-if="product.with_product.type !== 'EXAM' && product.with_consultation">
                    <ApolloQuery v-if="product.with_consultation.attended_by "
                                 :query="require('@/graphql/doctors/LoadCostProductDoctor.gql')"
                                 :variables="{idDoctor: product.with_consultation.attended_by.id, idProduct: product.with_product.id}"
                    >
                      <template v-slot="{result: {data, loading, error}}">
                        <v-flex v-if="data">{{SetCost(label,labels,data.CostProductDoctor[0].cost) | moneyFilter}}</v-flex>
                        <v-flex v-if="error">error</v-flex>
                      </template>
                    </ApolloQuery>
                    <v-flex xs1 v-else> R$ 0,00</v-flex>
                  </v-flex>
                  <v-flex xs1  v-else-if="product.with_product.type !== 'EXAM' && !product.with_consultation">
                    R$ 0,00
                  </v-flex>
                  <v-flex v-else>:) 3</v-flex>
                  <v-flex xs1>
                    <v-divider vertical />
                  </v-flex>
                  <v-flex xs2>{{product.price | moneyFilter}}</v-flex>
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
                    <v-flex xs3>{{payments.credito ? payments.credito : 'X' | moneyFilter}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs3>{{payments.debito ? payments.debito : 'X' | moneyFilter}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs2>{{payments.dinheiro ? payments.dinheiro : 'X' | moneyFilter}}</v-flex>
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
                    <v-flex xs3 class="font-weight-bold">Total Custos</v-flex>
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
                    <v-flex xs3>{{payments.credito + payments.debito + payments.dinheiro}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs3>{{CostTotal()| moneyFilter}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs2>{{parseFloat(payments.credito + payments.debito + payments.dinheiro) - parseFloat(CostTotal()) | moneyFilter}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical />
                    </v-flex>
                    <v-flex xs12>
                      <v-divider />
                    </v-flex>
                  </v-layout>
                </v-flex>

                <!-- <v-flex xs12 class="my-1">
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
                </v-flex> -->
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
      "dateStart",
      "dateEnd",
      "payments"
  ],
  methods:{
    loadCost(intake){
      let cost = 0
      for(let product in intake.products){
        cost += intake.products[product].cost
      }
      return cost
    },
    SetCost(intake,product,cost){
      if(!this.report[intake].cost){
        this.report[intake].cost =0
      }
      this.report[intake].cost += cost
      return cost
    },
    CostTotal(){
      let cost=0
      for(let i in this.report){
        cost +=  this.report[i].cost ? this.report[i].cost : 0
      }
      return parseFloat(cost)
    }
  }
};
</script>

<style scoped>
</style>
