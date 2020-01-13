<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card class="py-2 px-4">
                    <v-layout row wrap>
                        <v-flex xs12 class="text-left">
                            <span class="my-headline">Adicionar conta à pagar</span>
                        </v-flex>
                        <v-flex xs12 sm3>
                            <v-combobox
                                    outlined
                                    v-model="category"
                                    :items="categories"
                                    label="Categoria"
                            >
                            </v-combobox>
                        </v-flex>
                        <v-flex xs12 sm3 class="mx-3">
                            <v-select
                                    outlined
                                    label="Método de pagamento"
                                    v-model="paymentMethod"
                                    :items="paymentMethods"></v-select>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-flex xs12 sm2 class="mx-3">
                            <v-currency-field
                                    outlined
                                    v-model="value"
                            ></v-currency-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    outlined
                                    label="Descrição"
                                    v-model="description"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm4>
                            <span class="my-sub-headline">Data para pagamento</span>
                            <v-date-picker
                                    locale="pt-br"
                                    v-model="dateToPay"></v-date-picker>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <!--                        <v-flex xs12 sm7 class="mt-6">-->
                        <!--                            <v-layout row wrap v-if="paymentMethod === paymentMethods[0]">-->
                        <!--                                <v-flex xs12>-->
                        <!--                                    <v-text-field-->
                        <!--                                            outlined-->
                        <!--                                            label="Número do boleto"></v-text-field>-->
                        <!--                                </v-flex>-->
                        <!--                            </v-layout>-->
                        <!--                            <v-layout row wrap v-if="paymentMethod === paymentMethods[1]">-->
                        <!--                                <v-flex xs12>-->
                        <!--                                    <v-text-field-->
                        <!--                                            outlined-->
                        <!--                                            label="Número do boleto"></v-text-field>-->
                        <!--                                </v-flex>-->
                        <!--                            </v-layout>-->
                        <!--                        </v-flex>-->
                    </v-layout>
                </v-card>
            </v-flex>
            <v-fade-transition>
                <v-flex xs12 class="text-right mt-4" v-if="!loading">
                    <v-btn @click="addBill()" rounded class="primary">Adicionar</v-btn>
                </v-flex>
                <v-flex xs12 class="text-right" v-else>
                    <v-progress-circular indeterminate class="primary--text"></v-progress-circular>
                </v-flex>
            </v-fade-transition>

            <v-flex xs12 class="text-left mt-6">
                <span class="my-headline">Contas à pagar</span>
            </v-flex>
            <v-flex xs12>
                <v-card class="pa-4">
                    <v-layout row wrap>
                        <v-flex xs12 class="my-2" v-for="bill in pendingOuttakes" :key="bill.id">
                            <v-layout row wrap>
                                <span>{{bill.category}}</span>
                                <v-divider vertical class="mx-4"></v-divider>
                                <span>{{bill.payment_method}}</span>
                                <v-divider vertical class="mx-4"></v-divider>
                                <span class="font-weight-bold">{{bill.date_to_pay | dateFilter}}</span>
                                <v-divider vertical class="mx-4"></v-divider>
                                <v-icon class="warning--text" v-if="distanceToToday(bill.date_to_pay) < 3">warning
                                </v-icon>
                                <v-spacer></v-spacer>
                                <span class="font-weight-bold">R$ {{bill.value}}</span>
                                <v-flex xs12>
                                    <span>{{bill.description}}</span>
                                </v-flex>
                                <v-flex xs12 class="text-right" v-if="!loading">
                                    <v-btn @click="deleteOuttake(bill)" class="error mx-2" fab small>
                                        <v-icon>delete</v-icon>
                                    </v-btn>
                                    <v-btn @click="payOuttake(bill)" class="success mx-2" fab small>
                                        <v-icon>attach_money</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex xs12 class="text-right" v-else>
                                    <v-progress-circular indeterminate class="primary--text"></v-progress-circular>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex xs12 class="text-left mt-6">
                <span class="my-headline">Contas pagas</span>
            </v-flex>
            <v-flex xs12 class="mt-4">
                <v-card class="pa-4">
                    <v-layout row wrap>
                        <v-flex xs12 v-for="bill in paidOuttakes" :key="bill.id">
                            <v-layout row wrap>
                                <span>{{bill.category}}</span>
                                <v-divider vertical class="mx-4"></v-divider>
                                <span>{{bill.payment_method}}</span>
                                <v-divider vertical class="mx-4"></v-divider>
                                <span class="font-weight-bold">{{bill.date_to_pay | dateFilter}}</span>
                                <v-divider vertical class="mx-4"></v-divider>
                                <span class="font-weight-bold">{{bill.paid | dateFilter}}</span>
                                <v-divider vertical class="mx-4"></v-divider>
                                <v-spacer></v-spacer>
                                <span class="font-weight-bold">R$ {{bill.value}}</span>
                                <v-flex xs12>
                                    <span>{{bill.description}}</span>
                                </v-flex>
                                <v-flex xs12 class="text-right" v-if="!loading">
                                    <!--                                    <v-btn @click="deleteOuttake(bill)" class="error mx-2" fab small>-->
                                    <!--                                        <v-icon>delete</v-icon>-->
                                    <!--                                    </v-btn>-->
                                    <v-btn @click="unpayOuttake(bill)" class="error mx-2" fab small>
                                        <v-icon>money_off</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex xs12 class="text-right" v-else>
                                    <v-progress-circular indeterminate class="primary--text"></v-progress-circular>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "Bills",
        data() {
            return {
                category: undefined,
                paymentMethod: undefined,
                description: undefined,
                value: 0.00,
                dateToPay: moment().format('YYYY-MM-DD'),
                paymentMethods: ['Boleto', 'Transferência', 'Dinheiro'],
                loading: false,
            }
        },
        mounted() {
            this.initiate()
        },
        computed: {
            outtakes() {
                return this.$store.getters.outtakes
            },
            paidOuttakes() {
                return this.outtakes.filter((outtake) => {
                    return outtake.paid
                }).sort((a, b) => {
                    return b.date_to_pay > a.date_to_pay ? 1 : -1
                })
            },
            pendingOuttakes() {
                return this.outtakes.filter((outtake) => {
                    return !outtake.paid
                }).sort((a, b) => {
                    return b.date_to_pay < a.date_to_pay ? 1 : -1
                })
            },
            categories() {
                return this.$store.getters.outtakesCategories
            },
            user() {
                return this.$store.getters.user
            }
        },
        methods: {
            async initiate() {
                this.loading = true
                await this.$store.dispatch('getOuttakesCategories')
                await this.$store.dispatch('getOuttakes')
                this.loading = false
            },
            async addBill() {
                let bill = {
                    category: this.category,
                    payment_method: this.paymentMethod,
                    description: this.description,
                    value: this.value,
                    date_to_pay: this.dateToPay,
                    created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                    colaborator: this.user
                }
                if (this.categories.indexOf(this.category) < 0) {
                    await this.$store.dispatch('addOuttakesCategory', this.category)
                }
                await this.$store.dispatch('addOuttakes', bill)
                await this.$store.dispatch('getOuttakes')
            },
            async payOuttake(outtake) {
                this.loading = true
                await this.$store.dispatch('updateOuttake', {
                    outtake: outtake,
                    field: 'paid',
                    value: moment().format('YYYY-MM-DD HH:mm:ss')
                })
                await this.$store.dispatch('getOuttakes')
                this.loading = false
            },
            async unpayOuttake(outtake) {
                this.loading = true
                await this.$store.dispatch('updateOuttake', {
                    outtake: outtake,
                    field: 'status',
                    value: 'delete'
                })
                await this.$store.dispatch('getOuttakes')
                this.loading = false
            },
            async deleteOuttake(outtake) {
                this.loading = true
                await this.$store.dispatch('deleteOuttake', outtake)
                await this.$store.dispatch('getOuttakes')
                this.loading = false
            },
            distanceToToday(date) {
                let now = moment()
                return moment(date, 'YYYY-MM-DD').diff(now, 'days')
            }
        },
    }
</script>

<style scoped>

</style>
