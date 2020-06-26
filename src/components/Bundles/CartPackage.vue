<template>
    <v-container class="ma-0 pa-0 mt-4">
        <v-layout row wrap>
            <v-flex class="hidden-print-only" xs12>
                <v-layout row wrap class="align-center mt-3 mr-2 ml-2">
                    <v-flex xs10>
                        <v-select
                                v-if="!registerPackage"
                                v-model="searchData"
                                :items="listPackage"
                                item-text="name"
                                auto-select-first
                                :loading="isLoading"
                                @change="GetPackage(searchData)"
                                return-object
                                label="Escolhe um pacote"
                                outlined
                                solo
                                dense
                        />
                        <v-text-field v-else v-model="newPackageName"
                                      label="Nome para o Pacote"
                                      outlined
                                      dense
                                      solo
                        />
                    </v-flex>
                    <v-flex xs2>
                        <v-btn x-small fab color="background" dark class="mb-7"
                               @click="(registerPackage = !registerPackage, searchPackage = !searchPackage),clearCart()">
                            <v-icon v-if="!registerPackage" class="primary--text">add</v-icon>
                            <v-icon v-else class="primary--text">search</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
                <v-card id="carrinho" class="elevation-2 mr-2 ml-2 mt-n1" >
                    <div class="hidden-sm-and-up" style="position:fixed; right:20px; z-index:1">
                        <v-btn class="my-0" x-large icon @click="$emit('closeCart')">
                            <v-icon>cancel</v-icon>
                        </v-btn>
                    </div>
                    <v-container>
                        <v-layout row wrap class="align-center">
                            <v-flex xs12 class="mt-1 v-card" style="overflow:auto; height:50vh; box-shadow: inset 0px 5px grey">
                                <v-layout row wrap>
                                    <v-flex xs12 v-if="exames.length > 0">
                                        <p class="my-headline">Exames</p>
                                        <v-card v-for="(item) in exames" class="ma-2" :key="item.name">
                                            <v-card-title class="py-2">
                                                <span class="subtitle-1 font-weight-medium">{{item.name}}</span>
                                                <v-spacer/>
                                                <span class="subtitle-1 font-weight-light">
                                                <v-btn small icon @click="removeItem(item, 'exams')">
                                                    <v-icon>cancel</v-icon>
                                                </v-btn>
                                            </span>
                                            </v-card-title>
                                            <v-card-text class="pt-1 pb-0">
                                                {{item.clinic.name}}
                                                <p class="text-right">
                                                    R$ {{(item.price).toFixed(2)}}
                                                </p>
                                            </v-card-text>
                                        </v-card>
                                    </v-flex>
                                    <v-divider/>
                                    <v-flex xs12 v-if="consultas.length > 0">
                                        <p class="my-headline">Consultas</p>
                                        <v-card v-for="(item) in consultas" class="ma-2" :key="item.doctor.name">
                                            <v-card-title class="py-2">
                                                <span class="subtitle-1 font-weight-medium">{{item.name}}</span>
                                                <v-spacer/>
                                                <span class="subtitle-1 font-weight-light">
                                                <v-btn small icon @click="removeItem(item, 'consultations')">
                                                    <v-icon>cancel</v-icon>
                                                </v-btn>
                                            </span>
                                            </v-card-title>
                                            <v-card-text class="pt-1 pb-0">
                                                {{item.doctor.name}}
                                                <v-divider/>
                                                <v-layout row wrap class="mt-2">
                                                    <span>
                                                        {{item.doctor.clinic.name}}
                                                    </span>
                                                    <v-spacer/>
                                                    <p class="text-right">
                                                        R$ {{(item.doctor.price).toFixed(2)}}
                                                    </p>
                                                </v-layout>
                                            </v-card-text>

                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
                <v-flex xs12 class="mt-4 mx-3">
                    <v-card class="pr-1 pl-1">
                        <v-layout row wrap>
                            <v-flex>
                                <v-layout wrap class="mt-3">
                                    <v-flex xs6>
                                        <v-text-field label="Desconto: %" outlined dense
                                                      v-model="percentageDiscount">
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs5 class="ml-4">
                                        <v-text-field
                                                disabled outlined dense
                                                label="Desconto: R$ " v-model="moneyDiscount">
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12>
                                <v-layout row wrap>
                                    <v-flex xs12>
                                        <v-divider color="black"/>
                                    </v-flex>
                                    <v-layout row wrap>
                                        <v-flex xs6>
                                            <span>Subtotal: R$ {{this.subTotal.toLocaleString('en-us', {minimumFractionDigits: 2})}}</span>
                                        </v-flex>
                                        <v-flex xs6>
                                            <span>Desconto: R$ {{this.moneyDiscount.toLocaleString('en-us', {minimumFractionDigits: 2})}}</span>
                                        </v-flex>
                                    </v-layout>
                                    <v-flex xs12>
                                        <v-divider/>
                                    </v-flex>
                                    <v-flex xs12 class="my-2">
                                        <h6 class="title font-weight-bold primary--text"> Total: R$
                                            {{this.total.toLocaleString('en-us', {minimumFractionDigits: 2})}}</h6>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-divider/>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 class="mt-3 mb-3">
                                <v-layout row wrap class="align-end fill-height">
                                    <v-flex xs4 class="text-center">
                                        <submit-button
                                                text="Salvar" :loading="paymentLoading" outlined
                                                :success="paymentSuccess" color="primary"
                                                @click="validateRegister()">
                                        </submit-button>
                                    </v-flex>
                                    <v-flex xs4="text-center mt-4">
                                        <v-btn color="primary" outlined @click="clearCart()">Limpar</v-btn>
                                    </v-flex>
                                    <v-spacer/>
                                    <v-flex xs4 class="text-center mt-4">
                                        <v-btn outlined color="error" @click="deletePackage()">excluir</v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>

            </v-flex>
        </v-layout>
        <v-dialog v-model="searchPatient" transition="dialog-bottom-transition">
            <select-patient-card @removed="clearCart" max-width="100%"/>
        </v-dialog>
        <v-dialog v-model="budgetToPrintDialog" v-if="budgetToPrint">
            <budget-to-print @close="budgetToPrintDialog = false" :budget="budgetToPrint"/>
        </v-dialog>
        <v-dialog v-model="receiptDialog" v-if="selectedIntake" fullscreen transition="dialog-bottom-transition">
            <receipt @close="receiptDialog = false" :budget=selectedIntake>
            </receipt>
        </v-dialog>
    </v-container>
