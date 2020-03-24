<template>
    <v-container class="ma-0 pa-0">
        <v-layout row wrap>
            <v-flex class="hidden-print-only" xs12>
                <v-card id="carrinho" class="elevation-2 ">

                    <div style="position:fixed; right:20px; z-index:1">
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
                            <!--                            <v-flex xs12 class="text-center mt-3">-->
                            <!--                                <v-btn outlined color="primary" @click="gerarCodigo()">Gerar Codigo</v-btn>-->
                            <!--                            </v-flex>-->
                            <v-flex xs12 class="mt-1 v-card"
                                    style="overflow:auto; height:50vh; box-shadow: inset 0px 0px 5px grey;">
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
                                                        R$ {{(item.doctor.price).toFixed(2)}}
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
                                    <v-flex sm12 xs12 class="px-3 mt-3" v-if="payments.length > 1">
                                        <v-layout row wrap class="align-center" v-for="(payment, index) in payments"
                                                  :key="index">
                                            <v-flex xs10>
                                                <v-select
                                                        outlined
                                                        rounded
                                                        :items="FormasDePagamento"
                                                        v-model="payments[index]"
                                                        label="Forma de Pagamento">
                                                </v-select>
                                            </v-flex>
                                            <v-flex xs5 v-if="payments[index] === 'Crédito'">
                                                <v-currency-field
                                                        filled
                                                        v-model="valuesPayments[index]"
                                                        label="Valor"
                                                >
                                                </v-currency-field>
                                            </v-flex>
                                            <v-flex xs10 v-if="payments[index] !== 'Crédito'">
                                                <v-currency-field
                                                        filled
                                                        v-model="valuesPayments[index]"
                                                        label="Valor"
                                                >
                                                </v-currency-field>
                                            </v-flex>
                                            <v-flex xs5 v-if="payments[index] === 'Crédito'">
                                                <v-select :items="parcels" v-model="parcel"
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
                                    <v-flex sm12 xs12 class="px-3 mt-3" v-if="payments.length === 1">
                                        <v-layout row wrap class="align-center" v-for="(payment, index) in payments"
                                                  :key="index">
                                            <v-flex xs10>
                                                <v-select
                                                        outlined
                                                        rounded
                                                        :items="FormasDePagamento"
                                                        v-model="payments[index]"
                                                        label="Forma de Pagamento">
                                                </v-select>
                                            </v-flex>
                                            <v-flex xs5 v-if="payments[index] === 'Crédito'">
                                                <v-currency-field
                                                        filled
                                                        v-model="valuesPayments[index]"
                                                        label="Valor"
                                                >
                                                </v-currency-field>
                                            </v-flex>
                                            <v-flex xs10 v-if="payments[index] !== 'Crédito'">
                                                <v-currency-field
                                                        filled
                                                        v-model="valuesPayments[index]"
                                                        label="Valor"
                                                >
                                                </v-currency-field>
                                            </v-flex>
                                            <v-flex xs5 v-if="payments[index] === 'Crédito'">
                                                <v-select :items="parcels" v-model="parcel"
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
                                        <v-flex v-for="(payment, index) in payments" :key="index">
                                            <v-flex xs12 v-if="payments[index] === 'Crédito'">
                                                <span>Crédito: {{parcel}}x de R$ {{( valuesPayments[index] / parcel).toFixed(2)}}</span>
                                            </v-flex>
                                            <v-flex xs12 v-if="payments[index] === 'Débito'">
                                                <span>Débito: R$ {{( valuesPayments[index])}}</span>
                                            </v-flex>
                                            <v-flex xs12 v-if="payments[index] === 'Dinheiro'">
                                                <span>Dinheiro: R$ {{( valuesPayments[index])}}</span>
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
                                                    :disabled="!patient || cartItems.length === 0 || this.paymentValues !== this.total"
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
    import SelectPatientCard from "../SelectPatientCard";
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
                payments: ['Dinheiro'],
                valuesPayments:[''],
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
                // selectedBudget: undefined
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
                // return this.$store.getters.selectedBudget.exams
                return this.$store.getters.getShoppingCartItemsByCategory.exams
            },
            consultas() {
                // return this.$store.getters.selectedBudget.consultations
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
                let tamanho = this.payments.length;
                let pagando = 0;
                if (tamanho === 1 && this.payments[0] !== '') {
                    this.valuesPayments[0] = parseFloat(this.total);
                    pagando = parseFloat(this.valuesPayments[0]);
                } else {
                    for (let i = 0; i < tamanho; i++) {
                        if (this.valuesPayments[i] !== '') {
                            pagando += parseFloat(this.valuesPayments[i])
                        }
                    }
                }
                return pagando.toFixed(2);
            },
        },
        watch: {
            percentageDiscount: function () {
                this.moneyDiscount = ((this.percentageDiscount * this.subTotal) / 100);
                // this.totalNovo = this.total - this.moneyDiscount
            },
        },
        methods: {
            async searchBudget() {
                this.searchBudgetLoading = true;
                let budget = await this.$store.dispatch('getBudget', this.searchBudgetNumber);
                if (budget) {
                    this.$store.commit('setSelectedBudget', budget);
                    // this.selectedBudget = budget
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
            },
            apagarFormaDePagamento(index) {
                this.payments.splice(index, 1);
                this.valuesPayments.splice(index, 1)
            },
            removeItem(item) {
                this.$store.commit('removeShoppingCartItem', item)
            },
            shareOrcamento() {
                var text = "";
                if (this.exames.length > 0) {
                    text = "Exames\n";
                    for (let index = 0; index < this.exames.length; index++) {
                        text += "\t" + this.exames[index].nome + "\n\tClinica: " + this.exames[index].clinica + "\n\tPreço: " + this.exames[index].preco + "\n"
                    }
                }
                if (this.consultas.length > 0) {
                    text += this.exames.length ? "\n\nConsultas\n" : "Consultas\n";
                    for (let index = 0; index < this.consultas.length; index++) {
                        text += "\t" + this.consultas[index].nome + "\n\tClinica: " + this.consultas[index].clinica + "\n\tPreço: " + this.consultas[index].preco + "\n"

                    }
                }

                text += "\n\nSubtotal: R$" + this.total.toLocaleString('en-us', {minimumFractionDigits: 2});
                text += "\nDesconto: R$" + this.moneyDiscount.toLocaleString('en-us', {minimumFractionDigits: 2});
                text += "\nTotal: R$" + this.totalNovo.toLocaleString('en-us', {minimumFractionDigits: 2});
                return text
            },
            imprimir() {
                this.saveBudget(this.generateBudget());
                this.budgetToPrint = this.selectedBudget;
                this.budgetToPrintDialog = true
            },
            pesquisarUsuario() {
                this.$store.dispatch('searchPatient', this.codigo).then(() => {
                    this.categorySelect = 'appointment';
                    for (this.i = 0; this.i < this.pedid[0].consultas.length; this.i++) {
                        this.addProducts(this.pedid[0].consultas[this.i], this.pedid[0].consultas[this.i].preco, this.pedid[0].consultas[this.i].custo, this.pedid[0].consultas[this.i].clinica)
                    }
                    this.categorySelect = 'exams';
                    for (this.i = 0; this.i < this.pedid[0].exames.length; this.i++) {
                        this.addProducts(this.pedid[0].exames[this.i], this.pedid[0].exames[this.i].price, this.pedid[0].exames[this.i].cost, this.pedid[0].exames[this.i].clinic)
                    }
                }).catch(() => {
                    this.aviso = true;
                })
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
                    parcel: this.parcel,
                    date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    cost: this.cost,
                    user: this.$store.getters.selectedPatient,
                    colaborator: this.$store.getters.user,
                    parcelar: this.parcelar,
                    doctor: this.selectedDoctor,
                    payments: this.payments,
                    valuesPayments: this.valuesPayments,
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
                    if(!this.selectedBudget.id) {
                        this.selectedBudget.id = this.now
                    }
                    newBudget.id = this.selectedBudget.id;
                    this.$store.commit('setSelectedBudget', newBudget)
                }
                await this.$store.dispatch('addIntake', this.selectedBudget);
                let porcentagem = (this.selectedBudget.discount / this.selectedBudget.subTotal)

                console.log('total : ', this.selectedBudget)
                if(porcentagem >= 0.5 || parseFloat(this.searchBudget.subTotal) >  this.selectedBudget.cost){
                    console.log('entrei')
                    this.$store.dispatch('DiscountWarning', {orcamento: this.selectedBudget.id, date: this.selectedBudget.date,
                        discont: ((this.selectedBudget.discount / this.selectedBudget.subTotal)*100), name:this.selectedBudget.colaborator.name, cpf:this.selectedBudget.colaborator.cpf})
                }
                this.updateBudgetsIntakes();
                this.receipt(this.selectedBudget);
                this.paymentLoading = false;
                this.paymentSuccess = true;
                this.card = false
                // window.print();
            },
            async receipt(intake) {
                this.selectedIntake = await this.$store.dispatch('getIntakeDetails', intake);
                // this.selectedIntake = intake
                this.receiptDialog = true
            },
            clearCart() {
                this.$store.commit('clearShoppingCartItens');
                this.$store.commit('setSelectedBudget', undefined);
                let user = undefined;
                this.$store.commit('setSelectedPatient', user)
                // this.selectedBudget = undefined

            },


        }
    }
</script>

<style scoped>
</style>
