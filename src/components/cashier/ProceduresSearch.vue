<template>
    <v-container class="ma-0 pa-0">
        <v-layout row wrap>
            <v-flex class="hidden-print-only" xs12>
                <v-card class="elevation-0 px-2">
                    <v-flex xs12>
                        <v-card-title class="pa-0">
                            <v-flex xs12>
                                <v-text-field
                                        label="Pesquisa"
                                        v-model="search"
                                        :loading="loading"
                                        id="search"
                                        single-line
                                        :disabled="!categorySelect"
                                        prepend-icon="search">
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12 class="text-center">
                                <v-btn outlined class="mx-2"
                                       :color="categorySelect === 'exam' ? 'accent' : 'primary_light'" rounded
                                       @click="selectCategory('exam')">
                                    <span class="hidden-xs-only">Exames</span>
                                    <img src="@/assets/icons/lab.svg" height="24px" class="hidden-sm-and-up">
                                </v-btn>
                                <v-btn outlined class="mx-2"
                                       :color="categorySelect === 'appointment' ? 'accent' : 'primary_light'" rounded
                                       @click="selectCategory('appointment')">
                                    <span class="hidden-xs-only">{{specialtiesLoaded ? 'Consultas' : 'Carregando consultas...'}}</span>
                                    <img src="@/assets/icons/doctor.svg" height="24px" class="hidden-sm-and-up">
                                </v-btn>
                                <v-btn outlined class="mx-2"
                                       :color="categorySelect === 'package' ? 'accent' : 'primary_light'" rounded
                                       @click="selectCategory('package')">
                                    <span class="hidden-xs-only">Pacotes</span>
                                    <img src="@/assets/icons/box.svg" height="24px" class="hidden-sm-and-up">
                                </v-btn>
                            </v-flex>
                        </v-card-title>
                    </v-flex>
                    <v-fade-transition>
                        <v-flex xs12>
                            <v-layout row wrap>
                                <v-flex class="ml-2" sm12>
                                    <v-card v-for="item in items" class="my-3" :key="item.id">
                                        <v-card-title class="pt-2 " v-text="item.name"></v-card-title>
                                        <v-card-text v-if="categorySelect === 'exam'">
                                            <v-slide-group >
                                                <v-slide-item v-for="n in item.clinics"
                                                              :key="n.name"
                                                              v-slot:default="{ active, toggle }">
                                                    <v-btn class="mx-2"
                                                           :input-value="active"
                                                           active-class="blue white--text"
                                                           depressed
                                                           rounded
                                                           @click="addProduct(item, n, 'exam')"
                                                    >
                                                        {{n.name}} | {{n.price}}
                                                    </v-btn>
                                                </v-slide-item>
                                            </v-slide-group>
                                        </v-card-text>
                                        <v-card-text v-if="categorySelect === 'appointment'">
                                            <v-slide-group show-arrows>
                                                <v-slide-item v-for="(n, index) in item.doctors"
                                                              :key="n.crm + index"
                                                              v-slot:default="{ active, toggle }">
                                                    <div>
                                                        <v-btn class="mx-2"
                                                               :input-value="active"
                                                               active-class="blue white--text"
                                                               depressed
                                                               rounded
                                                               v-for="clinic in n.clinics"
                                                               :key="clinic.name"
                                                               @click="addProduct(item, n, 'appointment', clinic)"

                                                        >
                                                            {{n.name}} | {{clinic.name}} | {{n.price}}
                                                        </v-btn>
                                                    </div>
                                                </v-slide-item>
                                            </v-slide-group>
                                        </v-card-text>
                                        <v-card-text v-if="categorySelect === 'package'">
                                            <v-slide-group show-arrows>
                                                <v-slide-item
                                                        v-slot:default="{ active, toggle }"
                                                >

                                                    <v-btn class="mx-2"
                                                           :input-value="active"
                                                           active-class="blue white--text"
                                                           depressed
                                                           rounded

                                                           @click="selectBudget(item)"
                                                    >
                                                        Selecionar
                                                    </v-btn>
                                                </v-slide-item>
                                            </v-slide-group>
                                        </v-card-text>
                                    </v-card>
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
                loading: undefined
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
                    specialties[spec].doctors = specialties[spec].doctors.filter((a) => {
                        return a.cost
                    })
                }
                specialties = this.$store.getters.specialties.filter((a) => {
                    return a.doctors.length > 0 && a.name.includes(this.search.toUpperCase())
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
                this.$store.commit('setSelectedBudget', budget)
                for (let exam in budget.exams) {
                    //console.log('exams', budget.exams[exam])
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
                            self.loading = true
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
