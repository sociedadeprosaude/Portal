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
            <v-card>
                <v-layout row wrap>
                    <v-flex xs12>
                        <p  class="mt-3 font-italic font-weight-bold">Atualizado Com Sucesso</p>
                    </v-flex>
                    <v-flex xs12>
                        <v-btn color="success" @click="successUpdateExams = !successUpdateExams">Fechar</v-btn>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogContestValue" persistent max-width="400">
            <v-card>
                <v-layout row wrap>
                    <v-flex xs12>
                        <p  class="mt-3 font-italic font-weight-bold">Exame: {{ContestExam.name}}</p>
                    </v-flex>
                    <v-flex xs12>
                        <p>Valor Atual: {{ContestExam.cost}}</p>
                    </v-flex>
                    <v-flex xs2>
                    <v-spacer></v-spacer>
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field v-model="NewValue" label="Valor Correto"></v-text-field>
                    </v-flex>
                    <v-flex xs2>
                        <v-spacer></v-spacer>
                    </v-flex>
                    <v-flex xs12>
                        <v-btn color="success" @click="FunctionContestValue">Enviar</v-btn>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import {mask} from "vue-the-mask";

    export default {
        name: "TemplateDischargeProcedures",
        directives: {
            mask
        },
        props:['outtake','user'],
        data() {
            return {
                loading: false,
                successUpdateExams: false,
                dialogContestValue: false,
                ContestExam:[],
                NewValue: '',
                file:[],
                files:[]
            };
        },

        methods: {
            async removeFile(index,intake,outtak) {
                intake.results.splice(index, 1);
                let exams = outtak.exams

                await this.$store.dispatch("updateOuttakeExams", {
                    outtake: outtak,
                    field: "results",
                    exams: exams
                });
            },
            DividerContestValue(intake){
                this.dialogContestValue= true;
                this.ContestExam= intake
            },
            async FunctionContestValue(){
                let clinic= await this.$store.dispatch('getClinic', this.user.cnpj)
                this.ContestExam.NewValue = this.NewValue
                await this.$store.dispatch('addNewContestValue',{exams:this.ContestExam, value:this.NewValue, cnpj:this.user.cnpj, numberIntake:this.outtake.intakeNumber, clinic:clinic.docs[0].id})
                this.dialogContestValue = !this.dialogContestValue
                this.NewValue=0
            },
            async AddResultExam(intake,outtak,index){
                if(!intake.result){
                    intake.result = []
                }
                await this.$store.dispatch("deleteFile", {
                    imagePaths: intake.result,
                    path: "outtakes/resultExams"
                });
                if(this.files.indexOf(this.file[0]) < 0 && this.file.length > 0){
                    this.files.push(this.file[0])
                    this.file= []
                }
                let urls = await this.submitFiles(this.files)
                let exams = outtak.exams
                exams[index].result = urls
                await this.$store.dispatch("updateOuttakeExams", {
                    outtake: outtak,
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
            }
        }
    };
</script>
