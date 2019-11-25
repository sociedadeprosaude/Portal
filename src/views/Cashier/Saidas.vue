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
            <v-flex xs12>
                <v-card>
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
                                    <v-btn class="mx-2" fab dark small color="blue" @click="() => {verificador = !verificador}">
                                        <v-icon color="primary" v-on="on">add</v-icon>
                                    </v-btn>
                                </template>
                                <span>Adicionar nova Categoria</span>
                            </v-tooltip>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-flex xs4>
                            <v-text-field
                                    label="valor"
                                    v-model="valor"
                                    :rules="[rules.required||rules.valor]"
                                    required
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    label="Descrição"
                                    v-model="descricao"
                            >
                            </v-text-field>
                        </v-flex>
                        <v-flex rigth>
                            <v-btn
                                    @click="enviar"
                            >Enviar</v-btn>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-dialog
             v-model="verificador"
            >
                <v-card>
                    Adicionar Nova Categoria
                    <v-text-field
                    v-model="categoriaNova"
                    >
                    </v-text-field>
                    <v-btn @click="adicionarCategoria()">
                        <v-icon>add</v-icon>
                    </v-btn>
                </v-card>
            </v-dialog>
            <v-dialog v-model="aviso">
                <v-card color="green" dark>
                    <v-card-title>Sucesso</v-card-title>
                    <v-card-text color="white">Saida cadastrada com sucesso</v-card-text>
                </v-card>
            </v-dialog>
        </v-layout>
    </v-container>
</template>

<script>
    import Vue from 'vue'
    import moment from 'moment'


    export default {
        data: () => ({
            descricao:'',
            categoria:'',
            valor:0,
            verificador:false,
            categoriaNova:'',
            aviso:false,
            data: moment().format("YYYY-MM-DD HH:mm:ss"),
            rules: {
                valor: value =>{
                    const pattern = /(^(\d)+(\.(\d)+)*$|^$)/
                    return pattern.test(value) || 'Digite apenas números exemplo:" 2.5 "'
                }
            }
        }),
        methods: {
            enviar(){
                this.$store.dispatch('AddSaida',{descricao:this.descricao, categoria:this.categoria, valor: this.valor, codigo:this.data}).then(() =>{
                    this.aviso=true
                });
                this.descricao='';
                this.valor=0;
                this.categoria='';
            },
            adicionarCategoria(){
                this.$store.dispatch('AddCategorie',{categoria: this.categoriaNova}).then(() => {
                    this.$store.dispatch('LoadCategories');
                });
                this.verificador= !this.verificador;
                this.categoriaNova= '';
            },
            back(){
                this.$router.push('/caixa')
            },
        },
        mounted() {
            this.$store.dispatch('LoadCategories')
        },
        computed: {
         Categorias(){
             return this.$store.getters.categoria;
         }
        }

    }
</script>

<style>

</style>