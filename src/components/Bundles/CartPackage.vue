<template>
    <v-container class="ma-0 pa-0 mt-4">
        <v-layout row wrap>
            <v-flex class="hidden-print-only" xs12>
                <v-layout row wrap class="align-center mt-3 mr-2 ml-2">
                    <v-flex xs9>
                        <v-select
                                v-if="!registerPackage && !editName"
                                v-model="searchData"
                                :items="LocaleBundles ? LocaleBundles : []"
                                item-text="name"
                                auto-select-first
                                :loading="isLoading"
                                @change="GetPackage(searchData)"
                                return-object
                                label="Escolhe um pacote"
                                outlined
                                solo
                                dense
                        />
                      <v-text-field v-else-if="editName && !registerPackage" v-model="searchData.name"
                                    label="Nome do Pacote"
                                    outlined
                                    dense
                                    solo
                      />
                        <v-text-field v-else v-model="newPackageName"
                                      label="Nome para o Pacote"
                                      outlined
                                      dense
                                      solo
                        />
                    </v-flex>
                  <v-flex xs1>
                    <v-btn x-small fab color="background" dark class="mb-7"
                           @click="editName= !editName" v-if="!registerPackage && searchData">
                      <v-icon class="primary--text">edit</v-icon>
                    </v-btn>
                  </v-flex>
                    <v-flex xs1>
                        <v-btn x-small fab color="background" dark class="mb-7"
                               @click="(registerPackage = !registerPackage, searchPackage = !searchPackage),clearCart()">
                            <v-icon v-if="!registerPackage" class="primary--text">add</v-icon>
                            <v-icon v-else class="primary--text">search</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
                <v-card id="carrinho" class="elevation-2 mr-2 ml-2 mt-n1" >
                    <div class="hidden-sm-and-up" style="position:fixed; right:20px; z-index:1">
                        <v-btn class="my-0" x-large icon @click="$emit('closeCart')">
                            <v-icon>cancel</v-icon>
                        </v-btn>
                    </div>
                    <v-container>
                        <v-layout row wrap class="align-center">
                            <v-flex xs12 class="mt-1 v-card" style="overflow:auto; height:50vh; box-shadow: inset 0px 5px grey">
                                <v-layout row wrap>
                                    <v-card class="my-2 white" width="100%" v-if="exams.length > 0">
                                        <h4 class="text-left ml-2">Exames</h4>
                                        <v-card-text v-for="(item) in exams" :key="item.name" class="ma-0 pa-0 my-1 font-weight-bold">
                                            <v-flex xs12 class="mt-2">
                                                <v-divider/>
                                            </v-flex>
                                            <v-flex xs12 class="align-center justify-center text-center">
                                                <span class="font-weight-bold">{{item.name}}</span>
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-divider/>
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-layout row wrap class="mx-1 black--text">
                                                    <span>{{item.clinic.name}}</span>
                                                    <v-spacer/>
                                                    <span>R$ {{item.price}}</span>
                                                </v-layout>
                                            </v-flex>
                                            <v-btn rounded dense x-small class="error px-6" @click="removeItem(item)">Remover Item</v-btn>
                                        </v-card-text>
                                    </v-card>
                                    <v-divider/>
                                    <v-card class="my-2 white" width="100%" v-if="consultations.length > 0">
                                        <h4 class="text-left ml-2">Consultas</h4>
                                        <v-card-text v-for="(item) in consultations" :key="item.doctor.name" class="ma-0 pa-0 my-1 font-weight-bold">
                                            <v-flex xs12 class="mt-2">
                                                <v-divider/>
                                            </v-flex>
                                            <v-flex xs12 class="align-center justify-center text-center">
                                                <span>{{item.name}}</span>
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-divider/>
                                            </v-flex>
                                            <v-flex xs12>
                                                <v-layout row wrap class="mx-1 black--text">
                                                    <v-flex xs12 class="text-left">
                                                        <span>{{item.doctor.name}}</span>
                                                    </v-flex>
                                                    <span>{{item.doctor.clinic.name}}</span>
                                                    <v-spacer/>
                                                    <span>R$ {{item.doctor.price}}</span>
                                                </v-layout>
                                            </v-flex>
                                            <v-btn rounded dense x-small class="error px-6" @click="removeItem(item)">Remover Item</v-btn>
                                        </v-card-text>
                                    </v-card>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
                <v-flex xs12 class="mt-4 mx-3">
                    <v-card class="pr-1 pl-1">
                        <v-layout row wrap>
                            <v-flex>
                                <v-layout wrap class="mt-3">
                                  <v-flex xs5 class="ml-4">
                                    <v-text-field
                                        label="Desconto: R$ "
                                        v-model="moneyDiscount"
                                        dense
                                        outlined
                                    />
                                  </v-flex>
                                  <v-flex xs6>
                                    <v-text-field
                                        disabled
                                        label="Desconto: %"
                                        v-model="PercentageDiscount"
                                        outlined
                                        dense
                                    />
                                  </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12>
                                <v-layout row wrap>
                                    <v-flex xs12>
                                        <v-divider color="black"/>
                                    </v-flex>
                                    <v-layout row wrap>
                                        <v-flex xs6>
                                            <span>Subtotal: R$ {{this.subTotal.toLocaleString('en-us', {minimumFractionDigits: 2})}}</span>
                                        </v-flex>
                                        <v-flex xs6>
                                            <span>Desconto: R$ {{this.moneyDiscount.toLocaleString('en-us', {minimumFractionDigits: 2})}}</span>
                                        </v-flex>
                                    </v-layout>
                                    <v-flex xs12>
                                        <v-divider/>
                                    </v-flex>
                                    <v-flex xs12 class="my-2">
                                        <h6 class="title font-weight-bold primary--text"> Total: R$
                                            {{this.total.toLocaleString('en-us', {minimumFractionDigits: 2})}}</h6>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-divider/>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <v-flex xs12 class="mt-3 mb-3">
                                <v-layout row wrap class="align-end fill-height" v-if="!loading">
                                    <v-flex xs4 class="text-center">
                                        <submit-button
                                                text="Salvar" :loading="paymentLoading" outlined
                                                :success="paymentSuccess" color="primary"
                                                @click="validateRegister()">
                                        </submit-button>
                                    </v-flex>
                                    <v-flex xs4="text-center mt-4">
                                        <v-btn color="primary" outlined @click="clearCart()">Limpar</v-btn>
                                    </v-flex>
                                    <v-spacer/>
                                    <v-flex xs4 class="text-center mt-4">
                                        <v-btn outlined color="error" @click="deletePackage()">excluir</v-btn>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap class="align-end fill-height" v-else>
                                    <v-flex xs12 class="text-center">
                                        <v-btn  :loading="loading">
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>

            </v-flex>
        </v-layout>
        <v-dialog v-model="searchPatient" transition="dialog-bottom-transition">
            <select-patient-card @removed="clearCart" max-width="100%"/>
        </v-dialog>
        <v-dialog v-model="budgetToPrintDialog" v-if="budgetToPrint">
            <budget-to-print @close="budgetToPrintDialog = false" :budget="budgetToPrint"/>
        </v-dialog>
        <v-dialog v-model="receiptDialog" v-if="selectedIntake" fullscreen transition="dialog-bottom-transition">
            <receipt @close="receiptDialog = false" :budget=selectedIntake>
            </receipt>
        </v-dialog>
    </v-container>
