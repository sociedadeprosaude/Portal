<template>
    <v-container>
        <v-layout row wrap v-if="!loading">
            <v-flex xs12>
                <span class="my-headline">Médicos</span>
            </v-flex>
            <v-flex xs12>
                <v-card>
                    <v-layout row wrap>
                        <v-flex xs12 class="px-3 my-3">
                          <ApolloQuery
                              :query="require('@/graphql/doctors/LoadDoctorsPayment.gql')"
                          >
                            <template slot-scope="{ result: { data } }">
                              <v-layout>
                                <v-flex>
                                  <h4 class="text-left mb-2 ">Total a pagar: {{TotalCostExamsDoctor(data)}}</h4>
                                </v-flex>
                              </v-layout>
                              <v-flex xs12 v-if="doctor.charges.length !== 0">
                                <v-card v-for="(doctor,i) in data ? data.Doctor : []" :key="i" outlined class="mb-4 primary" >
                                  <v-layout row wrap>
                                    <v-flex s10 md3 class="text-left">
                                      <span class="font-weight-bold white--text ml-2">{{doctor.name.toUpperCase()}}</span>
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
                                              @click="OpenReceipt(item,doctor)"
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
                                                      Custo : {{CostExamsDoctor(doctor)}}
                                                </span>
                                        </v-card>
                                      </v-flex>
                                      <v-flex xs7 md2>
                                        <v-card sm3 class="mx-4 elevation-0 transparent">
                                                <span  class="font-weight-bold white--text">
                                                            Nº de exames : {{doctor.charges ? doctor.charges.length : 0}}
                                                </span>
                                        </v-card>
                                      </v-flex>
                                      <v-flex xs12 class="mb-4 hidden-md-and-up">
                                        <v-spacer></v-spacer>
                                      </v-flex>
                                      <v-flex md3>
                                        <v-card sm3 class="mx-4 elevation-0 transparent">
                                            <span class="font-weight-bold white--text">
                                                         Último Pagamento: {{lastPayment(doctor)}}
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
                                        <v-btn @click="checkReceipts(doctor)" text dark>+ detalhes</v-btn>
                                      </v-flex>
                                      <v-flex xs6 class="text-right">
                                        <v-card class="mx-4 elevation-0 transparent">
                                          <v-btn :loading="loadingPayment"  @click="payDoctor(doctor)" outlined dark class="elevation-0">
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
                                  <v-card v-if="intakesObserv && doctor === doctorSelected">
                                    <DoctorOuttakes @close-dialog="intakesObserv = false" :doctor="doctorSelected" :outtakes="outtakesSelected"></DoctorOuttakes>
                                  </v-card>
                                </v-card>
                              </v-flex>
                              <v-flex xs12 v-if="data">
                                <v-card class="mx-4 elevation-0 transparent">
                                  <v-btn @click="payAllDoctor(data ? data.Doctor : [])"  outlined class="elevation-0">
                                 <span class="font-weight-bold">
                                     Pagar Todos
                                 </span>
                                  </v-btn>
                                </v-card>
                              </v-flex>
                            <v-btn elevation="0" color="white" v-if="!data" :loading="true"></v-btn>
                            </template>
                          </ApolloQuery>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>

        <v-dialog v-model="dialogReceipt">
            <ReceiptOuttakesDoctor @close="CloseReceipt()"  :doctorSelected="doctorSelected" :outtakes="outtakesSelected"></ReceiptOuttakesDoctor>
        </v-dialog>
    </v-container>
</template>

