<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
                    <v-card v-for="(outtake,i) in outtakes" :key="i">
                    <v-layout row wrap>
                        <v-flex xs1 class="align-center justify-center">
                            <p class="font-weight-black mt-5">
                                {{outtake._id}}
                            </p>
                        </v-flex>
                        <v-flex xs1>
                            <v-divider class="primary" vertical/>
                        </v-flex>
                        <v-flex xs3 class="text-center align-center justify-center">
                            <p class="mt-5"> CONSULTA: {{outtake.ProductTransaction[0].Consultation.Product.name}}</p>
                        </v-flex>
                      <v-flex xs1>
                        <v-divider class="primary" vertical/>
                      </v-flex>
                      <v-flex xs2 class="align-center justify-center">
                        <p class="font-weight-black mt-5">
                          {{date(outtake.date.formatted)}}
                        </p>
                      </v-flex>
                        <v-flex xs1>
                            <v-divider class="primary" vertical/>
                        </v-flex>
                        <v-flex xs1>
                            <p class="mt-5"> PREÇO: {{-outtake.value}}</p>
                        </v-flex>
                      <v-flex xs1>
                        <v-divider class="primary" vertical/>
                      </v-flex>
                      <v-flex xs1>
                            <v-btn :loading="loadingPaymentConsultation"  @click="payConsultationDoctor(outtake)" outlined class="elevation-0 mt-5">
                                                    <span class="font-weight-bold">
                                                        Pagar
                                                    </span>
                            </v-btn>
                      </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex xs12>
                <v-divider class="my-3"/>
            </v-flex>
            <v-spacer/>
            <v-flex xs11/>
            <v-flex xs12 v-if="loading">
                <v-progress-linear color="primary" indeterminate/>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {mask} from "vue-the-mask";
    import  moment from 'moment'
    import {uuid} from "vue-uuid";
    import MutationBuilder from "@/classes/MutationBuilder";
    import gql from "graphql-tag";

    export default {
        props: ['doctor','outtakes'],
        name: "DoctorOuttakes",
        directives: {
            mask
        },
        data() {
            return {
                numberIntake:'',
                loadingPaymentConsultation: false,
                loading: false,
                successUpdateExams: false,
                dialogContestValue: false,
                ContestExam:[],
                NewValue: ''
            };
        },
        methods: {
            closeDialog: function() {
                this.$emit('close-dialog')
            },
          date(dat){
              console.log('dat: ', dat)
             return moment(dat).format('DD/MM/YYYY')
          },
          async payConsultationDoctor(charge){
              this.loadingPaymentConsultation= true
            //await this.$store.dispatch('PayDoctor', doctor)
            //this.getInitialInfo()
            console.log('dortor: ', this.doctor)
            console.log('outtake: ', charge)
            this.loadingPayment= true
            let transactionId = uuid.v4()
            let mutationBuilder = new MutationBuilder()
            mutationBuilder.addMutation({
              mutation: require('@/graphql/transaction/CreateTransactionPay.gql'),
              variables:{
                date:{formatted: `${moment().format("YYYY-MM-DDTHH:mm:ss")}`},
                id:transactionId,
                value:-parseFloat(charge.value),
              }
            })
            mutationBuilder.addMutation({
              mutation: require('@/graphql/doctors/AddPaymentsHasDoctor.gql'),
              variables:{
                idDoctor:this.doctor.id,
                idTransaction:transactionId,
              }
            })
            console.log('transactionId: ', transactionId)
            mutationBuilder.addMutation({
              mutation: require('@/graphql/productTransaction/addTransactionsHasProductTransaction.gql'),
              variables:{
                idProductTransaction:charge.ProductTransaction[0].id,
                idTransaction:transactionId,
              }
            })
              let costProduct = await this.$apollo.mutate({
                mutation: require ('@/graphql/doctors/LoadCostProductDoctor.gql'),
                variables:{idDoctor: this.doctor.id, idProduct: charge.ProductTransaction[0].Consultation.Product.id}
              })
              console.log('cost: ', costProduct.data.CostProductDoctor[0].cost)
            mutationBuilder.addMutation({
              mutation: require('@/graphql/productTransaction/UpdateProductTransaction.gql'),
              variables:{
                idProductTransaction:charge.ProductTransaction[0].id,
                cost:costProduct.data.CostProductDoctor[0].cost,
              }
            })
            mutationBuilder.addMutation({
              mutation: require('@/graphql/charge/DeleteCharge.gql'),
              variables:{
                id:charge.id,
              }
            })

            let response = await this.$apollo.mutate({
                  mutation: mutationBuilder.generateMutationRequest(),
                })
            console.log('response :', response)
            this.loadingPaymentConsultation= false
          },
        },
        mounted(){
            this.$store.dispatch('GetReceiptsDoctor', this.doctor)

        },
        computed: {

            mostrarOuttakes(){
                console.log('outtakes: ', this.outtakes)
            }
        }
    };
</script>
