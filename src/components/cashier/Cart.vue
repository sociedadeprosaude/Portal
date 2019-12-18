<template>
    <v-container class="ma-0 pa-0">
        <v-layout row wrap>
            <v-flex class="hidden-print-only d-none d-md-block" xs12>
                <v-card id="carrinho" class="ml-5 elevation-2 ">
                    <v-container>
                        <v-layout row wrap class="mx-3 align-center">
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
                            <v-flex xs12 v-if="searchBudgetBtn">
                                <v-layout row wrap class="align-center">
                                    <v-flex xs10>
                                        <v-text-field
                                                label="Num. do Orçamento"
                                                v-model="searchBudgetNumber"
                                                type="number"
                                        ></v-text-field>
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
                                        <v-progress-circular class="primary--text" indeterminate
                                                             v-else></v-progress-circular>
                                    </v-flex>
                                    <v-flex xs12 v-if="searchBudgetError">
                                        <span class="error--text">{{searchBudgetError}}</span>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 v-if="patient" class="my-3 text-left" style="font-size: 0.8em">
                                <v-layout row wrap>
                                    <v-flex xs12>
                                        <v-divider></v-divider>
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
                                        <v-divider></v-divider>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 v-if="selectedBudget" class="mt-3 text-left" style="font-size: 0.8em">
                                <v-layout row wrap>
                                    <v-flex xs12>
                                        <v-divider></v-divider>
                                    </v-flex>
                                    <v-flex xs12>
                                        <span>Orçamento: {{selectedBudget.id}}</span>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-divider></v-divider>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <!--                            <v-flex xs12 class="text-center mt-3">-->
                            <!--                                <v-btn outlined color="primary" @click="gerarCodigo()">Gerar Codigo</v-btn>-->
                            <!--                            </v-flex>-->
                            <v-flex xs12 class="mt-4 v-card"
                                    style="overflow:auto; height:50vh; box-shadow: inset 0px 0px 5px grey;">
                                <v-layout row wrap>
                                    <v-flex xs12 v-if="exames.length > 0">
                                        <p class="my-headline">Exames</p>
                                        <v-card v-for="(item) in exames" class="ma-2" :key="item.name">
                                            <v-card-title class="py-2">
                                                <span class="subtitle-1 font-weight-medium">{{item.name}}</span>
                                                <v-spacer></v-spacer>
                                                <span class="subtitle-1 font-weight-light">
                                                <v-btn small icon @click="removeItem(item)">
                                                    <v-icon>cancel</v-icon>
                                                </v-btn>
                                            </span>
                                            </v-card-title>
                                            <v-card-text class="pt-1 pb-0">
                                                {{item.clinic}}
                                                <p class="text-right">
                                                    R$ {{item.price}}
                                                </p>
                                            </v-card-text>
                                        </v-card>
                                    </v-flex>
                                    <v-divider></v-divider>
                                    <v-flex xs12 v-if="consultas.length > 0">
                                        <p class="my-headline">Consultas</p>
                                        <v-card v-for="(item) in consultas" class="ma-2" :key="item.doctor.name">
                                            <v-card-title class="py-2">
                                                <span class="subtitle-1 font-weight-medium">{{item.name}}</span>
                                                <v-spacer></v-spacer>
                                                <span class="subtitle-1 font-weight-light">
                                                <v-btn small icon @click="removeItem(item)">
                                                    <v-icon>cancel</v-icon>
                                                </v-btn>
                                            </span>
                                            </v-card-title>
                                            <v-card-text class="pt-1 pb-0">
                                                {{item.doctor.name}}
                                                <p class="text-right">
                                                    R$ {{item.doctor.price}}
                                                </p>
                                            </v-card-text>

                                        </v-card>
                                    </v-flex>
                                    <v-divider></v-divider>
                                    <v-flex xs12 v-if="pacotes.length > 0">
                                        <p class="my-headline">Pacotes</p>
                                        <v-card v-for="(item) in pacotes" class="mt-2" :key="item.nome">
                                            <v-card-title class="py-2">
                                                <span class="subtitle-1 font-weight-medium">{{item.name}}</span>
                                                <v-spacer></v-spacer>
                                                <span class="subtitle-1 font-weight-light">
                                                <v-btn small icon @click="removeItem(item)">
                                                    <v-icon>cancel</v-icon>
                                                </v-btn>
                                            </span>
                                            </v-card-title>
                                            <v-card-text class="pt-1 pb-0">
                                                <p class="text-right">
                                                    R$ {{item.price}}
                                                </p>
                                            </v-card-text>

                                        </v-card>
                                    </v-flex>

                                </v-layout>
                            </v-flex>


                            <v-spacer></v-spacer>
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-select class="mt-5" label="Forma de pagamento" :items="FormasDePagamento"
                                              v-model="formaPagamento"></v-select>
                                </v-flex>
                                <v-flex>
                                    <v-flex xs6 v-if="formaPagamento === 'Crédito'">
                                        <v-select :items="quantParcelas" v-model="parcelas"
                                                  label="quantidade de parcelas"></v-select>
                                    </v-flex>
                                    <v-layout wrap>
                                        <v-flex xs5>
                                            <v-text-field label="Desconto: %"
                                                          v-model="percentageDiscount"></v-text-field>
                                        </v-flex>
                                        <v-spacer></v-spacer>
                                        <v-flex xs5>
                                            <v-text-field
                                                    disabled
                                                    label="Desconto: R$ " v-model="moneyDiscount"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 class="my-4">
                                    <v-layout row wrap>
                                        <v-flex xs6>
                                            <span>Subtotal: R$ {{this.subTotal.toLocaleString('en-us', {minimumFractionDigits: 2})}}</span>
                                        </v-flex>
                                        <v-flex xs6>
                                            <span>Desconto: R$ {{this.moneyDiscount.toLocaleString('en-us', {minimumFractionDigits: 2})}}</span>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-divider></v-divider>
                                        </v-flex>
                                        <v-flex xs12>
                                            <h6 class="title font-weight-bold"> Total: R$
                                                {{this.total.toLocaleString('en-us', {minimumFractionDigits: 2})}}</h6>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-divider></v-divider>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-spacer></v-spacer>
                                <v-flex xs12>
                                    <v-layout row wrap class="align-end fill-height">
                                        <v-flex xs6 class="text-center">
                                            <v-btn :disabled="consultas.length === 0 && exames.length === 0" outlined color="primary" @click="imprimir()">Imprimir
                                            </v-btn>
                                        </v-flex>
                                        <v-flex xs6 class="text-center">
                                            <submit-button
                                                    :disabled="!patient"
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
        <v-dialog v-model="searchPatient"
        >
            <select-patient-card max-width="100%"></select-patient-card>
        </v-dialog>
        <v-dialog v-model="budgetToPrintDialog" v-if="budgetToPrint">
            <budget-to-print @close="budgetToPrintDialog = false" :budget="budgetToPrint"></budget-to-print>
        </v-dialog>