<script>
    import moment from "moment/moment";
    import DoctorOuttakes from "../../components/DoctorOuttakes"
    import ReceiptOuttakesDoctor from "../../components/OuttakesDoctor/ReceiptOuttakesDoctor"
    import {uuid} from "vue-uuid";
    import MutationBuilder from "@/classes/MutationBuilder";

    export default {
        name: "PaymentMedics",
        components: {
            DoctorOuttakes,ReceiptOuttakesDoctor
        },
        data() {
            return {
                loading: true,
                loadingPayment:false,
                value: undefined,
                change: false,
                dialogReceipt:false,
                doctorSelected:[],
                cost:'',
                ChargeSkip:false,
                outtakesSelected:[],
                intakes:[],
                period:'',
                NumberExams:'',
                intakesObserv:false,
                charges:[],
                Menu: [
                    { title: 'Gerar Boleto' },
                    { title: 'Anexar Recibo' },
                ],
                menu2:false,
                dateFormatted2: moment().format("DD/MM/YYYY"),
                date2: moment().format("YYYY-MM-DD 23:59:59"),
                datenow: moment().format('YYYY-MM-DD'),
                days:['10','15','30']
            }
        },
        computed: {
            units() {
                return this.$store.getters.units
            }
        },
        methods: {
            OpenReceipt(item,doctor){
                this.outtakesSelected= doctor.charges
                this.doctorSelected = doctor
                if(item.title === 'Gerar Boleto'){
                    this.dialogReceipt= !this.dialogReceipt
                }
            },
             CostExamsDoctor(doctor){
                let cost = 0;
                for(let i in doctor.charges){
                  cost += parseFloat(doctor.charges[i].value)
                }
                return cost ? -cost.toFixed(2) : 0
            },
          TotalCostExamsDoctor(data){
            let cost = 0;
            if(data !== null){
              for(let j in data.Doctor){
                for(let i in data.Doctor[j].charges) {
                  cost += data.Doctor[j].charges[i].value
                }
              }

            }
            return cost ? -cost.toFixed(2) : 0
          },
          lastPayment(doctor){
            if(doctor.payments[0]){
              return moment(doctor.payments[0].date.formatted).format('DD/MM/YYYY')
            }
            return 'Sem pagamentos até o momento'
          },
            CloseReceipt(){
                this.dialogReceipt= !this.dialogReceipt
            },
            async getInitialInfo() {
                this.loading = false
            },
            ChangeDateDialog(doctor) {
                this.doctorSelected = doctor;
                this.change = !this.change;
            },
            formatDate(date) {
                if (!date) return null;
                const [year, month, day] = date.split("-");
                return `${day}/${month}/${year}`;
            },
            async checkReceipts(doctor){
                this.outtakesSelected= doctor.charges
                this.doctorSelected = doctor
                this.intakesObserv = !this.intakesObserv

            },
            async payDoctor(doctor){
                //await this.$store.dispatch('PayDoctor', doctor)
                //this.getInitialInfo()
               this.loadingPayment= true
               let transactionId = uuid.v4()
               let mutationBuilder = new MutationBuilder()
              mutationBuilder.addMutation({
                mutation: require('@/graphql/transaction/CreateTransactionPay.gql'),
                variables:{
                  date:{formatted: `${moment().format("YYYY-MM-DDTHH:mm:ss")}`},
                  id:transactionId,
                  value:-parseFloat(this.CostExamsDoctor(doctor)),
                }
              })
              mutationBuilder.addMutation({
                mutation: require('@/graphql/doctors/AddPaymentsHasDoctor.gql'),
                variables:{
                  idDoctor:doctor.id,
                  idTransaction:transactionId,
                }
              })
               for (let charge in doctor.charges) {
                 mutationBuilder.addMutation({
                   mutation: require('@/graphql/productTransaction/addTransactionsHasProductTransaction.gql'),
                   variables:{
                     idProductTransaction:doctor.charges[charge].ProductTransaction[0].id,
                     idTransaction:transactionId,
                   }
                 })
                   let costProduct = await this.$apollo.mutate({
                       mutation: require ('../../graphql/doctors/LoadCostProductDoctor.gql'),
                       variables:{idDoctor: doctor.id, idProduct: doctor.charges[charge].ProductTransaction[0].Consultation.Product.id}
                   })
                 mutationBuilder.addMutation({
                   mutation: require('@/graphql/productTransaction/UpdateProductTransaction.gql'),
                   variables:{
                     idProductTransaction:doctor.charges[charge].ProductTransaction[0].id,
                     cost:costProduct.data.CostProductDoctor[0].cost,
                   }
                 })
                 mutationBuilder.addMutation({
                   mutation: require('@/graphql/charge/DeleteCharge.gql'),
                   variables:{
                     id:doctor.charges[charge].id,
                   }
                 })

              }
              await this.$apollo.mutate({
                mutation: mutationBuilder.generateMutationRequest(),
              })
              this.loadingPayment= false
            },
            async payAllDoctor(doctors){
              this.loadingPayment= true
              let mutationBuilder = new MutationBuilder()
              for(let i in doctors){
                let transactionId = uuid.v4()
                mutationBuilder.addMutation({
                  mutation: require('@/graphql/transaction/CreateTransactionPay.gql'),
                  variables:{
                    date:{formatted: `${moment().format("YYYY-MM-DDTHH:mm:ss")}`},
                    id:transactionId,
                    value:-parseFloat(this.CostExamsDoctor(doctors[i])),
                  }
                })
                mutationBuilder.addMutation({
                  mutation: require('@/graphql/doctors/AddPaymentsHasDoctor.gql'),
                  variables:{
                    idDoctor:doctors[i].id,
                    idTransaction:transactionId,
                  }
                })
                for (let charge in doctors[i].charges) {
                  mutationBuilder.addMutation({
                    mutation: require('@/graphql/productTransaction/addTransactionsHasProductTransaction.gql'),
                    variables:{
                      idProductTransaction:doctors[i].charges[charge].ProductTransaction[0].id,
                      idTransaction:transactionId,
                    }
                  })
                    let costProduct = await this.$apollo.mutate({
                        mutation: require ('../../graphql/doctors/LoadCostProductDoctor.gql'),
                        variables:{idDoctor: doctors[i].id, idProduct: doctors[i].charges[charge].ProductTransaction[0].Consultation.Product.id}
                    })
                    console.log('cost: ', costProduct.data.CostProductDoctor[0].cost)
                  mutationBuilder.addMutation({
                    mutation: require('@/graphql/productTransaction/UpdateProductTransaction.gql'),
                    variables:{
                      idProductTransaction:doctors[i].charges[charge].ProductTransaction[0].id,
                      cost:costProduct.data.CostProductDoctor[0].cost,
                    }
                  })
                  mutationBuilder.addMutation({
                    mutation: require('@/graphql/charge/DeleteCharge.gql'),
                    variables:{
                      id:doctors[i].charges[charge].id,
                    }
                  })
                }
              }
              let response = await this.$apollo.mutate({
                mutation: mutationBuilder.generateMutationRequest(),
              })
              console.log('response :', response)
            },
            date(day,period){
                if(!period){
                    return moment(day).add(30, 'days').format('DD/MM/YYYY')
                }
                else{
                    return moment(day).add(period, 'days').format('DD/MM/YYYY')
                }
            }

        },
        mounted() {
            this.getInitialInfo()
        }
    }
</script>
