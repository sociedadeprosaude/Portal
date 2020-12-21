<template>
    <v-container>
        <header-discharge-procedures @SearchIntake="SearchIntake($event)" ></header-discharge-procedures>
        <ApolloQuery
          :query="require('@/graphql/transaction/GetTransactionId.gql')"
          :variables="{Id:numberIntake}"
        >
          <template v-slot="{result: {data, loading, error}}">
          <template-discharge-procedures
              v-id="data"
              @SuccessUpdate="successUpdateExams = !successUpdateExams"
              :successUpdateExams="successUpdateExams"
              @CheckExams="SendCheckExams($event)"
              @AddResultExam="AddResultExam($event)"
              @removeFiles="removeFile($event)"
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
            console.log('data: ', data)
            return data.Transaction
          },
            async AddResultExam(values){
                if(!values.intake.result){
                    values.intake.result = []
                }

                await this.$store.dispatch("deleteFile", {
                    imagePaths: values.intake.result,
                    path: "outtakes/resultExams"
                });
                if(values.files.indexOf(values.file[0]) < 0 && values.file.length > 0){
                    values.files.push(values.file[0])
                    values.file= []
                }
                let urls = await this.submitFiles(values.files)
                let exams = values.outtak.exams
                exams[values.index].result = urls
                await this.$store.dispatch("updateOuttakeExams", {
                    outtake: values.outtak,
                    field: "results",
                    value: urls,
                    exams: exams
                });
                await this.$store.dispatch('getSpecificOuttake',{number:this.numberIntake, cnpj: this.user.cnpj})
            },
            async submitFiles(files) {
                return await this.$store.dispatch("uploadFileToStorage", {
                    files: files,
                    path: "/outtakes/resultExams"
                });
            },
            async SendCheckExams(outtake){
                this.loading= true;
                this.loading= false;
                console.log('outtake: ', outtake)
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
            },
            async removeFile(values) {
                await this.$store.dispatch("updateOuttakeExams", {
                    outtake: values.outtake,
                    field: values.field,
                    exams: values.exams
                });
            },

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
