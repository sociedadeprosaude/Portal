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
                                    <span class="hidden-xs-only">{{specialtiesLoaded ? 'Consultas' : 'Carregando consultas...'}}</span>
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
                                            <v-layout row wrap v-if="categorySelect === 'exam'">
                                                <v-flex v-for="n in item.clinics" :key="n.name" sm12 xs12
                                                        class="px-2 py-2">
                                                    <v-card class="pa-4 background"
                                                            style="border-radius:20px; height: 100%">
                                                        <v-layout>
                                                            <v-layout row wrap>
                                                                <v-flex xs12 class="text-left">
                                                                    <v-layout row wrap>
                                                                        <span class="subtitle-2 font-weight-bold">{{n.name}}</span>
                                                                        <v-spacer/>
                                                                        <v-chip small color="primary_dark"
                                                                                text-color="white" class="mb-2">
                                                                            Preço :
                                                                            {{n.price}}
                                                                        </v-chip>
                                                                    </v-layout>
                                                                </v-flex>
                                                                <v-flex xs12 class="mb-1">
                                                                    <v-divider class="primary"/>
                                                                </v-flex>
                                                                <v-flex xs12 class="text-right">
                                                                    <v-fade-transition>
                                                                        <v-btn
                                                                                rounded
                                                                                small
                                                                                color="primary_dark white--text"
                                                                                class="mx-0"
                                                                                @click="addProduct(item, n, 'exam')"
                                                                        >Adicionar
                                                                        </v-btn>
                                                                        <v-btn
                                                                                rounded
                                                                                small
                                                                                color="grey"
                                                                                class="mx-0"
                                                                        >Sem conexão
                                                                        </v-btn>
                                                                    </v-fade-transition>
                                                                </v-flex>
                                                            </v-layout>
                                                        </v-layout>
                                                    </v-card>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row wrap v-if="categorySelect === 'appointment'">
                                                <v-flex v-for="(n, index) in item.doctors"
                                                        :key="n.crm + index" sm12 xs12 class="px-2 py-2">
                                                    <div v-for="clinic in n.clinics" :key="clinic.name" class="mb-3">
                                                        <v-card class="pa-4 background"
                                                                style="border-radius:20px; height: 100%">
                                                            <v-layout>
                                                                <v-layout row wrap>
                                                                    <v-flex xs12 class="text-left">
                                                                        <v-layout row wrap>
                                                                            <span class="subtitle-2 font-weight-bold">
                                                                                {{n.name}} - {{clinic.name}}
                                                                            </span>
                                                                            <v-spacer/>
                                                                            <v-chip small color="primary_dark"
                                                                                    text-color="white" class="mb-2">
                                                                                Preço :
                                                                                {{n.price}}
                                                                            </v-chip>
                                                                        </v-layout>
                                                                    </v-flex>
                                                                    <v-flex xs12 class="mb-1">
                                                                        <v-divider class="primary"/>
                                                                    </v-flex>
                                                                    <v-flex xs12 class="text-right">
                                                                        <v-fade-transition>
                                                                            <v-btn
                                                                                    rounded
                                                                                    small
                                                                                    color="primary_dark white--text"
                                                                                    class="mx-0"
                                                                                    @click="addProduct(item, n, 'appointment', clinic)"
                                                                            >Adicionar
                                                                            </v-btn>
                                                                            <v-btn
                                                                                    rounded
                                                                                    small
                                                                                    color="grey"
                                                                                    class="mx-0"
                                                                            >Sem conexão
                                                                            </v-btn>
                                                                        </v-fade-transition>
                                                                    </v-flex>
                                                                </v-layout>
                                                            </v-layout>
                                                        </v-card>
                                                    </div>
                                                </v-flex>
                                            </v-layout>
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
            }
        },
        watch: {
            categorySelect: function () {
                this.search = ''
            }
        },
        computed: {
            specialties() {
                let specialties = this.$store.getters.specialties;
                for (let spec in specialties) {
                    if (specialties[spec].doctors) {

                        specialties[spec].doctors = specialties[spec].doctors.filter((a) => {
                            return a.cost
                        })
                    }
                }
                specialties = this.$store.getters.specialties.filter((a) => {
                    if (a.doctors) {
                        return a.doctors.length > 0 && a.name.includes(this.search.toUpperCase())
                    } else {
                        return false
                    }
                });
                return specialties
            },
            specialtiesLoaded() {
                return this.$store.getters.specialtiesLoaded
            },
            exams() {
                return this.$store.getters.examsSelected;
            },
            package() {
                return this.$store.getters.bundles;
            },
            items() {
                switch (this.categorySelect) {
                    case 'exam':
                        return this.exams;
                    case 'appointment':
                        return this.specialties;
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
                        holder.realized = false;
                        break;
                    default:
                }
                this.$store.commit('addShoppingCartItem', holder)
            }
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
        }
    }
</script>

<style scoped>

</style>
