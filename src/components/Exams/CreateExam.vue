<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card grid-list-x1 fluid class="mt-4">
                    <v-form v-model="validRegister" lazy-validation>
                        <v-card-text>
                            <v-layout wrap>
                                <v-flex xs12 sm12>
                                    <v-text-field
                                            outlined
                                            required
                                            label="Nome"
                                            v-model="editedExam.name"
                                            prepend-icon="description"
                                            :rules="rules.campoObrigatorio"
                                            class="ml-3 mr-3"
                                    />
                                </v-flex>
                                <v-flex xs12 sm12>
                                    <v-select
                                            class="ml-3 mr-3"
                                            label="Tipo"
                                            prepend-icon="school"
                                            v-model="editedExam.type"
                                            :items="specialties"
                                            item-text="name"
                                            return-object
                                            outlined
                                            chips
                                            color="pink"
                                            clearable
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
                                <v-flex xs12 sm12>
                                    <v-textarea
                                            outlined
                                            label="Regras"
                                            v-model="editedExam.rules"
                                            class="ml-3 mr-3"
                                            prepend-icon="report_problem"
                                    />
                                </v-flex>
                                <v-flex xs12 sm12>
                                    <v-text-field
                                            outlined
                                            required
                                            label="Preço"
                                            v-model="editedExam.price"
                                            prepend-icon="attach_money"
                                            :rules="rules.campoObrigatorio"
                                            class="ml-3 mr-3"
                                    />
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer/>
                            <submit-button
                                    :loading="loading"
                                    :success="success"
                                    text="Cadastrar Exame"
                                    :disabled="!formRegister"
                                    @click="validateRegister()"
                                    class="ma-3"
                            />
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    import SubmitButton from "../SubmitButton";

    export default {

        components: {SubmitButton},
        props: ['registed', 'selectedExam'],

        data: () => ({
            validRegister: true,
            loading: false,
            success: false,

            editedExam: {
                id: '', name: '', rules: '', type: '',
            },

            rules: {
                campoObrigatorio: [
                    v => !!v || 'Campo é Obrigatório',
                ],
            }
        }),

        mounted() {
            if(this.selectedExam){
                this.editedExam.name = this.selectedExam.name;
                this.editedExam.price = this.selectedExam.price;
                this.editedExam.rules = this.selectedExam.rules;
                this.editedExam.type = this.selectedExam.type;
            }
        },

        computed: {
            formRegister() {
                return this.editedExam.name;
            },
            specialties() {
                let specialties = this.$store.getters.specialties.slice();
                for (let spec in specialties) {
                    delete specialties[spec].doctors
                }
                return specialties
            },
        },

        methods: {
            handleEnter(e) {
                if (e.key === 'Enter') {
                    if (this.registerExam) {
                        this.validateRegister()
                    } else {
                        this.searchExams(this.searchText)
                    }
                }
            },

            validateRegister() {
                this.loading = true;
                this.registerProduct()
            },

            async registerProduct() {
                const examData = {
                    id: '',
                    name: this.editedExam.name.toUpperCase().replace(/\//g, "-"),
                    rules: this.editedExam.rules,
                    type: this.editedExam.type ? this.editedExam.type.name : undefined,
                };
                await this.$store.dispatch('addExam', examData);
                this.success = true;
                this.loading = false;
                this.clear();
                this.close();

            },

            clear() {
                this.editedExam.name = '';
                this.editedExam.type = null;
                this.editedExam.rules = '';
                this.editedExam.price = '';
                this.editedExam.id = '';
            },

            close () {
                this.$emit('close-dialog')
            }

        },
    }
</script>