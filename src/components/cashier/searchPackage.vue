<template>
    <v-container class="ma-0 pa-0">
        <v-layout row wrap class="justify-center">
            <v-flex xs12>
                <v-card class="round-card elevation-0">
                    <v-flex xs12 class="text-right pa-2" v-if="searchPackage">
                        <v-layout row wrap >
                            <v-combobox v-model="searchData" :items="listPackage" item-text="name"
                                        :clearable="true" :loading="isLoading" :search-input.sync="searchBundle"
                                        filled  full-width
                                        @click:clear = "clearSearch" outlined class="mr-2 ml-2"
                                        :disabled="!searchPackage">
                                <template v-slot:no-data>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                Sem resultado para "<strong> {{ searchBundle }} </strong>"
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template>
                            </v-combobox>
                            <v-btn small fab color="primary" dark class="mb-2 mr-2"
                                   @click="(registerPackage =! registerPackage, searchPackage =! searchPackage),newPackage()">
                                <v-icon>add</v-icon>
                            </v-btn>
                            <v-btn small fab color="primary" dark class="mb-2 mr-2"
                                   @click="$router.back()">
                                <v-icon>close</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-flex>
                    <v-card-text v-if="registerPackage">
                        <v-form v-model="validRegister" lazy-validation>
                            <v-layout row wrap>
                                <v-flex sm8 >
                                    <v-text-field required label="nome" v-model="editedPackage.name"
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
                                    <!--
                                    <v-btn outlined text :color="color.buttonAppointment" class="button-select mx-2" rounded
                                           @click="selectAppointment">Consultas
                                    </v-btn>
                                    -->
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
                                            <!--
                                            <v-slide-group v-if="categorySelect === 'appointment'" show-arrows multiple>
                                                <v-slide-item
                                                        v-for="(n,i) in item.doctors" v-slot:default="{ active, toggle }" :key="i">
                                                    <v-btn class="mx-2"
                                                           :input-value="active"
                                                           active-class="blue white--text"
                                                           depressed
                                                           rounded
                                                           @mousedown="toggle"
                                                           @click="addSpecialties('PRO-SAUDE' , item , n, categorySelect, n.price, n.cost)"
                                                    >
                                                        {{n.name}} | {{n.price}}
                                                    </v-btn>
                                                </v-slide-item>
                                            </v-slide-group>
                                            -->
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
                                        <!--
                                            <v-card-text>
                                                <v-slide-group v-if="categorySelect === 'clinic' && item.specialties" show-arrows multiple>
                                                    <v-slide-item
                                                            v-for="(n,index) in doctors"  v-slot:default="{ active, toggle }" :key="index">
                                                        <v-btn class="mx-2"
                                                               :input-value="active"
                                                               active-class="blue white--text"
                                                               depressed
                                                               rounded
                                                               @mousedown="toggle"
                                                               @click="addProducts(item.nome, n.nome, 'appointment', n.venda,n.custo)"
                                                        >
                                                            {{ n.produto}} | {{n.nome}} | {{n.venda}}
                                                        </v-btn>
                                                    </v-slide-item>
                                                </v-slide-group>
                                            </v-card-text>
                                            -->
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

            listPackage (){
                return this.$store.getters.bundles;
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
                    const data = this.searchData.name.toUpperCase();

                    let bundle = await this.$store.dispatch('getBundle', data);

                    if (bundle) {
                        this.searchPackage = false;
                        this.registerPackage= true;

                        this.editedPackage = Object.assign({}, this.searchData);
                        this.editedPackage.name = data;

                        this.$store.commit('selectedBundle', this.editedPackage);
                        for (let exam in bundle.exams) {
                            this.$store.commit('addItemsPackage', bundle.exams[exam])
                        }
                    }

                } else {
                    this.$store.commit('selectedBundle', this.defaultPackage);
                }
            },

            categorySelect: function () {
                this.search = ''
            },

        },

        methods: {

            selectCategory(category) {
                this.categorySelect = category;
            },

            clearSearch () {

                this.isLoading = false;
                this.searchData = null;
                this.registerPackage = false;
                this.searchPackage = true;
                this.editedPackage= Object.assign({}, this.defaultPackage);
                this.$store.dispatch('selectedBundle', this.defaultPackage);
                this.editedPackage.exams = [];

            },

            async selectBundle (bundle) {
                this.loading = true;
                this.$store.commit('setSelectedBundle', bundle);
                for (let exam in bundle.exams) {
                    //console.log('exams', budget.exams[exam])
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
                this.$store.dispatch('selectedBundle', this.defaultPackage);
            },

        },

    }
</script>

<style scoped>
    .round-card {
        border-radius: 20px;
    }
</style>