<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 class="my-4">
                <v-card class="round-card">
                    <v-flex xs12 class="text-right pa-2" v-if="searchPackage">
                        <v-layout row wrap>
                            <v-btn rounded color="primary" dark class="mb-2"
                                   @click="$router.back()">
                                <v-icon>close</v-icon>
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn rounded color="primary" dark class="mb-2"
                                   @click="registerPackage =! registerPackage, searchPackage =! searchPackage">
                                ADICIONAR PACOTE
                                <v-icon right>add</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-flex>
                    <v-card-text>
                        <v-flex xs12 v-if="searchPackage">
                            <v-layout>
                                <v-flex xs12>
                                    <v-combobox v-model="searchData" :items="listPackage" item-text="name"
                                                hide-selected hide-no-data :clearable="true" :loading="isLoading"
                                                :search-input.sync="searchData" filled single-line full-width
                                                return-object @click:clear = "clearSearch" outlined
                                                style="justify-content: center">
                                        <template v-slot:no-data>
                                            <v-list-item>
                                                <v-list-item-content>
                                                    <v-list-item-title>
                                                        Sem resultado para "<strong>{{ searchData }}</strong>"
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </template>
                                    </v-combobox>
                                </v-flex>
                            </v-layout>

                            <v-card v-if="selectedPackage" class="round-card">
                                <v-card-title>
                                    <h4 class="font-italic font-weight-bold primary--text">
                                        {{editedPackage.name}}
                                    </h4>
                                </v-card-title>
                                <v-card-text class="mt-3">
                                    
                                </v-card-text>
                            </v-card>
                        </v-flex>
                        <v-flex xs12 v-if="registerPackage">
                            <v-form v-model="validRegister" lazy-validation>
                                <v-layout row wrap>
                                    <v-flex xs11>
                                        <v-text-field required label=" nome" v-model="editedPackage.nome"
                                                      prepend-inner-icon="folder" :rules="rules.campoObrigatorio"
                                                      primary solo :clearable="true">
                                        </v-text-field>
                                    </v-flex>
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary" small fab
                                           @click="registerPackage= !registerPackage, searchPackage= !searchPackage">
                                        <v-icon >close</v-icon>
                                    </v-btn>
                                    <v-flex xs5>
                                        <v-radio-group :mandatory="false" row class="justify-center">
                                            <v-btn outlined text :color="color.buttonExam" class="button-select" rounded
                                                   @click="selectExam">Exames
                                            </v-btn>
                                            <v-btn outlined text :color="color.buttonAppointment" class="button-select mx-2" rounded
                                                   @click="selectAppointment">Consultas
                                            </v-btn>
                                            <v-btn outlined text :color="color.buttonClinic" class="button-select mx-2" rounded
                                                   @click="selectClinic">Clinicas
                                            </v-btn>
                                        </v-radio-group>
                                    </v-flex>
                                    <v-text-field v-model="search" required solo primary :clearable="true"
                                                  placeholder="Escolha a categoria" item-value="nome"
                                    ></v-text-field>
                                </v-layout>
                                <v-card-text>
                                    <v-flex v-for="(item, index) in categories" :key="index" >
                                        <v-card class="mt-3">
                                            <v-card-title v-text="item.nome"></v-card-title>

                                        </v-card>
                                    </v-flex>
                                </v-card-text>
                            </v-form>
                        </v-flex>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    export default {
        data: () => ({
            searchPackage: true, registerPackage: false,
            searchData: null,
            isLoading: false,

            search: null,
            validRegister: true,
            categorySelect: null,

            listProducts: [], items: [], combo: [],

            editedPackage: {
                id: '', name: '', exams: [], specialties: [], cost: '', sale: '', discountPercentage: '', discountMoney: '',
            },

            defaultPackage: {
                id: '', name: '', exams: [], specialties: [], cost: '', sale: '', discountPercentage: 0, discountMoney: 0,
            },

            rules: {
                campoObrigatorio: [
                    v => !!v || 'O CAMPO É OBRIGATÓRIO!'
                ],
            },

            color: {
                buttonAppointment:'#9EA9D5', buttonExam:'#009688', buttonClinic: '#9EA9D5',
                colorSelect:'#009688', noSelect: '#9EA9D5',
            }

        }),

        computed: {
            listPackage (){
                //this.isLoading = false;
                return this.$store.getters.bundles;
            },

            selectedPackage () {
                return this.$store.getters.selectedBundle;
            },

            formRegister () {
                return this.editedPackage.name && this.editedPackage.sale && this.editedPackage.cost;
            },

            categories: function () {

                if (!this.search) { return [] }

                let search = this.search.toLowerCase();
                let products = [];

                console.log('#### items', this.items);

                if (this.items) {
                    if (this.categorySelect === 'clinic') {
                        for (let i in this.items) {
                            let obj = {
                                name: this.items[i].name
                            };
                            if (this.items[i].specialties.length > 0){
                                obj = {...obj, specialties: this.items[i].specialties }
                            }
                            if (this.items[i].exams.length > 0){
                                obj = {...obj, exams: this.items[i].exams}
                            }
                            products[i] = (obj);
                        }
                    } else if (this.categorySelect === 'exam') { //exams
                        for (let i in this.items) {
                            let obj = {
                                name: this.items[i].name,
                                rules: this.items[i].rules,
                            };
                            let clinics = [];
                            for (let clinic in this.items[i].clinics) {
                                clinics [clinic] = ({
                                    cost: this.items[i].clinics[clinic].cost,
                                    price: this.items[i].clinics[clinic].sale,
                                    clinic: this.items[i].clinics[clinic].clinic,
                                });
                            }

                            obj = {...obj, clinics : clinics};
                            products[i] = (obj);
                        }
                    } else { //specialities
                        for (let i in this.items){
                            let obj = {
                                name: this.items[i].name,
                            };
                            let doctors = [];
                            for (let doctor in this.items[i].doctors){
                                doctors [doctor] = ({
                                    payment_method: this.items[i].doctors[doctor].payment_method,
                                    doctor: this.items[i].doctors[doctor].doctor,
                                    cost: this.items[i].doctors[doctor].cost,
                                    price: this.items[i].doctors[doctor].price,
                                });
                            }

                            obj = {...obj, doctors: doctors};
                            products [i] = (obj);
                        }
                    }

                    console.log(products);
                    let p = products.filter(item => {
                        const text = item.name.toLowerCase();
                        return text.indexOf(search) >-1;
                    });

                    console.log('p' ,p);
                    return p;
                }
            },
        },

        mounted () {
            this.$store.dispatch('loadBundle');
            this.$store.dispatch('loadExam').then(() => {
                this.selectExam();
            });
            this.$store.dispatch('loadSpecialties');
            this.$store.dispatch('getClinics');
        },

        methods: {

            clearSearch () {
                this.isLoading = false;
                this.searchData = null;
                this.editedPackage= Object.assign({}, this.defaultPackage);
                this.$store.dispatch('selectedBundle', null);
            },

            validateRegister () {
                  const packageData = {
                      name: this.capitalize(this.editedPackage.name),
                      cost: this.cost,
                      sale: this.sale,
                      exams: this.exams,
                      specialties: this.specialties,
                  };

                  this.$store.dispatch('addBundle', packageData);
            },

            selectExam () {
                this.color.buttonExam = this.color.colorSelect;
                this.color.buttonAppointment = this.color.noSelect;
                this.color.buttonClinic = this.color.noSelect;
                this.categorySelect = 'exam';
                this.items= this.$store.getters.exams;

            },

            selectAppointment () {

                this.color.buttonAppointment = this.color.colorSelect;
                this.color.buttonExam = this.color.noSelect;
                this.color.buttonClinic = this.color.noSelect;
                this.categorySelect = 'appointment';
                this.items= this.$store.getters.specialties;

            },

            selectClinic () {
                this.color.buttonClinic = this.color.colorSelect;
                this.color.buttonExam = this.color.noSelect;
                this.color.buttonAppointment = this.color.noSelect;
                this.categorySelect = 'clinic';
                this.items = this.$store.getters.clinics;

            },
        },

        watch: {

            searchData () { //pesquisa por filtro de status e por delimitação de nome
                if (this.searchData){
                    this.isLoading = true;
                    const data = this.searchData.toUpperCase();
                    if (this.listPackage.length > 0){
                        for (let key in this.listPackage) {
                            if (data === this.listPackage[key].nome) {
                                this.searchPackage = true;
                                this.registerPackage= false;
                                this.$store.dispatch('selectedBundle', {...this.$store.getters.bundles[key]});
                                this.editedPackage = Object.assign({}, this.selectedBundle);
                                this.editedPackage.name = data;
                            }
                        }
                    }

                } else {
                    this.$store.dispatch('selectedBundle', null);
                }
            },
        },
    }
</script>

<style scoped>
    .round-card {
        border-radius: 20px;
    }

    .title {
        color: #757575;
        font-size: 20px;
    }

    .center-card {
        height: 100%;
        justify-content: center;
        align-content: center;
        align-items: center;

    }
</style>