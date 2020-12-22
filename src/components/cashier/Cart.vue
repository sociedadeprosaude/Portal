<template>
    <v-container class="ma-0 pa-0">
        <v-layout row wrap>
            <v-flex class="hidden-print-only" xs12>
                <v-card id="carrinho" class="elevation-2 ">

                    <div class="hidden-sm-and-up" style="position:fixed; right:20px; z-index:1">
                        <v-btn class="my-0" x-large icon @click="$emit('closeCart')">
                            <v-icon>cancel</v-icon>
                        </v-btn>
                    </div>

                    <v-container>
                        <v-layout row wrap class=" mx-3 align-center">
                            <v-flex xs6 class="text-center">
                                <v-btn
                                        @click="searchPatient = !searchPatient"
                                        rounded
                                        class="primary"
                                >
                                    <v-icon>person_add</v-icon>
                                </v-btn>
                            </v-flex>
                            <v-flex xs6 class="text-center">
                                <v-btn
                                        @click="searchBudgetBtn = !searchBudgetBtn"
                                        rounded
                                        class="primary">
                                    <v-icon>search</v-icon>
                                </v-btn>
                            </v-flex>
                            <v-flex xs12 class="my-2 mt-6" v-if="!loadingDoctors">
                                <v-combobox
                                        v-model="selectedDoctor"
                                        auto-select-first
                                        chips
                                        dense
                                        flat
                                        clearable
                                        label="Médico"
                                        hint="Médico"
                                        item-text="name"
                                        return-object
                                        :items="doctors">
                                </v-combobox>
                            </v-flex>
                            <v-flex xs12 v-else class="my-2">
                                <v-layout column wrap class="align-center">
                                    <span>Carregando Médicos...</span>
                                    <v-progress-circular class="primary--text" indeterminate/>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 v-if="searchBudgetBtn">
                                <v-layout row wrap class="align-center">
                                    <v-flex xs10>
                                        <v-text-field
                                                label="Num. do Orçamento"
                                                v-model="searchBudgetNumber"
                                                type="number">
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs2 class="text-center">
                                        <v-btn
                                                v-if="!searchBudgetLoading"
                                                rounded
                                                class="primary"
                                                style="min-width: 0; width: 64px"
                                                @click="searchBudget"
                                        >
                                            <v-icon>search</v-icon>
                                        </v-btn>
                                        <v-progress-circular class="primary--text" indeterminate v-else>
                                        </v-progress-circular>
                                    </v-flex>
                                    <v-flex xs12 v-if="searchBudgetError">
                                        <span class="error--text">{{searchBudgetError}}</span>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 v-if="patient" class="my-3 text-left" style="font-size: 0.8em">
                                <v-layout row wrap>
                                    <v-flex xs12>
                                        <v-divider/>
                                    </v-flex>
                                    <v-flex xs12>
                                        <span class="font-weight-bold">{{patient.name}}</span>
                                    </v-flex>
                                    <v-flex xs12>
                                        <span class="grey--text">CPF:</span>
                                        <span class="font-weight-bold"> {{patient.cpf}}</span>
                                    </v-flex>
                                    <v-flex xs12>
                                        <span class="grey--text">Num. Assoc.:</span>
                                        <span class="font-weight-bold"> {{patient.association_number}}</span>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-divider/>
                                    </v-flex>
                                </v-layout>
                            </v-flex>

                            <v-flex xs12 class="mt-1 v-card"
                                    style="overflow:auto; height:50vh; box-shadow: inset 0px 5px grey;">
                                <v-layout row wrap>
                                    <v-flex xs12 v-if="exames.length > 0">
                                        <p class="my-headline">Exames</p>
                                        <v-card v-for="(item) in exames" class="ma-2" :key="item.name">
                                            <v-card-title class="py-2">
                                                <span class="subtitle-1 font-weight-medium">{{item.name}}</span>
                                                <v-spacer/>
                                                <span class="subtitle-1 font-weight-light">
                                                <v-btn small icon @click="removeItem(item)">
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
                                                <v-btn small icon @click="removeItem(item)">
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
                                                        R$ {{(item.price).toFixed(2)}}
                                                    </p>
                                                </v-layout>
                                            </v-card-text>

                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-spacer/>
                            <v-flex xs12>
                                <v-spacer/>
                            </v-flex>
                            <v-layout row wrap>
                                <v-flex>
                                    <v-flex sm12 xs12 class="px-3 mt-3" v-if="payment.paymentForm.length > 1">
                                        <v-layout row wrap class="align-center" v-for="(x ,index) in payment.paymentForm"
                                                  :key="index">
                                            <v-flex xs10>
                                                <v-select
                                                        outlined
                                                        rounded
                                                        :items="FormasDePagamento"
                                                        v-model="payment.paymentForm[index]"
                                                        label="Forma de Pagamento">
                                                </v-select>
                                            </v-flex>
                                            <v-flex xs5 v-if="payment.paymentForm[index] === 'Crédito'">
                                                <v-currency-field
                                                        filled
                                                        v-model="payment.value[index]"
                                                        label="Valor"
                                                >
                                                </v-currency-field>
                                            </v-flex>
                                            <v-flex xs10 v-if="payment.paymentForm[index] !== 'Crédito'">
                                                <v-currency-field
                                                        filled
                                                        v-model="payment.value[index]"
                                                        label="Valor"
                                                >
                                                </v-currency-field>
                                            </v-flex>
                                            <v-flex xs5 v-if="payment.paymentForm[index] === 'Crédito'">
                                                <v-select :items="parcels" v-model="payment.parcel[index]"
                                                          label="Parcelas"
                                                          filled>
                                                </v-select>
                                            </v-flex>
                                            <v-flex xs2>
                                                <v-btn
                                                        @click="index === 0 ? adicionarFormaDePagamento() : apagarFormaDePagamento(index)"
                                                        text class="transparent">
                                                    <v-icon v-if="index === 0">add_circle</v-icon>
                                                    <v-icon v-else>remove_circle</v-icon>
                                                </v-btn>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex sm12 xs12 class="px-3 mt-3" v-if="payment.paymentForm.length === 1">
                                        <v-layout row wrap class="align-center" v-for="(x ,index) in payment.paymentForm"
                                                  :key="index">
                                            <v-flex xs10>
                                                <v-select
                                                        outlined
                                                        rounded
                                                        :items="FormasDePagamento"
                                                        v-model="payment.paymentForm[index]"
                                                        label="Forma de Pagamento">
                                                </v-select>
                                            </v-flex>
                                            <v-flex xs5 v-if="payment.paymentForm[index] === 'Crédito'">
                                                <v-currency-field
                                                        filled
                                                        v-model="payment.value[index]"
                                                        label="Valor"
                                                >
                                                </v-currency-field>
                                            </v-flex>

                                            <v-flex xs10 v-if="payment.paymentForm[index] === 'Crédito'">
                                                <v-select :items="parcels" v-model="payment.parcel[index]"
                                                          label="Parcelas"
                                                          filled>
                                                </v-select>
                                            </v-flex>
                                            <v-flex xs2>
                                                <v-btn
                                                        @click="index === 0 ? adicionarFormaDePagamento() : apagarFormaDePagamento(index)"
                                                        text class="transparent">
                                                    <v-icon v-if="index === 0">add_circle</v-icon>
                                                    <v-icon v-else>remove_circle</v-icon>
                                                </v-btn>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-layout wrap>
                                        <v-flex xs5>
                                            <v-text-field label="Desconto: %"
                                                          v-model="percentageDiscount">
                                            </v-text-field>
                                        </v-flex>
                                        <v-spacer/>
                                        <v-flex xs5>
                                            <v-text-field
                                                    disabled
                                                    label="Desconto: R$ " v-model="moneyDiscount">
                                            </v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 class="my-4">
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-divider color="black"/>
                                        </v-flex>
                                        <v-flex v-for="(x , index) in payment.paymentForm" :key="index">
                                            <v-flex xs12 v-if="payment.paymentForm[index] === 'Crédito'">
                                                <span>Crédito: {{payment.parcel[index]}}x de R$ {{( payment.value[index] / payment.parcel[index]).toFixed(2)}}</span>
                                            </v-flex>
                                            <v-flex xs12 v-if="payment.paymentForm[index] === 'Débito'">
                                                <span>Débito: R$ {{( payment.value[index])}}</span>
                                            </v-flex>
                                            <v-flex xs12 v-if="payment.paymentForm[index] === 'Dinheiro'">
                                                <span>Dinheiro: R$ {{( payment.value[index])}}</span>
                                            </v-flex>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-divider color="black"/>
                                        </v-flex>
                                        <v-flex>
                                            <span>Total Até então: {{this.paymentValues}}</span>
                                        </v-flex>
                                        <v-flex xs6>
                                            <span>Subtotal: R$ {{this.subTotal.toLocaleString('en-us', {minimumFractionDigits: 2})}}</span>
                                        </v-flex>
                                        <v-flex xs6>
                                            <span>Desconto: R$ {{this.moneyDiscount.toLocaleString('en-us', {minimumFractionDigits: 2})}}</span>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-divider color="primary"/>
                                        </v-flex>
                                        <v-flex xs12>
                                            <h6 class="title font-weight-bold primary--text"> Total: R$
                                                {{this.total.toLocaleString('en-us', {minimumFractionDigits: 2})}}</h6>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-divider color="primary"/>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-spacer/>
                                <v-flex xs12>
                                    <v-layout row wrap class="align-end fill-height">
                                        <v-flex xs6 class="text-center">
                                            <v-btn :disabled="cartItems.length === 0" outlined
                                                   color="primary" @click="imprimir()">Imprimir
                                            </v-btn>
                                        </v-flex>
                                        <v-flex xs6 class="text-center">
                                            <submit-button
                                                    :disabled="paymentDisabled"
                                                    text="Pagar" :loading="paymentLoading"
                                                    :success="paymentSuccess" color="primary" @click="pay()">
                                                Pagar
                                            </submit-button>
                                        </v-flex>
                                        <v-flex xs12 class="text-center mt-4">
                                            <v-btn outlined color="primary" @click="clearCart()">Novo Orçamento</v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>
        <v-dialog v-model="searchPatient" transition="dialog-bottom-transition"
        >
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
    import BudgetToPrint from "./BudgetToPrint";
    import Receipt from "./Receipt";

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
                payment:{ paymentForm:['Dinheiro'], value:[''], parcel:['1']},
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
            loadingDoctors() {
                return !this.$store.getters.doctorsLoaded
            },
            doctors() {
                return Object.values(this.$store.getters.doctors)
            },
            selectedUnit() {
                return this.$store.getters.selectedUnit
            },
            selectedBudget() {
                return this.$store.getters.selectedBudget
            },
            patient() {
                return this.$store.getters.selectedPatient
            },
            cartItems() {
                return this.$store.getters.getShoppingCartItems
            },
            exames() {
                return this.$store.getters.getShoppingCartItemsByCategory.exams
            },
            consultas() {
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
                return (parseFloat(this.subTotal) - parseFloat(this.moneyDiscount)).toFixed(2)
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
                return pagando.toFixed(2);
            },
            paymentNull() {
                let tamanho = this.payment.paymentForm.length;
                if (tamanho === 1 && this.payment.value[0] !== '') {
                    return true
                } else {
                    for (let i = 0; i < tamanho; i++) {
                        if (this.payment.value[i] === ''){
                            return false
                        }
                    }
                    return true
                }
            },
          paymentDisabled() {
              console.log({
                'patient': this.patient,
                cartItenslenght: this.cartItems.length,
                paymentValue: this.paymentValues,
                total: this.total,
                paymentNull: this.paymentNull
              })
              return !this.patient || this.cartItems.length === 0 || this.paymentValues !== this.total || this.paymentNull === false
          }
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
                this.payment.paymentForm.push('');
                this.payment.value.push('');
                this.payment.parcel.push('1')
            },
            apagarFormaDePagamento(index) {
                this.payment.paymentForm.splice(index, 1);
                this.payment.value.splice(index, 1);
                this.payment.parcel.splice(index, 1);

            },
            removeItem(item) {
                this.$store.commit('removeShoppingCartItem', item)
            },
            imprimir() {
                this.saveBudget(this.generateBudget());
                this.budgetToPrint = this.selectedBudget;
                this.budgetToPrintDialog = true
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
            async pay() {
                this.paymentLoading = true;
                let user = this.patient;
                if (!user) {
                    return
                }
                await this.saveBudget(this.generateBudget());
                let newBudget = this.generateBudget();
                newBudget.id = this.selectedBudget.id;
                this.$store.commit('setSelectedBudget', newBudget);
                if (!this.selectedBudget) {
                    await this.saveBudget(this.generateBudget())
                } else {
                    let newBudget = this.generateBudget();
                    if(!this.selectedBudget.id) {
                        this.selectedBudget.id = this.now
                    }
                    newBudget.id = this.selectedBudget.id;
                    this.$store.commit('setSelectedBudget', newBudget)
                }
                await this.$store.dispatch('addIntake', this.selectedBudget);
                let porcentagem = (this.selectedBudget.discount / this.selectedBudget.subTotal)

                if(porcentagem >= 0.5 || parseFloat(this.searchBudget.subTotal) >  this.selectedBudget.cost){

                    this.$store.dispatch('DiscountWarning', {orcamento: this.selectedBudget.id, date: this.selectedBudget.date,
                        discont: ((this.selectedBudget.discount / this.selectedBudget.subTotal)*100), name:this.selectedBudget.colaborator.name, cpf:this.selectedBudget.colaborator.cpf})
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

<style scoped>
</style>
