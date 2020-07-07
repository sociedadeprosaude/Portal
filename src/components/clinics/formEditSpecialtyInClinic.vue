<template>
    <v-card>
        <v-card-text>
            <v-layout wrap row class="mt-4">
                <v-flex xs12>
                    <v-text-field
                            prepend-icon="assignment"
                            label="Consultas"
                            outlined
                            v-model="specialty.name"
                            readonly
                            hide-details>
                    </v-text-field>
                </v-flex>
                <v-flex xs12 class="mt-3">
                    <v-text-field
                            prepend-icon="assignment_ind"
                            label="Médicos"
                            outlined
                            v-model="nameDoctor"
                            readonly
                            hide-details>
                    </v-text-field>
                </v-flex>
                <v-flex xs12 class="mt-3">
                    <v-select
                            prepend-icon="payment"
                            :items="paymentOptions"
                            label="Forma de Pagamento"
                            outlined
                            v-model="payment"
                            clearable
                            chips
                            hide-details>
                    </v-select>
                </v-flex>
                <v-flex xs6 class="mt-3">
                    <v-currency-field
                            prepend-icon="attach_money"
                            outlined
                            clearable
                            label="Preço de Custo"
                            prefix="R$"
                            v-model="cost"
                            hide-details>
                    </v-currency-field>
                </v-flex>
                <v-flex xs6 class="mt-3">
                    <v-currency-field
                            prepend-icon="monetization_on"
                            outlined
                            clearable
                            label="Preço de Venda"
                            prefix="R$"
                            v-model="price"
                            hide-details>
                    </v-currency-field>
                </v-flex>
                <v-flex xs12 class="mt-3">
                    <v-textarea
                            outlined
                            v-model="obs"
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
        </v-card-text>
        <v-card-actions>
            <v-btn color="error" @click="closeForm">CANCELAR</v-btn>
            <v-spacer/>
            <v-btn :disabled="!formIsValide" @click="editSpecialty" color="success">SALVAR</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
    export default {
        props: ['specialty', 'clinic', 'doctor'],
        data: () => ({
            cpf: '',
            crm: '',
            nameDoctor: '',
            cost: '',
            price: '',
            obs: '',
            payment: '',
            paymentOptions: [
                {text: 'Consultas', value: 'unit'},
                {text: 'Dia', value: 'daily'},
            ],
        }),

        mounted() {
            this.cpf = this.doctor.cpf;
            this.crm = this.doctor.crm;
            this.nameDoctor = this.doctor.name;
            this.cost = this.doctor.cost;
            this.price = this.doctor.price;
            this.obs = this.doctor.rules;
            this.payment = this.doctor.payment_method;
        },

        computed: {
            formIsValide() {
                return this.doctor && this.specialty && this.payment
            }
        },

        methods: {
            closeForm() {
                this.$emit('close-dialog')
            },
            async editSpecialty() {
                await this.$store.dispatch('addAppointment', {
                    clinic: this.clinic,
                    specialtie: this.specialty.name,
                    doctor: this.nameDoctor,
                    crm: this.crm,
                    cpf: this.cpf,
                    cost: this.cost,
                    price: this.price,
                    obs: this.obs,
                    payment: this.payment,
                });
                this.closeForm();
            }
        }
    }
</script>