</template>

<script>
    import SelectPatientCard from "../Patient/SelectPatientCard";
    import SubmitButton from "../SubmitButton";
    import BudgetToPrint from "../cashier/BudgetToPrint";
    import Receipt from "../cashier/Receipt";

    export default {
        name: "Cart",
        components: {
            Receipt,
            SelectPatientCard,
            SubmitButton,
            BudgetToPrint
        },
        data() {
            return {
                xDown: undefined,
                yDown: undefined,
                parcel: 1,
                parcels: [1, 2, 3, 4, 5],
                paymentLoading: false,
                quantParcelas: ["1", "2", "3", "4", "5"],
                paymentSuccess: false,
                searchBudgetError: undefined,
                searchBudgetNumber: undefined,
                searchBudgetLoading: false,
                searchBudgetBtn: false,
                searchPatient: false,
                payments: ['Dinheiro'],
                valuesPayments: [''],
                payment: {paymentForm: ['Dinheiro'], value: [''], parcel: ['1']},
                moneyDiscout: 0,
                data: moment().format("YYYY-MM-DD HH:mm:ss"),
                parcelas: '1',
                totalCusto: 0,
                percentageDiscount: 0,
                moneyDiscount: 0,
                FormasDePagamento: ["Dinheiro", "Crédito", "Débito"],
                totalNovo: 0,
                budgetToPrint: undefined,
                budgetToPrintDialog: false,
                selectedIntake: undefined,
                selectedDoctor: undefined,
                receiptDialog: false,
                searchPackage: true, registerPackage: false, searchData: '',
                newPackageName: '',
                isLoading: false

            }
        },
        computed: {
            listPackage() {
                return Object.values(this.$store.getters.bundles);
            },
            selectedUnit() {
                return this.$store.getters.selectedUnit
            },
            selectedBudget() {
                return this.$store.getters.selectedBudget
            },

            cartItems() {
                return this.$store.getters.getShoppingCartItems
            },
            exames() {
                if (this.searchData.exams) {
                    return this.searchData.exams
                } else {
                    return this.$store.getters.getShoppingCartItemsByCategory.exams
                }
            },
            consultas() {
                if (this.searchData.consultations) {
                    return this.searchData.consultations
                } else {
                    return this.$store.getters.getShoppingCartItemsByCategory.consultations
                }
            },
            cost() {
                let total = 0;
                if (this.searchData.name) {
                    if (this.searchData.consultations) {
                        for (let item in this.searchData.consultations) {
                            total += parseFloat(this.searchData.consultations[item].cost)
                        }
                    }
                    if (this.searchData.exams) {
                        for (let item in this.searchData.exams) {
                            total += parseFloat(this.searchData.exams[item].cost)
                        }
                    }
                } else {
                    let itens = this.$store.getters.getShoppingCartItems;
                    for (let item in itens) {
                        total += parseFloat(itens[item].cost)
                    }
                }
                return total
            },
            subTotal() {
                let total = 0;
                if (this.searchData.name) {
                    if (this.searchData.consultations) {
                        for (let item in this.searchData.consultations) {
                            total += parseFloat(this.searchData.consultations[item].priceOriginal)
                        }
                    }
                    if (this.searchData.exams) {
                        for (let item in this.searchData.exams) {
                            total += parseFloat(this.searchData.exams[item].priceOriginal)
                        }
                    }
                } else {
                    let itens = this.$store.getters.getShoppingCartItems;
                    for (let item in itens) {
                        total += parseFloat(itens[item].price);
                    }
                }
                return total
            },
            total() {
                return (parseFloat(this.subTotal) - parseFloat(this.moneyDiscount)).toFixed(2)
            },
        },
        watch: {
            percentageDiscount: function () {
                this.moneyDiscount = ((this.percentageDiscount * this.subTotal) / 100);
            },
        },
        mounted() {
            this.$store.dispatch('loadBundle');

        },
        methods: {
            GetPackage(product) {
                this.percentageDiscount = product.percentageDiscount
                this.moneyDiscount = product.moneyDiscount

            },
            removeItem(item, type) {
                if (this.searchData.name) {
                    if (type === 'exams') {
                        this.searchData.exams.splice(this.searchData.exams.indexOf(item), 1)
                    } else {
                        this.searchData.consultations.splice(this.searchData.consultations.indexOf(item), 1)
                    }
                } else {
                    this.$store.commit('removeShoppingCartItem', item)
                }
            },

            generateBudget() {
                let id = moment().valueOf()
                let budget = {
                    id: id,
                    specialties: this.consultas.length > 0 ? this.consultas : undefined,
                    exams: this.exames.length > 0 ? this.exames : undefined,
                    subTotal: this.subTotal,
                    discount: this.moneyDiscount,
                    total: this.total,
                    parcel: this.payment.parcel,
                    date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    cost: this.cost,
                    user: this.$store.getters.selectedPatient,
                    colaborator: this.$store.getters.user,
                    parcelar: this.parcelar,
                    doctor: this.selectedDoctor,
                    payments: this.payment.paymentForm,
                    valuesPayments: this.payment.value,
                    unit: this.selectedUnit
                };
                return budget
            },
            async updateBudgetsIntakes() {
                let user = this.patient;
                let intakes = await this.$store.dispatch('getUserIntakes', user);
                let budgets = await this.$store.dispatch('getUserBudgets', user);
                user.intakes = intakes;
                user.budgets = budgets;
                this.$store.commit('setSelectedPatient', user)
            },
            async saveBudget(budget) {
                this.$store.commit('setSelectedBudget', budget);
                await this.$store.dispatch('getUserBudgets', this.patient);
                await this.$store.dispatch('addBudget', budget);
                this.updateBudgetsIntakes()
            },

            clearCart() {
                this.$store.commit('clearShoppingCartItens');
                this.$store.commit('setSelectedBudget', undefined);
                this.moneyDiscount = 0;
                this.percentageDiscount = 0;
                let user = undefined;
                this.newPackageName = '';
                this.searchData = '';
                this.$store.commit('setSelectedPatient', user)

            },
            deletePackage() {
                this.$store.dispatch('deletePackage', this.searchData).then(() => {
                    this.$store.dispatch('loadBundle');
                });
                this.clearCart();

            },
            async validateRegister() {
                const packageData = {
                    exams: this.exames,
                    consultations: this.consultas,
                    moneyDiscount: this.moneyDiscount,
                    percentageDiscount: this.percentageDiscount,
                    cost: this.cost,
                    price: this.subTotal.toLocaleString('en-us', {minimumFractionDigits: 2}),
                    total: (this.total),
                    name: this.newPackageName !== '' ? this.newPackageName : this.searchData.name,
                };

                for (let exam in packageData.exams) {
                    if (!packageData.exams[exam].priceOriginal) {
                        packageData.exams[exam].priceOriginal = packageData.exams[exam].price
                    }

                    packageData.exams[exam].price = packageData.exams[exam].priceOriginal - ((this.percentageDiscount / 100) * packageData.exams[exam].priceOriginal)
                }
                for (let consul in packageData.consultations) {
                    if (!packageData.consultations[consul].priceOriginal) {
                        packageData.consultations[consul].priceOriginal = packageData.consultations[consul].price
                    }
                    packageData.consultations[consul].price = packageData.consultations[consul].priceOriginal - ((this.percentageDiscount / 100) * packageData.consultations[consul].priceOriginal)
                }

                this.$store.dispatch('addBundle', packageData).then(() => {
                    this.clearCart();
                    this.registerPackage = !this.registerPackage
                    this.$store.dispatch('loadBundle');
                });
            }

        }
    }
</script>

<style scoped>
</style>