</template>

<script>
    import SelectPatientCard from "../Patient/SelectPatientCard";
    import SubmitButton from "../SubmitButton";
    import BudgetToPrint from "../cashier/BudgetToPrint";
    import Receipt from "../cashier/Receipt";
    import gql from 'graphql-tag'
    import { uuid } from 'vue-uuid'

    export default {
        name: "Cart",
        components: {
            Receipt,
            SelectPatientCard,
            SubmitButton,
            BudgetToPrint
        },
        data() {
            return {
                xDown: undefined,
                yDown: undefined,
                parcel: 1,
                parcels: [1, 2, 3, 4, 5],
                paymentLoading: false,
                quantParcelas: ["1", "2", "3", "4", "5"],
                paymentSuccess: false,
                searchBudgetError: undefined,
                searchBudgetNumber: undefined,
                searchBudgetLoading: false,
                searchBudgetBtn: false,
                searchPatient: false,
                payments: ['Dinheiro'],
                valuesPayments: [''],
                payment: {paymentForm: ['Dinheiro'], value: [''], parcel: ['1']},
                moneyDiscout: 0,
                data: moment().format("YYYY-MM-DD HH:mm:ss"),
                parcelas: '1',
                totalCusto: 0,
                percentageDiscount: 0,
                moneyDiscount: 0,
                FormasDePagamento: ["Dinheiro", "Crédito", "Débito"],
                totalNovo: 0,
                budgetToPrint: undefined,
                budgetToPrintDialog: false,
                selectedIntake: undefined,
                selectedDoctor: undefined,
                receiptDialog: false,
                searchPackage: true, registerPackage: false, searchData: '',
                newPackageName: '',
                isLoading: false,
                Bundles: [],
                loading:false,
                LocaleBundles: [],
                BundlesSkip: false,
                editName: false,
            }
        },
        computed: {
          PercentageDiscount(){
            if(this.$store.getters.getDiscountBudget !== 0){
              this.moneyDiscount = this.$store.getters.getDiscountBudget
              this.percentageDiscount = ((100 * this.moneyDiscount)/this.subTotal)
              this.$store.commit('setDiscount',0)
            }
            if(this.moneyDiscount.length === 0){
              this.moneyDiscount = 0
              this.percentageDiscount = 0
            }
            else{
              this.percentageDiscount= ((100 * this.moneyDiscount) / this.subTotal)
            }
            return this.percentageDiscount.toFixed(2)
          },
            listPackage() {
                return Object.values(this.$store.getters.bundles);
            },
            selectedUnit() {
                return this.$store.getters.selectedUnit
            },
            selectedBudget() {
                return this.$store.getters.selectedBudget
            },

            cartItems() {
                return this.$store.getters.getShoppingCartItems
            },
            exams() {
                if (this.searchData.product) {
                    this.searchData.product.filter( e => { if(e.clinic.length){
                        e.type = e.product[0].type
                        e.name = e.product[0].name
                        e.clinic = e.clinic[0]
                        e.id = e.product[0].id
                        this.$store.commit('addShoppingCartItem', e) }
                    })
                }
                return this.$store.getters.getShoppingCartItemsByCategory.exams
            },
            consultations() {
                if (this.searchData.consultations) {
                    return this.searchData.consultations
                }
                return this.$store.getters.getShoppingCartItemsByCategory.consultations
            },
            cost() {
                let total = 0;
                if (this.searchData.name) {
                    if (this.searchData.consultations) {
                        for (let item in this.searchData.consultations) {
                            total += parseFloat(this.searchData.consultations[item].cost)
                        }
                    }
                    if (this.searchData.exams) {
                        for (let item in this.searchData.exams) {
                            total += parseFloat(this.searchData.exams[item].cost)
                        }
                    }
                } else {
                    let itens = this.$store.getters.getShoppingCartItems;
                    for (let item in itens) {
                        total += parseFloat(itens[item].cost)
                    }
                }
                return total
            },
            subTotal() {
                let total = 0;
                let itens = this.$store.getters.getShoppingCartItems;
                for (let item in itens) {
                    total += parseFloat(itens[item].price);
                }
                return total
            },
          total() {
            if(this.moneyDiscount.length === 0){
              return (parseFloat(this.subTotal).toFixed(2))
            }
            return (parseFloat(this.subTotal) - parseFloat(this.moneyDiscount)).toFixed(2)
          },
        },
        mounted() {
            this.$store.dispatch('loadBundle');

        },
        methods: {
            GetPackage(product) {
                this.percentageDiscount = ( (product.discount * 100)/(product.total + product.discount))
                this.moneyDiscount = product.discount
            },
            removeItem(item, type) {
                this.$store.commit('removeShoppingCartItem', item)
            },

            generateBudget() {
                let id = moment().valueOf()
                let budget = {
                    id: id,
                    specialties: this.consultations.length > 0 ? this.consultations : undefined,
                    exams: this.exams.length > 0 ? this.exams : undefined,
                    subTotal: this.subTotal,
                    discount: this.moneyDiscount,
                    total: this.total,
                    parcel: this.payment.parcel,
                    date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    cost: this.cost,
                    user: this.$store.getters.selectedPatient,
                    colaborator: this.$store.getters.user,
                    parcelar: this.parcelar,
                    doctor: this.selectedDoctor,
                    payments: this.payment.paymentForm,
                    valuesPayments: this.payment.value,
                    unit: this.selectedUnit
                };
                return budget
            },
            async updateBudgetsIntakes() {
                let user = this.patient;
                let intakes = await this.$store.dispatch('getUserIntakes', user);
                let budgets = await this.$store.dispatch('getUserBudgets', user);
                user.intakes = intakes;
                user.budgets = budgets;
                this.$store.commit('setSelectedPatient', user)
            },
            async saveBudget(budget) {
                this.$store.commit('setSelectedBudget', budget);
                await this.$store.dispatch('getUserBudgets', this.patient);
                await this.$store.dispatch('addBudget', budget);
                this.updateBudgetsIntakes()
            },

            clearCart() {
                this.$store.commit('clearShoppingCartItens');
                this.$store.commit('setSelectedBudget', undefined);
                this.moneyDiscount = 0;
                this.percentageDiscount = 0;
                let user = undefined;
                this.newPackageName = '';
                this.searchData = '';
                this.$store.commit('setSelectedPatient', user)

            },
            async deletePackage() {
                /* this.$store.dispatch('deletePackage', this.searchData).then(() => {
                    this.$store.dispatch('loadBundle');
                }); */
                for( let i in this.searchData.product){
                    await this.$apollo.mutate({
                        mutation: require ('@/graphql/bundles/deleteProductBundles.gql'),
                        variables:{
                           id: this.searchData.product[i].id
                        }
                    })
                }
                this.$apollo.mutate({
                    mutation: require ('@/graphql/bundles/deleteBundles.gql'),
                    variables:{
                        id: this.searchData.id
                    }
                }).then((data)=> {
                    this.BundlesSkip = false
                    this.$apollo.queries.loadBundles.refresh()
                    this.clearCart();
                })

            },
            async validateRegister() {
                this.loading= true
              this.editName = false
                const packageData = {
                    exams: this.exams,
                    consultations: this.consultations,
                    moneyDiscount: parseFloat(this.moneyDiscount),
                    percentageDiscount: parseFloat(this.percentageDiscount),
                    cost: this.cost,
                    price: this.subTotal.toLocaleString('en-us', {minimumFractionDigits: 2}),
                    total: (this.total),
                    name: this.newPackageName !== '' ? this.newPackageName : this.searchData.name,
                };
                /* for (let exam in packageData.exams) {
                    if (!packageData.exams[exam].priceOriginal) {
                        packageData.exams[exam].priceOriginal = packageData.exams[exam].price
                    }

                    packageData.exams[exam].price = packageData.exams[exam].priceOriginal - ((this.percentageDiscount / 100) * packageData.exams[exam].priceOriginal)
                }
                for (let consul in packageData.consultations) {
                    if (!packageData.consultations[consul].priceOriginal) {
                        packageData.consultations[consul].priceOriginal = packageData.consultations[consul].price
                    }
                    packageData.consultations[consul].price = packageData.consultations[consul].priceOriginal - ((this.percentageDiscount / 100) * packageData.consultations[consul].priceOriginal)
                }

                this.$store.dispatch('addBundle', packageData).then(() => {
                    this.clearCart();
                    this.registerPackage = !this.registerPackage
                    this.$store.dispatch('loadBundle');
                }); */
                if(this.searchData.name){
                    for( let i in this.searchData.product){
                        await this.$apollo.mutate({
                            mutation: require ('@/graphql/bundles/deleteProductBundles.gql'),
                            variables:{
                                id: this.searchData.product[i].id
                            }
                        })
                    }
                    this.$apollo.mutate({
                        mutation: require ('@/graphql/bundles/deleteBundles.gql'),
                        variables:{
                            id: this.searchData.id
                        }
                    })
                }
                let products = packageData.exams.concat(packageData.specialties)

                    let BundleId = uuid.v4()
                    let BundleString = `CreateBundles(
                 id: "${BundleId}",
                 total: ${parseFloat(packageData.total)},
                 name: "${packageData.name}",
                 discount: ${parseFloat(packageData.moneyDiscount)}
                ){
                id, total, name, discount
                }`
                    let ProductBundlesIds = []
                    let ProductBundlesString = ''
                products = products.filter(p => p)
                    for (let product in products) {
                        let prodId = uuid.v4()
                        products[product].prodId = prodId
                        ProductBundlesIds.push(prodId)
                        ProductBundlesString += `
                        ProductBundles${product}: CreateProductBundles(
                        id: "${prodId}"
                        discount: ${parseFloat(packageData.percentageDiscount)}
                        price:${parseFloat(products[product].price)}
                        ){
                            id
                        },`
                    }
                let ProductBundlesLinkString = ''
                for (let product in products) {
                        let ProductBundlesIds = products[product].prodId
                        ProductBundlesLinkString += `
                AddBundlesWith_product${product}:AddBundlesWith_product(
        from:{
            id:"${BundleId}"
        },
        to:{
            id:"${ProductBundlesIds}"
        }
    ){
        from{id},
        to{id}
    },
    AddProductBundlesWith_product${product}:AddProductBundlesWith_product(
        from:{
            id:"${ProductBundlesIds}"
        },
        to:{
            id:"${products[product].id}"
        }
        ){
        from{id},
        to{id}
    },
    ${products[product].clinic ? `AddProductBundlesWith_clinic${product}:AddProductBundlesWith_clinic(
        from:{
            id:"${ProductBundlesIds}"
        },
        to:{
          id:"${products[product].clinic.id}"
        }
        ){
        from{id},
        to{id}
    }` : ''},`
                    }
                let finalString = `mutation { ${BundleString} ${ProductBundlesString} ${ProductBundlesLinkString} }`
                    await this.$apollo.mutate({
                        mutation: gql`${finalString}`,
                    })
                    this.BundlesSkip = false
                    this.$apollo.queries.loadBundles.refresh()
                    this.clearCart();
                this.loading= false
                return BundleId


            }
        },

        apollo: {
            loadBundles: {
                query: require("@/graphql/bundles/loadBundles.gql"),
                update(data){
                    this.Bundles = Object.assign(data.Bundles)
                    this.LocaleBundles= data.Bundles
                    this.BundlesSkip = true
                },
                skip(){
                    return this.BundlesSkip
                }
            }
        }
    }
</script>

<style scoped>
</style>
