<template>
    <v-container class="ma-0 pa-0">
        <v-layout row wrap>
            <v-flex class="hidden-print-only d-none d-md-block" xs12>
                <v-card class="ml-5 elevation-2">
                    <v-container>
                        <v-layout  row wrap class="mx-3 align-center">
                            <v-flex xs12 class="v-card"
                                    style="overflow:auto; height:50vh; box-shadow: inset 0px 0px 5px grey;">
                                <v-layout row wrap v-if="editedPackage">
                                    <v-flex xs12 v-if="exams.length > 0">
                                        <p class="my-headline">Exames</p>
                                        <v-card v-for="(item) in exams" class="ma-2" :key="item.name">
                                            <v-card-title class="py-2">
                                                <span class="subtitle-1 font-weight-medium">{{item.name}}</span>
                                                <v-spacer> </v-spacer>
                                                <span class="subtitle-1 font-weight-light">
                                                    <v-btn small icon @click="removeItem(item)">
                                                        <v-icon>cancel</v-icon>
                                                    </v-btn>
                                                </span>
                                            </v-card-title>
                                            <v-card-text class="pt-1 pb-0">
                                                {{item.clinic.name}}
                                                <p class="text-right">
                                                    R$ {{item.price}}
                                                </p>
                                            </v-card-text>
                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-spacer> </v-spacer>
                            <v-layout row wrap class="mt-2">
                                <v-flex xs5>
                                    <v-text-field
                                            outlined
                                            label="Custo R$"
                                            v-model="cost"
                                            prefix="R$"
                                            readonly>
                                    </v-text-field>
                                </v-flex>
                                <v-spacer> </v-spacer>
                                <v-flex xs5>
                                    <v-text-field
                                            outlined
                                            label="Venda R$"
                                            v-model="price"
                                            prefix="R$"
                                            readonly>
                                    </v-text-field>
                                </v-flex>
                                <v-flex>
                                    <v-layout wrap>
                                        <v-flex xs5>
                                            <v-text-field
                                                    label="Desconto: %"
                                                    v-model="percentageDiscount"
                                                    placeholder="0"
                                                    clearable>
                                            </v-text-field>
                                        </v-flex>
                                        <v-spacer> </v-spacer>
                                        <v-flex xs5>
                                            <v-text-field
                                                    disabled
                                                    label="Desconto: R$ "
                                                    placeholder="0"
                                                    v-model="moneyDiscount">
                                            </v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 class="my-4">
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-divider> </v-divider>
                                        </v-flex>
                                        <v-flex xs12>
                                            <h6 class="title font-weight-bold"> Total:
                                                {{this.total | moneyFilter}}</h6>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-divider> </v-divider>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-spacer> </v-spacer>
                                <v-flex xs12>
                                    <v-layout row wrap class="align-end fill-height">
                                        <v-flex xs12 class="text-center mt-4">
                                            <v-btn outlined color="primary"  @click="validateRegister()">
                                                Salvar Pacote</v-btn>
                                            <v-btn color="error" fab small class="ml-5" :disabled="!selectedPackage"
                                                   @click="deleteBundle = true">
                                                <v-icon>delete</v-icon>
                                            </v-btn>
                                            <v-dialog v-model="deleteBundle" persistent max-width="350">
                                                <v-card>
                                                    <v-card-title><strong>Deseja excluir este pacote?</strong></v-card-title>
                                                    <v-card-text>Este pacote será excluído permanentemente.</v-card-text>
                                                    <v-card-actions>
                                                        <v-spacer> </v-spacer>
                                                        <v-btn color="error" text @click="deleteBundle = false, deletePackage()">EXCLUIR</v-btn>
                                                        <v-btn color="primary" text @click="deleteBundle = false">CANCELAR</v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </v-dialog>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    export default {
        name: "listPackage",
        data () {
            return {
                searchData: null,

                search: null,
                validRegister: true,

                items: [], action: false, deleteBundle: false,

                percentageDiscount: '0', moneyDiscount: '0',

                editedPackage: {
                    id: '', name: '', exams: [], specialties: [],
                },

                defaultPackage: {
                    id: '', name: '', exams: [], specialties: [], percentageDiscount: 0,
                },
            }
        },

        computed: {

            selectedPackage () {
                let item= this.$store.getters.selectedBundle;
                if(item){
                    this.percentageDiscount= item.percentageDiscount ? parseFloat(item.percentageDiscount) : 0;
                    this.moneyDiscount = item.percentageDiscount ? parseFloat(item.moneyDiscount).toLocaleString('en-us', {minimumFractionDigits: 2}) : 0;
                }
                return this.$store.getters.selectedBundle;

            },

            exams () {
                return this.$store.getters.getItemsPackageByCategory.exams
            },

            cost () {
                let itens = this.$store.getters.getItemsPackage;
                let total = 0;
                for (let item in itens) {
                    total += parseFloat(itens[item].cost)
                }
                if (total) {
                    return total
                } else {
                    return 0;
                }

            },

            price() {

                let itens = this.$store.getters.getItemsPackage;
                let total = 0;
                for (let item in itens) {
                    total += parseFloat(itens[item].price)
                }

                return total;
            },

            total() {
                let subTotal = 0;
                subTotal = subTotal + this.moneyDiscount;
                let total = parseFloat(this.price) - parseFloat(subTotal);
                if (!total || total < 0) {
                    return 0;
                } else {
                    return total ;
                }

            }

        },


        watch: {
            percentageDiscount: function () {

                this.moneyDiscount = ((this.percentageDiscount * this.price) / 100);

            },

        },

        methods: {

            clearSearch () {

                this.$store.commit('setSelectedBundle', this.defaultPackage);
                this.$store.commit('clearItemsPackage');
                this.$store.commit('clearNameBundle');
                this.percentageDiscount = 0;
                this.moneyDiscount = 0;
            },

            validateRegister () {

                const packageData = {

                    exams: this.exams.length > 0 ? this.exams : undefined,
                    moneyDiscount: this.moneyDiscount,
                    percentageDiscount: this.percentageDiscount,
                    cost: this.cost,
                    price: this.price,
                    total: (this.price - this.moneyDiscount),
                    name: this.$store.getters.getNameBundle.toUpperCase(),
                };


                for (let exam in this.exams) {

                    this.exams[exam].price = this.exams[exam].price - ((this.percentageDiscount / 100) * this.exams[exam].price)
                }

                this.$store.dispatch('addBundle', packageData).then(() => {
                    this.clearSearch();
                    this.$store.dispatch('loadBundle');
                });

            },

            removeItem(item) {
                this.$store.commit('removeItemsPackage', item)
            },
            deletePackage () {

                this.$store.dispatch('deletePackage', this.$store.getters.selectedBundle).then(() => {
                    this.$store.dispatch('loadBundle');
                });
                this.clearSearch();

            },
        },
    }
</script>

