<template>
    <v-container class="ma-0 pa-0">
        <v-layout row wrap class="ma-0 pa-0" id="card-to-print">
            <v-flex xs12 class="mb-1">
                <v-card width="100vw" height="100vh">
                    <v-img height="100%" width="100%" class="px-4 py-2 ma-0">
                        <v-layout row wrap style="font-size: 0.8em">
                            <v-flex xs3 class="text-left">
                                <span class="font-weight-bold" style="font-size: 1.0em">{{user.name}}</span>
                            </v-flex>
                            <v-flex xs1 class="text-right">
                                <v-layout column wrap>
                                    <span class="font-weight-bold" style="font-size: 1.2em">{{user.association_number}}</span>
                                </v-layout>
                            </v-flex>
                            <v-flex xs8></v-flex>
                            <v-flex xs2 class="text-left mt-2">
                                <v-layout column wrap>
                                    <span class="font-weight-bold" style="font-size: 1.2em">{{actualDate}}</span>
                                </v-layout>
                            </v-flex>
                            <v-flex xs2 class="text-right mt-2">
                                <v-layout column wrap>
                                    <span class="font-weight-bold"
                                          style="font-size: 1.2em">{{user.birth_date | dateFilter}}</span>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-img>
                </v-card>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs12 class="text-right">
                <v-card width="100vw" height="100vh">
                    <v-img :src="require('../../assets/card_background.jpg')" height="100%" width="100%" class="px-8 py-2">
                        <v-layout row wrap>
                            <v-flex xs8 class="text-left mt-2" style="font-size: 0.8em">
                                <v-layout column wrap>
                                    <span class="font-weight-bold white--text">
                                        <img src="../../assets/icons/instagram-logo.svg" height="12px"> @sociedadeprosaude
                                    </span>
                                    <span class="font-weight-bold white--text">
                                        <img src="../../assets/icons/facebook-logo.svg" height="12px">  sociedadeprosaude
                                    </span>
                                    <span class="font-weight-bold white--text">
                                        <img src="../../assets/icons/world-shape-public-symbol.svg" height="12px">  sociedadeprosaude.com
                                    </span>
                                </v-layout>
                            </v-flex>
                            <v-flex xs4 style="font-size: 0.8em">
                                <v-layout column wrap>
                                    <span class="font-weight-bold white--text"
                                          style="font-size: 0.6em">Nossas unidades</span>
                                    <span class="font-weight-bold white--text">
                                        <v-icon class="white--text pb-1" style="font-size: 1.2em">alarm</v-icon>
                                        6:00 - 17:00</span>
                                    <span class="font-weight-bold white--text"
                                          style="font-size: 0.6em">Atendimento por telefone</span>
                                    <span class="font-weight-bold white--text">
                                                                                <v-icon class="white--text pb-1"
                                                                                        style="font-size: 1.2em">alarm</v-icon>
                                        7:30 - 17:00</span>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 class="text-left" style="height: 50px">
                            </v-flex>
                            <v-flex xs6 class="text-left pt-4">
                                <v-layout column wrap>
                                    <span class="font-weight-bold white--text" style="font-size: 0.8em">
                                        <img src="../../assets/icons/icons8-whatsapp.svg" height="14px">
                                        (92)99146-0334</span>
                                    <span class="font-weight-bold white--text" style="font-size: 0.8em">
                                        <v-icon class="white--text" style="font-size: 1.2em">phone</v-icon>
                                        (92)3232-4149</span>
                                </v-layout>
                            </v-flex>
                            <v-flex xs6 class="text-right">
                                <v-layout column wrap>
                                    <span class="font-weight-bold white--text"
                                          style="font-size: 0.6em">Válido nas unidades</span>
                                    <span class="font-weight-bold white--text">Cidade Nova</span>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-img>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "PatientTag",
        props: ['user'],
        data() {
            return {
                validDate: moment().add(1, 'year').format('MM/YY')
            }
        },
        methods: {
            print() {
                window.print()
            }
        },
        computed: {
            actualDate() {
                return moment(this.user.created_at, 'YYYY-MM-DD HH:mm:ss').format('MM/YY')
            },
            selectedUnit() {
                return this.$store.getters.selectedUnit
            },
        }
    }
</script>
