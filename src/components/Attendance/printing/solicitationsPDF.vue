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
                    <v-layout row wrap class="align-center pa-4 mt-4" style="border: 2px solid #2196f3; border-radius: 16px">
                        <v-spacer></v-spacer>
                        <v-flex xs4>
                            <v-divider style="border: 2px solid #2196f3; border-radius: 10px"></v-divider>
                        </v-flex>

                        <v-flex xs4 >
                            <v-img v-if="selectedUnit"
                                   :src="selectedUnit.logo"
                                   width="400"
                            ></v-img>
                        </v-flex>

                        <v-flex xs4>
                            <v-divider style="border: 2px solid #2196f3; border-radius: 10px"></v-divider>
                        </v-flex>
                        <v-flex xs12 class="white" style="color: white">.</v-flex>
                        <v-layout row wrap class="align-center justify-center">
                            <v-flex xs12 class="align-center justify-center">
                                <span class="align-center justify-center">EXAMES</span>
                            </v-flex>
                        </v-layout>
                        <v-spacer></v-spacer>

                        <v-flex xs12 class="white" style="color: white">.</v-flex>

                        <v-flex xs12 v-for="(dados,i) in exams" :key="i">
                            <ul>
                                <li style="list-style-type: none;">
                                    {{dados.name}}
                                </li>
                            </ul>
                        </v-flex>

                        <v-flex xs12 style="height: 500px"></v-flex>

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
/*            exams: undefined,
            consultation: undefined*/
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
/*            this.exams = this.consultation
            this.consultation = this.consultation*/
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