<template>
    <v-container fluid class="ma-0 pa-0">
        <v-layout row nowrap style="width: 100%">
            <v-card class="my-2 grey_light" width="100%" v-if="exams.length > 0">
                <h4 class="text-left ml-2">Exames</h4>
                <v-divider/>
                <v-card-text v-for="(item) in exams" :key="item.name" class="ma-0 pa-0 my-1">
                    <v-flex xs12 class="align-center justify-center text-center">
                        <span class="font-weight-bold">{{item.name}}</span>
                    </v-flex>
                    <v-flex xs12>
                        <v-divider/>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout row wrap class="mx-1">
                            <span>{{item.clinic.name}}</span>
                            <v-spacer/>
                            <span>R$ {{item.price}}</span>
                        </v-layout>
                    </v-flex>
                    <v-btn rounded dense x-small class="error" block width="100%" @click="removeItem(item)">Remover Item</v-btn>
                </v-card-text>
            </v-card>
            <v-card class="my-2 grey_light" width="100%" v-if="consultations.length > 0">
                <h4 class="text-left ml-2">Consultas</h4>
                <v-divider/>
                <v-card-text v-for="(item) in consultations" :key="item.doctor.name" class="ma-0 pa-0 my-1">
                    <v-flex xs12 class="align-center justify-center text-center">
                        <span class="font-weight-bold">{{item.name}}</span>
                    </v-flex>
                    <v-flex xs12>
                        <v-divider/>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout row wrap class="mx-1">
                            <v-flex xs12 class="text-left">
                                <span>{{item.doctor.name}}</span>
                            </v-flex>
                            <span>{{item.doctor.clinic.name}}</span>
                            <v-spacer/>
                            <span>R$ {{item.doctor.price}}</span>
                        </v-layout>
                    </v-flex>
                    <v-btn rounded dense x-small class="error" block width="100%" @click="removeItem(item)">Remover Item</v-btn>
                </v-card-text>
            </v-card>

        </v-layout>
    </v-container>
