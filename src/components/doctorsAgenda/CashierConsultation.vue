<template>
    <v-container class="ma-0 pa-0 hidden-print-only" fluid>
        <v-layout row wrap>
            <v-flex xs12>
                <v-btn rounded small class="mx-1" @click="selectCategory('exam')"
                       :color="categorySelect === 'exam' ? 'background' : 'primary'" v-if="!historyPatient">
                    Exames
                </v-btn>
                <v-btn rounded small class="mx-1" @click="selectCategory('appointment')"
                       :color="categorySelect === 'appointment' ? 'background' : 'primary'" v-if="!historyPatient">
                    Consultas
                </v-btn>
                <v-btn rounded small class="mx-1" @click="selectCategory('package')"
                       :color="categorySelect === 'package' ? 'background' : 'primary'" v-if="!historyPatient">
                    Pacotes
                </v-btn>
                <v-btn rounded small class="mx-1" v-if="historyPatient" @click="selectOptionHistoryPatient('budgets')"
                       :color="optionPatient === 'budgets' ? 'background' : 'primary'">
                    Orçamentos
                </v-btn>
                <v-btn rounded small class="mx-1" v-if="historyPatient" @click="selectOptionHistoryPatient('intakes')"
                       :color="optionPatient === 'intakes' ? 'background' : 'primary'">
                    Vendas
                </v-btn>
                <v-btn small text icon dark v-if="patient" @click="historyPatient = !historyPatient">
                    <v-icon>more_vert</v-icon>
                </v-btn>
            </v-flex>
            <v-flex xs12 class="mt-4 mx-3" v-if="!historyPatient">
                <v-card>
                    <v-card-title>
                        <v-flex xs12 class="text-center pt-n5">
                            <v-btn @click="searchBudgetBtn = !searchBudgetBtn" dense text>
                                <h5 class="primary--text" v-if="!searchBudgetBtn">pesquisar orçamento</h5>
                                <h5 class="primary--text" v-if="searchBudgetBtn"> esconder pesquisa por orçamento</h5>
                            </v-btn>
                        </v-flex>
                        <v-flex xs12 v-if="searchBudgetBtn">
                            <v-layout row wrap class="align-center mt-2">
                                <v-flex xs10>
                                    <v-text-field
                                            label="Num. do Orçamento"
                                            v-model="searchBudgetNumber"
                                            type="number"
                                            outlined
                                            dense
                                    >
                                    </v-text-field>
                                </v-flex>
                                <v-flex xs2 class="text-center mt-n6">
                                    <v-btn v-if="!searchBudgetLoading"
                                           fab
                                           small
                                           icon
                                           style="min-width: 0; width: 64px"
                                           @click="searchBudget">
                                        <v-icon class="primary--text">search</v-icon>
                                    </v-btn>
                                    <v-progress-circular class="primary--text" indeterminate v-else/>
                                </v-flex>
                                <v-flex xs12 v-if="searchBudgetError">
                                    <span class="error--text">{{searchBudgetError}}</span>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-text-field placeholder="Pesquisa"
                                      v-model="search"
                                      :loading="loading"
                                      id="search"
                                      single-line
                                      :disabled="!categorySelect"
                        />
                        <v-spacer/>
                        <v-btn :color="cartPatient ? 'accent' : ''" fab icon @click="cartPatient = !cartPatient">
                            <v-badge
                                :content="this.itemsShopping"
                                :value="this.itemsShopping"
                                color="primary"
                                overlap
                            >
                                <v-icon>local_grocery_store</v-icon>
                            </v-badge>
                        </v-btn>
                        <span>{{itemsShopping}}</span>
                    </v-card-title>
                    <v-card-text v-if="cartPatient">
                        <CartPatient/>
                    </v-card-text>
                    <v-card-text v-if="!cartPatient">
                        <CartShopping :Items="items" :categorySelect="categorySelect"/>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12 class="mt-4 mx-3" v-if="cartPatient && !historyPatient">
                <v-card>
                    <v-card-title>
                        <h5>Detalhes do pagamento</h5>
                    </v-card-title>
                    <v-card-text>
                        <DetailsPayment/>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12 v-if="historyPatient" class="mt-4 mx-3">
                <v-card>
                    <HistoryCashierPatient :option="optionPatient"/>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import CartShopping from "../doctorsAgenda/CartShopping";
    import CartPatient from "../doctorsAgenda/CartPatient";
    import DetailsPayment from "../doctorsAgenda/DetailsPaymentCashier";
    import HistoryCashierPatient from "../doctorsAgenda/HistoryCashierPatient"

    export default {
        components: {CartShopping, CartPatient, DetailsPayment, HistoryCashierPatient},
        data() {
            return {
                categorySelect: 'exam',
                search: '',
                loading: undefined,
                cartPatient: false,
                historyPatient: false,
                optionPatient: 'budgets',
                searchBudgetError: undefined,
                searchBudgetNumber: undefined,
                searchBudgetLoading: false,
                searchBudgetBtn: false,
                type:'EXAM',
                Products:[],
                LocaleProducts:[],
                Exams:[],
                LocaleExams:[],
                ExamsSkip: false,
                Specialties:[],
                LocaleSpecialties:[],
                SpecialtieSkip: false
            }
        },

        mounted() {
            let self = this;
            window.addEventListener('keyup', function (e) {
                if (e.target.id === 'search') {
                    clearTimeout(self.typingTimer);
                    self.typingTimer = setTimeout(() => {
                        if (self.categorySelect === 'exam') {
                            self.LocaleExams = self.Exams.filter((el) =>  el.name.toUpperCase().includes(self.search.toUpperCase()))
                        }
                        if (self.categorySelect === 'appointment') {
                            self.LocaleSpecialties = self.Specialties.filter((el) =>  el.name.toUpperCase().includes(self.search.toUpperCase()))
                        }
                        if (self.categorySelect === 'package') {
                            self.$store.dispatch("loadBundle");
                        }
                    }, 300);
                }
            });
            window.addEventListener('keydown', function (e) {
                if (e.target.id === 'search') {
                    clearTimeout(self.typingTimer)
                }
            })
        },

        watch: {
            categorySelect(value) {
                switch (this.categorySelect) {
                    case 'exam':
                        this.type = 'EXAM'
                        break;
                    case 'appointment':
                        this.type = 'SPECIALTY'
                        break;
                    case 'package':
                        console.log(this.package)
                        break;
                    default:
                        return []
                }
                this.search = ''
            },
            patient() {
                return this.$store.getters.selectedPatient;
            }
        },

        computed: {
            itemsShopping () {
                return this.$store.getters.getShoppingCartItems.length;
            },
            package() {
                return this.$store.getters.bundles;
            },
            items() {
                switch (this.categorySelect) {
                    case 'exam':
                        return this.LocaleExams.slice(0,20);
                    case 'appointment':
                        return this.LocaleSpecialties.slice(0,20);
                    case 'package':
                        return this.package;
                    default:
                        return []
                }
            },
            patient() {
                return this.$store.getters.selectedPatient;
            }
        },

        methods: {

            selectCategory(category) {
                this.categorySelect = category
            },

            selectOptionHistoryPatient(option) {
                this.optionPatient = option
            },

            async selectBudget(budget) {
                this.loading = true;
                this.$store.commit('setSelectedBudget', budget);
                for (let exam in budget.exams) {
                    this.$store.commit('addShoppingCartItem', budget.exams[exam])
                }
                for (let spec in budget.consultations) {
                    this.$store.commit('addShoppingCartItem', budget.consultations[spec])
                }
                this.loading = false
            },
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

        },
        apollo: {
            loadSpecialties: {
                query: require("@/graphql/products/LoadProducts.gql"),
                variables(){
                    return {
                        type: 'SPECIALTY'
                    }
                },
                update(data){
                    this.Specialties = Object.assign(data.Product)
                    this.LocaleSpecialties= data.Product
                    this.SpecialtieSkip = true
                },
                skip(){
                    return this.SpecialtieSkip
                }
            },
            loadExams: {
                query: require("@/graphql/products/LoadProducts.gql"),
                variables(){
                    return {
                        type: 'EXAM'
                    }
                },
                update(data){
                    this.Exams = Object.assign(data.Product)
                    this.LocaleExams= data.Product
                    this.ExamsSkip = true
                },
                skip(){
                    return this.ExamsSkip
                }
            }
        }
    }

</script>
