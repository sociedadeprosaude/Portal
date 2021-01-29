<template>
    <v-container class="ma-0 pa-0">
        <v-layout row wrap>
            <v-flex class="hidden-print-only" xs12>
                <v-card class="elevation-0 pl-2 pr-4">
                    <v-flex xs12>
                        <v-card-title class="mt-3">
                            <v-flex xs12 class="text-center mb-4">
                                <v-btn rounded small class="mx-2"
                                       :color="categorySelect === 'exam' ? 'primary' : 'background'"
                                       @click="selectCategory('exam')">
                                    <span class="hidden-xs-only">Exames</span>
                                    <img src="@/assets/icons/lab.svg" height="24px" class="hidden-sm-and-up">
                                </v-btn>
                                <v-btn rounded small class="mx-2"
                                       :color="categorySelect === 'appointment' ? 'primary' : 'background'"
                                       @click="selectCategory('appointment')">
                                    <span class="hidden-xs-only">{{'Consultas'}}</span>
                                    <img src="@/assets/icons/doctor.svg" height="24px" class="hidden-sm-and-up">
                                </v-btn>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field
                                        label="Pesquisa"
                                        v-model="search"
                                        :loading="loading"
                                        id="search"
                                        single-line
                                        outlined
                                        dense
                                        :disabled="!categorySelect"
                                        prepend-icon="search"
                                >
                                </v-text-field>
                            </v-flex>
                        </v-card-title>
                    </v-flex>
                    <v-fade-transition>
                        <v-flex xs12>
                            <v-layout row wrap>
                                <v-flex class="ml-2" sm12>
                                    <v-layout row wrap style="width:100%"
                                              class="align-center justify-center py-0"
                                              v-for="item in items"
                                              :key="item.id">
                                        <v-flex xs12 class="align-start justify-start">
                                            <div class="text-left">
                                                <span class="my-sub-headline primary--text">{{item.name}}</span>
                                                <v-divider class="primary"/>
                                            </div>
                                        </v-flex>
                                        <v-container fluid grid-list-sm class="py-0 my-3 mx-2">
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
                                        </v-container>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-fade-transition>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "ProceduresSearch",
        data() {
            return {
                categorySelect: 'appointment',
                search: '',
                loading: undefined,
                Exams:[],
                LocaleExams:[],
                ExamsSkip: false,
                Specialties:[],
                LocaleSpecialties:[],
                SpecialtieSkip: false,
            }
        },
        watch: {
            categorySelect: function () {
                this.search = ''
            }
        },
        computed: {
            specialties() {
                return this.LocaleSpecialties.filter((a) => {
                    if (a.doctors) {
                        return a.doctors.length > 0 && a.name.includes(this.search.toUpperCase())
                    } else {
                        return false
                    }
                });
            },
            specialtiesLoaded() {
                return this.$store.getters.specialtiesLoaded
            },
            exams() {
                return this.LocaleExams.filter(e => e.name.includes(this.search.toUpperCase()));
            },
            package() {
                return this.$store.getters.bundles;
            },
            items() {
                switch (this.categorySelect) {
                    case 'exam':
                        return this.exams.slice(0,20);
                    case 'appointment':
                        return this.specialties.slice(0,20);
                    case 'package':
                        return this.package;
                    default:
                        return []
                }
            }
        },

        methods: {
            selectCategory(category) {
                this.categorySelect = category
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

            addProduct(product, type, clinic) {
                let holder = Object.assign({}, product);
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
                this.$store.commit('addShoppingCartItem', holder)
            },
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
        apollo: {
            loadSpecialties: {
                query: require("@/graphql/products/LoadProducts.gql"),
                variables(){
                    return {
                        type: 'SPECIALTY'
                    }
                },
                update(data){
                    this.Specialties = Object.assign(data.Product)
                    this.LocaleSpecialties= data.Product
                    this.SpecialtieSkip = true
                },
                skip(){
                    return this.SpecialtieSkip
                }
            },
            loadExams: {
                query: require("@/graphql/products/LoadProducts.gql"),
                variables(){
                    return {
                        type: 'EXAM'
                    }
                },
                update(data){
                    this.Exams = Object.assign(data.Product)
                    this.LocaleExams= data.Product
                    this.ExamsSkip = true
                },
                skip(){
                    return this.ExamsSkip
                }
            },
        }
    }
</script>

<style scoped>

</style>
