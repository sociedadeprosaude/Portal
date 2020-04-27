<template>
    <v-container fluid>
        <v-layout column wrap class="justify-center">
            <v-layout row wrap class="justify-center mt-10">
                <v-flex xs3>
                    <p class="word">Orçamento</p>
                </v-flex>
                <v-flex xs3>
                    <p class="word">Entrada</p>
                </v-flex>
            </v-layout>
            <v-layout row wrap class="justify-center">
                <v-flex xs3>
                    <v-btn fab dark class="button" color="primary" @click="budget">
                        <v-icon size="80">shopping_cart</v-icon>
                    </v-btn>
                </v-flex>
                <v-flex xs3>
                    <v-btn fab dark class="button" color="primary" @click="intakeDialog = !intakeDialog">
                        <v-icon size="80">attach_money</v-icon>
                    </v-btn>
                </v-flex>
            </v-layout>
            <v-dialog content-class="bottom-dialog" v-model="intakeDialog" transition="dialog-bottom-transition" max-width="720px">
                <v-card class="pa-3">
                    <v-layout row wrap>
                        <v-flex xs12>
                            <span class="my-headline">Entrada</span>
                        </v-flex>
                        <v-flex sm5 xs12>
                            <v-combobox
                                    :items="intakeCategories"
                                    v-model="intake.category" label="categoria">
                            </v-combobox>
                        </v-flex>
                        <v-spacer/>
                        <v-flex sm5 xs12>
                            <v-currency-field v-model="intake.value" label="valor">
                            </v-currency-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field v-model="intake.description" label="Descricao">
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12 class="text-center">
                            <submit-button text="Adicionar" :loading="loading" :success="success" @click="addIntake(intake)">
                            </submit-button>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-dialog>
        </v-layout>
    </v-container>
</template>

<script>
    import SubmitButton from "../../components/SubmitButton";
    import moment from 'moment';

    export default {
        data() {
            return {
                intakeDialog: false,
                intake: {},
                loading: false,
                success: false
            }
        },
        components: {
            SubmitButton
        },
        computed: {
            intakeCategories() {
                return this.$store.getters.intakesCategories
            },
            user () {
                return this.$store.getters.user
            },
            unit() {
                return this.$store.getters.selectedUnit
            }
        },
        mounted() {
            this.$store.dispatch('getIntakesCategories')
        },
        methods: {

            budget() {
                this.$router.push('/caixa/Orçamento')
            },

            async addIntake(intake) {
                this.loading = true;
                intake.colaborator = this.user;
                intake.unit = this.unit;
                intake.date = moment().format('YYYY-MM-DD HH:mm:ss');
                intake.type = 'financial_support';
                await this.$store.dispatch('addFinancialSupportIntake', intake);
                this.success = true;
                this.loading = false;
                setTimeout(() => {
                    this.success = false
                }, 1000)
            }
        }
    };
</script>

<style scoped>

    .button {
        margin-top: 10%;
        width: 120px;
        height: 120px;
    }

    .word {
        font-size: 32px;
        margin-top: 5%;
    }
</style>
