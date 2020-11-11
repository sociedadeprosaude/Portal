<template>
  <v-container>
    <v-layout row wrap v-if="!loading">
      <v-flex xs12>
        <span class="my-headline">Convênios</span>
      </v-flex>
      <v-flex xs12>
        <v-card>
          <v-layout row wrap>
            <v-flex xs12 class="px-3 my-3">
              <ApolloQuery
                  :query="require('@/graphql/clinics/LoadClinicsPayment.gql')"
              >
                <template slot-scope="{ result: { data } }">
                  <v-layout>
                    <v-flex>
                      <h4 class="text-left mb-2 ">Total a pagar: {{ TotalCostExamsClinic(data) }}</h4>
                    </v-flex>
                  </v-layout>
                  <v-card v-for="(clinic,i) in data ? data.Clinic : []" :key="i" outlined class="mb-4 primary"
                          v-if="clinic.charges.length !== 0">
                    <v-layout row wrap>
                      <v-flex xs10 md5 class="text-left">
                        <span class="font-weight-bold white--text ml-2">{{ clinic.name }}</span>
                      </v-flex>
                      <v-spacer></v-spacer>
                      <v-flex xs2 md1>
                        <v-menu open-on-hover top offset-y>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                v-bind="attrs"
                                v-on="on"
                                class="elevation-0 transparent"
                                small
                                dark
                            >
                              <v-icon>more_vert</v-icon>
                            </v-btn>
                          </template>

                          <v-list>
                            <v-list-item
                                v-for="(item, index) in Menu"
                                :key="index"
                                @click="OpenReceipt(item,clinic)"
                            >
                              <v-list-item-title>{{ item.title }}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </v-flex>
                    </v-layout>
                    <v-flex xs12 sm12>
                      <v-layout row wrap class="justify-center">
                        <v-flex xs5 md2>
                          <v-card sm3 class="mx-4 elevation-0 transparent">
                                                <span class="font-weight-bold white--text">
                                                    Custo : {{ CostExamsClinic(clinic) }}
                                                </span>
                          </v-card>
                        </v-flex>
                        <v-flex xs7 md2>
                          <v-card sm3 class="mx-4 elevation-0 transparent">
                                                <span class="font-weight-bold white--text">
                                                            Nº de exames : {{ clinic.charges.length }}
                                                </span>
                          </v-card>
                        </v-flex>
                        <v-flex xs12 class="mb-4 hidden-md-and-up">
                          <v-spacer></v-spacer>
                        </v-flex>
                        <v-flex md3>
                          <v-card sm3 class="mx-4 elevation-0 transparent">
                                                <span class="font-weight-bold white--text">
                                                             Próximo Pagamento: {{ date(clinic.last_payment, clinic.period) }}
                                                </span>
                          </v-card>
                        </v-flex>
                        <v-flex xs12 class="mb-2 hidden-md-and-up">
                          <v-spacer></v-spacer>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12 class="mb-4 hidden-md-and-up">
                      <v-spacer></v-spacer>
                    </v-flex>
                    <v-flex xs12 sm12 class="mt-3">
                      <v-layout row wrap class="justify-space-between">
                        <v-flex xs6 class="text-left">
                          <v-btn @click="checkReceipts(clinic)" text dark>+ detalhes</v-btn>
                        </v-flex>

                        <v-flex xs6 class="text-right">
                          <v-card class="mx-4 elevation-0 transparent">
                            <v-btn :loading="loadingPayment" @click="payClinic(clinic)" outlined dark
                                   class="elevation-0">
                                                    <span class="font-weight-bold white--text">
                                                        Pagar
                                                    </span>
                            </v-btn>
                          </v-card>
                        </v-flex>
                        <v-flex xs12 class="mb-2">
                          <v-spacer></v-spacer>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-card v-if="intakesObserv && clinic === clinicSelected">
                      <clinicsIntakes @close-dialog="intakesObserv = false" :clinic="clinicSelected"
                                      :outtakes="outtakesSelected"></clinicsIntakes>
                    </v-card>
                  </v-card>
                  <v-btn elevation="0" color="white" v-if="!data" :loading="true"></v-btn>
                </template>
              </ApolloQuery>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="change" max-width="300px">
      <v-card>
        <v-card-title>Período de Pagamento</v-card-title>
        <v-flex class="mt-5 ml-3">
          <v-select
              v-model="period"
              :items="days"
              label="período"
          >
          </v-select>
        </v-flex>
        <v-flex>
          <v-btn @click="ChangeDate(clinica)">
            Confirmar
          </v-btn>
        </v-flex>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogReceipt">
      <ReceiptOuttakesConvenant @close="CloseReceipt()" :clinicSelected="clinicSelected"
                                :outtakes="outtakesSelected"></ReceiptOuttakesConvenant>
    </v-dialog>

  </v-container>
