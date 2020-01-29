<template>
    <v-container class="ma-0 pa-0">
        <v-layout row wrap class="ma-0 pa-0">
            <v-flex xs12>
                <v-card class="ma-0 pa-0" id="card-to-print-alternate">
                    <v-img :src="require('../assets/carteira_fundo2.jpg')" class="px-4 py-2">
                        <v-layout row wrap>
                            <v-flex xs6 class="text-left">
                                <v-layout column wrap>
                                    <span class="font-weight-bold white--text" style="font-size: 1.2em">Sociedade</span>
                                    <span class="font-weight-bold white--text" style="font-size: 1.6em">Pró Saúde</span>
                                </v-layout>
                            </v-flex>
                            <v-flex xs6 class="text-right">
                                <img height="64px" :src="require('@/assets/pro_saude_logo.png')">
                            </v-flex>
                            <v-flex xs12 class="text-left">
                                <span class="font-weight-bold white--text" style="font-size: 1.0em">{{user.name}}</span>
                            </v-flex>
                            <v-flex xs12 class="text-left">
                                <v-layout column wrap>
                                    <span class="font-weight-bold white--text"
                                          style="font-size: 0.6em">No Associado</span>
                                    <span class="font-weight-bold white--text" style="font-size: 1.2em">{{user.association_number}}</span>
                                </v-layout>
                            </v-flex>
                            <v-flex xs4 class="text-left">
                                <v-layout column wrap>
                                    <span class="font-weight-bold white--text"
                                          style="font-size: 0.6em">Associado desde</span>
                                    <span class="font-weight-bold white--text" style="font-size: 1.2em">{{actualDate}}</span>
                                </v-layout>
                            </v-flex>
                            <v-flex xs4 class="text-left">
                                <v-layout column wrap>
                                    <span class="font-weight-bold white--text"
                                          style="font-size: 0.6em">Válido até</span>
                                    <span class="font-weight-bold white--text" style="font-size: 1.2em">{{validDate}}</span>
                                </v-layout>
                            </v-flex>
                            <v-flex xs4 class="text-left">
                                <v-layout column wrap>
                                    <span class="font-weight-bold white--text"
                                          style="font-size: 0.6em">Nascimento</span>
                                    <span class="font-weight-bold white--text"
                                          style="font-size: 1.2em">{{user.birth_date | dateFilter}}</span>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-img>
                </v-card>
            </v-flex>
