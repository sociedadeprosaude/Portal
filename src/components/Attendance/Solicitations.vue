<template>
    <v-container>
        <v-layout row wrap>

            <v-container fluid grid-list-xl>
                <v-card
                        outlined
                        class="elevation-6"
                >
                    <v-layout align-center wrap>

                        <v-flex xs11>
                            <v-combobox
                                    prepend-icon="spellcheck"
                                    v-model="exams"
                                    :items="examsOptions"
                                    outlined
                                    hide-details
                                    chips
                                    clearable
                                    multiple
                                    placeholder="Digite o nome do exame para pesquisar"
                            >
                                <template v-slot:selection="data">
                                    <v-chip
                                            color="primary"
                                            :key="JSON.stringify(data.item)"
                                            :selected="data.selected"
                                            :disabled="data.disabled"
                                            class="v-chip--select-multi"
                                            @click.stop="data.parent.selectedIndex = data.index"
                                            @input="data.parent.selectItem(data.item)"
                                    >
                                        <strong style="font-size: 15px">{{ data.item }}</strong>
                                    </v-chip>
                                </template>
                            </v-combobox>
                        </v-flex>

                    </v-layout>
                </v-card>
            </v-container>

            <v-container class="py-0 my-0 ml-0">
                <v-layout align-center justify-center>
                    <v-card width="700" class="elevation-6">
<!--                        <v-img :src="require('../assets/pro_saude_logo_transparente.png')">-->
                            <v-layout align-center row wrap>
                                <v-flex xs12>
<!--                                    <v-img
                                            :src="require('../assets/logo-pro-saude.png')"
                                            class="my-3"
                                            contain
                                            height="50"
                                    ></v-img>-->
                                </v-flex>
                                <v-flex xs12>
                                    <h2 style="text-align: center">EXAMES</h2>
                                    <br/><br/><br/>
                                    <p style="text-align: center; text-justify: auto">
                                        <strong>
                                            NOME: {{paciente}}<br/>
                                            ESTA IMPOSSIBILITADO(A) A COMPARECER A SEU TRABALHO DE:<br/>
                                            <br/>
                                            Este atestado é valido para finalidade previstas np Art. 86 do RGPS, aprovado pelo decreto nº 14.03.67 e será expedido para justificativa de 1 a 15 dias de afastamento do trabalho.<br/>
                                            <br/><br/><br/><br/>
                                            MANAUS, DATA.
                                            <br/><br/><br/><br/><br/><br/><br/>
                                            <v-layout align-center justify-center>
                                                <v-flex xs4 lalign-center justify-center>
                                                    <v-divider color="black"></v-divider>
                                                    {{medico}}
                                                    {{crm}}
                                                </v-flex>
                                            </v-layout>
                                        </strong>
                                    </p>
                                </v-flex>
                            </v-layout>
                        </v-img>
                    </v-card>
                </v-layout>
            </v-container>

            <v-layout align-center justify-center>
                <v-btn
                        align-center
                        justify-center
                        round
                        color="primary"
                        :disabled="!formIsValid"
                >
                    IMPRIMIR
                    <v-icon right color="white">print</v-icon>
                </v-btn>
            </v-layout>

        </v-layout>
    </v-container>
</template>

<script>
    var moment = require('moment');
    export default {
        data: () => ({
            medico: 'JACKSON KELVIN DE SOUZA',
            crm:'55874',
            paciente: 'JACKSON KELVIN DE SOUZA',
            moment: moment,
            exams: [],
            dateFormatted: '',
            examsOptions: [],
        }),
        computed: {
            formIsValid() {
                return this.exams.length > 0
            },
        },
        async mounted() {
        },
        watch: {
        },
        methods: {
        }
    }
</script>
<style scoped>
</style>