</template>

<script>
import moment from "moment/moment";
import clinicsIntakes from "../../components/PaymentCovenants/ClinicsIntakes"
import ReceiptOuttakesConvenant from "../../components/PaymentCovenants/ReceiptOuttakesConvenants"
import {uuid} from "vue-uuid";
import MutationBuilder from "@/classes/MutationBuilder";
import gql from "graphql-tag";

export default {
  name: "PaymentCovenants",
  components: {
    clinicsIntakes, ReceiptOuttakesConvenant
  },
  data() {
    return {
      loading: true,
      value: undefined,
      change: false,
      loadingPayment: false,
      dialogReceipt: false,
      clinica: [],
      clinicSelected: [],
      cost: '',
      outtakesSelected: [],
      intakes: [],
      period: '',
      NumberExams: '',
      intakesObserv: false,
      Menu: [
        {title: 'Gerar Boleto'},
        {title: 'Anexar Recibo'},
      ],
      menu2: false,
      dateFormatted2: moment().format("DD/MM/YYYY"),
      date2: moment().format("YYYY-MM-DD 23:59:59"),
      datenow: moment().format('YYYY-MM-DD'),
      days: ['10', '15', '30']
    }
  },
  computed: {
    units() {
      return this.$store.getters.units
    }
  },
  methods: {
    OpenReceipt(item, clinic) {
      this.outtakesSelected = clinic.charges
      this.clinicSelected = clinic
      if (item.title === 'Gerar Boleto') {
        this.dialogReceipt = !this.dialogReceipt
      }
    },
    CostExamsClinic(clinic) {
      let cost = 0;
      for (let i in clinic.charges) {
        cost += clinic.charges[i].value
      }
      return -cost.toFixed(2)
    },
    TotalCostExamsClinic(data) {
      let cost = 0;
      if (data !== null) {
        for (let j in data.Clinic) {
          for (let i in data.Clinic[j].charges) {
            cost += data.Clinic[j].charges[i].value
          }
        }

      }
      return cost ? -cost.toFixed(2) : 0
    },
    CloseReceipt() {
      this.dialogReceipt = !this.dialogReceipt
    },
    ChangeDateDialog(clinic) {
      this.clinica = clinic;
      this.change = !this.change;
    },
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    async CalculateValue(clinic) {
      this.cost = '';
      this.clinica = clinic;
      let ReturnValuesClinic = await this.$store.dispatch('CalculedValuePaymentClinic', clinic)
      this.cost = ReturnValuesClinic.cost
      this.NumberExams = ReturnValuesClinic.NumberExams
    },

    async checkReceipts(clinic) {
      this.outtakesSelected = clinic.charges
      this.clinicSelected = clinic
      this.intakesObserv = !this.intakesObserv

    },
    async payClinic(clinic) {
      this.loadingPayment = true
      let transactionId = uuid.v4()
      let mutationBuilder = new MutationBuilder()
      mutationBuilder.addMutation(
          `CreateTransaction(
                    date:{formatted: "${moment().format("YYYY-MM-DDTHH:mm:ss")}"},
                    id:"${transactionId}",
                    value:${-parseFloat(this.CostExamsClinic(clinic))},
                  ){
                  id,date{formatted},value,
                  }`
      )
      mutationBuilder.addMutation(`
                  AddTransactionWith_clinic(
                 from:{
                      id:"${transactionId}"
                    },

                    to:{
                      id:"${clinic.id}"
                    }
                  ){
                     from{id},
                      to{id}
                  }
              `)
      for (let charge in clinic.charges) {
        mutationBuilder.addMutation(`
                  DeleteCharge(id:"${clinic.charges[charge].id}"){
                  id
                  }
                `)
      }
      let finalString = mutationBuilder.generateMutationRequest()
      await this.$apollo.mutate({
        mutation: gql`${finalString}`,
      })
      console.log('ok')
      this.loadingPayment = false
    },
    date(day, period) {
      if (!period) {
        return moment(day).add(30, 'days').format('DD/MM/YYYY')
      } else {
        return moment(day).add(period, 'days').format('DD/MM/YYYY')
      }
    },
    mostrar(data) {
      console.log('data: ', data)
    },
    async getInitialInfo() {
      this.loading = false
    },

  },
  mounted() {
    this.getInitialInfo()
  }

}
</script>
