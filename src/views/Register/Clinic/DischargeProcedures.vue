<template>
    <v-container>
        <header-discharge-procedures @SearchIntake="SearchIntake($event)" ></header-discharge-procedures>
        <template-discharge-procedures @SuccessUpdate="successUpdateExams = !successUpdateExams"
                                       :successUpdateExams="successUpdateExams"
                                       @CheckExams="SendCheckExams()"
                                       @AddResultExam="AddResultExam($event)"
                                       @removeFiles="removeFile($event)"
                                       @dialogContestValue="dialogContestValue = $event"
                                       :dialogContestValue="dialogContestValue"
                                       @ContestValue=" FunctionContestValue($event)"
                                       :loading="loading"
                                       :outtake="outtake"
                                       :user="user"
        ></template-discharge-procedures>
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
            async SendCheckExams(){
                this.loading= true;
                await this.$store.dispatch('updatingSpecificOuttake',{outtake: this.outtake.filter( (outtak) => outtak.root === true)[0], exams: this.outtake.filter( (outtak) => outtak.root === true)[0].exams, cnpj: this.user.cnpj})
                this.loading= false;

                this.successUpdateExams= true;
                this.numberIntake = '';
                for(let outtakes= 0; outtakes <  this.outtake.length; outtakes++ ){
                    this.outtake[outtakes].exams = {}
                }
                this.outtake[0].user ='';
            },
            async SearchIntake(number){
                this.loading= true;
                await this.$store.dispatch('getSpecificOuttake',{number:number, cnpj: this.user.cnpj})
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
        }
    };
</script>