<!--            <v-spacer></v-spacer>-->
<!--            <v-flex xs6 class="text-right">-->
<!--                <v-card>-->
<!--                    <v-img :src="require('../assets/card_background.jpg')" class="px-4 py-2">-->
<!--                        <v-layout row wrap>-->
<!--                            <v-flex xs8 class="text-left mt-2" style="font-size: 0.8em">-->
<!--                                <v-layout column wrap>-->
<!--                                    <span class="font-weight-bold white&#45;&#45;text">-->
<!--                                        <img src="../assets/icons/instagram-logo.svg" height="12px"> @sociedadeprosaude-->
<!--                                    </span>-->
<!--                                    <span class="font-weight-bold white&#45;&#45;text">-->
<!--                                        <img src="../assets/icons/facebook-logo.svg" height="12px">  sociedadeprosaude-->
<!--                                    </span>-->
<!--                                    <span class="font-weight-bold white&#45;&#45;text">-->
<!--                                        <img src="../assets/icons/world-shape-public-symbol.svg" height="12px">  sociedadeprosaude.com-->
<!--                                    </span>-->
<!--                                </v-layout>-->
<!--                            </v-flex>-->
<!--                            &lt;!&ndash;                            <v-flex xs2 class="text-right">&ndash;&gt;-->
<!--                            &lt;!&ndash;                                <img height="64px" :src="require('@/assets/pro_saude_logo.png')">&ndash;&gt;-->
<!--                            &lt;!&ndash;                            </v-flex>&ndash;&gt;-->
<!--                            <v-flex xs4 style="font-size: 0.8em">-->
<!--                                <v-layout column wrap>-->
<!--                                    <span class="font-weight-bold white&#45;&#45;text"-->
<!--                                          style="font-size: 0.6em">Nossas unidades</span>-->
<!--                                    <span class="font-weight-bold white&#45;&#45;text">-->
<!--                                        <v-icon class="white&#45;&#45;text pb-1" style="font-size: 1.2em">alarm</v-icon>-->
<!--                                        6:00 - 17:00</span>-->
<!--                                    <span class="font-weight-bold white&#45;&#45;text"-->
<!--                                          style="font-size: 0.6em">Atendimento por telefone</span>-->
<!--                                    <span class="font-weight-bold white&#45;&#45;text">-->
<!--                                                                                <v-icon class="white&#45;&#45;text pb-1"-->
<!--                                                                                        style="font-size: 1.2em">alarm</v-icon>-->
<!--                                        7:00 - 17:00</span>-->
<!--                                </v-layout>-->
<!--                            </v-flex>-->
<!--                            <v-flex xs12 class="text-left" style="height: 50px">-->
<!--                                &lt;!&ndash;                                <span class="font-weight-bold white&#45;&#45;text" style="font-size: 1.0em">Luiz Fernando Sarmento Nicolau</span>&ndash;&gt;-->
<!--                            </v-flex>-->
<!--                            <v-flex xs6 class="text-left pt-4">-->
<!--                                <v-layout column wrap>-->
<!--                                    <span class="font-weight-bold white&#45;&#45;text" style="font-size: 0.8em">-->
<!--                                        <img src="../assets/icons/icons8-whatsapp.svg" height="14px">-->
<!--                                        (92)99146-0334</span>-->
<!--                                    <span class="font-weight-bold white&#45;&#45;text" style="font-size: 0.8em">-->
<!--                                        <v-icon class="white&#45;&#45;text" style="font-size: 1.2em">phone</v-icon>-->
<!--                                        (92)3232-4149</span>-->
<!--                                </v-layout>-->
<!--                            </v-flex>-->
<!--                            <v-flex xs6 class="text-right">-->
<!--                                <v-layout column wrap>-->
<!--                                    <span class="font-weight-bold white&#45;&#45;text"-->
<!--                                          style="font-size: 0.6em">Válido nas unidades</span>-->
<!--                                    <span class="font-weight-bold white&#45;&#45;text">Matriz</span>-->
<!--                                    <span class="font-weight-bold white&#45;&#45;text">Cidade Nova</span>-->
<!--                                </v-layout>-->
<!--                            </v-flex>-->
<!--                            &lt;!&ndash;                            <v-flex xs4 class="text-left">&ndash;&gt;-->
<!--                            &lt;!&ndash;                                <v-layout column wrap>&ndash;&gt;-->
<!--                            &lt;!&ndash;                                    <span class="font-weight-bold white&#45;&#45;text"&ndash;&gt;-->
<!--                            &lt;!&ndash;                                          style="font-size: 0.6em">Nascimento</span>&ndash;&gt;-->
<!--                            &lt;!&ndash;                                    <span class="font-weight-bold white&#45;&#45;text"&ndash;&gt;-->
<!--                            &lt;!&ndash;                                          style="font-size: 1.2em">17/05/1973</span>&ndash;&gt;-->
<!--                            &lt;!&ndash;                                </v-layout>&ndash;&gt;-->
<!--                            &lt;!&ndash;                            </v-flex>&ndash;&gt;-->
<!--                        </v-layout>-->
<!--                    </v-img>-->
<!--                </v-card>-->
<!--            </v-flex>-->
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "PatientCard",
        data() {
            return {
                actualDate: moment().format('MM/YY'),
                validDate: moment().add(1, 'year').format('MM/YY')
            }
        },
        computed: {
          user () {
              return this.$store.getters.selectedPatient
          }
        },
        methods: {
            print() {
                window.print()
            }
        }
    }
</script>
