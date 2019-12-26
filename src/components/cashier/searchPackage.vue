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
                                              id="search"
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
                                                        v-for="(n,i) in item.clinics" :key="i" v-slot:default="{ active }" >
                                                    <v-btn class="mx-2"
                                                           :input-value="active"
                                                           active-class="blue white--text"
                                                           depressed
                                                           rounded
                                                           @click="addExam(n.name, item.name, categorySelect, n.price, n.cost)"
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
                                                           @click="addExam(n.name, item.name, categorySelect, n.price, n.cost)"
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
                searchData: null,
                isLoading: false,

                searchBundle: null,
                search: '',
                validRegister: true,
                categorySelect: 'exam',

                action: false,

                cost: 0, price: 0, percentageDiscount: 0, moneyDiscount: 0,

                editedPackage: {
                    id: '', name: '', exams: [], specialties: [],
                },

                defaultPackage: {
                    id: '', name: '', exams: [], specialties: [], percentageDiscount: 0,
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

            selectedPackage () {
                return this.$store.getters.selectedBundle;
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


            total() {
                let subTotal = 0;
                subTotal = subTotal + this.moneyDiscount;
                let total = parseFloat(this.price) - parseFloat(subTotal);

                if (total < 0) {
                    return 0;
                } else {
                    return total ;
                }

            }

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

            percentageDiscount: function () {
                this.moneyDiscount = ((this.percentageDiscount * this.price) / 100);
            },

            searchData () {
                if (this.searchData){
                    this.isLoading = true;
                    const data = this.searchData.name.toUpperCase();

                    this.searchPackage = false;
                    this.registerPackage= true;

                    this.editedPackage = Object.assign({}, this.searchData);
                    this.editedPackage.name = data;

                    this.$store.dispatch('selectedBundle', this.editedPackage);

                } else {
                    this.$store.commit('selectedBundle', this.defaultPackage);
                }
            },

            categorySelect: function () {
                this.search = ''
            },

            search () {
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
            }
        },

        methods: {

            selectCategory(category) {
                this.categorySelect = category
                console.log(this.categorySelect);
                console.log('items', this.items);
            },

            clearSearch () {

                this.isLoading = false;
                this.searchData = null;
                this.registerPackage = false;
                this.searchPackage = true;
                this.editedPackage= Object.assign({}, this.defaultPackage);
                this.$store.dispatch('selectedBundle', this.defaultPackage);
                this.editedPackage.exams = [];
                this.cost = 0;
                this.price = 0;
                this.percentageDiscount = 0;
                this.moneyDiscount = 0;
            },

            costAndPrice () {
                this.price = 0;
                this.cost = 0;
                for (let key in this.editedPackage.exams) {
                    this.price += this.editedPackage.exams[key].price;
                    this.cost += this.editedPackage.exams[key].cost;
                }
                for (let key in this.editedPackage.specialties) {
                    this.price += this.editedPackage.specialties[key].price;
                    this.cost += this.editedPackage.specialties[key].cost;
                }


            },

            addExam (clinic, product, type, price, cost) {
                this.item = {
                    name: product,
                    clinic: clinic,
                    type: type,
                    price:  parseFloat(price),
                    cost:parseFloat(cost)
                };

                if (this.editedPackage.exams){
                    for (let key in this.editedPackage.exams) {

                        if (this.item.name === this.editedPackage.exams[key].name &&
                            this.item.clinic === this.editedPackage.exams[key].clinic){

                            this.action = true;
                            this.editedPackage.exams.splice(key, 1);
                        }

                        if (this.item.name === this.editedPackage.exams[key].name &&
                            this.item.clinic !== this.editedPackage.exams[key].clinic ){

                            this.action = true;
                            this.editedPackage.exams[key].name= this.item.name;
                            this.editedPackage.exams[key].clinic = this.item.clinic;
                            this.editedPackage.exams[key].price = this.item.price;
                            this.editedPackage.exams[key].cost = this.item.cost;
                            this.action = true;

                        }
                    }
                }

                if (this.action === false){
                    this.editedPackage.exams.push({...this.item})
                }

                console.log(this.editedPackage.exams);

                this.costAndPrice();
                this.action = false;
            },

            removeExam (exam) {

                this.price -= exam.price;
                this.cost -= exam.cost;

                for (let i in this.editedPackage.exams) {
                    if (this.editedPackage.exams[i].name === exam.name
                        && this.editedPackage.exams[i].clinic === exam.clinic){

                        this.editedPackage.exams.splice(i,1);
                    }
                }
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