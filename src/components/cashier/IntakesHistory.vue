<template>
    <v-container class="my-0 py-0">
        <v-card class="pa-2">
            <v-layout row wrap>
                <v-flex xs12>
                    <span class="my-headline" style="font-size: 1.3em">
                        Histórico
                    </span>
                </v-flex>
                <v-flex xs12>
                    <v-btn-toggle
                            v-model="option"
                            tile
                            color="primary accent-3"
                            group
                            mandatory
                    >
                        <v-btn value="intakes">
                            Vendas
                        </v-btn>
                        <v-btn value="budgets">
                            Orçamentos
                        </v-btn>
                    </v-btn-toggle>
                </v-flex>
                <div v-if="option === 'intakes'">
                    <v-flex xs12 v-for="intake in intakes" :key="intake.id">
                        <v-card :class="['my-2 pl-2 py-2', diffByNow(intake) < 30000 ? 'green' : '']"
                        >

                            <v-layout row wrap>
                                <v-flex xs10>
                                    <v-card @click="receipt(intake)" flat>
                                        <v-layout row wrap>
                                            <v-flex xs10 class="text-left ripple">
                            <span class="my-sub-headline">
                                {{intake.date | dateFilter}}
                            </span>
                                            </v-flex>
                                            <v-flex xs2>
                                                <v-progress-circular indeterminate v-if="loading"
                                                                     class="primary--text"></v-progress-circular>
                                            </v-flex>
                                            <v-flex xs12 class="text-left">
                            <span class="my-sub-headline">
                                {{intake.id}}
                            </span>
                                            </v-flex>
                                            <v-flex xs12 class="text-left">
                            <span>
                                {{intake.payment_method}}
                            </span>
                                            </v-flex>
                                            <v-flex xs12 class="text-left">
                            <span class="my-sub-headline">
                                R$ {{intake.total}}
                            </span>
                                            </v-flex>
                                        </v-layout>
                                    </v-card>
                                </v-flex>
                                <v-flex xs2 v-if="!loading && intake.status !== intakeStatus.CANCELLED">
                                    <v-btn @click="cancelBuy(intake)" text style="min-width: 0; width: 32px; height: 100%">
                                        <v-icon class="secondary--text">delete</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex xs2 v-else>
                                    <v-btn disabled text style="min-width: 0; width: 32px; height: 100%">
                                        <v-icon class="secondary--text">cancel</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                </div>
                <div v-if="option === 'budgets'">
                    <v-flex xs12 v-for="budget in budgets" :key="budget.id">
                        <v-card ripple class=" my-2 pa-2" @click="selectBudget(budget)">
                            <v-layout row wrap>
                                <v-flex xs10 class="text-left">
                            <span class="my-sub-headline">
                                {{budget.date | dateFilter}}
                            </span>
                                </v-flex>
                                <v-flex xs2>
                                    <v-progress-circular indeterminate v-if="loading"
                                                         class="primary--text"></v-progress-circular>
                                </v-flex>
                                <v-flex xs12 class="text-left">
                            <span class="my-sub-headline">
                                {{budget.id}}
                            </span>
                                </v-flex>
                                <v-flex xs12 class="text-left">
                            <span>
                                {{budget.payment_method}}
                            </span>
                                </v-flex>
                                <v-flex xs12 class="text-left">
                            <span class="my-sub-headline">
                                R$ {{budget.total}}
                            </span>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                </div>
            </v-layout>
        </v-card>
        <v-dialog transition="dialog-bottom-transition" fullscreen v-model="receiptDialog" v-if="selectedIntake">
            <receipt @close="receiptDialog = false" :budget=selectedIntake></receipt>
            <!--            <attendance-guide v-for="(item,i) in examsPerClinc" :key="i" :guide=item></attendance-guide>-->
        </v-dialog>
        <v-dialog v-model="cancelBuyDialog" v-if="selectedIntake" max-width="500px">
            <v-card class="pa-2">
                <v-layout row wrap>
                    <v-flex xs12 class="text-left">
                    <span class="my-headline">
                        Deseja cancelar o recibo {{selectedIntake.id}}?
                    </span>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                type="password"
                                v-model="managerPassword"
                        label="Senha do gerente"></v-text-field>
                    </v-flex>
                    <v-flex xs12 class="text-right">
                        <span class="red--text mr-4" v-if="error">{{error}}</span>
                        <v-btn @click="cancelBuy(selectedIntake)" rounded class="red white--text" v-if="!loading">Cancelar compra</v-btn>
                        <v-progress-circular v-else class="primary--text" indeterminate></v-progress-circular>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>

    import Receipt from "./Receipt";
    import constants from "../../utils/constants";
    // import AttendanceGuide from "./AttendanceGuide";

    export default {
        name: "IntakesHistory",
        components: {
            // AttendanceGuide,
            Receipt
        },
        data() {
            return {
                option: 'budgets',
                loading: false,
                selectedIntake: undefined,
                examsPerClinc: undefined,
                receiptDialog: false,
                cancelBuyDialog: false,
                managerPassword: '',
                error: undefined,
                intakeStatus: constants.INTAKE_STATUS
            }
        },
        methods: {
            async selectBudget(budget) {
                this.loading = true
                budget = await this.$store.dispatch('getBudget', budget.id.toString())
                this.$store.commit('clearShoppingCartItens')
                this.$store.commit('setSelectedBudget', budget)
                // this.selectedBudget = budget
                for (let exam in budget.exams) {
                    this.$store.commit('addShoppingCartItem', budget.exams[exam])
                }
                for (let spec in budget.specialties) {
                    this.$store.commit('addShoppingCartItem', budget.specialties[spec])
                }
                this.loading = false
                // this.$store.commit('setSelectedPatient', budget.user)
            },
            diffByNow(product) {
                let now = moment()
                let date = moment(product.date, 'YYYY-MM-DD HH:mm:ss')
                return now.valueOf() - date.valueOf()
            },
            async receipt(intake) {
                this.loading = true
                this.selectedIntake = await this.$store.dispatch('getIntakeDetails', intake)
                this.receiptDialog = true
                this.loading = false
            },
            async cancelBuy(intake) {
                if (!this.cancelBuyDialog) {
                    this.selectedIntake = intake
                    this.cancelBuyDialog = true
                    return
                }
                if (this.managerPassword !== constants.MANAGER_PASSWORD) {
                    this.error = 'Senha incorreta'
                    return
                } else {
                    this.error = undefined
                }
                this.loading = true
                intake.user = this.patient
                await this.$store.dispatch('cancelIntake', intake)
                this.patient.intakes = await this.$store.dispatch('getUserIntakes', this.patient)
                this.$store.commit('setSelectedPatient', this.patient)
                this.loading = false
            }
        },
        computed: {
            patient() {
                return this.$store.getters.selectedPatient
            },
            intakes() {
                return this.patient.intakes.sort((a, b) => {
                    if (a.date < b.date) {
                        return 1
                    }
                    return -1
                })
            },
            budgets() {
                return this.patient.budgets.sort((a, b) => {
                    if (a.date < b.date) {
                        return 1
                    }
                    return -1
                })
            }
        }
    }
</script>

<style scoped>

</style>
