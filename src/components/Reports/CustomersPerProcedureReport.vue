<template>
  <v-container>
    <v-layout>
      <p>{{ReportCustomersProcedure}}</p>
      <v-flex xs12 v-if="ReportTrue">
        <v-card class="pa-4 receipt-to-print">
          <v-layout row wrap>
            <v-flex xs6 class="text-left">
              <img :src="report.unit.logo" height="64px" />
            </v-flex>
            <v-flex xs6 class="text-right">
              <v-layout column wrap>
                <span class="my-sub-headline mb-4">Relatório Cliente por Procedimento</span>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <v-divider></v-divider>
            </v-flex>
            <v-row>
              <v-col>
                <v-divider vertical></v-divider>
              </v-col>
              <v-col>-</v-col>
              <v-col>
                <v-divider vertical></v-divider>
              </v-col>
              <v-col>Segunda</v-col>
              <v-col>
                <v-divider vertical></v-divider>
              </v-col>
              <v-col>Terça</v-col>
              <v-col>
                <v-divider vertical></v-divider>
              </v-col>
              <v-col>Quarta</v-col>
              <v-col>
                <v-divider vertical></v-divider>
              </v-col>
              <v-col>Quinta</v-col>
              <v-col>
                <v-divider vertical></v-divider>
              </v-col>
              <v-col>Sexta</v-col>
              <v-col>
                <v-divider vertical></v-divider>
              </v-col>
              <v-col>Sábado</v-col>
              <v-col>
                <v-divider vertical></v-divider>
              </v-col>
            </v-row>
            <v-flex xs12>
              <v-divider></v-divider>
            </v-flex>
            <v-flex xs12>
              <span class="my-headline">Consultas Feitas</span>
            </v-flex>
            <v-flex xs12>
              <v-divider></v-divider>
            </v-flex>
            <v-row>
              <v-col>
                <v-divider vertical></v-divider>
              </v-col>
              <v-col>Manhã</v-col>
              <v-col>
                <v-divider vertical></v-divider>
              </v-col>
              <v-col>{{reportProcedure["Consultas Feitas"].morning["1"]}}</v-col>
              <v-col>
                <v-divider vertical></v-divider>
              </v-col>
              <v-col>{{reportProcedure["Consultas Feitas"].morning["2"]}}</v-col>
              <v-col>
                <v-divider vertical></v-divider>
              </v-col>
              <v-col>{{reportProcedure["Consultas Feitas"].morning["3"]}}</v-col>
              <v-col>
                <v-divider vertical></v-divider>
              </v-col>
              <v-col>{{reportProcedure["Consultas Feitas"].morning["4"]}}</v-col>
              <v-col>
                <v-divider vertical></v-divider>
              </v-col>
              <v-col>{{reportProcedure["Consultas Feitas"].morning["5"]}}</v-col>
              <v-col>
                <v-divider vertical></v-divider>
              </v-col>
              <v-col>{{reportProcedure["Consultas Feitas"].morning["6"]}}</v-col>
              <v-col>
                <v-divider vertical></v-divider>
              </v-col>
            </v-row>
            <v-flex xs12>
              <v-divider></v-divider>
            </v-flex>
            <v-row>
              <v-layout row wrap class="mt-2">
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>Tarde</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Consultas Feitas"].afternoon["1"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Consultas Feitas"].afternoon["2"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Consultas Feitas"].afternoon["3"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Consultas Feitas"].afternoon["4"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Consultas Feitas"].afternoon["5"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Consultas Feitas"].afternoon["6"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
              </v-layout>
            </v-row>
            <v-flex xs12>
              <v-divider></v-divider>
            </v-flex>
            <v-flex xs12>
              <span class="my-headline">Consultas Pagas</span>
            </v-flex>
            <v-flex xs12>
              <v-divider></v-divider>
            </v-flex>
            <v-row>
              <v-layout row wrap class="mt-2">
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>Manhã</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Consultas Pagas"].morning["1"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Consultas Pagas"].morning["2"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Consultas Pagas"].morning["3"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Consultas Pagas"].morning["4"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Consultas Pagas"].morning["5"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Consultas Pagas"].morning["6"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
              </v-layout>
            </v-row>
            <v-flex xs12>
              <v-divider></v-divider>
            </v-flex>
            <v-row>
              <v-layout row wrap class="mt-2">
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>Tarde</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Consultas Pagas"].afternoon["1"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Consultas Pagas"].afternoon["2"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Consultas Pagas"].afternoon["3"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Consultas Pagas"].afternoon["4"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Consultas Pagas"].afternoon["5"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Consultas Pagas"].afternoon["6"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
              </v-layout>
            </v-row>
            <v-flex xs12>
              <v-divider></v-divider>
            </v-flex>
            <v-flex xs12>
              <span class="my-headline">Vendas Realizadas</span>
            </v-flex>
            <v-flex xs12>
              <v-divider></v-divider>
            </v-flex>
            <v-row>
              <v-layout row wrap class="mt-2">
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>Manhã</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Vendas realizadas"].morning["1"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Vendas realizadas"].morning["2"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Consultas Pagas"].morning["3"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Vendas realizadas"].morning["4"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Vendas realizadas"].morning["5"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Vendas realizadas"].morning["6"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
              </v-layout>
            </v-row>
            <v-flex xs12>
              <v-divider></v-divider>
            </v-flex>
            <v-row>
              <v-layout row wrap class="mt-2">
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>Tarde</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Vendas realizadas"].afternoon["1"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Vendas realizadas"].afternoon["2"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Vendas realizadas"].afternoon["3"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Vendas realizadas"].afternoon["4"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Vendas realizadas"].afternoon["5"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
                <v-col>{{reportProcedure["Vendas realizadas"].afternoon["6"]}}</v-col>
                <v-col>
                  <v-divider vertical></v-divider>
                </v-col>
              </v-layout>
            </v-row>
            <v-flex xs12>
              <v-divider></v-divider>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: [
    "report",
    "loading",
    "now",
    "reportProcedure",
    "ReportTrue",
    "ReportCustomersProcedure"
  ]
};
</script>

<style scoped>
</style>
