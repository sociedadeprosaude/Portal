<template>
    <v-container fluid class="fill-height ma-0 pa-0">
        <v-layout row wrap class="align-center justify-center white">
            <v-flex xs6 class="text-left white">
                <v-btn class="transparent" text  @click="closeDialog()">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-flex>
            <v-flex xs6 class="text-right white">
                <v-btn class="transparent" text @click="print()">
                    <v-icon>print</v-icon>
                </v-btn>
            </v-flex>
            <v-flex xs12>
                <v-divider></v-divider>
            </v-flex>

            <v-flex>
                <v-card flat class="pa-10 receipt-to-print">
                    <v-layout row wrap class="align-center pa-4 mt-4" style="border: 2px solid #2196f3; border-radius: 16px">
                        <v-img :src="require('@/assets/pro_saude_logo_transparente.png')">

                            <v-layout class="align-center justify-center">
                                <v-flex xs6>
                                    <img :src="consultation.clinic.logo"/>
                                </v-flex>
                            </v-layout>

                            <v-flex xs12 class="transparent" style="color: transparent">.</v-flex>

                            <v-flex xs12 class="align-center justify-center">
                                <v-layout row wrap class="align-center justify-center">
                                    <span class="my-sub-headline primary--text" style="font-size: 1.4em;text-decoration: underline">EXAMES</span>
                                </v-layout>
                            </v-flex>

                            <v-flex xs12 class="transparent" style="color: transparent">.</v-flex>

                            <v-layout row rap class="align-start justify-start">
                                <v-flex xs12 v-for="(dados,i) in exams" :key="i">
                                    <ul>
                                        <li style="list-style-type: none;">
                                            <span>{{ dados.name }}</span>
                                        </li>
                                    </ul>
                                </v-flex>
                            </v-layout>

                        </v-img>

                        <v-layout class="align-center justify-center">
                            <v-flex xs4>
                                <v-divider color="black"></v-divider>
                                {{consultation.doctor.name}}
                                <br/>
                                CRM-AM {{consultation.doctor.crm}}
                            </v-flex>
                        </v-layout>

                    </v-layout>

                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    var moment = require('moment');
    export default {
        name: "solicitationsPDF",
        props:['consultation', 'exams'],
        data: () => ({
            moment: moment,
            hoje: undefined,
            dia: undefined,
        }),
        computed:{
            //
        },
        watch:{
            //
        },
        mounted() {
            this.hoje = moment().locale('pt-BR').format('DD/MM/YYYY HH:mm:ss')
            this.dia = moment().format('dddd')
        },
        methods: {
            save(){
                this.$store.dispatch('addSolicitationsToConsultation',{
                    Solicitations: this.exams,
                    consultation: this.consultation.id,
                    patient: this.consultation.user.id
                })
            },
            print () {
                this.save()
                window.print()
            },
            clear() {
                this.closeDialog()
            },
            closeDialog: function () {
                this.$emit('close-dialog')
            },
        },
    }
</script>

<style scoped>
</style>