<template>
    <v-container fluid class=" fill-height">
        <v-layout row wrap class="justify-center">
            <v-flex class="my-4">
                <v-card class="round-card ml-5 elevation-2">
                    <v-flex xs12 class="text-right pa-2" v-if="searchPackage">
                        <v-layout row wrap >
                            <v-combobox v-model="searchData" :items="listPackage" item-text="name"
                                        :clearable="true" :loading="isLoading" :search-input.sync="search"
                                         filled  full-width
                                        @click:clear = "clearSearch" outlined class="mr-2 ml-2"
                                        :disabled="!searchPackage">
                                <template v-slot:no-data>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                Sem resultado para "<strong> {{ search }} </strong>"
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template>
                            </v-combobox>
                            <v-btn small fab color="primary" dark class="mb-2 mr-2"
                                   @click="(registerPackage =! registerPackage, searchPackage =! searchPackage)">
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
                                <v-spacer></v-spacer>
                                <v-radio-group row class="ma-1">
                                    <v-btn outlined text :color="color.buttonExam" class="button-select" rounded
                                           @click="selectExam">Exames
                                    </v-btn>
                                    <!--
                                    <v-btn outlined text :color="color.buttonAppointment" class="button-select mx-2" rounded
                                           @click="selectAppointment">Consultas
                                    </v-btn>
                                    -->
                                    <v-btn outlined text :color="color.buttonClinic" class="button-select mx-2" rounded
                                           @click="selectClinic">Clinicas
                                    </v-btn>
                                </v-radio-group>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" small fab
                                       @click="registerPackage= !registerPackage, searchPackage= !searchPackage, clearSearch()">
                                    <v-icon >close</v-icon>
                                </v-btn>

                                <v-text-field v-model="search" required solo primary :clearable="true"
                                              placeholder="Escolha a categoria" item-value="nome"
                                ></v-text-field>
                            </v-layout>
                            <v-card-text>
                                <v-flex v-for="(item, index) in categories" :key="index" >
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
                                                           @click="addExam(n.clinic, item.name, categorySelect, n.price, n.cost)"
                                                        >
                                                            {{ n.clinic }} | {{ n.price }}
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


                                                               @click="addExam(n.clinic, item.name, categorySelect, n.price, n.cost)"
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
            <v-flex sm3>
                <v-card class="ml-5 elevation-2">
                    <v-container>
                        <v-layout  row wrap class="mx-3 align-center">
                            <v-flex xs12 class="v-card"
                                    style="overflow:auto; height:50vh; box-shadow: inset 0px 0px 5px grey;">
                                <v-layout row wrap>
                                    <v-flex xs12 v-if="editedPackage.exams.length > 0">
                                        <p class="my-headline">Exames</p>
                                        <v-card v-for="(item) in editedPackage.exams" class="ma-2" :key="item.name">
                                            <v-card-title class="py-2">
                                                <span class="subtitle-1 font-weight-medium">{{item.name}}</span>
                                                <v-spacer></v-spacer>
                                                <span class="subtitle-1 font-weight-light">
                                                <v-btn small icon @click="removeExam(item)">
                                                    <v-icon>cancel</v-icon>
                                                </v-btn>
                                            </span>
                                            </v-card-title>
                                            <v-card-text class="pt-1 pb-0">
                                                {{item.clinic}}
                                                <p class="text-right">
                                                    R$ {{item.price}}
                                                </p>
                                            </v-card-text>
                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-flex>

                            <v-spacer></v-spacer>
                            <v-layout row wrap class="mt-2">
                                <v-flex xs5>
                                    <v-text-field
                                            outlined
                                            label="Custo R$"
                                            v-model="cost"
                                            prefix="R$"
                                            readonly
                                    ></v-text-field>
                                </v-flex>
                                <v-spacer></v-spacer>
                                <v-flex xs5>
                                    <v-text-field
                                            outlined
                                            label="Venda R$"
                                            v-model="price"
                                            prefix="R$"
                                            readonly
                                    ></v-text-field>
                                </v-flex>
                                <v-flex>
                                    <v-layout wrap>
                                        <v-flex xs5>
                                            <v-text-field
                                                    label="Desconto: %"
                                                    v-model="percentageDiscount"
                                                    clearable
                                            ></v-text-field>
                                        </v-flex>
                                        <v-spacer></v-spacer>
                                        <v-flex xs5>
                                            <v-text-field
                                                    disabled
                                                    label="Desconto: R$ "
                                                    v-model="moneyDiscount"
                                            ></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 class="my-4">
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <v-divider></v-divider>
                                        </v-flex>
                                        <v-flex xs12>
                                            <h6 class="title font-weight-bold"> Total:
                                                {{this.total | moneyFilter}}</h6>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-divider></v-divider>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-spacer></v-spacer>

                                <v-flex xs12>
                                    <v-layout row wrap class="align-end fill-height">
                                        <v-flex xs12 class="text-center mt-4">
                                            <v-btn outlined color="primary" :disabled="!formRegister" @click="validateRegister()">
                                                Salvar Pacote</v-btn>
                                            <v-btn color="error" fab small class="ml-5" :disabled="!selectedPackage"
                                                @click="deleteBundle = true">
                                                <v-icon>delete</v-icon>
                                            </v-btn>
                                            <v-dialog v-model="deleteBundle" persistent max-width="350">
                                                <v-card>
                                                    <v-card-title><strong>Deseja excluir este pacote?</strong></v-card-title>
                                                    <v-card-text>Este pacote será excluído permanentemente.</v-card-text>
                                                    <v-card-actions>
                                                        <v-spacer></v-spacer>
                                                        <v-btn color="error" text @click="deleteBundle = false, deletePackage()">EXCLUIR</v-btn>
                                                        <v-btn color="primary" text @click="deleteBundle = false">CANCELAR</v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </v-dialog>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-layout>
                    </v-container>


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

            listProducts: [], items: [], action: false, deleteBundle: false,

            cost: 0, price: 0, percentageDiscount: 0, moneyDiscount: 0,

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
                return this.$store.getters.bundles;
            },

            selectedPackage () {
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
                                obj = {...obj, specialties: this.items[i].specialties};
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

                    let p = products.filter(item => {
                        const text = item.name.toLowerCase();
                        return text.indexOf(search) >-1;
                    });

                    return p;
                }
            },

            total() {
                let subTotal = 0;
                subTotal = subTotal + this.moneyDiscount;
                return parseFloat(this.price) - parseFloat(subTotal);
            }

        },

        mounted () {
            this.$store.dispatch('loadBundle');
            this.$store.dispatch('loadExam').then(() => {
                this.selectExam();
            });
            this.$store.dispatch('loadSpecialties');
            this.$store.dispatch('loadClinics');
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

                    this.cost = parseFloat(this.editedPackage.cost);
                    this.price = parseFloat(this.editedPackage.price);
                    this.percentageDiscount = this.editedPackage.percentageDiscount;
                    this.moneyDiscount = this.editedPackage.moneyDiscount;
                    this.$store.dispatch('selectedBundle', this.editedPackage);

                } else {
                    this.$store.dispatch('selectedBundle', null);
                }
            },
        },

        methods: {

            clearSearch () {

                this.isLoading = false;
                this.searchData = null;
                this.registerPackage = false;
                this.searchPackage = true;
                this.editedPackage= Object.assign({}, this.defaultPackage);
                this.$store.dispatch('selectedBundle', null);
                this.editedPackage.exams = [];
                this.cost = 0;
                this.price = 0;
                this.percentageDiscount = 0;
                this.moneyDiscount = 0;
            },

            validateRegister () {

                for (let exam in this.editedPackage.exams) {
                    this.editedPackage.exams[exam].priceDiscount = this.editedPackage.exams[exam].price - this.moneyDiscount
                }

                const packageData = {
                      name: this.editedPackage.name.toUpperCase(),
                      cost: this.cost,
                      price: this.price,
                      total: (this.price - this.moneyDiscount),
                      moneyDiscount: this.moneyDiscount,
                      percentageDiscount: this.percentageDiscount,
                      exams: this.editedPackage.exams,
                      //specialties: this.editedPackage.specialties,
                };

                this.$store.dispatch('addBundle', packageData).then(() => {
                    this.clearSearch();
                    this.registerPackage = false;
                    this.searchPackage = true;
                });

            },

            selectExam () {
                this.color.buttonExam = this.color.colorSelect;
                //this.color.buttonAppointment = this.color.noSelect;
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
                //this.color.buttonAppointment = this.color.noSelect;
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

            removeSpecialtie (index) {
                this.sale -= this.editedPackage.specialties[index].price;
                this.cost -= this.editedPackage.specialties[index].cost;

                this.editedPackage.specialties.splice(index,1);
            },

            deletePackage () {
                this.$store.dispatch('deletePackage', this.editedPackage);
                this.clearSearch();

            },

        },

    }
</script>

<style scoped>
    .round-card {
        border-radius: 20px;
    }
</style>