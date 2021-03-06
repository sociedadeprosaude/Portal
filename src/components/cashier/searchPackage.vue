<template>
    <v-container class="ma-0 pa-0">
        <v-layout row wrap class="justify-center">
            <v-flex xs12>
                <v-card class="round-card elevation-0">
                    <v-flex xs12 class="text-right pa-2" v-if="searchPackage">
                        <v-layout row wrap >
                          <v-combobox
                                        v-model="searchData"
                                        :items="listPackage"
                                        item-text="name"
                                        auto-select-first
                                        :clearable="true"
                                        :loading="isLoading"
                                        :search-input.sync="searchBundle"
                                        filled
                                        full-width
                                        return-object
                                        @click:clear = "clearSearch"
                                        outlined class="mr-2 ml-2"
                                        :disabled="!searchPackage"
                          >
                            </v-combobox>
                            <v-btn small fab color="primary" dark class="mb-2 mr-2"
                                   @click="(registerPackage = !registerPackage, searchPackage = !searchPackage),newPackage()">
                                <v-icon>add</v-icon>
                            </v-btn>
                            <v-btn small fab color="primary" dark class="mb-2 mr-2"
                                   @click="close()">
                                <v-icon>close</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-flex>
                    <v-card-text v-if="registerPackage">
                        <v-form v-model="validRegister" lazy-validation>
                            <v-layout row wrap>
                                <v-flex sm8 >
                                    <v-text-field required label="nome" v-model="nameBundle" @keyup="nameForPackage()"
                                                  prepend-inner-icon="folder" :rules="rules.campoObrigatorio"
                                                  primary solo :clearable="true">
                                    </v-text-field>
                                </v-flex>
                                <v-spacer> </v-spacer>
                                <v-radio-group row class="ma-1">
                                    <v-btn outlined text rounded
                                           :color="categorySelect === 'exam' ? 'accent' : 'primary_light'"
                                           @click="selectCategory('exam')">Exames
                                    </v-btn>

                                    <v-btn outlined text rounded class="mx-2"
                                           :color="categorySelect === 'clinic' ? 'accent' : 'primary_light'"
                                           @click="selectCategory('clinic')">Clinicas
                                    </v-btn>
                                </v-radio-group>
                                <v-spacer> </v-spacer>
                                <v-btn color="primary" small fab
                                       @click="registerPackage= !registerPackage, searchPackage= !searchPackage, clearSearch()">
                                    <v-icon >close</v-icon>
                                </v-btn>

                                <v-text-field v-model="search" required solo primary clearable
                                              id="search" :loading="loading"
                                              placeholder="Exames / Clinicas"
                                > </v-text-field>
                            </v-layout>
                            <v-card-text>
                                <v-flex v-for="item in items" :key="item.id" >
                                    <v-card class="mt-1">
                                        <v-card-title class="justify-center">
                                            <h3 class="primary--text">{{item.name}}</h3>
                                        </v-card-title>
                                        <v-card-text>
                                            <v-slide-group v-if="categorySelect === 'exam'"  show-arrows >
                                                <v-slide-item
                                                        v-for="n in item.clinics" :key="n.name" v-slot:default="{ active }" >
                                                    <v-btn class="mx-2"
                                                           :input-value="active"
                                                           active-class="blue white--text"
                                                           depressed
                                                           rounded
                                                           @click="addProduct(item, n, categorySelect)"
                                                    >
                                                        {{ n.name }} | {{ n.price }}
                                                    </v-btn>
                                                </v-slide-item>
                                            </v-slide-group>
                                        </v-card-text>
                                        <v-card-text>
                                            <v-slide-group v-if="categorySelect === 'clinic' && item.exams" show-arrows multiple>
                                                <v-slide-item
                                                        v-for="(n,index) in item.exams"  v-slot:default="{ active}" :key="index">
                                                    <v-btn class="mx-2"
                                                           :input-value="active"
                                                           active-class="blue white--text"
                                                           depressed
                                                           rounded
                                                           @click="addProduct(item, n, categorySelect)"
                                                    >
                                                        {{ n.name}} | {{n.price}}
                                                    </v-btn>
                                                </v-slide-item>
                                            </v-slide-group>
                                        </v-card-text>
                                    </v-card>
                                </v-flex>
                            </v-card-text>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {

        name: "searchPackage",

        data () {
            return {

                searchPackage: true, registerPackage: false,
                searchData: null, searchBundle: null,
                isLoading: undefined, loading: undefined,

                search: '',
                validRegister: true,
                categorySelect: 'exam',

                editedPackage: {
                    id: '', name: '', exams: [], specialties: [],
                },

                defaultPackage: {
                    id: '', name: '', exams: [], specialties: [],
                },

                rules: {
                    campoObrigatorio: [
                        v => !!v || 'O CAMPO É OBRIGATÓRIO!'
                    ],
                },

            };
        },

        computed: {

            nameBundle () {
                 return this.$store.getters.getNameBundle;
            },
            listPackage (){
                return Object.values(this.$store.getters.bundles);
            },

            formRegister () {
                return this.editedPackage.name && this.price && this.cost;
            },

            exams () {
                return this.$store.getters.examsSelected;
            },

            clinics () {
                return this.$store.getters.clinics;
            },

            items () {
                switch (this.categorySelect) {
                    case 'exam':
                        return this.exams;
                    case 'clinic':
                        return this.clinics;
                    default:
                        return []
                }
            },

        },

        mounted () {
            this.$store.dispatch('loadBundle');
            let self = this;
            window.addEventListener('keyup', function (e) {
                if (e.target.id === 'search') {
                    clearTimeout(self.typingTimer);
                    self.typingTimer = setTimeout(() => {
                        if (self.categorySelect === 'exam') {
                            self.$store.dispatch("loadSelectedExams", self.search).then(() => {
                            });
                        }
                        if (self.categorySelect === 'clinic') {
                            self.$store.dispatch("loadClinics");
                        }
                    }, 1000);
                }
            });
            window.addEventListener('keydown', function (e) {
                if (e.target.id === 'search') {
                    clearTimeout(self.typingTimer)
                }
            })
        },

        watch: {

            async searchData () {
                if (this.searchData){
                    this.isLoading = true;

                    this.searchPackage = false;
                    this.registerPackage= true;
                    this.$store.commit('setSelectedBundle', this.searchData);
                    let name = this.searchData.name.toUpperCase();
                    this.$store.commit('setNameBundle', name);
                    for (let exam in this.searchData.exams) {
                        this.$store.commit('addItemsPackage', this.searchData.exams[exam])
                    }
                }


                else {
                    this.$store.commit('setSelectedBundle', this.defaultPackage);
                }
            },

            categorySelect: function () {
                this.search = ''
            },

        },

        methods: {

            nameForPackage () {
                this.$store.commit('setNameBundle', this.nameBundle)
            },

            selectCategory(category) {
                this.categorySelect = category;
            },

            clearSearch () {

                this.isLoading = false;
                this.searchData = null;
                this.registerPackage = false;
                this.searchPackage = true;
                this.$store.commit('clearNameBundle');
                this.editedPackage= Object.assign({}, this.defaultPackage);
                this.$store.commit('setSelectedBundle', this.defaultPackage);
                this.editedPackage.exams = [];
                this.$store.commit('clearItemsPackage');

            },

            async selectBundle (bundle) {
                this.loading = true;
                this.$store.commit('setSelectedBundle', bundle);
                for (let exam in bundle.exams) {
                    this.$store.commit('addItemsPackage', bundle.exams[exam])
                }
                this.loading = false
            },

            addProduct(product, selection, type) {

                let holder = Object.assign({}, product);

                delete holder.clinics;
                holder.clinic = selection;
                holder.cost = selection.cost;
                holder.price = selection.price;

                this.$store.commit('addItemsPackage', holder);
            },

            newPackage() {
                this.$store.commit('clearNameBundle');
                this.$store.commit('setSelectedBundle', this.defaultPackage);
            },


            close () {
                this.clearSearch();
                this.$router.back();
            }

        },

    }
</script>

<style scoped>
    .round-card {
        border-radius: 20px;
    }
</style>