<template>
    <v-container fluid class="ma-0 pa-0">
        <v-layout row nowrap style="width: 100%">
            <v-card class="my-2 white" width="100%" v-if="exams.length > 0">
                <h4 class="text-left ml-2">Exames</h4>
                <v-card-text v-for="(item) in exams" :key="item.name" class="ma-0 pa-0 my-1 font-weight-bold">
                    <v-flex xs12 class="mt-2">
                        <v-divider/>
                    </v-flex>
                    <v-flex xs12 class="align-center justify-center text-center">
                        <span class="font-weight-bold">{{item.name}}</span>
                    </v-flex>
                    <v-flex xs12>
                        <v-divider/>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout row wrap class="mx-1 black--text">
                            <span>{{item.clinic.name}}</span>
                            <v-spacer/>
                            <span>R$ {{item.price}}</span>
                        </v-layout>
                    </v-flex>
                    <v-btn rounded dense x-small class="error px-6" @click="removeItem(item)">Remover Item</v-btn>
                </v-card-text>
            </v-card>
            <v-card class="my-2 white" width="100%" v-if="consultations.length > 0">
                <h4 class="text-left ml-2">Consultas</h4>
                <v-card-text v-for="(item,key) in consultations" :key="key" class="ma-0 pa-0 my-1 font-weight-bold">
                    <v-flex xs12 class="mt-2">
                        <v-divider/>
                    </v-flex>
                    <v-flex xs12 class="align-center justify-center text-center">
                        <span>{{item.name}}</span>
                    </v-flex>
                    <v-flex xs12>
                        <v-divider/>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout row wrap class="mx-1 black--text">
                            <span>{{item.doctor.clinic.name}}</span>
                            <v-spacer/>
                            <span>R$ {{item.price}}</span>
                        </v-layout>
                    </v-flex>
                    <v-btn rounded dense x-small class="error px-6" @click="removeItem(item)">Remover Item</v-btn>
                </v-card-text>
            </v-card>
            <v-layout row wrap class="mt-3">
                <v-flex xs12>
                    <ApolloQuery
                            :query="require('@/graphql/doctors/LoadDoctorsId.gql')"
                    >
                        <template slot-scope="{ result: { data } }">
                            <v-combobox class="pa-0"
                                        v-model="selectedDoctor"
                                        :items="data ? doctors : []"
                                        return-object
                                        item-text="name"
                                        label="Médico"
                                        outlined
                                        dense
                                        solo
                                        color="blue"
                                        clearable
                            >
                                <template v-slot:selection="dataa">
                                    <v-chip
                                            :key="JSON.stringify(dataa.item)"
                                            :input-value="dataa.selected"
                                            :disabled="dataa.disabled"
                                            class="v-chip--select-multi"
                                            @click.stop="dataa.parent.selectedIndex = dataa.index"
                                            @input="dataa.parent.selectItem(dataa.item)"
                                            text-color="white" dense
                                            color="primary"
                                    >{{ dataa.item.name }}
                                    </v-chip>
                                </template>
                            </v-combobox>
                        </template>
                    </ApolloQuery>
                </v-flex>
            </v-layout>
        </v-layout>
    </v-container>
</template>
<script>

    export default {

        data() {
            return {
                receiptDialog: false,
                noDoctorKeyWord: 'Nenhum',
                doctors:{},
                skipDoctors: false

            }
        },

        computed: {
            exams() {
                return this.$store.getters.getShoppingCartItemsByCategory.exams
            },
            consultations() {
                return this.$store.getters.getShoppingCartItemsByCategory.consultations
            },
            selectedDoctor: {
                get() {
                    return this.$store.getters.shoppingCartSelectedDoctor
                },
                set(val) {
                    this.$store.commit('setSelectedDoctor', val)
                }
            }
        },
        watch: {
            percentageDiscount: function () {
                this.moneyDiscount = ((this.percentageDiscount * this.subTotal) / 100);
            },
        },
        methods: {
            removeItem(item) {
                this.$store.commit('removeShoppingCartItem', item)
            },
            clearCart() {
                this.$store.commit('clearShoppingCartItens');
                this.$store.commit('setSelectedBudget', undefined);
                let user = undefined;
                this.$store.commit('setSelectedPatient', user)
            },
        },
        apollo: {
            loadDoctors: {
                query: require("@/graphql/doctors/LoadDoctorsId.gql"),
                update(data) {
                    this.doctors = data.Doctor
                    this.doctors.push({name: this.noDoctorKeyWord})
                    this.skipDoctors = true
                },
                skip (){
                    return this.skipDoctors
                }
            },
        }
    }
</script>
