<template>
    <v-card width="500">
        <v-card-title class="headline grey lighten-2" primary-title>
            <span class="headline">Cadastro de Exames</span>
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
                                v-model="this.selectedClinic.name"
                                hide-details
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-combobox
                                prepend-icon="poll"
                                :items="listExam"
                                item-text="name"
                                return-object
                                label="Exames"
                                outlined
                                v-model="newExam"
                                clearable
                                chips
                                hide-details
                        ></v-combobox>
                    </v-flex>
                    <v-flex>
                        <v-flex xs12>
                        <v-btn v-on:click="addToList" color="success">
                            <v-icon>add</v-icon>
                            adicionar na lista de exames
                        </v-btn>
                        </v-flex>
                        <v-flex>
                        <v-btn v-on:click="deleteFromList" color="error">
                            <v-icon>delete_forever</v-icon>
                            Limpar lista de exames
                        </v-btn>
                        </v-flex>
                    </v-flex>
                    <v-flex xs12>
                    <strong>EXAMES SELECIONADOS:</strong>
                    </v-flex>
                    <v-flex>
                        <v-select
                                :items="exams"
                                item-text="name"
                                item-value="name"
                                return-object
                                multiple
                                v-model="exams"
                                chips
                                outlined
                        >
                            <template v-slot:selection="data">
                                <v-chip
                                        :key="JSON.stringify(data.item)"
                                        :selected="data.selected"
                                        :disabled="data.disabled"
                                        class="v-chip--select-multi"
                                        @click.stop="data.parent.selectedIndex = data.index"
                                        @input="data.parent.selectItem(data.item)"
                                        text-color="white"
                                        color="info"
                                >{{ data.item.name }}</v-chip>
                            </template>
                        </v-select>
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
                <v-btn color="error" @click="clear()">CANCELAR</v-btn>
                <v-spacer></v-spacer>
                <v-btn
                        :disabled="!formIsValid"
                        @click="save()"
                        color="success"
                >
                    SALVAR
                </v-btn>
            </v-layout>
        </v-card-actions>
    </v-card>
</template>

<script>
    import {mask} from 'vue-the-mask';
    export default {
        directives: {mask},
        data: () => ({
            cost: null,
            sale: null,
            obs: null,
            exams: [],
            newExam: null,
        }),
        computed: {
            formIsValid() {
                return this.sale && this.cost && this.exams.length > 0
            },
            selectedClinic() {
                return this.$store.getters.selectedClinic;
            },
            listExam () {
                return this.$store.getters.exams;
            },
        },

        mounted() {
            this.$store.dispatch('loadExam');
        },

        methods:{
            addToList () {
                this.exams.push(this.newExam);
                this.newExam = null;
            },
            deleteFromList () {
                this.exams= [];
            },

            save(){
                for (let i in this.exams){
                    let examData = {
                        clinic: this.selectedClinic.name,
                        exam: this.exams[i].name,
                        cost:this.cost,
                        sale:this.sale,
                        obs:this.obs,
                    };
                    console.log(examData)
                    this.$store.dispatch('addExamToClinic', examData);
                }
                this.clear()
            },

            clear () {
                this.cost = null;
                this.sale =  null;
                this.obs =  null;
                this.exams = [];
                this.$store.dispatch('selectClinic', null);
            },
        }
    }
</script>
<style scoped>
</style>