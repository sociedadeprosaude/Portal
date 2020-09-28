<template>
    <v-container fluid class="ma-0 pa-0 hidden-print-only">
        <v-layout row wrap>
            <v-card>
                <div v-show="option === 'intakes'">
                    <v-flex xs12 v-for="intake in intakes" :key="intake.id">
                        <v-card :class="['my-2 pl-2 py-2', diffByNow(intake) < 30000 ? 'green' : '']" >
                            <v-layout row wrap>
                                <v-flex xs10>
                                    <v-card flat @click="receipt(intake)">
                                        <v-layout row wrap>
                                            <v-flex xs10 class="text-left ripple">
                                                <span class="my-sub-headline">{{intake.id}}</span>
                                            </v-flex>
                                            <v-flex xs2>
                                                <v-progress-circular indeterminate v-if="loading"
                                                                     class="primary--text"/>
                                            </v-flex>
                                            <v-flex xs12 class="text-left">
                                                <p class="my-0">{{intake.date | dateFilter}}</p>
                                                <!--
                                                <p v-if="intake.payment_method">{{intake.payment_method}}</p>
                                                -->
                                                <p>R$ {{intake.value}}</p>
                                            </v-flex>
                                        </v-layout>
                                    </v-card>
                                </v-flex>
                                <v-flex xs2 v-if="!loading && intake.status !== intakeStatus.CANCELLED">
                                    <v-btn @click="cancelBuy(intake)" text
                                           style="min-width: 0; width: 32px; height: 100%">
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
                <div v-show="option === 'budgets'">
                    <v-flex xs12 v-for="budget in budgets" :key="budget.id">
                        <v-card ripple class="my-2 pa-2" @click="selectBudget(budget)">
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-btn rounded dense small block class="background font-weight-bold">
                                        {{budget.id}} <v-spacer/> R$ {{budget.total}}
                                    </v-btn>
                                </v-flex>
                                <v-flex xs12 class="text-left">
                                    <p class="ma-1">{{budget.date | dateFilter}}</p>
                                    <!--
                                    <span>{{budget.payment_method}}</span>
                                    -->
                                </v-flex>
                                <v-flex xs2>
                                    <v-progress-circular x-small indeterminate v-if="loading" class="primary--text"/>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                </div>
            </v-card>
            <v-dialog v-model="cancelBuyDialog" v-if="selectedIntake" max-width="500px">
                <v-card class="pa-3">
                    <v-card-title>
                        <h4>Deseja cancelar o recibo {{selectedIntake.id}}?</h4>
                    </v-card-title>
                    <v-card-text>
                        <v-flex xs12>
                            <v-text-field
                                    type="password"
                                    v-model="managerPassword"
                                    outlined
                                    placeholder="Senha do gerente"
                            />
                        </v-flex>
                        <span class="red--text" v-if="error">{{error}}</span>
                    </v-card-text>
                    <v-card-actions class="justify-center">
                        <v-btn
                                @click="cancelBuy(selectedIntake)"
                                rounded
                                class="red white--text"
                                v-if="!loading"
                        >Cancelar compra
                        </v-btn>
                        <v-progress-circular v-else class="primary--text" indeterminate/>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog
                    transition="dialog-bottom-transition"
                    fullscreen
                    v-model="receiptDialog"
                    v-if="selectedIntake"
            >
                <receipt @close="receiptDialog = false" :budget="selectedIntake"/>
            </v-dialog>
        </v-layout>
    </v-container>
</template>
<script>
    import constants from "../../utils/constants";
    import receipt from "../cashier/Receipt"

    let moment = require('moment');

    export default {
        props: ['option'],
        components: {receipt},

        data() {
            return {
                loading: false,
                selectedIntake: undefined,
                receiptDialog: false,
                cancelBuyDialog: false,
                managerPassword: "",
                error: undefined,
                intakeStatus: constants.INTAKE_STATUS
            };
        },
        methods: {
            async selectBudget(budget) {
                this.loading = true;
                budget = await this.$store.dispatch("getBudget", budget.id.toString());
                this.$store.commit("clearShoppingCartItens");
                this.$store.commit("setSelectedBudget", budget);
                for (let exam in budget.exams) {
                    this.$store.commit("addShoppingCartItem", budget.exams[exam]);
                }
                for (let spec in budget.specialties) {
                    this.$store.commit("addShoppingCartItem", budget.specialties[spec]);
                }
                this.loading = false;
            },
            diffByNow(product) {
                let now = moment();
                let date = moment(product.date, "YYYY-MM-DD HH:mm:ss");
                return now.valueOf() - date.valueOf();
            },
            async receipt(intake) {
                this.loading = true;
               /* let getIntake = await this.$store.dispatch(
                    "getIntakeDetails",
                    intake
                ); */
                this.selectedIntake = intake;
                this.receiptDialog = true;
                this.loading = false;
            },
            async cancelBuy(intake) {
                if (!this.cancelBuyDialog) {
                    this.selectedIntake = intake;
                    this.cancelBuyDialog = true;
                    return;
                }
                if (this.managerPassword !== constants.MANAGER_PASSWORD) {
                    this.error = "Senha incorreta";
                    return;
                } else {
                    this.error = undefined;
                }
                this.loading = true;
                intake.user = this.patient;
                await this.$store.dispatch("cancelIntake", intake);
                this.patient.intakes = await this.$store.dispatch(
                    "getUserIntakes",
                    this.patient
                );
                this.$store.commit("setSelectedPatient", this.patient);
                this.loading = false;
            }
        },

        computed: {
            patient() {
                return this.$store.getters.selectedPatient;
            },
            intakes() {
                console.log('this.patient', this.patient.intakes)
                let intakes= Object.assign({}, this.patient.intakes)
                return intakes;
            },
            budgets() {
                let budgets= Object.assign({}, this.patient.budgets)
                return budgets;
            }
        }
    };
</script>