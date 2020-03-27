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
            <v-flex>
                <v-card flat class="pa-10 receipt-to-print">
                    <v-layout
                            row
                            wrap
                            class="align-center pa-4 mt-4"
                            style="border: 2px solid #2196f3; border-radius: 16px"
                    >
                        Dr. JONATAS
                        CRM:130913
                        Especialidade: CARDIOLOGIA
                        Procedimento: Consulta
                        Data:26/03/2020 - 13:00
                        <v-spacer></v-spacer>
                        Data: {{hoje}} - {{dia}}
                        <v-flex xs4 >
                            <v-img v-if="selectedUnit"
                                   :src="selectedUnit.logo"
                                   width="400"
                            ></v-img>
                        </v-flex>
                        RYAN DE BARBA NEGRA
                        CPF:00293048544
                        Data de Nascimento:27/01/1995
                        Idade:25
                        <v-spacer></v-spacer>

                        <v-flex xs12 class="white" style="color: white">.</v-flex>

                        <v-flex xs12 v-for="(dados,i) in medicines" :key="i">
                            <ul>
                                <li style="list-style-type: none;">
                                    {{dados.name}} - {{dados.concentration}} - {{dados.pharmaceutical}}
                                    <v-layout class="align-center justify-center">
                                        <v-flex xs12>
                                            <v-text-field :prefix="dados.name + ' - '+ 'Observações:'" outlined></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                    <!--<v-flex><strong style="color: white">.</strong></v-flex>-->
                                </li>
                            </ul>
                        </v-flex>

                        <v-flex xs12 style="height: 550px"></v-flex>
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
            selectedUnit() {
                return this.$store.getters.selectedUnit
            },
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