<template>
    <v-card>
        <v-card-text>
            <v-layout wrap row class="mt-4">
                <v-flex xs12>
                    <v-text-field prepend-icon="poll" outlined v-model="exam.name" readonly/>
                </v-flex>
                <v-flex xs6>
                    <v-currency-field
                            prepend-icon="attach_money"
                            outlined
                            clearable
                            label="Preço de Custo"
                            prefix="R$"
                            v-model="exam.cost"
                            hide-details>
                    </v-currency-field>
                </v-flex>
                <v-flex xs6>
                    <v-currency-field
                            prepend-icon="monetization_on"
                            outlined
                            clearable
                            label="Preço de Venda"
                            prefix="R$"
                            v-model="exam.price"
                            hide-details>
                    </v-currency-field>
                </v-flex>
                <v-flex xs12 class="mt-3">
                    <v-textarea
                            outlined
                            v-model="exam.obs"
                            label="Observação:"
                            counter
                            clearable
                            maxlength="280"
                            full-width
                            single-line
                            hide-details>
                    </v-textarea>
                </v-flex>
            </v-layout>
            <v-divider class="primary mt-3"/>
            <v-card-actions>
                <v-layout class="align-center justify-center">
                    <v-btn color="error" @click="closeForm()">CANCELAR</v-btn>
                    <v-spacer/>
                    <v-btn
                            :disabled="!formIsValide"
                            @click="editExam()"
                            color="success"
                    >
                        SALVAR
                    </v-btn>
                </v-layout>
            </v-card-actions>
        </v-card-text>
    </v-card>
</template>
<script>
    export default {
        props: ['exam', 'clinic'],
        data: () => ({}),
        computed: {
            formIsValide() {
                return this.exam.name
            },
        },
        methods: {
            editExam() {
                this.$store.dispatch('addExamToClinic', {
                    clinic: this.clinic,
                    exam: this.exam.name,
                    cost: this.exam.cost,
                    sale: this.exam.price,
                    rules: this.exam.rules,
                    obs: this.exam.obs,
                });
                this.closeForm()
            },
            closeForm() {
                this.$emit('close-dialog')
            },

        }
    }
</script>