</template>
<script>

    import moment from "moment"

    export default {

        data() {
            return {
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
            }
        },
        computed: {

            cartItems() {
                return this.$store.getters.getShoppingCartItems
            },
            exams() {
                return this.$store.getters.getShoppingCartItemsByCategory.exams
            },
            consultations() {
                return this.$store.getters.getShoppingCartItemsByCategory.consultations
            },
            cost() {
                let itens = this.$store.getters.getShoppingCartItems;
                let total = 0;
                for (let item in itens) {
                    total += parseFloat(itens[item].cost)
                }
                return total
            },
            subTotal() {
                let itens = this.$store.getters.getShoppingCartItems;
                let total = 0;
                for (let item in itens) {
                    total += parseFloat(itens[item].price);
                }
                return total
            },
            total() {
                return (parseFloat(this.subTotal) - parseFloat(this.moneyDiscount))
            },
            paymentValues() {
                let tamanho = this.payment.paymentForm.length;
                let pagando = 0;
                if (tamanho === 1 && this.payment.paymentForm[0] !== '') {
                    this.payment.value[0] = parseFloat(this.total)
                    pagando = parseFloat(this.payment.value[0]);
                } else {
                    for (let i = 0; i < tamanho; i++) {
                        if (this.payment.value[i] !== '') {
                            pagando += parseFloat(this.payment.value[i])
                        }
                    }
                }
                return pagando;
            },
            paymentNull() {
                let tamanho = this.payment.paymentForm.length;
                if (tamanho === 1 && this.payment.value[0] !== '') {
                    return true
                } else {
                    for (let i = 0; i < tamanho; i++) {
                        if (this.payment.value[i] === '') {
                            return false
                        }
                    }
                    return true
                }
            },
        },
        watch: {
            percentageDiscount: function () {
                this.moneyDiscount = ((this.percentageDiscount * this.subTotal) / 100);
            },
        },
        methods: {
            async searchBudget() {
                this.searchBudgetLoading = true;
                let budget = await this.$store.dispatch('getBudget', this.searchBudgetNumber);
                if (budget) {
                    this.$store.commit('setSelectedBudget', budget);
                    for (let exam in budget.exams) {
                        this.$store.commit('addShoppingCartItem', budget.exams[exam])
                    }
                    for (let spec in budget.specialties) {
                        this.$store.commit('addShoppingCartItem', budget.specialties[spec])
                    }
                    let intakes = await this.$store.dispatch('getUserIntakes', budget.user);
                    if (intakes) {
                        budget.user.intakes = intakes
                    }
                    let budgets = await this.$store.dispatch('getUserBudgets', budget.user);
                    if (budgets) {
                        budget.user.budgets = budgets
                    }
                    this.$store.commit('setSelectedPatient', budget.user);
                    this.searchBudgetBtn = false
                } else {
                    this.searchBudgetError = 'Orçamento não encontrado'
                }
                this.searchBudgetLoading = false
            },
            adicionarFormaDePagamento() {
                this.valuesPayments.push('');
                this.payments.push('')
                this.payment.paymentForm.push('');
                this.payment.value.push('');
                this.payment.parcel.push('1')
            },
            apagarFormaDePagamento(index) {
                this.payments.splice(index, 1);
                this.valuesPayments.splice(index, 1);
                this.payment.paymentForm.splice(index, 1);
                this.payment.value.splice(index, 1);
                this.payment.parcel.splice(index, 1);

            },
            removeItem(item) {
                this.$store.commit('removeShoppingCartItem', item)
            },


            generateBudget() {
                let id = moment().valueOf();
                let budget = {
                    id: id,
                    specialties: this.consultations.length > 0 ? this.consultations : undefined,
                    exams: this.exams.length > 0 ? this.exams : undefined,
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
            async pay() {
                this.paymentLoading = true;
                let user = this.patient;
                if (!user) {
                    return
                }
                await this.saveBudget(this.generateBudget())
                let newBudget = this.generateBudget();
                newBudget.id = this.selectedBudget.id;
                this.$store.commit('setSelectedBudget', newBudget)
                if (!this.selectedBudget) {
                    await this.saveBudget(this.generateBudget())
                } else {
                    let newBudget = this.generateBudget();
                    if (!this.selectedBudget.id) {
                        this.selectedBudget.id = this.now
                    }
                    newBudget.id = this.selectedBudget.id;
                    this.$store.commit('setSelectedBudget', newBudget)
                }
                await this.$store.dispatch('addIntake', this.selectedBudget);
                let porcentagem = (this.selectedBudget.discount / this.selectedBudget.subTotal)

                if (porcentagem >= 0.5 || parseFloat(this.searchBudget.subTotal) > this.selectedBudget.cost) {

                    this.$store.dispatch('DiscountWarning', {
                        orcamento: this.selectedBudget.id,
                        date: this.selectedBudget.date,
                        discont: ((this.selectedBudget.discount / this.selectedBudget.subTotal) * 100),
                        name: this.selectedBudget.colaborator.name,
                        cpf: this.selectedBudget.colaborator.cpf
                    })
                }
                this.updateBudgetsIntakes();
                this.receipt(this.selectedBudget);
                this.paymentLoading = false;
                this.paymentSuccess = true;

                let data = {
                    user: this.patient,
                    budgetId: this.selectedBudget.id.toString(),
                };

                await this.$store.dispatch('deleteBudget', data);
                await this.$store.commit('setSelectedBudget', undefined);
                this.$store.commit('clearShoppingCartItens');
                this.card = false
            },
            async receipt(intake) {
                this.selectedIntake = await this.$store.dispatch('getIntakeDetails', intake);
                this.receiptDialog = true
            },

            clearCart() {
                this.$store.commit('clearShoppingCartItens');
                this.$store.commit('setSelectedBudget', undefined);
                let user = undefined;
                this.$store.commit('setSelectedPatient', user)

            },


        }
    }
</script>