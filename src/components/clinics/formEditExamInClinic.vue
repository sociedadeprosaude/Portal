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
                            label="Preço de Venda"
                            prefix="R$"
                            v-model="exam.price"
                            readonly
                            hide-details>
                    </v-currency-field>
                </v-flex>
            </v-layout>
            <v-divider class="primary mt-3"/>
            <v-card-actions>
                <v-layout class="align-center justify-center">
                    <v-btn color="error" @click="closeForm()">CANCELAR</v-btn>
                    <v-spacer/>
                  <div>
                    <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
                    <v-btn v-else @click="editExam()" color="success">
                        SALVAR
                    </v-btn>
                  </div>
                </v-layout>
            </v-card-actions>
        </v-card-text>
    </v-card>
</template>
<script>
    export default {
        props: ['exam', 'clinic'],
        data: () => ({
          loading: false,
        }),
        methods: {
            async editExam() {
              this.loading = true
              await this.$apollo.mutate({
                mutation: require('@/graphql/clinics/UpdateCostProductClinic.gql'),
                variables: {
                  id: this.exam.idcpc,
                  cost: this.exam.cost,
                },
              });
              this.loading = false
              this.$router.push('/')
            },

            closeForm() {
                this.$emit('close-dialog')
            },

        }
    }
</script>