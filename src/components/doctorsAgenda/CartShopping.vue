<template>
    <v-container fluid class="ma-0 pa-0">
        <v-layout row nowrap style="width: 100%">
            <v-card v-for="(item, i) in Items" :key="i" class="my-2" width="100%">
                <v-layout row wrap v-if="categorySelect === 'package'"
                          class="align-center justify-center text-center my-1">
                    <v-btn rounded dense x-small block class="background font-weight-bold" @click="selectBudget(item)"
                           v-if="item.percentageDiscount">
                        {{item.name}}
                        <v-spacer/>
                        {{parseFloat((item.price * parseFloat(item.percentageDiscount)) / 100).toFixed(2)}}
                    </v-btn>

                    <v-btn rounded dense x-small block class="background font-weight-bold" @click="selectBudget(item)"
                           v-else>
                        {{item.name}}
                        <v-spacer/>
                        {{parseFloat(item.price).toFixed(2)}}
                    </v-btn>
                </v-layout>
                <h4 v-else class="text-left ml-2">{{item.name}}</h4>
                <v-divider/>
                <v-card-text v-if="categorySelect === 'exam'" class="ma-0 pa-0 my-1">
                    <v-flex xs12>
                        <v-layout row v-for="n in item.clinics" :key="n.name" class="my-2" style="width: 100%">
                            <v-btn rounded dense x-small block class="background font-weight-bold"
                                   @click="addProduct(item, n, 'exam')">
                                {{n.name}}
                                <v-spacer/>
                                {{n.price}}
                            </v-btn>
                        </v-layout>
                    </v-flex>
                </v-card-text>
                <v-card-text v-if="categorySelect === 'appointment'" class="ma-0 pa-0 my-1">
                    <v-layout row v-for="n in item.doctors" :key="n.cpf" class="my-2">
                        <v-flex xs12 class="align-center justify-center text-center">
                            <span class="font-weight-bold">{{n.name}}</span>
                        </v-flex>
                        <v-flex xs12>
                            <v-divider/>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout row no-wrap v-for="clinic in n.clinics"
                                      :key="clinic.name + n.name"
                                      class="align-center justify-center text-center my-1">
                                <v-btn rounded dense x-small block class="background font-weight-bold"
                                       @click="addProduct(item, n, 'appointment', clinic)">
                                    {{clinic.name}}
                                    <v-spacer/>
                                    {{n.price}}
                                </v-btn>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-text v-if="categorySelect === 'package'">
                    <v-flex xs12 class="align-center justify-center text-center pa-0">
                        <span class="font-weight-bold" v-if="item.exams.length !== 0">Exames</span>
                    </v-flex>
                    <v-divider/>
                    <div v-if="item.exams">
                        <v-layout row v-for="n in item.exams" :key="n.name" class="my-2 justify-center"
                                  style="width: 100%">
                            <h5>{{n.name}}
                                <v-spacer/>
                            </h5>
                        </v-layout>
                    </div>

                    <v-flex xs12 class="align-center justify-center text-center">
                        <span class="font-weight-bold" v-if="item.consultations.length !== 0">Consultas</span>
                    </v-flex>
                    <v-divider/>
                    <div v-if="item.consultations">
                        <v-layout row v-for="n in item.consultations" :key="n.name" class="my-2 justify-center"
                                  style="width: 100%">
                            <h5>{{n.name}}
                                <v-spacer/>
                            </h5>
                        </v-layout>
                    </div>
                </v-card-text>
            </v-card>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        props: ['Items', 'categorySelect'],

        methods: {
            async selectBudget(budget) {
                this.$store.commit('setSelectedBudget', budget);
                for (let exam in budget.exams) {
                    this.$store.commit('addShoppingCartItem', budget.exams[exam])
                }
                for (let spec in budget.consultations) {
                    this.$store.commit('addShoppingCartItem', budget.consultations[spec])
                }
            },

            addProduct(product, selection, type, clinic) {
                let holder = Object.assign({}, product);

                switch (type) {
                    case 'appointment':
                        delete holder.doctors;
                        holder.doctor = selection;
                        holder.doctor.clinic = clinic;
                        holder.cost = selection.cost;
                        holder.price = selection.price;
                        break;
                    case 'exam':
                        delete holder.clinics;
                        holder.clinic = selection;
                        holder.cost = selection.cost;
                        holder.price = selection.price;
                        break;
                    default:
                }
                this.$store.commit('addShoppingCartItem', holder)
            },

        }
    }
</script>
