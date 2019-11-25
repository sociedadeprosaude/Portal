<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 class="my-4">
                <v-card class="round-card">
                    <v-flex xs12 class="text-right pa-2" v-if="searchPackage" >
                        <v-layout row wrap>
                            <v-btn rounded color="primary" dark class="mb-2" @click="$router.back()">
                                <v-icon>close</v-icon>
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn rounded color="primary" dark class="mb-2"
                                   @click="registerPackage= !registerPackage, searchPackage= !searchPackage">
                                ADICIONAR PACOTE
                                <v-icon right>add</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-flex>

                    <v-card-text>
                        <v-flex xs12 v-if="searchPackage" >
                            <v-layout>
                                <v-flex xs12>
                                    <v-combobox v-model="searchData" :items="listPackage" item-text="nome"
                                                hide-selected hide-no-data :clearable="true" style="justify-content: center"
                                                :loading="isLoading" :search-input.sync="searchData" filled single-line
                                                full-width return-object @click:clear="clearSearch" shaped outlined
                                    >
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
                                    <h4 class="font-italic font-weight-bold primary--text">{{editedPackage.nome}}</h4>
                                </v-card-title>
                                <v-card-text class="mt-3">
                                    <v-card>
                                        <v-card-text>
                                            <v-list-item v-for="(item,index) in listProducts" :key="index">
                                                <v-chip v-if="item.type ==='appointment' " color="green" text-color="white">
                                                    <strong>{{item.product}} | {{item.clinic}} | R$ {{item.price}}</strong>
                                                    <v-btn class="ml-1" small icon @click="removeProduct(index)">
                                                        <v-icon>cancel</v-icon>
                                                    </v-btn>
                                                </v-chip>
                                                <v-chip v-else color="purple" text-color="white">
                                                    <strong>{{item.product}} | {{item.clinic}} | R$ {{item.price}}</strong>
                                                    <v-btn class="ml-1" mall icon @click="removeProduct(index)">
                                                        <v-icon>cancel</v-icon>
                                                    </v-btn>
                                                </v-chip>
                                            </v-list-item>
                                        </v-card-text>
                                    </v-card>
                                    <v-dialog v-model="dialogEditProduct" hide-overlay width="550px">
                                        <v-card>
                                            <v-card-title>
                                                <h5>Deseja excluir produto {{editedProduct.product}} do pacote {{editedPackage.nome}} ?</h5>
                                            </v-card-title>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn class="red--text" text @click="deleteItemFromPackage(editedProduct, editedPackage, index)">SIM</v-btn>
                                                <v-btn class="primary--text" text @click="dialogEditProduct = false">CANCELAR</v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="save">Salvar<v-icon right>done_all</v-icon></v-btn>
                                </v-card-actions>
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
                                            <v-btn outlined text :color="buttonExam" class="button-select" rounded
                                                   @click="selectExam">Exames
                                            </v-btn>
                                            <v-btn outlined text :color="buttonAppointment" class="button-select mx-2" rounded
                                                   @click="selectAppointment">Consultas
                                            </v-btn>
                                            <v-btn outlined text :color="buttonClinic" class="button-select mx-2" rounded
                                                   @click="selectClinic">Clinicas
                                            </v-btn>
                                        </v-radio-group>
                                    </v-flex>
                                    <v-text-field v-model="search" required solo primary :clearable="true"
                                                  placeholder="Escolha a categoria"
                                    ></v-text-field>
                                </v-layout>
                                <v-card-text>
                                        <v-flex v-for="(item,index) in categories" :key="index">
                                            <v-card class="mt-3">
                                                <v-card-title v-text="item.nome"></v-card-title>
                                                <v-card-text>
                                                    <v-slide-group v-if="categorySelect === 'clinic' && item.exames" show-arrows>
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
                                                    <v-slide-group v-if="categorySelect === 'exam'" show-arrows>
                                                        <v-slide-item
                                                                v-for="(n,i) in item.clinicas" :key="i" v-slot:default="{ active, toggle }" >
                                                            <v-btn class="mx-2"
                                                                   :input-value="active"
                                                                   active-class="blue white--text"
                                                                   depressed
                                                                   rounded
                                                                   @mousedown="toggle"

                                                                   @click="addProducts(n.nome,item.nome, categorySelect, n.venda,n.custo)"
                                                            >
                                                                {{ n.nome }} | {{n.venda}}
                                                            </v-btn>
                                                        </v-slide-item>
                                                    </v-slide-group>
                                                    <v-slide-group v-if="categorySelect === 'appointment'" show-arrows>
                                                        <v-slide-item
                                                                v-for="(n,i) in item.combo" v-slot:default="{ active, toggle }" :key="i">
                                                            <v-btn class="mx-2"
                                                                   :input-value="active"
                                                                   active-class="blue white--text"
                                                                   depressed
                                                                   rounded
                                                                   @mousedown="toggle"
                                                                   @click="addProducts(n.clinica , n , categorySelect, n.venda,n.custo)"
                                                            >
                                                                {{ n.clinica }} | {{n.nome}} | {{n.venda}}
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
                                        <v-flex xs12>
                                            <p></p>
                                        </v-flex>
                                        <v-layout row>
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
                                                        v-model="sale"
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
                                                        v-model="total"
                                                        rounded
                                                        readonly
                                                        color="#009688"
                                                ></v-text-field>
                                            </v-flex>
                                        </v-layout>

                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn outlined rounded text color="primary" :disabled="!formRegister" @click="validateRegister()" class="ma-3">
                                            Cadastrar Pacote
                                        </v-btn>
                                        <v-dialog v-model="sucessRegister" hide-overlay max-width="500px">
                                            <v-card color="white">
                                                <v-card-title class="text-xs-center ma-1">
                                                    <h4>Pacote cadastrado com sucesso!<v-icon right>how_to_reg</v-icon></h4>
                                                </v-card-title>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn color="primary" text @click="endRegister()" router-link to="/" >Finalizar</v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-dialog>
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
                                <v-list-item v-for="(item,index) in listProducts" :key="index">
                                    <v-chip v-if="item.type ==='appointment' " color="green" text-color="white">
                                        <strong>{{item.product}} | {{item.clinic}} | R$ {{item.price}}</strong>
                                        <v-btn class="ml-1" small icon @click="removeProduct(index)">
                                            <v-icon>cancel</v-icon>
                                        </v-btn>
                                    </v-chip>
                                    <v-chip v-else color="purple" text-color="white">
                                        <strong>{{item.product}} | {{item.clinic}} | R$ {{item.price}}</strong>
                                        <v-btn class="ml-1" mall icon @click="removeProduct(index)">
                                            <v-icon>cancel</v-icon>
                                        </v-btn>
                                    </v-chip>
                                </v-list-item>
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
            cost: 0, sale: 0, total: 0, discountPercentage: 0, discountMoney: 0,

            searchPackage: true, registerPackage: false, searchData: null, isLoading:false,
            validRegister: true, sucessRegister: false, listProducts:[], listClinic: [], action: false,  tab: null, tabs:null,
            listModelsSlide :[],

            dialogEditProduct: false,
            seeProduct: false,
            search:'',
            buttonAppointment:'#9EA9D5' , buttonExam:'#009688', buttonClinic: '#9EA9D5',
            colorSelect:'#009688', noSelect: '#9EA9D5',
            categorySelect: null, item: [],

            items: [],  consultas:[], exames:[], clinicas: [], medicos: [],  combo: [],

            opcoes: ['EXAMES' , 'CONSULTAS'], select: null,

            editedProduct: {clinic: '', cost: '', price: '', product: '', type: '', doctor: ''},

            defaultProduct: {clinic: '', cost: '', price: '', product: '', type: '', doctor: ''},

            editedPackage: {
                id:'', nome: '', exames: [], consultas: [], clinicas: [], tab: []

            },

            defaultPackage: {
                id:'', nome: '', exames: [], consultas: [], clinicas: [], tab: []
            },

            rules: {
                campoObrigatorio: [
                    v => !!v || 'Campo é Obrigatório',
                ],
            }
        }),

        computed: {

            listPackage () {
                this.isLoading = false;
                return this.$store.getters.bundle;
            },

            allPackage () {
                return this.$store.getters.bundle;
            },

            formRegister () {
                return this.editedPackage.nome && this.cost && this.sale /* && this.discountPercentage && this.discountMoney */ && this.total;
            },

            selectedPackage () {
                let pacoteSelecionado = this.$store.getters.selectedBundle;
                this.editedPackage = Object.assign({}, pacoteSelecionado);
                console.log('pacoteSelecionado', pacoteSelecionado);
                return pacoteSelecionado;
            },

            categories: function () {
                if (!this.search) { return [] }
               
                let search = this.search.toLowerCase();
                let products = [];


                if(this.items){

                    if (this.categorySelect === 'clinic'){
                        for (let i in this.items) {
                            console.log('Clinica->',this.items[i])
                            var obj = {
                                nome: this.items[i].nome}
                            if(this.items[i].consultas.length > 0)
                                obj = {...obj,consultas: this.items[i].consultas}
                            
                             if(this.items[i].exames.length > 0)
                                obj = {...obj,exames: this.items[i].exames}
                            products[i] = (obj)
                            console.log('Clinica->',obj)
                        }

                    } else if(this.categorySelect === "exam"){
                        for(let i in this.items){
                            products[i] = ({
                                nome: this.items[i].nome ,
                                regras: this.items[i].regras,
                                clinicas: this.items[i].clinicas
                            })
                        }
                    }else{
                        for (let i in this.items) {
                            this.combo = [];
                            for (let clinica in this.items[i].clinicas){
                                for (let medico in this.items[i].clinicas[clinica].medicos){

                                    let item = {
                                        produto: this.items[i].nome,
                                        nome:  this.items[i].clinicas[clinica].medicos[medico].nome,
                                        clinica:  this.items[i].clinicas[clinica].nome,
                                        custo: this.items[i].clinicas[clinica].medicos[medico].custo,
                                        venda:  this.items[i].clinicas[clinica].medicos[medico].venda,
                                    };


                                    if (this.combo.length !== 0){
                                        this.combo[this.combo.length] =  item;
                                    }
                                    else {
                                        this.combo[0] = item;
                                    }
                                }
                            }
                             products[i] = ({
                                nome: this.items[i].nome ,
                                regras: this.items[i].regras,
                                clinicas: this.items[i].clinicas,
                                combo:this.combo
                            })
                        }
                    }
                    var p = products.filter(item => {
                        const text = item.nome.toLowerCase();
                        //console.log("->" + text + " ->" + search  + " " + (text.indexOf(search) > -1))
                        return text.indexOf(search) > -1
                    });

                    return p
                }

            },

        },

        mounted() {
           this.$store.dispatch('loadExam');
           this.$store.dispatch('loadSpecialties');
           // this.$store.dispatch('loadClinic');
            
        },

        watch: {

            discountPercentage: function () {
                this.discountMoney = (this.discountPercentage * this.sale) / 100
                this.total = this.sale - this.discountMoney
            },

            discountMoney: function () {
                this.discountPercentage = ((this.discountMoney * 100) / this.sale)
            },

            sale: function (val) {
                this.total = val - this.discountMoney
            },

            searchData(){

                if (this.searchData){

                    this.isLoading = true;
                    const data = this.capitalize (this.searchData);
                    this.listProducts = [];
                    this.$store.dispatch('searchPackage', data).then(() => {

                        if (this.listPackage.length > 0) {

                            for (let key in this.listPackage) {
                                if (this.searchData === this.listPackage[key].nome || this.searchData.nome === this.listPackage[key].nome) {
                                    this.searchPackage = true;
                                    this.registerPackage= false;
                                    this.$store.dispatch('selectPackage', {...this.$store.getters.package[key]});
                                    this.editedPackage = Object.assign({}, this.selectedPackage);
                                    this.editedPackage.nome = data;
                                    for (let i in this.editedPackage.exames){
                                        this.listProducts.push({
                                            ...this.editedPackage.exames[i],
                                        });
                                    }
                                    for (let i in this.editedPackage.consultas){
                                        this.listProducts.push({
                                            ...this.editedPackage.consultas[i],
                                        });
                                    }


                                    console.log('list', this.listProducts);
                                }
                            }
                        } else {
                            //setTimeout(this.alert, 500);
                        }
                    })
                } else {
                    this.$store.dispatch('selectPackage', null);
                }
            },
        },

        methods: {

            removeProduct(index){
                this.sale -= this.listProducts[index].price;
                this.cost -= this.listProducts[index].cost;
                
                this.listProducts.splice(index,1)
            },

            deleteItem (product, pack) {
                console.log("product", product);
                console.log("package", pack);

                this.editedProduct = Object.assign({}, product);
                this.dialogEditProduct = true;
            },

            deleteItemFromPackage (index, product, pack) {

                let type = product.type;

                this.sale -= this.listProducts[index].price;
                this.cost -= this.listProducts[index].cost;
                this.listProducts.splice(index,1);

                const data = {
                    nome: pack.nome,
                    pacote: this.listProducts,
                };
                this.$store.dispatch('deleteProductFromPackage', data).then(() => {
                    this.dialogEditProduct = false;
                })
            },

            alert() {
                if (this.selectedPackage === null){
                    alert("Pacote não cadastrado");
                    this.editedPackage= Object.assign({}, this.defaultPackage);
                    this.editedPackage.nome = this.searchData;
                }
            },

            clearSearch () {
                this.isLoading = false;
                this.searchData = null;
                this.editedPackage= Object.assign({}, this.defaultPackage);
                this.$store.dispatch('selectPackage', null);
            },

            validateRegister () {
                this.registerProduct();
                this.sucessRegister = true;
            },

            registerProduct () {
                const packageData = {
                    nome: this.capitalize(this.editedPackage.nome),
                    pacote : this.listProducts,
                    custo: this. cost,
                    venda: this.sale,
                    porcentagem: this.discountPercentage,
                    dinheiro: this.discountMoney,
                    total: this.total,
                };

                this.$store.dispatch('createPackage', packageData);
            },

            endRegister () {
                setTimeout(() => {
                    this.editedPackage = Object.assign({}, this.defaultPackage);
                }, 300);
                if (this.registerPackage === true){

                    this.registerPackage = false;
                    this.sucessRegister = false;
                    this.searchPackage = true;
                    this.searchData = null;

                }
            },

            save(){
                //Object.assign({}, this.editedPackage);
                this.saveEditions();
            },

            saveEditions(){

                const packageData = {
                    nome: this.capitalize(this.editedPackage.nome),
                    pacotes: this.listProducts,
                };

                this.$store.dispatch('loadPackage').then(() => {
                    this.$store.dispatch('updateDataPackage', packageData);
                });
            },

            capitalize(value){
                value = value.toString();
                return value.toUpperCase();
            },

            selectExam () {
                this.buttonExam = this.colorSelect;
                this.buttonAppointment = this.noSelect;
                this.buttonClinic = this.noSelect;
                this.categorySelect = 'exam';
                this.items= this.$store.getters.exams;

                console.log('items', this.items);
            },

            selectAppointment () {

                this.buttonAppointment = this.colorSelect;
                this.buttonExam = this.noSelect;
                this.buttonClinic = this.noSelect;
                this.categorySelect = 'appointment';
                this.items= this.$store.getters.specialties;

                console.log('items', this.items);
                this.combo = [];


                for (let i in this.items) {
                    for (let clinica in this.items[i].clinicas){
                        for (let medico in this.items[i].clinicas[clinica].medicos){

                            let item = {
                                produto: this.items[i].nome,
                                nome:  this.items[i].clinicas[clinica].medicos[medico].nome,
                                clinica:  this.items[i].clinicas[clinica].nome,
                                custo: this.items[i].clinicas[clinica].medicos[medico].custo,
                                venda:  this.items[i].clinicas[clinica].medicos[medico].venda,
                            };


                            if (this.combo.length !== 0){
                                this.combo[this.combo.length] =  item;
                            }
                            else {
                                this.combo[0] = item;
                            }
                        }
                    }
                }

            },

            selectClinic () {
                this.buttonClinic = this.colorSelect;
                this.buttonExam = this.noSelect;
                this.buttonAppointment = this.noSelect;
                this.categorySelect = 'clinic';
                this.items = this.$store.getters.allClinics;
                this.combo = [];

                for (let i in this.items) {
                    for (let consulta in this.items[i].consultas){
                        for (let medico in this.items[i].consultas[consulta].medicos){

                            let item = {
                                produto: this.items[i].consultas[consulta].nome,
                                nome:  this.items[i].consultas[consulta].medicos[medico].medico,
                                clinica:  this.items[i].nome,
                                custo: this.items[i].consultas[consulta].medicos[medico].custo,
                                venda:  this.items[i].consultas[consulta].medicos[medico].venda,
                            };


                            if (this.combo.length !== 0){
                                this.combo[this.combo.length] =  item;
                            }
                            else {
                                this.combo[0] = item;
                            }
                        }
                    }

                }


            },

            addProducts(clinic, product, type, price,cost){

                if (type === 'appointment') {
                    this.item = {
                        product: product.produto,
                        doctor: product.nome,
                        clinic: clinic,
                        type: type,
                        price:  parseFloat(price),
                        cost:parseFloat(cost)
                    }
                } else {
                    this.item = {
                        product: product,
                        clinic: clinic,
                        type: type,
                        price:  parseFloat(price),
                        cost:parseFloat(cost)
                    };
                }

                console.log(this.item);
                if (this.listProducts){
                    for (let key in this.listProducts) {    
                        if (this.item.product === this.listProducts[key].product ) {
                                if (this.item.clinic === this.listProducts[key].clinic && this.item.type === this.listProducts[key].type && this.item.price === this.listProducts[key].price 
                                    && this.item.cost === this.listProducts[key].cost && type === this.listProducts[key].type
                                    && ( (this.item.type === "appointment" && this.item.doctor === this.listProducts[key].doctor) ||(type != "appointment")  ) ) {
                                    
                                    this.action = true;
                                }
                                else {
                                    this.action = false;
                                }
                                this.listProducts.splice(key,1)
                        }
                    }
                }

                if (this.action === false){
                    this.listProducts.push({
                        ...this.item
                    });
                    //this.sale = this.sale + item.price
                    
                }
                console.log(this.listProducts);
                this.sale = 0;
                this.cost = 0;
                for (let key in this.listProducts) {
                    
                    this.sale += this.listProducts[key].price;
                    this.cost += this.listProducts[key].cost;
                }
                this.action = false;
            },

            back(){
                this.$router.push('/Cadastrar')
            },

        },
    }
</script>

<style scoped>
    .title {

        color: #757575;
        font-size: 20px;
    }

    .round-card {
        border-radius: 20px;

    }

    .center-card {
        height: 100%;
        justify-content: center;
        align-content: center;
        align-items: center;

    }
</style>