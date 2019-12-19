<template>
    <v-container fluid class=" fill-height">
        <v-layout row wrap class="justify-center">
            <v-flex>
                <searchPackage></searchPackage>
            </v-flex>
            <v-flex sm3 v-if="selectedPackage">
                <listPackage></listPackage>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import listPackage from "../../components/cashier/listPackage";
    import searchPackage from "../../components/cashier/searchPackage";


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

        components: {
            listPackage,
            searchPackage,
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

            categories: function () {

                if (!this.search) { return [] }

                let search = this.search.toLowerCase();
                let products = [];

                //console.log(this.items);

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
                        //console.log(this.items);
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