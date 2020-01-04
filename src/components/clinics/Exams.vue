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
                    <v-flex xs12 v-if="!loadingExams">
                        <v-combobox
                                prepend-inner-icon="search"
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
                    <v-flex xs12 v-else>
                        <v-layout column wrap class="align-center">
                            <span>Carregando exames...</span>
                            <v-progress-circular indeterminate class="primary--text"></v-progress-circular>
                        </v-layout>
                    </v-flex>
                    <v-flex>
                        <v-flex xs12>
                            <v-btn v-on:click="addToList" :disabled="!addIsValid" color="success">
                                <v-icon>add</v-icon>
                                adicionar na lista de exames
                            </v-btn>
                        </v-flex>
                        <v-flex>
                            <v-btn v-on:click="deleteFromList" :disabled="!deleteIsValid" color="error">
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
                                return-object
                                multiple
                                v-model="exams"
                                chips
                                outlined
                        >
                            <template v-slot:selection="data">
                                <v-chip
                                        :key="JSON.stringify(data.item)"
                                        :input-value="data.selected"
                                        :disabled="data.disabled"
                                        class="v-chip--select-multi"
                                        @click.stop="data.parent.selectedIndex = data.index"
                                        @input="data.parent.selectItem(data.item)"
                                        text-color="white"
                                        color="info"
                                >{{ data.item.name }}
                                </v-chip>
                            </template>
                        </v-select>
                    </v-flex>

                    <v-flex xs6>
                        <v-currency-field
                                prepend-icon="attach_money"
                                outlined
                                clearable
                                label="Preço de Custo"
                                prefix="R$"
                                v-model="cost"
                                hide-details
                        ></v-currency-field>
                    </v-flex>
                    <v-flex xs6>
                        <v-currency-field
                                prepend-icon="monetization_on"
                                outlined
                                clearable
                                label="Preço de Venda"
                                prefix="R$"
                                v-model="sale"
                                hide-details
                        ></v-currency-field>
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
                <submit-button :loading="loading" :success="succes" text="SALVAR" :disabled="!formIsValid" @click="save()"></submit-button>
<!--                <v-btn-->
<!--                        :disabled="!formIsValid"-->
<!--                        @click="save()"-->
<!--                        color="success"-->
<!--                >-->
<!--                    SALVAR-->
<!--                </v-btn>-->
            </v-layout>
        </v-card-actions>
    </v-card>
</template>

<script>
    import SubmitButton from "../SubmitButton";
    export default {
        data: () => ({
            cost: null,
            sale: null,
            rules: null,
            obs: null,
            exams: [],
            newExam: null,
            loadingExams: false,
            loading: false,
            succes: false
        }),
        components: {
            SubmitButton
        },
        computed: {
            formIsValid() {
                return this.sale && this.cost && this.exams.length > 0
            },
            addIsValid() {
                return this.newExam
            },
            deleteIsValid() {
                return this.exams.length > 0
            },
            selectedClinic() {
                return this.$store.getters.selectedClinic;
            },
            listExam() {
                return this.$store.getters.exams;
            },
        },

        mounted() {
            // this.loadExams()
            window.addEventListener('keydown', this.handleEnter)
        },
        beforeDestroy() {
            window.removeEventListener('keydown', this.handleEnter)
        },

        methods: {
            // async loadExams() {
            //     this.loadingExams = true
            //     await this.$store.dispatch('loadExam');
            //     this.loadingExams = false
            // },
            handleEnter(e) {
                if (e.key === 'Enter') {
                    this.addToList()
                }
            },
            addToList() {
                if (this.exams.indexOf(this.newExam) > -1) {
                    return
                }
                this.exams.push(this.newExam);
                this.newExam = null;
            },
            deleteFromList() {
                this.exams = [];
            },

            async save() {
                this.loading = true
                for (let i in this.exams) {
                    let examData = {
                        clinic: this.selectedClinic,
                        exam: this.exams[i].name,
                        rules: this.exams[i].rules,
                        obs: this.obs,
                        cost: this.cost,
                        sale: this.sale,
                    };
                    await this.$store.dispatch('addExamToClinic', examData);
                }
                this.loading = false
                this.succes = true
                setTimeout(() => {
                    this.clear()
                    this.succes = false
                }, 1000)
            },

            clear() {
                this.cost = null;
                this.sale = null;
                this.obs = null;
                this.exams = [];
                // this.$store.dispatch('selectClinic', null);
            },
        }
    }
</script>
<style scoped>
</style>