<!--        <v-flex class="hidden-screen-only">-->
<!--            <receipt :budgets="selectedBudget"></receipt>-->
<!--        </v-flex>-->
        <v-dialog v-model="receiptDialog" v-if="selectedIntake">
            <receipt @close="receiptDialog = false" :budget=selectedIntake></receipt>
        </v-dialog>
    </v-container>
</template>

<script>
    import constants from "../../utils/constants";
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
                paymentLoading: false,
                paymentSuccess: false,
                searchBudgetError: undefined,
                searchBudgetNumber: undefined,
                searchBudgetLoading: false,
                searchBudgetBtn: false,
                searchPatient: false,
                formaPagamento: 'Dinheiro',
                moneyDiscout: 0,
                now: moment().valueOf(),
                data: moment().format("YYYY-MM-DD HH:mm:ss"),
                totalCusto: 0,
                percentageDiscount: 0,
                moneyDiscount: 0,
                FormasDePagamento: ["Dinheiro", "Crédito", "Débito"],
                totalNovo: 0,
                budgetToPrint: undefined,
                budgetToPrintDialog: false,
                selectedIntake: undefined,
                receiptDialog: false
                // selectedBudget: undefined
            }
        },
        computed: {
            selectedBudget() {
                return this.$store.getters.selectedBudget
            },
            patient() {
                return this.$store.getters.selectedPatient
            },
            exames() {
                // return this.$store.getters.selectedBudget.exams
                return this.$store.getters.getShoppingCartItemsByCategory.exams
            },
            consultas() {
                // return this.$store.getters.selectedBudget.consultations
                return this.$store.getters.getShoppingCartItemsByCategory.consultations
            },
            pacotes() {
                // return this.$store.getters.selectedBudget.packages
                return this.$store.getters.getShoppingCartItemsByCategory.packages
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
                return parseFloat(this.subTotal) - parseFloat(this.moneyDiscount)
            }
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
            removeExame(index) {
                this.total = this.total - parseFloat(this.exames[index].preco);
                this.exames.splice(index, 1)
            },
            removeConsults(index) {
                this.total -= parseFloat(this.consultas[index].preco);
                this.consultas.splice(index, 1);
                this.medicoDia.splice(index, 1);
            },
            removePackages(index) {
                this.total -= parseFloat(this.pacotes[index].preco);
                this.pacotes.splice(index, 1)
            },
            imprimir() {
                // if (this.codigo === '') {
                //     this.codigo = this.now.toString();
                // }
                // this.$store.dispatch('CadastrarVenda', {
                //     consultas: this.consultas,
                //     exames: this.exames,
                //     pacotes: this.pacotes,
                //     codigo: this.codigo,
                //     preco: this.total,
                //     custo: this.totalCusto
                // });
                // window.print();
                this.saveBudget(this.generateBudget())
                this.budgetToPrint = this.selectedBudget
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
                let id = this.now
                let budget = {
                    id: id,
                    specialties: this.consultas.length > 0 ? this.consultas : undefined,
                    exams: this.exames.length > 0 ? this.exames : undefined,
                    subTotal: this.subTotal,
                    discount: this.moneyDiscount,
                    total: this.total,
                    payment_method: this.formaPagamento,
                    date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    cost: this.cost,
                    user: this.$store.getters.selectedPatient,
                    colaborator: this.$store.getters.user
                }
                return budget
            },
            async updateBudgetsIntakes() {
                let user = this.patient;
                let intakes = await this.$store.dispatch('getUserIntakes', user)
                let budgets = await this.$store.dispatch('getUserBudgets', user)
                user.intakes = intakes
                user.budgets = budgets
                this.$store.commit('setSelectedPatient', user)
            },
            async saveBudget(budget) {
                this.$store.commit('setSelectedBudget', budget)
                // this.selectedBudget = Object.assign({}, budget)
                await this.$store.dispatch('addBudget', budget)
                this.updateBudgetsIntakes()
            },
            async pay() {
                console.log('Veio aqui')
                this.paymentLoading = true
                let user = this.patient;
                if (!user) {
                    return
                }
                if (!this.selectedBudget) {
                    await this.saveBudget(this.generateBudget())
                } else {
                    let newBudget = this.generateBudget()
                    newBudget.id = this.selectedBudget.id
                    this.$store.commit('setSelectedBudget', newBudget)
                }
                await this.$store.dispatch('addIntake', this.selectedBudget)
                this.updateBudgetsIntakes()
                this.receipt(this.selectedBudget)
                this.paymentLoading = false
                this.paymentSuccess = true
                this.card = false
                // window.print();
            },
            async receipt(intake) {
                this.selectedIntake = await this.$store.dispatch('getIntakeDetails', intake)
                // this.selectedIntake = intake
                this.receiptDialog = true
            },
            clearCart() {
                this.$store.commit('clearShoppingCartItens')
                this.$store.commit('setSelectedBudget', undefined)
                // this.selectedBudget = undefined
            },
        }
    }
</script>

<style scoped>

</style>
