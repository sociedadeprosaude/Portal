<template>
    <v-container class="ma-0 pa-0" fluid>
        <v-layout row wrap>
            <v-flex xs12>
                <v-btn rounded small class="mx-1" @click="selectCategory('exam')"
                       :color="categorySelect === 'exam' ? 'background' : 'primary'" v-if="!historyPatient">
                    Exames
                </v-btn>
                <v-btn rounded small class="mx-1" @click="selectCategory('appointment')"
                       :color="categorySelect === 'appointment' ? 'background' : 'primary'" v-if="!historyPatient">
                    <span>{{specialtiesLoaded ? 'Consultas' : 'Carregando consultas...'}}</span>
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
            }
        },

        mounted() {
            let self = this;
            window.addEventListener('keyup', function (e) {
                if (e.target.id === 'search') {
                    clearTimeout(self.typingTimer);
                    self.typingTimer = setTimeout(() => {
                        if (self.categorySelect === 'exam') {
                            self.loading = true;
                            self.$store.dispatch("loadSelectedExams", self.search.toUpperCase()).then(() => {
                                self.loading = false
                            });
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
            categorySelect: function () {
                this.search = ''
            },
            patient() {
                return this.$store.getters.selectedPatient;
            },

        },

        computed: {
            itemsShopping () {
                console.log( this.$store.getters.getShoppingCartItems.length);
                return this.$store.getters.getShoppingCartItems.length;
            },
            specialties() {
                let specialties = this.$store.getters.specialties;
                for (let spec in specialties) {
                    if (specialties[spec].doctors) {

                        specialties[spec].doctors = specialties[spec].doctors.filter((a) => {
                            return a.cost
                        })
                    }
                }
                specialties = this.$store.getters.specialties.filter((a) => {
                    if (a.doctors) {
                        return a.doctors.length > 0 && a.name.includes(this.search.toUpperCase())
                    } else {
                        return false
                    }
                });
                return specialties
            },
            specialtiesLoaded() {
                return this.$store.getters.specialtiesLoaded
            },
            exams() {
                return this.$store.getters.examsSelected;
            },
            package() {
                return this.$store.getters.bundles;
            },
            items() {
                switch (this.categorySelect) {
                    case 'exam':
                        return this.exams;
                    case 'appointment':
                        return this.specialties;
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
                for (let spec in budget.specialties) {
                    this.$store.commit('addShoppingCartItem', budget.specialties[spec])
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

        }
    }

</script>
