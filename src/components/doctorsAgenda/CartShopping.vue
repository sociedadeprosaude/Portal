<template>
    <v-container fluid class="ma-0 pa-0">
        <v-layout row nowrap style="width: 100%" id="infinite-list" class="list-group">
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
                        <p v-if="!item.clinics"> {{item.price}}</p>
                        <v-layout row v-for="n in item.clinics" :key="n.name" class="my-2" style="width: 100%">
                            <v-btn rounded dense x-small block class="background font-weight-bold"
                                   @click="addProduct(item, 'exam', n)">
                                {{n.name}}
                                <v-spacer/>
                                {{item.price ? item.price : item.final_price}}
                            </v-btn>
                        </v-layout>
                    </v-flex>
                </v-card-text>
                <v-card-text v-if="categorySelect === 'appointment'" class="ma-0 pa-0 my-1">
                    <v-layout row class="my-2">
                        <v-flex xs12>
                            <v-layout row no-wrap v-for="clinic in item.clinics"
                                      :key="clinic.name + item.name"
                                      class="align-center justify-center text-center my-1">
                                <v-btn rounded dense x-small block class="background font-weight-bold"
                                       @click="addProduct(item, 'appointment', clinic)">
                                    {{clinic.name}}
                                    <v-spacer/>
                                    {{item.price ? item.price : item.final_price}}
                                </v-btn>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-text v-if="categorySelect === 'package'">
                    <div v-if="item.exams">
                        <v-flex xs12 class="align-center justify-center text-center pa-0">
                            <span class="font-weight-bold" v-if="item.exams.length !== 0">Exames</span>
                        </v-flex>
                        <v-divider/>
                        <v-layout row v-for="n in item.exams" :key="n.name" class="my-2 justify-center"
                                  style="width: 100%">
                            <h5>{{n.name}}
                                <v-spacer/>
                            </h5>
                        </v-layout>
                    </div>
                    <div v-if="item.consultations">
                        <v-flex xs12 class="align-center justify-center text-center">
                            <span class="font-weight-bold" v-if="item.consultations.length !== 0">Consultas</span>
                        </v-flex>
                        <v-divider/>
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
    import {infiniteScroll} from "vue-infinite-scroll"

    export default {
        props: ['Items', 'categorySelect'],
        directives: {infiniteScroll},

        async mounted() {
            const listElm = document.querySelector('#infinite-list');
            listElm.addEventListener('scroll', e => {
                if (listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight) {
                    //
                }
            });


        },

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
            addProduct(product, type, clinic) {
                let holder = Object.assign({}, product);
                console.log('type: ', type)
                switch (type) {
                    case 'appointment':
                        delete holder.doctors;
                        delete holder.clinics
                        holder.type ='appointment'
                        holder.clinic = clinic
                        break;
                    case 'exam':
                        delete holder.clinics;
                        delete holder.doctors;
                        holder.type ='exam'
                        holder.clinic = clinic;
                        break;
                    default:
                }
                console.log('holder: ', holder)
                this.$store.commit('addShoppingCartItem', holder)
            },

        }
    }
</script>
<style scoped>

    .list-group {
        overflow: auto;
        height: 82vh;
    }
</style>
