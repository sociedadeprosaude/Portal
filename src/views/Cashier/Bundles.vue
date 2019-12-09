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
                                   @click="registerPackage =! registerPackage, searchPackage =! searchPackage, clearSearch()">
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
                                        <v-text-field required label=" nome" v-model="editedPackage.name"
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
                                            <v-card-title class="justify-center">
                                                <h3 class="primary--text">{{item.name}}</h3>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-slide-group v-if="categorySelect === 'exam'" show-arrows multiple>
                                                    <v-slide-item
                                                            v-for="(n,i) in item.clinics" :key="i" v-slot:default="{ active, toggle }" >
                                                        <v-btn class="mx-2"
                                                               :input-value="active"
                                                               active-class="blue white--text"
                                                               depressed
                                                               rounded
                                                               @mousedown="toggle"
                                                               @click="addExam(n.clinic, item.name, categorySelect, n.price, n.cost)"
                                                        >
                                                            {{ n.clinic }} | {{ n.price }}
                                                        </v-btn>
                                                    </v-slide-item>
                                                </v-slide-group>
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
                                            </v-card-text>
                                            <v-card-text>
                                                <v-slide-group v-if="categorySelect === 'clinic' && item.exams" show-arrows>
                                                    <v-slide-item
                                                            v-for="(n,index) in item.exames"  v-slot:default="{ active, toggle }" :key="index">
                                                        <v-btn class="mx-2"
                                                               :input-value="active"
                                                               active-class="blue white--text"
                                                               depressed
                                                               rounded
                                                               @mousedown="toggle"

                                                               @click="addProducts(item.nome, n.nome, 'exam', n.venda, n.custo)"
                                                        >
                                                            {{ n.nome}} | {{n.venda}}
                                                        </v-btn>
                                                    </v-slide-item>
                                                </v-slide-group>
                                            </v-card-text>
                                            <v-card-text>
                                                <v-slide-group v-if="categorySelect === 'clinic' && item.consultas" show-arrows>
                                                    <v-slide-item
                                                            v-for="(n,index) in combo"  v-slot:default="{ active, toggle }" :key="index">
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
                                        </v-card>
                                    </v-flex>
                                    <v-layout row class="mt-5">
                                        <v-flex xs2>
                                            <v-text-field
                                                    prepend-icon="attach_money"
                                                    outlined
                                                    label="Preço de Custo"
                                                    placeholder="ex.: 50.00"
                                                    v-model="cost"
                                                    prefix="R$"
                                                    readonly
                                                    rounded
                                                    color="#009688"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-spacer></v-spacer>
                                        <v-flex xs2>
                                            <v-text-field
                                                    prepend-icon="monetization_on"
                                                    outlined
                                                    label="Preço de Venda"
                                                    placeholder="ex.: 80.00"
                                                    v-model="price"
                                                    prefix="R$"
                                                    readonly
                                                    rounded
                                                    color="#009688"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-spacer></v-spacer>
                                        <v-flex xs2>
                                            <v-text-field
                                                    prepend-icon="looks_6"
                                                    outlined
                                                    clearable
                                                    label="Desconto %"
                                                    v-model="discountPercentage"
                                                    suffix="%"
                                                    rounded
                                                    color="#009688"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-spacer></v-spacer>
                                        <v-flex xs3>
                                            <v-text-field
                                                    prepend-icon="money_off"
                                                    outlined
                                                    clearable
                                                    label="Desconto R$"
                                                    v-model="discountMoney"
                                                    prefix="R$"
                                                    rounded
                                                    color="#009688"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-spacer></v-spacer>
                                        <v-flex xs2>
                                            <v-text-field
                                                    prepend-icon="fiber_new"
                                                    outlined
                                                    label="Valor Total"
                                                    prefix="R$"
                                                    v-model.number="total"
                                                    rounded
                                                    readonly
                                                    color="#009688"
                                            ></v-text-field>
                                            {{ typeof(total) }}
                                            {{total | moneyFilter}}
                                        </v-flex>
                                    </v-layout>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn outlined rounded text color="primary" :disabled="!formRegister" @click="validateRegister()" class="ma-3">
                                        Cadastrar Pacote
                                    </v-btn>
                                </v-card-actions>
                            </v-form>
                        </v-flex>
                    </v-card-text>
                </v-card>

                <v-layout v-if="registerPackage" align-center justify-center row wrap>
                    <v-container fluid class="center-card">
                        <v-card xs12 sm12 class="round-card elevation-3">
                            <v-card-title class="headline">Itens selecionados</v-card-title>
                            <v-card-text>
                                <v-list-item v-for="(item,index) in editedPackage.exams" :key="index">
                                    <v-chip color="purple" text-color="white">
                                        <strong>{{item.product}} | {{item.clinic}} | R$ {{item.price}}</strong>
                                        <v-btn class="ml-1" mall icon @click="removeExam(index)">
                                            <v-icon>cancel</v-icon>
                                        </v-btn>
                                    </v-chip>
                                </v-list-item>
                                <v-list-item v-for="(item,index) in editedPackage.specialties" :key="index">
                                    <v-chip color="green" text-color="white">
                                        <strong>{{item.product}} | {{item.clinic}} | R$ {{item.price}}</strong>
                                        <v-btn class="ml-1" small icon @click="removeSpecialtie(index)">
                                            <v-icon>cancel</v-icon>
                                        </v-btn>
                                    </v-chip>
                                </v-list-item >
                            </v-card-text>
                        </v-card>
                    </v-container>
                </v-layout>

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

            listProducts: [], items: [], action: false,

            cost: 0, price: 0, discountPercentage: '', discountMoney: '', total: 0,

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

            color: {
                buttonAppointment:'#9EA9D5', buttonExam:'#009688', buttonClinic: '#9EA9D5',
                colorSelect:'#009688', noSelect: '#9EA9D5',
            }

        }),

        computed: {
            listPackage (){
                this.isLoading = false;
                return this.$store.getters.bundles;
            },

            selectedPackage () {
                let pac =this.$store.getters.selectedBundle;
                this.editedPackage = Object.assign({}, pac);
                return this.$store.getters.selectedBundle;
            },

            formRegister () {
                return this.editedPackage.name && this.price && this.cost;
            },

            categories: function () {

                if (!this.search) { return [] }

                let search = this.search.toLowerCase();
                let products = [];

                console.log(this.items);

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
                        console.log(this.items);
                        for (let i in this.items) {
                            let obj = {
                                name: this.items[i].name,
                                rules: this.items[i].rules,
                            };
                            let clinics = [];
                            for (let clinic in this.items[i].clinics) {
                                clinics [clinic] = ({
                                    cost: this.items[i].clinics[clinic].cost,
                                    price: this.items[i].clinics[clinic].price,
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
                                    name: this.items[i].doctors[doctor].name,
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
                      name: this.editedPackage.name.toUpperCase(),
                      cost: this.cost,
                      price: this.price,
                      discountMoney: this.discountMoney,
                      discountPercentage: this.discountPercentage,
                      exams: this.editedPackage.exams,
                      specialties: this.editedPackage.specialties,
                  };

                  console.log('pac' , packageData);

                  this.$store.dispatch('addBundle', packageData).then(() => {

                      this.clearSearch();
                      this.registerPackage = false;
                      this.searchPackage = true;
                  });
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
                    product: product,
                    clinic: clinic,
                    type: type,
                    price:  parseFloat(price),
                    cost:parseFloat(cost)
                };

                if (this.editedPackage.exams){
                    for (let key in this.editedPackage.exams) {
                        if (this.item.product === this.editedPackage.exams[key].product
                            && this.item.clinic === this.editedPackage.exams[key].clinic
                            && this.item.price === this.editedPackage.exams[key].price
                            && this.item.cost === this.editedPackage.exams[key].cost){

                                this.action = true;
                                this.editedPackage.exams.splice(key, 1);

                        } else {

                                this.action = false;
                        }
                    }
                }

                if (this.action === false){ this.editedPackage.exams.push({...this.item}) }

                this.costAndPrice();
                this.action = false;
            },

            addSpecialties (clinic, product, doctor, type, price, cost) {
                this.item = {
                    product: product.name,
                    doctor: doctor.doctor,
                    clinic: clinic,
                    type: type,
                    price:  parseFloat(price),
                    cost:parseFloat(cost)
                };

                if (this.editedPackage.specialties){
                    for (let key in this.editedPackage.specialties) {
                        if (this.item.product === this.editedPackage.specialties[key].product
                            && this.item.clinic === this.editedPackage.specialties[key].clinic
                            && this.item.price === this.editedPackage.specialties[key].price
                            && this.item.cost === this.editedPackage.specialties[key].cost
                            && this.item.doctor === this.editedPackage.specialties[key].doctor){

                                this.action = true;
                                this.editedPackage.exams.splice(key, 1);

                        } else {

                                this.action = false;
                        }
                    }
                }

                if (this.action === false){ this.editedPackage.specialties.push({...this.item}) }

                this.costAndPrice();
                this.action = false;

            },

            removeExam (index) {
                this.sale -= this.editedPackage.exams[index].price;
                this.cost -= this.editedPackage.exams[index].cost;

                this.editedPackage.exams.splice(index,1);
            },

            removeSpecialtie (index) {
                this.sale -= this.editedPackage.specialties[index].price;
                this.cost -= this.editedPackage.specialties[index].cost;

                this.editedPackage.specialties.splice(index,1);
            }

        },

        watch: {

            discountPercentage: function () {
                this.discountMoney = ((this.discountPercentage * this.price) / 100).toFixed(0);
                this.total = Math.round (this.price - this.discountMoney)
            },

            discountMoney: function () {
                this.discountPercentage = Math.round ((this.discountMoney * 100) / this.price)
            },

            price: function (val) {
                this.total = (val - this.discountMoney)
            },

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