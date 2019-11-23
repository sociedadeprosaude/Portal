<template>
    <v-card width="500">
        <v-card-title class="headline grey lighten-2" primary-title>
            <span class="headline">Produtos Cadastrados</span>
        </v-card-title>
        <v-card-text>
            <v-container grid-list-md>
                <v-layout align-center justify-center wrap>

                    <v-flex xs12>
                        <v-text-field
                                prepend-icon="business"
                                label="Clinicas"
                                outlined
                                readonly
                                v-model="selectedClinic.nome"
                                hide-details
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-select
                                prepend-icon="edit"
                                :items="options"
                                label="Opções"
                                outlined
                                v-model="option"
                                clearable
                                chips
                                hide-details
                        ></v-select>
                    </v-flex>

                    <v-layout v-if="option === 'Consultas' " align-center justify-center wrap>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout align-center justify-center wrap>
                                    <v-flex xs12>
                                        <v-select
                                                prepend-icon="assignment"
                                                :items="consultationsOptions"
                                                label="Consultas"
                                                outlined
                                                v-model="consultations"
                                                clearable
                                                chips
                                                hide-details
                                        ></v-select>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-select
                                                multiple
                                                prepend-icon="assignment_ind"
                                                :items="doctorsOptions"
                                                label="Médicos"
                                                outlined
                                                v-model="doctors"
                                                clearable
                                                chips
                                                hide-details
                                        ></v-select>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-select
                                                prepend-icon="payment"
                                                :items="paymentOptions"
                                                label="Forma de Pagamento"
                                                outlined
                                                v-model="payment"
                                                clearable
                                                chips
                                                hide-details
                                        ></v-select>
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-text-field
                                                prepend-icon="attach_money"
                                                outlined
                                                clearable
                                                label="Preço de Custo"
                                                placeholder="ex.: 50.00"
                                                v-mask="['###.##' , '##.##', '####.##']"
                                                v-model="cost"
                                                prefix="R$"
                                                hide-details
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-text-field
                                                prepend-icon="monetization_on"
                                                outlined
                                                clearable
                                                label="Preço de Venda"
                                                placeholder="ex.: 80.00"
                                                v-mask="['###.##' , '##.##', '####.##']"
                                                v-model="sale"
                                                prefix="R$"
                                                hide-details
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-textarea
                                                outlined
                                                v-model="obs"
                                                label="Observação:"
                                                counter
                                                clearable
                                                maxlength="280"
                                                full-width
                                                single-line
                                                hide-details
                                        ></v-textarea>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-layout align-center justify-center>
                                <v-btn
                                        color="error"
                                        @click="clear()"
                                >
                                    <v-icon>
                                        delete
                                    </v-icon>
                                    APAGAR
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn
                                        @click="save()"
                                        color="warning"
                                >
                                    <v-icon>
                                        edit
                                    </v-icon>
                                    EDITAR
                                </v-btn>
                            </v-layout>
                        </v-card-actions>
                    </v-layout>

                    <v-layout v-else-if="option === 'Exames' " align-center justify-center wrap>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout align-center justify-center wrap>
                                    <v-flex>
                                        <v-combobox
                                                multiple
                                                prepend-icon="poll"
                                                :items="listExam"
                                                item-text="nome"
                                                label="Exames"
                                                outlined
                                                v-model="exams"
                                                clearable
                                                chips
                                                hide-details
                                        ></v-combobox>
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-text-field
                                                prepend-icon="attach_money"
                                                outlined
                                                clearable
                                                label="Preço de Custo"
                                                placeholder="ex.: 50.00"
                                                v-mask="['###.##' , '##.##', '####.##']"
                                                v-model="cost"
                                                prefix="R$"
                                                hide-details
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-text-field
                                                prepend-icon="monetization_on"
                                                outlined
                                                clearable
                                                label="Preço de Venda"
                                                placeholder="ex.: 80.00"
                                                v-mask="['###.##' , '##.##', '####.##']"
                                                v-model="sale"
                                                prefix="R$"
                                                hide-details
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-textarea
                                                outlined
                                                v-model="obs"
                                                label="Observação:"
                                                counter
                                                clearable
                                                maxlength="280"
                                                full-width
                                                single-line
                                                hide-details
                                        ></v-textarea>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-layout align-center justify-center>
                                <v-btn
                                        color="error"
                                        @click="clear()"
                                >
                                    <v-icon>
                                        delete
                                    </v-icon>
                                    APAGAR
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn
                                        @click="save()"
                                        color="warning"
                                >
                                    <v-icon>
                                        edit
                                    </v-icon>
                                    EDITAR
                                </v-btn>
                            </v-layout>
                        </v-card-actions>
                    </v-layout>

                    <v-layout v-else align-center justify-center wrap>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout align-center justify-center wrap>
                                    <v-flex>
                                        <v-alert type="warning">
                                            Selecione uma das Opções acima para <strong>EDITAR</strong> ou <strong>DELATAR</strong> Consultas ou Exames.
                                        </v-alert>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                    </v-layout>

                </v-layout>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        data: () => ({

            option:'',
            options: [
                'Consultas',
                'Exames'
            ],
        }),

        computed: {

            selectedClinic() {
                return this.$store.getters.selectedClinic;
            },
        },

        methods:{

            save(){
                //
            }
        },
    }
</script>

<style scoped>

</style>