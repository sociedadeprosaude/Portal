<template>
    <v-container full-width>
        <v-layout align-left justify-left>
            <v-btn
                    @click="back"
                    color="error"
                    rounded
                    class="mb-2 elevation-6"
            >
                <v-icon left>arrow_back</v-icon>
                VOLTAR
            </v-btn>
        </v-layout>
        <v-layout row wrap>
            <v-content>
                <v-flex xs12>
                    <v-card class="pa-4">
                        <v-layout wrap>
                            <v-flex xs5>
                                <v-select
                                        label="categoria"
                                        v-model="categoria"
                                        :items="Categorias"
                                ></v-select>
                            </v-flex>
                            <v-flex xs2>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn class="mx-2" fab dark small color="blue"
                                               @click="() => {verificador = !verificador}">
                                            <v-icon color="primary" v-on="on">add</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Adicionar nova Categoria</span>
                                </v-tooltip>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs4>
                                <v-currency-field
                                        label="valor"
                                        v-model="valor"
                                        :rules="[rules.required||rules.valor]"
                                        required
                                ></v-currency-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field
                                        label="Descrição"
                                        v-model="descricao"
                                >
                                </v-text-field>
                            </v-flex>
                            <v-flex rigth>
                                <submit-button text="Enviar" :loading="loading" :success="success"
                                               @reset="success = false"
                                               @click="enviar()">
                                </submit-button>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>
            </v-content>
            <v-dialog
                    v-model="verificador"
            >
                <v-card>
                    Adicionar Nova Categoria
                    <v-text-field
                            v-model="categoriaNova"
                    >
                    </v-text-field>
                    <submit-button text="Adicionar" :loading="loading" :success="success" @reset="success = false"
                                   @click="adicionarCategoria()">
                    </submit-button>
                </v-card>
            </v-dialog>
        </v-layout>
    </v-container>
</template>

<script>
    import Vue from 'vue'
    import moment from 'moment'
    import SubmitButton from "../../components/SubmitButton";


    export default {
        components: {SubmitButton},
        data: () => ({
            descricao: '',
            categoria: '',
            valor: 0,
            verificador: false,
            categoriaNova: '',
            aviso: false,
            now: moment().valueOf(),
            loading: false,
            success: false,
            data: moment().format("YYYY-MM-DD HH:mm:ss"),
            rules: {
                valor: value => {
                    const pattern = /(^(\d)+(,(\d)+)*$|^$)/
                    return pattern.test(value) || 'Digite apenas números exemplo:" 2.5 "'
                }
            }
        }),
        methods: {
            enviar() {
                this.loading = true;
                this.$store.dispatch('AddSaida', {
                    description: this.descricao,
                    category: this.categoria,
                    value: parseFloat(this.valor),
                    id: moment().valueOf(),
                    date: this.data,
                    paid: this.data,
                    colaborator: this.user,
                    payment_method: 'Dinheiro'
                })
                this.success = true;
                this.loading = false;
                this.descricao = '';
                this.valor = 0;
                this.categoria = '';
            },
            adicionarCategoria() {
                this.$store.dispatch('AddCategorie', {categoria: this.categoriaNova})
                this.success = true;
                this.loading = false;
                this.$store.dispatch('LoadCategories');
                setTimeout(() => {
                    this.categoriaNova = '';
                    this.verificador = false;
                }, 1000)
                this.verificador = !this.verificador;
                this.categoriaNova = '';
            },
            back() {
                this.$router.push('/caixa')
            },
        },
        mounted() {
            this.$store.dispatch('LoadCategories')
        },
        computed: {
            Categorias() {
                return this.$store.getters.categoria;
            },
            user() {
                return this.$store.getters.user
            }
        }

    }
</script>

<style>

</style>
