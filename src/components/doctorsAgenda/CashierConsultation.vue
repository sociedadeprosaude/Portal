<template>
    <v-container class="ma-0 pa-0" fluid>
        <v-layout row wrap>
            <v-flex xs12>
                <v-btn rounded small class="mx-1" @click="selectCategory('exam')"
                       :color="categorySelect === 'exam' ? 'primary' : 'background'">
                    Exames
                </v-btn>
                <v-btn rounded small class="mx-1" @click="selectCategory('appointment')"
                       :color="categorySelect === 'appointment' ? 'primary' : 'background'">
                    Consultas
                </v-btn>
                <v-btn rounded small class="mx-1"  @click="selectCategory('package')"
                       :color="categorySelect === 'package' ? 'primary' : 'background'">
                    Pacotes
                </v-btn>
                <v-btn small text icon dark>
                    <v-icon>more_vert</v-icon>
                </v-btn>
            </v-flex>
            <v-flex xs12 class="mt-4 mx-3">
                <v-card>
                    <v-card-title>
                        <v-text-field placeholder="Pesquisa"
                                      v-model="search"
                                      :loading="loading"
                                      id="search"
                                      single-line
                                      :disabled="!categorySelect"
                        />
                        <v-spacer/>
                        <v-btn icon>
                            <v-icon>local_grocery_store</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <CartShopping :Items="items" :categorySelect="categorySelect"/>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import CartShopping from "../doctorsAgenda/CartShopping"
    export default {
        components: {CartShopping},
        data (){
            return {
                categorySelect: 'appointment',
                search: '',
                loading: undefined
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
                    if ( specialties[spec].doctors) {

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

        }
    }

</script>