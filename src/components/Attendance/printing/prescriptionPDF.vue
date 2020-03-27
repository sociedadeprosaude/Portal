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
                        <!--opacity: .3-->
                        <img style="position:absolute;z-index:0;width:300px; heigth:300px; bottom:0;" :src="require('@/assets/pro_saude_logo_transparente.png')">
                        <v-spacer></v-spacer>
                        <v-flex xs4>
                            <v-divider style="border: 2px solid #2196f3; border-radius: 10px"></v-divider>
                        </v-flex>

                        <v-flex xs4>
                            <img :src="consultation.clinic.logo"/>
                        </v-flex>

                        <v-flex xs4>
                            <v-divider style="border: 2px solid #2196f3; border-radius: 10px"></v-divider>
                        </v-flex>

                        <v-flex xs12 class="white" style="color: white">.</v-flex>

                        <v-flex xs12 class="align-center justify-center">
                            <v-layout row wrap class="align-center justify-center">
                                <span class="my-sub-headline primary--text" style="font-size: 1.4em;text-decoration: underline">RECEITUÁRIO</span>
                            </v-layout>
                        </v-flex>

                        <v-spacer></v-spacer>

                        <v-flex xs12 class="white" style="color: white">.</v-flex>

                        <v-flex xs12 v-for="(dados,i) in medicines" :key="i">
                            <ul>
                                <li style="list-style-type: none;">
                                    <span>{{ dados.name }} - {{ dados.concentration }} - {{ dados.pharmaceutical }}</span>
                                    <v-layout class="align-center justify-center">
                                        <v-flex xs12>
                                            <v-text-field dense hide-details prefix="Observações:" outlined></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </li>
                            </ul>
                        </v-flex>
<!--                        <v-flex xs12 style="height: 300px"></v-flex>-->
                        <v-flex xs12 style="height: 300px"></v-flex>
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
        props:['consultation', 'medicines'],
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
            print () {
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