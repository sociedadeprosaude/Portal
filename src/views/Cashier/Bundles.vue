<template>
    <v-container fluid class=" fill-height">
        <v-layout row wrap class="justify-center">
            <v-flex>
                <searchPackage></searchPackage>
            </v-flex>
            <v-flex sm3>
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

            defaultPackage: {
                id: '', name: '', exams: [], specialties: [],
            },

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
            this.$store.commit('setSelectedBundle', this.defaultPackage);
        },

    }
</script>

