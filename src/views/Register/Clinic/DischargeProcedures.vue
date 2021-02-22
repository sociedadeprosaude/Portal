<template>
    <v-container>
        <header-discharge-procedures @SearchIntake="SearchIntake($event)" ></header-discharge-procedures>
        <ApolloQuery
          :query="require('@/graphql/transaction/GetTransactionId.gql')"
          :variables="{Id:numberIntake}"
        >
          <template v-slot="{result: {data, loading, error, query}}">
          <template-discharge-procedures
              v-if="data"
              @SuccessUpdate="successUpdateExams = !successUpdateExams"
              :successUpdateExams="successUpdateExams"
              @CheckExams="SendCheckExams($event)"
              @AddResultExam="AddResultExam($event)"
              @dialogContestValue="dialogContestValue = $event"
              :dialogContestValue="dialogContestValue"
              @ContestValue=" FunctionContestValue($event)"
              :loading="loading"
              :outtake="GetOuttake(data)"
              :user="user"
          ></template-discharge-procedures>
          </template>
        </ApolloQuery>
    </v-container>
</template>

<script>
    import {mask} from "vue-the-mask";
    import TemplateDischargeProcedures from '../../../components/clinics/DischargeProcedures/TemplateDischargeProcedures'
    import HeaderDischargeProcedures from '../../../components/clinics/DischargeProcedures/HeaderDischargeProcedures'
    import gql from 'graphql-tag'
    import MutationBuilder from "../../../classes/MutationBuilder"
    import {uuid} from 'vue-uuid'
    let moment = require('moment');

    export default {
        name: "DischargeProcedures",
        directives: {
            mask
        },
        components:{TemplateDischargeProcedures,HeaderDischargeProcedures},
        data() {
            return {
                numberIntake:'',
                loading: false,
                dialogContestValue:'',
                successUpdateExams:''
            };
        },
        methods: {
          GetOuttake(data){
            for(let outtake= 0; outtake < data.Transaction.length; outtake++ ){
              for(let exam=0; exam < data.Transaction[outtake].produts.length; exam++){
                if(data.Transaction[outtake].produts[exam].with_charge){
                  if(data.Transaction[outtake].produts[exam].with_charge.id){
                    data.Transaction[outtake].produts[exam].realized = true
                  }
                }
                else if(data.Transaction[outtake].produts[exam].with_transaction){
                  if(data.Transaction[outtake].produts[exam].with_transaction.id){
                    data.Transaction[outtake].produts[exam].realized = true
                  }
                }
                else {
                  data.Transaction[outtake].produts[exam].realized = false
                }
              }
            }
            console.log('data: ', data)

            return data.Transaction
          },
            async AddResultExam(values){
                if(!values.intake.result){
                    values.intake.result = []
                }
                if(values.files.indexOf(values.file[0]) < 0 && values.file.length > 0){
                    values.files.push(values.file[0])
                    values.file= []
                }
                let exams = values.outtak.exams
                exams[values.index].result = urls
            },

            async SendCheckExams(outtakes){
                this.loading= true;
                let exams = []
              let mutationBuilder = new MutationBuilder()
                for(let outtake= 0; outtake < outtakes.length; outtake++ ){
                    for(let exam=0; exam < outtakes[outtake].produts.length; exam++){
                      if(outtakes[outtake].produts[exam].realized === true){
                        if(!outtakes[outtake].produts[exam].with_charge && !outtakes[outtake].produts[exam].with_transaction){
                          console.log('item realizado agora: ', outtakes[outtake].produts[exam])
                          exams.push(outtakes[outtake].produts[exam])
                          let chargeID = uuid.v4()
                          let CostProductClinic = await this.$apollo.mutate({
                            mutation: require ('@/graphql/clinics/LoadCostProductClinic.gql'),
                            variables:{
                              idClinic: outtakes[outtake].produts[exam].with_clinic.id,
                              idProduct: outtakes[outtake].produts[exam].with_product.id
                            }
                          })
                          mutationBuilder.addMutation({
                            mutation: require ('@/graphql/charge/CreateCharge.gql'),
                            variables:{
                              id: chargeID,
                              value: -CostProductClinic.data.CostProductClinic[0].cost,
                              date: {formatted:moment().format("YYYY-MM-DDTHH:mm:ss") },
                              type: 'Clinic'
                            }
                          })
                          mutationBuilder.addMutation({
                            mutation: require('@/graphql/charge/AddRelationsProductTransactionHasCharge.gql'),
                            variables:{
                              idCharge: chargeID,
                              idProductTransaction: outtakes[outtake].produts[exam].id
                            }
                          })
                          mutationBuilder.addMutation({
                            mutation: require('@/graphql/charge/AddRelationUnitHasCharge.gql'),
                            variables:{
                              idCharge: chargeID,
                              idUnit: outtakes[outtake].with_unit[0].id
                            }
                          })
                        }
                      }
                    }
                 }
              let response = await this.$apollo.mutate({
                mutation: mutationBuilder.generateMutationRequest(),
              })
              this.loading= false;
              console.log('response :', response)
              this.successUpdateExams= true;
                /* this.successUpdateExams= true;
                this.numberIntake = '';
                for(let outtakes= 0; outtakes <  this.outtake.length; outtakes++ ){
                    this.outtake[outtakes].exams = {}
                }
                this.outtake[0].user =''; */
            },
            async SearchIntake(number){
                this.loading= true;
                this.numberIntake = number
                this.loading= false;
            },
            async FunctionContestValue(values){
                let clinic= await this.$store.dispatch('getIdClinic', this.user.cnpj)
                await this.$store.dispatch('addNewContestValue',{exams:values.ContestExam, value:values.NewValue, cnpj:this.user.cnpj, numberIntake:toString(this.outtake[0].intake_id), clinic:clinic})
                this.dialogContestValue = !this.dialogContestValue
            }
        },
        computed: {
            user() {
                return this.$store.getters.user
            },
            outtake(){
                return this.$store.getters.outtakeClinic
            },
            contestvalue(){
                return this.$store.getters.contestValue;
            }
        },
    };
</script>
