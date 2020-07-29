<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
                <v-divider/>
            </v-flex>
            <p v-if="outtake.length > 0" class="mt-3 font-italic font-weight-bold"> Paciente: {{outtake[0].user.name}}</p>
            <v-flex xs12>
                <v-divider/>
            </v-flex>
            <v-flex xs12 v-for="(outtak,indeex) in outtake" v-bind:key="indeex">
                <v-card class="elevation-2 my-3" v-for="(intake,index) in outtak.exams" v-bind:key="index">
                    <v-layout row wrap>
                        <v-flex xs6 md3 class="align-center justify-center">
                            <p class="font-weight-black mt-5">
                                {{intake.name}}
                            </p>
                        </v-flex>
                        <v-flex xs1 md1>
                            <v-divider class="primary" vertical/>
                        </v-flex>
                        <v-flex xs5 md1 class="text-center align-center justify-center">
                            <p class="mt-5"> PREÇO: {{intake.cost}}</p>
                        </v-flex>
                        <v-flex class="hidden-sm-and-down" md1>
                            <v-divider class="primary" vertical/>
                        </v-flex>
                        <v-flex xs12  class="hidden-md-and-up">
                            <v-divider class="primary"></v-divider>
                        </v-flex>
                        <v-flex xs6 md1 class="mt-4">
                            <v-btn @click="DividerContestValue(intake)" rounded color="blue" text>Contestar Valor</v-btn>
                        </v-flex>
                        <v-flex xs1 md1>
                            <v-divider class="primary" vertical/>
                        </v-flex>
                        <v-flex xs5 md1>
                            <v-checkbox v-model="intake.realized" color="success" label="Faturar" placeholder="Faturar" />
                        </v-flex>
                        <v-flex xs1 md1 class="hidden-sm-and-down">
                            <v-divider class="primary" vertical/>
                        </v-flex>
                        <v-flex xs12 class="hidden-md-and-up">
                            <v-divider class="primary" ></v-divider>
                        </v-flex>
                        <v-flex xs12 md1 class="mt-4 ml-2 ">
                            <v-file-input
                                    v-model="file"
                                    label="Anexar Resultado"
                                    multiple
                                    v-on:change="AddResultExam(intake,outtak,index)"
                            ></v-file-input>
                        </v-flex>
                        <v-flex xs12>
                            <v-divider class="primary" ></v-divider>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout row wrap>
                                <v-card class="pa-2 ma-2" v-for="(preview, i) in intake.result" :key="i">
                                    <v-btn
                                            @click="removeFile(i,intake,outtak)"
                                            class="grey"
                                            small
                                            fab
                                            text
                                            style="position: absolute; right: 0;"
                                    >
                                        <v-icon>close</v-icon>
                                    </v-btn>
                                    <v-layout column wrap>
                                        <img style="max-height: 124px; max-width: 124px" :src="preview" />
                                    </v-layout>
                                </v-card>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    </v-card>
            </v-flex>
            <v-flex xs12>
                <v-divider class="my-3"/>
            </v-flex>
            <v-spacer/>
            <v-flex xs10 md11/>
            <v-flex xs2 md1>
                <v-btn color="success" @click="SendCheckExams"> Enviar</v-btn>
            </v-flex>
            <v-flex xs12 v-if="loading">
                <v-progress-linear color="primary" indeterminate/>
            </v-flex>
        </v-layout>
        <v-dialog v-model="successUpdateExams" persistent max-width="400">
            <success-update-discharge-procedures @closeDialog="DialogSucess()" ></success-update-discharge-procedures>
        </v-dialog>
        <v-dialog v-model="dialogContestValue" persistent max-width="400">
            <contest-value-discharge-procedures @dialogContestValue="DialogContestValueChange($event)" @ContestValue="FunctionContestValue($event)" :ContestExam="ContestExam" ></contest-value-discharge-procedures>
        </v-dialog>
    </v-container>
</template>

<script>
    import {mask} from "vue-the-mask";
    import ContestValueDischargeProcedures from './ContestValueDischargeProcedures'
    import SuccessUpdateDischargeProcedures from './SuccessUpdateDischargeProcedures'


    export default {
        name: "TemplateDischargeProcedures",
        directives: {
            mask
        },
        components:{SuccessUpdateDischargeProcedures, ContestValueDischargeProcedures},
        props:['outtake','user','loading','dialogContestValue','successUpdateExams'],
        data() {
            return {
                ContestExam:[],
                NewValue: '',
                file:[],
                files:[]
            };
        },

        methods: {
            removeFile(index,intake,outtak) {
                intake.result.splice(index, 1);
                let exams = outtak.exams
                let values = {
                    outtake: outtak,
                    field: "results",
                    exams: exams
                }
                this.$emit('removeFiles', values)
            },
            DialogSucess(){
              this.$emit('SuccessUpdate', false)
            },
            DialogContestValueChange(event){
                this.$emit('dialogContestValue',event)
            },
            DividerContestValue(intake){
                this.$emit('dialogContestValue', true)
                this.ContestExam= intake
            },
            async FunctionContestValue(NewValue){
                this.ContestExam.NewValue = NewValue
                let values ={
                    NewValue: NewValue,
                    ContestExam: this.ContestExam
                }
                this.$emit('ContestValue', values);
            },
            async AddResultExam(intake,outtak,index){
                let values = {
                    intake: intake,
                    outtak: outtak,
                    index: index,
                    files: this.files,
                    file: this.file
                }
                this.$emit('AddResultExam',values)
            },
            async SendCheckExams(){
                this.$emit('CheckExams')
            }
        }
    };
</script>
