<template>
    <v-container>
        <v-layout row wrap>
            <RegisterBill @UpdateCharges="updateCharges()"/>
            <v-flex class="text-left mt-6" xs12>
                <span class="my-headline">{{pendingOuttakes.length}} Contas à pagar</span>
            </v-flex>
            <v-flex xs12>
                <outtake-order :outtakes="pendingOuttakes" @UpdateCharges="updateCharges()"/>
            </v-flex>
            <v-flex class="text-left mt-6" xs12>
                <span class="my-headline">{{selectedPaidOuttakesList.length}} Contas pagas</span>
            </v-flex>
            <v-container>
                <v-row>
                    <v-chip-group
                            @change="(event)=>$emit('change-selectedOption',event)"
                            active-class="primary--text"
                            mandatory
                            row
                            v-bind:value="selectedOption"
                    >
                        <v-chip :key="option" v-for="option in billsOptions">{{ option }}</v-chip>
                    </v-chip-group>
                </v-row>
                <div v-if="selectedOption === 1">
                    <v-row align="start" dense justify="start" no-gutters>
                        <v-col>
                            <v-switch
                                    :value="switchDate"
                                    @change="(event)=>$emit('change-switchDate',event)"
                                    label="Limitar por data"
                            />
                            <v-date-picker
                                    @change="(event)=>$emit('change-selectedDate',event)"
                                    locale="pt-br"
                                    v-bind:value="selectedDate"
                                    v-if="switchDate"
                            />
                        </v-col>
                        <v-col>
                            <v-switch
                                    @change="(event)=>$emit('change-switchCategory',event)"
                                    label="Limitar por categoria"
                                    v-bind:value="switchCategory"
                            />
                            <v-combobox
                                    :items="categories"
                                    @change="(event)=>$emit('change-selectedCategory',event)"
                                    clearable
                                    label="categoria"
                                    outlined
                                    v-bind:value="selectedCategory"
                                    v-if="switchCategory"
                            />
                        </v-col>
                    </v-row>
                </div>
            </v-container>
            <v-container v-if="loadingFilter">
                <v-row align="center" justify="center">
                    <v-col>
                        <v-card class="pa-4" elevation="10">
                            <v-progress-circular color="primary" indeterminate/>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <v-container v-else-if="selectedPaidOuttakesList.length === 0 && selectedOption === 0">
                <v-row align="center" justify="center">
                    <v-col>
                        <v-card class="pa-4" elevation="10">Não há contas pagas hoje</v-card>
                    </v-col>
                </v-row>
            </v-container>
            <v-container v-else-if="selectedPaidOuttakesList.length === 0 && selectedOption === 1">
                <v-row align="center" justify="center">
                    <v-col>
                        <v-card class="pa-4" elevation="10">Não há contas pagas que se encaixam nestas condições
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <v-flex class="mt-4" v-else xs12>
                <v-card :key="bill.id" class="pa-4 my-4" v-for="bill in selectedPaidOuttakesList">
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-layout row wrap>
                                <v-layout row v-bind:key="cat.name" v-for="cat in bill.categories" wrap>
                                    <span>{{cat.name}}</span>
                                </v-layout>
                                <v-divider class="mx-4" vertical/>
                                <span>{{bill.payment_methods}}</span>
                                <v-divider class="mx-4" vertical/>
                                <span class="font-weight-bold">{{bill.date_to_pay | dateFilter}}</span>
                                <v-divider class="mx-4" vertical/>
                                <span class="font-weight-bold">{{bill.paid | dateFilter}}</span>
                                <v-divider class="mx-4" vertical/>
                                <v-spacer/>
                                <span class="font-weight-bold">{{bill.value}}</span>

                                <v-flex xs12>
                                    <span>{{bill.description}}</span>
                                </v-flex>
                                <v-flex class="mt-4" sm10 xs12>
                                    <v-layout row wrap>
                                        <v-layout column wrap>
                                            <span class="my-sub-headline mb-4">Anexos</span>
                                            <v-layout row wrap>
                                                <v-flex :key="i" v-for="(append, i) in bill.appends">
                                                    <v-card @click="openAppend(append)" flat>
                                                        <img :src="append" style="max-width: 124px; max-width: 124px"/>
                                                    </v-card>
                                                </v-flex>
                                            </v-layout>
                                        </v-layout>
                                        <v-divider vertical/>
                                        <v-layout column wrap>
                                            <span class="my-sub-headline mb-4">Comprovante</span>
                                            <v-layout row v-if="!loading" wrap>
                                                <v-flex :key="i" v-for="(append, i) in bill.receipts">
                                                    <v-card @click="openAppend(append)" flat>
                                                        <img :src="append" style="max-width: 124px; max-width: 124px"/>
                                                    </v-card>
                                                </v-flex>
                                            </v-layout>
                                            <v-flex class="text-right" sm2 v-else xs12>
                                                <v-progress-circular class="primary--text" indeterminate/>
                                            </v-flex>
                                        </v-layout>
                                    </v-layout>
                                </v-flex>
                                <v-flex class="text-right" v-if="loadingDelete && outtakeSelect === bill" xs12>
                                    <v-progress-circular class="primary--text" indeterminate/>
                                </v-flex>
                                <v-flex class="text-right" v-else xs12>
                                    <v-btn @click="unpayOuttake(bill)" class="error mx-2" fab small>
                                        <v-icon>money_off</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import OuttakeOrder from "../Reports/OuttakeOrder";
    import RegisterBill from "../../components/Bills/RegisterBill";
    import {mask} from "vue-the-mask";
    import moment from "moment";

    export default {
        name: "Bils",
        components: {
            OuttakeOrder,
            RegisterBill
        },
        methods: {
            updateCharges() {
                this.$emit('updateCharges')
            }
        },
        props: {
            other: String,
            billsOptions: Array,
            dialogSelectDate: Boolean,
            dialogCategory: Boolean,
            switchDate: Boolean,
            switchCategory: Boolean,
            selectedOption: Number,
            selectedDate: String,
            selectedCategory: String,
            loading: Boolean,
            loadingFilter: Boolean,
            loadingDelete: Boolean,
            outtakeSelect: Object,
            files: Array,
            filesPreviews: Array,

            outtakesPaid: Array,
            outtakesPaidToday: Array,
            pendingOuttakes: Array,
            selectedPaidOuttakesList: Array,
            categories: Array,

            getOuttakesPaid: Function,
            unpayOuttake: Function,
            openAppend: Function
        }
    };
</script>
