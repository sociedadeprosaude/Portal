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
      <v-flex xs12 v-if="reportSelected === 0 || reportSelected === 1">
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

            <v-flex xs12>
              <span class="my-headline">Consultas</span>
            </v-flex>
            <v-flex xs12 v-for="(spec, label) in report.specialties" :key="label" class="my-1">
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
            <v-flex xs12>
              <v-layout row wrap class="mt-2">
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs2>Total</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{proceduresQuantity}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{totalCostSpecialtiesIntakes | moneyFilter}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{totalSpecialtiesIntakes | moneyFilter}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>
                  <span
                    v-if="totalSpecialtiesIntakes > 0"
                  >{{((totalSpecialtiesIntakes - totalCostSpecialtiesIntakes) / totalSpecialtiesIntakes) * 100 | moneyFilter}}%</span>
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
              <span class="my-headline">Clínicas</span>
            </v-flex>
            <v-flex xs12 v-for="(clinics, label) in report.clinics" :key="label" class="my-1">
              <v-layout row wrap>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs2>
                  <span class="font-weight-bold">{{label}}</span>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{clinics.quantity}}</v-flex>
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
                <v-flex xs12 class="mt-4" v-if="reportSelected === 1">
                  <v-layout row wrap v-for="(exam, name) in clinics.exams" :key="name">
                    <v-flex xs1>
                      <v-divider vertical></v-divider>
                    </v-flex>
                    <v-flex xs2>- {{name}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical></v-divider>
                    </v-flex>
                    <v-flex xs1>{{exam.quantity}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical></v-divider>
                    </v-flex>
                    <v-flex xs1>{{exam.cost | moneyFilter}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical></v-divider>
                    </v-flex>
                    <v-flex xs1>{{exam.price | moneyFilter}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical></v-divider>
                    </v-flex>
                    <v-flex xs1>
                      <span
                        v-if="exam.price  > 0"
                      >{{((exam.price - exam.cost) / exam.price ) * 100 | moneyFilter}}%</span>
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
                <v-flex xs2>Total</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{examsQuantity}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{totalCostExamsIntakes | moneyFilter}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{totalExamsIntakes | moneyFilter}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>
                  <span
                    v-if="totalExamsIntakes > 0"
                  > {{((totalExamsIntakes - totalCostExamsIntakes) / totalExamsIntakes) * 100 | moneyFilter}}%</span>
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
                <v-flex xs2 class="font-weight-bold">{{outtake.category}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{outtake.quantity}}</v-flex>
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
                <v-flex xs2>Total</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{report.quantityOuttakes}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs2>{{totalOuttakesInMoney + totalOuttakesNotMoney | moneyFilter}}</v-flex>
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
                    <v-flex xs1>
                      <!--                                            {{outtake.quantity}}-->
                    </v-flex>
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
                <v-flex xs12 class="my-2">
                  <v-layout row wrap>
                    <v-flex xs1>
                      <v-layout row wrap class="fill-height align-center justify-center">
                        <span></span>
                      </v-layout>
                    </v-flex>
                    <v-flex xs11>
                      <v-layout row wrap>
                        <v-flex xs12>
                          <v-layout row wrap>
                            <v-flex xs2></v-flex>
                            <v-flex xs3 class="border">Crédito</v-flex>
                            <v-flex xs3 class="border">Débito</v-flex>
                            <v-flex xs3 class="border">Dinheiro</v-flex>
                            <v-flex xs1 class="border">
                              <span>%</span>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12 class="my-2">
                  <v-layout row wrap>
                    <v-flex xs1 class="border">
                      <v-layout row wrap class="fill-height align-center justify-center">
                        <span>Entradas</span>
                      </v-layout>
                    </v-flex>
                    <v-flex xs11>
                      <v-layout row wrap>
                        <v-flex xs12>
                          <v-layout row wrap>
                            <v-flex xs2 class="border">Saldo Bruto</v-flex>
                            <v-flex xs3 class="border">{{totalCredit | moneyFilter}}</v-flex>
                            <v-flex xs3 class="border">{{totalDebit | moneyFilter}}</v-flex>
                            <v-flex xs3 class="border">
                              {{totalMoney +
                              totalFinancialSupport | moneyFilter}}
                            </v-flex>
                            <v-flex xs1></v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex xs12>
                          <v-layout row wrap>
                            <v-flex xs2 class="border">Total</v-flex>
                            <v-flex xs3 class="border">
                              {{totalCredit | moneyFilter}}
                              ({{(totalRawIntake != 0)? (totalCredit/totalRawIntake * 100).toFixed(2): 0}}%)
                            </v-flex>
                            <v-flex xs3 class="border">
                              {{totalDebit | moneyFilter}}
                              ({{(totalRawIntake != 0)? (totalDebit/totalRawIntake * 100).toFixed(2):0}}%)
                            </v-flex>
                            <v-flex xs3 class="border">
                              {{totalMoney +
                              totalFinancialSupport | moneyFilter}}
                              ({{(totalRawIntake != 0)? (totalMoney/totalRawIntake * 100).toFixed(2):0}}%)
                            </v-flex>
                            <v-flex xs1></v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12 class="my-2">
                  <v-layout row wrap>
                    <v-flex xs1 class="border">
                      <v-layout class="align-center fill-height justify-center">
                        <span>Saídas</span>
                      </v-layout>
                    </v-flex>
                    <v-flex xs11>
                      <v-layout row wrap>
                        <v-flex xs12>
                          <v-layout row wrap>
                            <v-flex xs2 class="border">Custo Médicos</v-flex>
                            <v-flex xs3 class="border">{{0 | moneyFilter}}</v-flex>
                            <v-flex xs3 class="border">{{0 | moneyFilter}}</v-flex>
                            <v-flex xs3 class="border">
                              {{totalCostSpecialtiesIntakes |
                              moneyFilter}}
                            </v-flex>
                            <v-flex xs1 class="border">
                              {{(totalProfit != 0 )?(totalCostSpecialtiesIntakes/this.totalProfit *
                              100).toFixed(2):0}}%
                            </v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex xs12>
                          <v-layout row wrap>
                            <v-flex xs2 class="border">Custo Clínicas</v-flex>
                            <v-flex xs3 class="border">{{0 | moneyFilter}}</v-flex>
                            <v-flex xs3 class="border">{{0 | moneyFilter}}</v-flex>
                            <v-flex xs3 class="border">
                              {{totalCostExamsIntakes |
                              moneyFilter}}
                            </v-flex>
                            <v-flex xs1 class="border">
                              {{(totalProfit != 0) ? (totalCostExamsIntakes/this.totalProfit *
                              100).toFixed(2):0}}%
                            </v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex xs12>
                          <v-layout row wrap>
                            <v-flex xs2 class="border">Gastos Op. (dia-a-dia)</v-flex>
                            <v-flex xs3 class="border">{{0 | moneyFilter}}</v-flex>
                            <v-flex xs3 class="border">
                              {{this.totalOuttakesNotMoney |
                              moneyFilter}}
                            </v-flex>
                            <v-flex xs3 class="border">
                              {{this.totalOuttakesInMoney |
                              moneyFilter}}
                            </v-flex>
                            <v-flex xs1 class="border">
                              {{(totalProfit != 0) ?((totalOuttakesInMoney + totalOuttakesNotMoney)/this.totalProfit *
                              100).toFixed(2):0}}%
                            </v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex xs12>
                          <v-layout row wrap>
                            <v-flex xs2 class="border">Taxas do cartão</v-flex>
                            <v-flex xs3 class="border">
                              {{parseFloat(totalTaxaCredit)
                              | moneyFilter}}
                            </v-flex>
                            <v-flex xs3 class="border">
                              {{parseFloat(totalTaxaDebit)
                              | moneyFilter}}
                            </v-flex>
                            <v-flex xs3 class="border">{{0 | moneyFilter}}</v-flex>
                            <v-flex xs1 class="border">
                              {{(totalProfit != 0) ?((parseFloat(totalTaxaCredit) +
                              parseFloat(totalTaxaDebit))/this.totalProfit *
                              100).toFixed(2):0}}%
                            </v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex xs12>
                          <v-layout row wrap>
                            <v-flex xs2 class="border">Total</v-flex>
                            <v-flex xs3 class="border">
                              {{parseFloat(totalTaxaCredit)
                              | moneyFilter}}
                            </v-flex>
                            <v-flex xs3 class="border">
                              {{ totalOuttakesNotMoney |
                              moneyFilter}}
                            </v-flex>
                            <v-flex xs3 class="border">
                              {{totalCostSpecialtiesIntakes +
                              totalCostExamsIntakes + totalOuttakesInMoney |
                              moneyFilter}}
                            </v-flex>
                            <v-flex xs1 class="border">
                              {{(totalProfit != 0) ?((parseFloat(totalTaxaCredit) +
                              parseFloat(totalTaxaDebit) +
                              totalCostSpecialtiesIntakes +
                              totalCostExamsIntakes +
                              totalOuttakesInMoney + totalOuttakesNotMoney)/this.totalProfit *
                              100).toFixed(2):0}}%
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12 class="my-2">
                  <v-layout row wrap>
                    <v-flex xs1 class="border">
                      <v-layout row wrap class="fill-height align-center justify-center">
                        <span>Total</span>
                      </v-layout>
                    </v-flex>
                    <v-flex xs11>
                      <v-layout row wrap>
                        <v-flex xs12>
                          <v-layout row wrap>
                            <v-flex xs2 class="border">
                              <v-layout row wrap class="align-center justify-center fill-height">
                                <v-divider class="black mx-4"></v-divider>
                              </v-layout>
                            </v-flex>
                            <v-flex xs3 class="border">
                              {{totalCredit -
                              parseFloat(totalTaxaCredit) | moneyFilter}}
                            </v-flex>
                            <v-flex xs3 class="border">
                              {{totalDebit -
                              parseFloat(totalTaxaDebit) - totalOuttakesNotMoney |
                              moneyFilter}}
                            </v-flex>
                            <v-flex xs3 class="border">
                              {{totalMoney +
                              totalFinancialSupport - totalCostSpecialtiesIntakes -
                              totalCostExamsIntakes - totalOuttakesInMoney |
                              moneyFilter}}
                            </v-flex>
                            <v-flex xs1 class="border">
                              {{(totalProfit != 0) ?((totalCredit -
                              parseFloat(totalTaxaCredit) + totalDebit -
                              parseFloat(totalTaxaDebit) + totalMoney +
                              totalFinancialSupport - totalCostSpecialtiesIntakes -
                              totalCostExamsIntakes -
                              totalOuttakesInMoney)/this.totalProfit *
                              100).toFixed(2):0}}%
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>

                <v-flex xs12 class="my-1">
                  <v-layout row wrap class="justify-center">
                    <v-flex xs3 class="border">Total Bruto</v-flex>
                    <v-flex xs3 class="border">Custos</v-flex>
                    <v-flex xs2 class="border">Saldo Final</v-flex>
                  </v-layout>
                </v-flex>

                <v-flex xs12 class="my-1">
                  <v-layout row wrap class="justify-center">
                    <v-flex xs3 class="border">{{ this.totalRawIntake | moneyFilter}}</v-flex>
                    <v-flex xs3 class="border">
                      {{totalCost | moneyFilter}} ({{(totalProfit != 0) ?(totalCost / this.totalProfit *
                      100).toFixed(2):0}}%)
                    </v-flex>
                    <v-flex xs2 class="border">
                      {{finalProfit | moneyFilter}} ({{(totalProfit != 0) ?(finalProfit / this.totalProfit *
                      100).toFixed(2):0}}%)
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex xs12 v-if="reportSelected === 2 || reportSelected === 3">
        <v-card class="pa-4 receipt-to-print">
          <v-layout row wrap>
            <v-flex xs6 class="text-right">
              <v-layout column wrap>
                <span class="my-sub-headline mb-4">Relatório Geral Todas Unidades</span>
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
                <v-flex xs1>quantity</v-flex>
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

            <v-flex xs12>
              <span class="my-headline">Consultas</span>
            </v-flex>
            <v-flex
              xs12
              v-for="(spec, label) in reportAllUnits.specialties"
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
            <v-flex xs12>
              <v-layout row wrap class="mt-2">
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs2>Total</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{proceduresQuantityAllClinics}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{totalCostSpecialtiesIntakesAllClinics | moneyFilter}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{totalSpecialtiesIntakesAllClinics | moneyFilter}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>
                  <span
                    v-if="totalSpecialtiesIntakesAllClinics > 0"
                  >{{((totalSpecialtiesIntakesAllClinics - totalCostSpecialtiesIntakesAllClinics) / totalSpecialtiesIntakesAllClinics) * 100 | moneyFilter}}%</span>
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
              <span class="my-headline">Clínicas</span>
            </v-flex>
            <v-flex
              xs12
              v-for="(clinics, label) in reportAllUnits.clinics"
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
                <v-flex xs2>
                  <span class="font-weight-bold">{{label}}</span>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{clinics.quantity}}</v-flex>
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
                <v-flex xs12 class="mt-4" v-if="reportSelected === 3">
                  <v-layout row wrap v-for="(exam, name) in clinics.exams" :key="name">
                    <v-flex xs1>
                      <v-divider vertical></v-divider>
                    </v-flex>
                    <v-flex xs2>- {{name}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical></v-divider>
                    </v-flex>
                    <v-flex xs1>{{exam.quantity}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical></v-divider>
                    </v-flex>
                    <v-flex xs1>{{exam.cost | moneyFilter}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical></v-divider>
                    </v-flex>
                    <v-flex xs1>{{exam.price | moneyFilter}}</v-flex>
                    <v-flex xs1>
                      <v-divider vertical></v-divider>
                    </v-flex>
                    <v-flex xs1>
                      <span
                        v-if="exam.price  > 0"
                      >{{((exam.price - exam.cost) / exam.price ) * 100 | moneyFilter}}%</span>
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
                <v-flex xs2>Total</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{examsQuantityAllClinics}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{totalCostExamsIntakesAllClinics | moneyFilter}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{totalExamsIntakesAllClinics | moneyFilter}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>
                  <span
                    v-if="totalExamsIntakesAllClinics > 0"
                  >{{((totalExamsIntakesAllClinics- totalCostExamsIntakesAllClinics) / totalExamsIntakesAllClinics) * 100 | moneyFilter}}%</span>
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
            <v-flex xs12 v-for="(outtake,i) in reportAllUnits.outtakes" :key="i" class="my-1">
              <v-layout row wrap>
                <v-flex xs12>
                  <v-divider></v-divider>
                </v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs2 class="font-weight-bold">{{outtake.category}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{outtake.quantity}}</v-flex>
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
                <v-flex xs12 class="mt-4" v-if="reportSelected === 3">
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
                <v-flex xs2>Total</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex xs1>{{report.quantityOuttakes}}</v-flex>
                <v-flex xs1>
                  <v-divider vertical></v-divider>
                </v-flex>
                <v-flex
                  xs2
                >{{totalOuttakesInMoneyAllClinics + totalOuttakesNotMoneyAllClinics | moneyFilter}}</v-flex>
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
              <v-layout row wrap v-if="reportAllUnits.financialSupportIntakes.length > 0">
                <v-flex xs12>
                  <span class="my-headline">Aportes Financeiros</span>
                </v-flex>
                <v-flex
                  xs12
                  v-for="intake in reportAllUnits.financialSupportIntakes"
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
                    <v-flex xs12 class="mt-4" v-if="reportSelected === 3">
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
                <v-flex xs12 class="my-2">
                  <v-layout row wrap>
                    <v-flex xs1>
                      <v-layout row wrap class="fill-height align-center justify-center">
                        <span></span>
                      </v-layout>
                    </v-flex>
                    <v-flex xs11>
                      <v-layout row wrap>
                        <v-flex xs12>
                          <v-layout row wrap>
                            <v-flex xs2></v-flex>
                            <v-flex xs3 class="border">Crédito</v-flex>
                            <v-flex xs3 class="border">Débito</v-flex>
                            <v-flex xs3 class="border">Dinheiro</v-flex>
                            <v-flex xs1 class="border">
                              <span>%</span>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12 class="my-2">
                  <v-layout row wrap>
                    <v-flex xs1 class="border">
                      <v-layout row wrap class="fill-height align-center justify-center">
                        <span>Entradas</span>
                      </v-layout>
                    </v-flex>
                    <v-flex xs11>
                      <v-layout row wrap>
                        <v-flex xs12>
                          <v-layout row wrap>
                            <v-flex xs2 class="border">Saldo Bruto</v-flex>
                            <v-flex xs3 class="border">{{totalCreditAllClinics | moneyFilter}}</v-flex>
                            <v-flex xs3 class="border">{{totalDebitAllClinics | moneyFilter}}</v-flex>
                            <v-flex xs3 class="border">
                              {{totalMoneyAllClinics +
                              totalFinancialSupportAllClinics | moneyFilter}}
                            </v-flex>
                            <v-flex xs1></v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex xs12>
                          <v-layout row wrap>
                            <v-flex xs2 class="border">Total</v-flex>
                            <v-flex xs3 class="border">
                              {{totalCreditAllClinics | moneyFilter}}
                              ({{(totalRawIntakeAllClinics != 0) ?(totalCreditAllClinics/totalRawIntakeAllClinics * 100).toFixed(2):0}}%)
                            </v-flex>
                            <v-flex xs3 class="border">
                              {{totalDebitAllClinics | moneyFilter}}
                              ({{(totalRawIntakeAllClinics != 0) ?(totalDebitAllClinics/totalRawIntakeAllClinics * 100).toFixed(2):0}}%)
                            </v-flex>
                            <v-flex xs3 class="border">
                              {{totalMoneyAllClinics +
                              totalFinancialSupportAllClinics | moneyFilter}}
                              ({{(totalRawIntakeAllClinics != 0) ?(totalMoneyAllClinics/totalRawIntakeAllClinics * 100).toFixed(2):0}}%)
                            </v-flex>
                            <v-flex xs1></v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12 class="my-2">
                  <v-layout row wrap>
                    <v-flex xs1 class="border">
                      <v-layout class="align-center fill-height justify-center">
                        <span>Saídas</span>
                      </v-layout>
                    </v-flex>
                    <v-flex xs11>
                      <v-layout row wrap>
                        <v-flex xs12>
                          <v-layout row wrap>
                            <v-flex xs2 class="border">Custo Médicos</v-flex>
                            <v-flex xs3 class="border">{{0 | moneyFilter}}</v-flex>
                            <v-flex xs3 class="border">{{0 | moneyFilter}}</v-flex>
                            <v-flex xs3 class="border">
                              {{totalCostSpecialtiesIntakesAllClinics |
                              moneyFilter}}
                            </v-flex>
                            <v-flex xs1 class="border">
                              {{(totalProfitAllClinics != 0) ?(totalCostSpecialtiesIntakesAllClinics/this.totalProfitAllClinics *
                              100).toFixed(2):0}}%
                            </v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex xs12>
                          <v-layout row wrap>
                            <v-flex xs2 class="border">Custo Clínicas</v-flex>
                            <v-flex xs3 class="border">{{0 | moneyFilter}}</v-flex>
                            <v-flex xs3 class="border">{{0 | moneyFilter}}</v-flex>
                            <v-flex xs3 class="border">
                              {{totalCostExamsIntakesAllClinics |
                              moneyFilter}}
                            </v-flex>
                            <v-flex xs1 class="border">
                              {{(totalProfitAllClinics != 0) ?(totalCostExamsIntakesAllClinics/this.totalProfitAllClinics *
                              100).toFixed(2):0}}%
                            </v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex xs12>
                          <v-layout row wrap>
                            <v-flex xs2 class="border">Gastos Op. (dia-a-dia)</v-flex>
                            <v-flex xs3 class="border">{{0 | moneyFilter}}</v-flex>
                            <v-flex xs3 class="border">
                              {{this.totalOuttakesNotMoneyAllClinics |
                              moneyFilter}}
                            </v-flex>
                            <v-flex xs3 class="border">
                              {{this.totalOuttakesInMoneyAllClinics |
                              moneyFilter}}
                            </v-flex>
                            <v-flex xs1 class="border">
                              {{(totalProfitAllClinics != 0) ?((totalOuttakesInMoneyAllClinics + totalOuttakesNotMoneyAllClinics)/this.totalProfitAllClinics *
                              100).toFixed(2):0}}%
                            </v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex xs12>
                          <v-layout row wrap>
                            <v-flex xs2 class="border">Taxas do cartão</v-flex>
                            <v-flex xs3 class="border">
                              {{parseFloat(totalTaxaCreditAllClinics)
                              | moneyFilter}}
                            </v-flex>
                            <v-flex xs3 class="border">
                              {{parseFloat(totalTaxaDebitAllClinics)
                              | moneyFilter}}
                            </v-flex>
                            <v-flex xs3 class="border">{{0 | moneyFilter}}</v-flex>
                            <v-flex xs1 class="border">
                              {{(totalProfitAllClinics != 0) ?((parseFloat(totalTaxaCreditAllClinics) +
                              parseFloat(totalTaxaDebitAllClinics))/this.totalProfitAllClinics *
                              100).toFixed(2):0}}%
                            </v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex xs12>
                          <v-layout row wrap>
                            <v-flex xs2 class="border">Total</v-flex>
                            <v-flex xs3 class="border">
                              {{parseFloat(totalTaxaCreditAllClinics)
                              | moneyFilter}}
                            </v-flex>
                            <v-flex xs3 class="border">
                              {{ totalOuttakesNotMoneyAllClinics |
                              moneyFilter}}
                            </v-flex>
                            <v-flex xs3 class="border">
                              {{totalCostSpecialtiesIntakesAllClinics +
                              totalCostExamsIntakesAllClinics + totalOuttakesInMoneyAllClinics |
                              moneyFilter}}
                            </v-flex>
                            <v-flex xs1 class="border">
                              {{(totalProfitAllClinics != 0) ?((parseFloat(totalTaxaCreditAllClinics) +
                              parseFloat(totalTaxaDebitAllClinics) +
                              totalCostSpecialtiesIntakesAllClinics +
                              totalCostExamsIntakesAllClinics +
                              totalOuttakesInMoneyAllClinics + totalOuttakesNotMoneyAllClinics)/this.totalProfitAllClinics *
                              100).toFixed(2):0}}%
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12 class="my-2">
                  <v-layout row wrap>
                    <v-flex xs1 class="border">
                      <v-layout row wrap class="fill-height align-center justify-center">
                        <span>Total</span>
                      </v-layout>
                    </v-flex>
                    <v-flex xs11>
                      <v-layout row wrap>
                        <v-flex xs12>
                          <v-layout row wrap>
                            <v-flex xs2 class="border">
                              <v-layout row wrap class="align-center justify-center fill-height">
                                <v-divider class="black mx-4"></v-divider>
                              </v-layout>
                            </v-flex>
                            <v-flex xs3 class="border">
                              {{totalCreditAllClinics -
                              parseFloat(totalTaxaCreditAllClinics) | moneyFilter}}
                            </v-flex>
                            <v-flex xs3 class="border">
                              {{totalDebitAllClinics -
                              parseFloat(totalTaxaDebitAllClinics) - totalOuttakesNotMoneyAllClinics |
                              moneyFilter}}
                            </v-flex>
                            <v-flex xs3 class="border">
                              {{totalMoneyAllClinics +
                              totalFinancialSupportAllClinics - totalCostSpecialtiesIntakesAllClinics -
                              totalCostExamsIntakesAllClinics - totalOuttakesInMoneyAllClinics |
                              moneyFilter}}
                            </v-flex>
                            <v-flex xs1 class="border">
                              {{(totalProfit != 0) ?((totalCreditAllClinics -
                              parseFloat(totalTaxaCreditAllClinics) + totalDebitAllClinics -
                              parseFloat(totalTaxaDebitAllClinics) + totalMoneyAllClinics +
                              totalFinancialSupportAllClinics - totalCostSpecialtiesIntakesAllClinics -
                              totalCostExamsIntakesAllClinics -
                              totalOuttakesInMoneyAllClinics)/this.totalProfit *
                              100).toFixed(2):0}}%
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>

                <v-flex xs12 class="my-1">
                  <v-layout row wrap class="justify-center">
                    <v-flex xs3 class="border">Total Bruto</v-flex>
                    <v-flex xs3 class="border">Custos</v-flex>
                    <v-flex xs2 class="border">Saldo Final</v-flex>
                  </v-layout>
                </v-flex>

                <v-flex xs12 class="my-1">
                  <v-layout row wrap class="justify-center">
                    <v-flex xs3 class="border">{{ this.totalRawIntakeAllClinics | moneyFilter}}</v-flex>
                    <v-flex xs3 class="border">
                      {{totalCostAllClinics | moneyFilter}} ({{(totalProfit != 0) ?(totalCostAllClinics / this.totalProfit *
                      100).toFixed(2):0}}%)
                    </v-flex>
                    <v-flex xs2 class="border">
                      {{finalProfitAllClinics | moneyFilter}} ({{(totalProfit != 0) ?(finalProfitAllClinics / this.totalProfit *
                      100).toFixed(2):0}}%)
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
    //==== functions ===
    "finalProfit",
    "totalProfit",
    "totalCost",
    "totalFinancialSupport",
    "proceduresQuantity",
    "examsQuantity",
    "totalExamsIntakes",
    "totalCostExamsIntakes",
    "totalSpecialtiesIntakes",
    "totalCostSpecialtiesIntakes",
    "totalOuttakesInMoney",
    "totalOuttakesNotMoney",
    "totalRawIntake",
    "totalCredit",
    "totalTaxaCredit",
    "totalDebit",
    "totalTaxaDebit",
    "totalMoney",
    "finalProfitAllClinics",
    "totalProfitAllClinics",
    "totalCostAllClinics",
    "totalFinancialSupportAllClinics",
    "proceduresQuantityAllClinics",
    "examsQuantityAllClinics",
    "totalExamsIntakesAllClinics",
    "totalCostExamsIntakesAllClinics",
    "totalSpecialtiesIntakesAllClinics",
    "totalCostSpecialtiesIntakesAllClinics",
    "totalOuttakesInMoneyAllClinics",
    "totalOuttakesNotMoneyAllClinics",
    "totalRawIntakeAllClinics",
    "totalCreditAllClinics",
    "totalTaxaCreditAllClinics",
    "totalDebitAllClinics",
    "totalTaxaDebitAllClinics",
    "totalMoneyAllClinics"
  ]
};
</script>

<style scoped>
.border {
  border: 1px solid grey;
}
</style>
