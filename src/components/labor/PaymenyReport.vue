<template>
    <v-container>
        <v-layout row wrap>
            <v-flex>
                <v-card>
                    <v-layout row wrap class="justify-center">
                        <v-flex sm3 class="mt-4 mb-4">
                            <v-menu
                                    ref="menu"
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    :return-value.sync="date"
                                    transition="scale-transition"
                                    offset-y
                                    max-width="290px"
                                    min-width="290px"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                            v-model="date"
                                            prepend-inner-icon="event"
                                            hint="Escolher data"
                                            persistent-hint
                                            readonly
                                            outlined
                                            dense
                                            v-on="on"
                                    />
                                </template>
                                <v-date-picker
                                        v-model="date"
                                        type="month"
                                        no-title
                                        scrollable
                                >
                                    <v-spacer/>
                                    <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                                    <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>

            <v-flex>
                <v-card>
                    <v-layout row wrap>
                        <v-flex xs12 class="mb-3">
                            <v-layout row wrap>
                                <v-flex xs4>
                                    <span class="font-weight-bold">Nome</span>
                                </v-flex>
                                <v-spacer/>
                                <v-flex xs3 class="text-center">
                                    <span class="font-weight-bold">Salario</span>
                                </v-flex>
                                <v-spacer/>
                                <v-flex xs2>
                                    <span class="font-weight-bold">Adiantamento</span>
                                </v-flex>
                                <v-spacer/>
                                <v-flex xs3>
                                    <span class="font-weight-bold">Adiantamentos Restantes</span>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12>
                            <v-divider/>
                        </v-flex>
                        <v-flex xs12 v-for="colab in colaborators" :key="colab.name">
                            <v-layout row wrap>
                                <v-flex xs4>
                                    <span>{{colab.name.toUpperCase()}}</span>
                                </v-flex>
                                <v-spacer/>
                                <v-flex xs3 class="text-center">
                                    <span>{{colab.salary}}</span>
                                </v-flex>
                                <v-spacer/>
                                <v-flex xs2>
                                    <span>{{sumUserAdvancesMouth(colab)}}</span>
                                </v-flex>
                                <v-spacer/>
                                <v-flex xs3>
                                    <span>{{sumUserAdvances(colab)}}</span>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider/>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout row wrap>
                                <v-flex xs4>
                                    <h4 class="font-weight-bold text--primary">Total</h4>
                                </v-flex>
                                <v-spacer/>
                                <v-flex xs3 class="text-center">
                                    <span>{{sumSalaries()}}</span>
                                </v-flex>
                                <v-spacer/>
                                <v-flex xs2>
                                    <span>{{sumAdvancesMonth()}}</span>
                                </v-flex>
                                <v-spacer/>
                                <v-flex xs3>
                                    <span>{{sumAdvances()}}</span>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex xs12 class="text-center mt-5">
                <v-btn block @click="makePayments" rounded class="primary">
                    Pagar
                </v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "PaymenyReport",
        props: ['colaborators'],
        data: () => ({
            date: new Date().toISOString().substr(0, 7),
            menu: false,
            modal: false,
            types: ['COLABORATOR', 'DOCTORS'],
            type: ''
        }),
        methods: {
            sumUserAdvances(user) {
                let advanceTotal = 0
                for (let advance in user.advances) {
                    advanceTotal += user.advances[advance].value
                }
                return advanceTotal
            },
            sumSalaries() {
                let salaryTotal = 0
                this.colaborators.forEach((user) => {
                    salaryTotal += user.salary ? user.salary : 0
                })
                return salaryTotal
            },
            sumAdvances() {
                let advanceTotal = 0;
                this.colaborators.forEach((user) => {
                    for (let advance in user.advances) {
                        advanceTotal += user.advances[advance].value
                    }
                })
                return advanceTotal
            },
            sumAdvancesMonth() {
                let advanceTotalMonth = 0;
                this.colaborators.forEach((user) => {
                    for (let advance in user.advances) {
                        for (let i = 0; i < user.advances[advance].months.length; i++) {
                            if (this.date === user.advances[advance].months[i]) {
                                advanceTotalMonth += user.advances[advance].valueParcel;
                            }
                        }
                    }
                })
                return advanceTotalMonth
            },
            sumUserAdvancesMouth(user) {
                let advanceTotal = 0
                for (let advance in user.advances) {
                    for (let i = 0; i < user.advances[advance].months.length; i++) {
                        if (this.date === user.advances[advance].months[i]) {
                            advanceTotal += user.advances[advance].valueParcel;
                        }
                    }
                }
                return advanceTotal
            },
            async makePayments() {
                this.loading = true
                for (let user in this.colaborators) {
                    await this.$store.dispatch('updateUserField', {
                        user: this.colaborators[user],
                        field: 'advances',
                        value: 'pay',
                        date: this.date
                    })
                }
                await this.getInitialInfo()
                this.loading = false
            },
            async getInitialInfo() {
                await this.$store.dispatch('getColaborators')
                await this.$store.dispatch('getColaboratorsDoctors')
                this.loading = false
            },
        }
    }
</script>

<style scoped>

</style>
