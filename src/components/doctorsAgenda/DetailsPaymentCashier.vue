<template>
    <v-container fluid class="ma-0 pa-0 hidden-print-only">
        <v-layout row wrap>
            <v-flex>
                <v-flex sm12 xs12 v-if="payment.paymentForm.length > 1">
                    <v-layout row wrap class="align-center" v-for="(x ,index) in payment.paymentForm" :key="index">
                        <v-flex xs12>
                            <v-select
                                    outlined
                                    dense
                                    :items="FormasDePagamento"
                                    v-model="payment.paymentForm[index]"
                                    hint="Forma de Pagamento"
                                    :append-outer-icon="index === 0 ? 'add_circle' : 'remove_circle'"
                                    @click:append-outer="index === 0 ? adicionarFormaDePagamento() : apagarFormaDePagamento(index)"
                            />
                        </v-flex>
                        <v-flex xs5 v-if="payment.paymentForm[index] === 'Crédito'">
                            <v-currency-field
                                    dense
                                    outlined
                                    v-model="payment.value[index]"
                                    label="Valor"
                            />
                        </v-flex>
                        <v-flex xs10 v-if="payment.paymentForm[index] !== 'Crédito'">
                            <v-currency-field
                                    outlined
                                    dense
                                    v-model="payment.value[index]"
                                    label="Valor"
                            />
                        </v-flex>
                        <v-flex xs6 v-if="payment.paymentForm[index] === 'Crédito'" class="ml-4">
                            <v-select
                                    :items="parcels"
                                    v-model="payment.parcel[index]"
                                    label="Parcelas"
                                    filled
                                    dense
                                    outlined
                            >
                            </v-select>
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-flex sm12 xs12 v-if="payment.paymentForm.length === 1">
                    <v-layout row wrap class="align-center" v-for="(x ,index) in payments" :key="index">
                        <v-flex xs12>
                            <v-select
                                    outlined
                                    dense
                                    :items="FormasDePagamento"
                                    v-model="payment.paymentForm[index]"
                                    hint="Forma de pagamento"
                                    append-outer-icon="add_circle"
                                    @click:append-outer="index === 0 ? adicionarFormaDePagamento() : apagarFormaDePagamento(index)"
                            />
                        </v-flex>
                        <v-flex xs5 v-if="payment.paymentForm[index] === 'Crédito'">
                            <v-currency-field
                                    outlined
                                    dense
                                    v-model="payment.value[index]"
                                    label="Valor"
                            />
                        </v-flex>
                        <v-flex xs6 v-if="payment.paymentForm[index] === 'Crédito'" class="ml-4">
                            <v-select :items="parcels"
                                      v-model="payment.parcel[index]"
                                      label="Parcelas"
                                      outlined
                                      dense
                            />
                        </v-flex>
                    </v-layout>
                </v-flex>
                <v-layout wrap>
                    <v-flex xs6>
                        <v-text-field
                                label="Desconto: %"
                                v-model="percentageDiscount"
                                outlined
                                dense
                        />
                    </v-flex>
                    <v-flex xs5 class="ml-4">
                        <v-text-field
                                disabled
                                label="Desconto: R$ "
                                v-model="moneyDiscount"
                                dense
                                outlined
                        />
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12>
                <v-layout row wrap v-if="payment.paymentForm.length > 1">
                    <v-flex xs12>
                        <v-divider color="black"/>
                    </v-flex>
                    <v-flex v-for="(x , index) in payments" :key="index">
                        <v-flex xs12 v-if="payment.paymentForm[index] === 'Crédito'">
                            <span>Crédito: {{payment.parcel[index]}}x de R$ {{( payment.value[index] / payment.parcel[index]).toFixed(2)}}</span>
                        </v-flex>
                        <v-flex xs12 v-if="payment.paymentForm[index] === 'Débito'">
                            <span>Débito: R$ {{( payment.value[index])}}</span>
                        </v-flex>
                        <v-flex xs12 v-if="payment.paymentForm[index] === 'Dinheiro'">
                            <span>Dinheiro: R$ {{( payment.value[index])}}</span>
                        </v-flex>
                    </v-flex>
                </v-layout>
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
            </v-flex>
            <v-spacer/>
            <v-flex xs12 class="mt-3">
                <v-layout row wrap class="align-end fill-height">
                    <v-flex xs4 class="text-center mt-4">
                        <v-btn outlined color="primary" @click="SelectNewPatient()">Novo</v-btn>
                    </v-flex>
                    <v-flex xs4 class="text-center">
                        <v-btn :disabled="cartItems.length === 0" outlined
                               color="primary" @click="imprimir()">Imprimir
                        </v-btn>
                    </v-flex>
                    <v-flex xs4 class="text-center">
                        <submit-button
                                :disabled="!patient || cartItems.length === 0 || this.paymentValues !== this.total || this.paymentNull === false"
                                text="Pagar" :loading="paymentLoading"
                                :success="paymentSuccess" color="primary" @click="pay()">
                            Pagar
                        </submit-button>
                    </v-flex>
                    <v-flex xs12 class="mt-4">
                        <v-fade-transition>
                            <v-alert
                                    v-model="alertMessage.model"
                                    dense
                                    border="right"
                                    colored-border
                                    type="error"
                                    elevation="2"
                            >{{alertMessage.text}}
                            </v-alert>
                        </v-fade-transition>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-dialog v-model="budgetToPrintDialog" v-if="budgetToPrint">
            <budget-to-print @close="budgetToPrintDialog = false" :budget="budgetToPrint"/>
        </v-dialog>
        <v-dialog
                transition="dialog-bottom-transition"
                fullscreen
                v-model="receiptDialog"
                v-if="selectedIntake"
        >
            <receipt @close="CloseReceipt()" :budget="selectedIntake"/>
        </v-dialog>
    </v-container>
</template>
<script>


    import SubmitButton from "../SubmitButton";
    import BudgetToPrint from "../../components/cashier/BudgetToPrint";
    import Receipt from "../cashier/Receipt";
    import functions from "../../utils/functions";

    let moment = require('moment');


    export default {
        name: "Cart",
        components: {
            BudgetToPrint,
            SubmitButton,
            Receipt
        },
        data() {
            return {
                xDown: undefined,
                yDown: undefined,
                parcel: 1,
                parcels: ["1", "2", "3", "4", "5"],
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
                receiptDialog: false,
                noDoctorKeyWord: 'Nenhum',
                alertMessage: {
                    text: '',
                    model: false
                },
                clinics: {}
            }
        },
        computed: {

            doctors: {
                get: function () {
                    let docArray = [];
                    docArray.push({
                        name: this.noDoctorKeyWord
                    });
                    docArray = docArray.concat(Object.values(this.$store.getters.doctors));
                    return docArray;
                }
            },
            selectedDoctor: {
                get() {
                    return this.$store.getters.shoppingCartSelectedDoctor
                },
                set(val) {
                    this.$store.commit('setSelectedDoctor', val)
                }
            },


            loadingDoctors() {
                return !this.$store.getters.doctorsLoaded
            },

            selectedUnit() {
                return this.$store.getters.selectedUnit
            },
            selectedBudget() {
                return this.$store.getters.selectedBudget
            },
            patient() {
                return this.$store.getters.selectedPatient
            },
            cartItems() {
                return this.$store.getters.getShoppingCartItems
            },
            exames() {
                return this.$store.getters.getShoppingCartItemsByCategory.exams
            },
            consultas() {
                return this.$store.getters.getShoppingCartItemsByCategory.consultations
            },
            clinic(){
                return this.$store.getters.getShoppingCartItemsByCategory.clinics
            },
            cost() {
                let itens = this.$store.getters.getShoppingCartItems;
                let total = 0;
                for (let item in itens) {
                    total += parseFloat(itens[item].cost)
                }
                return total
            },
            subTotal() {
                let itens = this.$store.getters.getShoppingCartItems;
                let total = 0;
                for (let item in itens) {
                    total += parseFloat(itens[item].price);
                }
                return total
            },
            total() {
                return (parseFloat(this.subTotal) - parseFloat(this.moneyDiscount)).toFixed(2)
            },
            paymentValues() {
                let tamanho = this.payment.paymentForm.length;
                let pagando = 0;
                if (tamanho === 1 && this.payment.paymentForm[0] !== '') {
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.payment.value[0] = parseFloat(this.total);
                    pagando = parseFloat(this.payment.value[0]);
                } else {
                    for (let i = 0; i < tamanho; i++) {
                        if (this.payment.value[i] !== '') {
                            pagando += parseFloat(this.payment.value[i])
                        }
                    }
                }
                return pagando.toFixed(2);
            },
            paymentNull() {
                let tamanho = this.payment.paymentForm.length;
                if (tamanho === 1 && this.payment.value[0] !== '') {
                    return true
                } else {
                    for (let i = 0; i < tamanho; i++) {
                        if (this.payment.value[i] === '') {
                            return false
                        }
                    }
                    return true
                }
            },
        },
        watch: {
            percentageDiscount: function () {
                this.moneyDiscount = ((this.percentageDiscount * this.subTotal) / 100);
            },
        },
        methods: {
            CloseReceipt(){
                this.$store.commit('setSelectedBudget', undefined);
                this.$store.commit('clearShoppingCartItens');
                this.card = false;
                this.paymentLoading= false
                this.paymentSuccess= true
                this.clearCart()
                this.receiptDialog=false
            },
            async searchBudget() {
                this.searchBudgetLoading = true;
                let budget = await this.$store.dispatch('getBudget', this.searchBudgetNumber);
                if (budget) {
                    this.$store.commit('setSelectedBudget', budget);
                    for (let exam in budget.exams) {
                        this.$store.commit('addShoppingCartItem', budget.exams[exam])
                    }
                    for (let spec in budget.specialties) {
                        this.$store.commit('addShoppingCartItem', budget.specialties[spec])
                    }
                    let intakes = await this.$store.dispatch('getUserIntakes', budget.user);
                    if (intakes) {
                        budget.user.intakes = intakes
                    }
                    let budgets = await this.$store.dispatch('getUserBudgets', budget.user);
                    if (budgets) {
                        budget.user.budgets = budgets
                    }
                    this.$store.commit('setSelectedPatient', budget.user);
                    this.searchBudgetBtn = false
                } else {
                    this.searchBudgetError = 'Orçamento não encontrado'
                }
                this.searchBudgetLoading = false
            },
            adicionarFormaDePagamento() {
                this.valuesPayments.push('');
                this.payments.push('');
                this.payment.paymentForm.push('');
                this.payment.value.push('');
                this.payment.parcel.push('1')
            },
            apagarFormaDePagamento(index) {
                this.payments.splice(index, 1);
                this.valuesPayments.splice(index, 1);
                this.payment.paymentForm.splice(index, 1);
                this.payment.value.splice(index, 1);
                this.payment.parcel.splice(index, 1);

            },
            removeItem(item) {
                this.$store.commit('removeShoppingCartItem', item)
            },
            imprimir() {
                this.saveBudget(this.generateBudget());
                this.budgetToPrint = this.selectedBudget;
                this.budgetToPrintDialog = true
            },

            generateBudget() {
                let id = moment().valueOf();
                return {
                    id: id,
                    specialties: this.consultas.length > 0 ? this.consultas : undefined,
                    exams: this.exames.length > 0 ? this.exames : undefined,
                    subTotal: this.subTotal,
                    perClinic: this.clinic,
                    discount: this.moneyDiscount,
                    total: this.total,
                    parcel: this.payment.parcel,
                    date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    user: this.$store.getters.selectedPatient,
                    colaborator: this.$store.getters.user,
                    doctor: this.selectedDoctor.name === this.noDoctorKeyWord ? undefined : this.selectedDoctor,
                    payments: this.payment.paymentForm,
                    valuesPayments: this.payment.value,
                    unit: this.selectedUnit
                }
            },

            async saveBudget(budget) {
                this.$store.commit('setSelectedBudget', budget);
            },
            async pay() {
                this.paymentLoading = true;
                let user = this.patient
                if (!user) {
                    this.paymentLoading = false
                    this.alertMessage.model = true
                    this.alertMessage.text = 'Escolha um paciente'
                    return
                }
                if (!this.selectedDoctor) {
                    this.paymentLoading = false
                    this.alertMessage.model = true
                    this.alertMessage.text = 'Escolha um médico que requisitou este orçamento'
                    return
                }
                this.alertMessage.model = false
                await this.saveBudget(this.generateBudget());
                this.selectedBudget.valuesPayments.forEach(value => {value = parseFloat(value)})
                await this.$apollo.mutate({
                    mutation: require('@/graphql/transaction/NewPayIntake.gql'),
                    variables: {
                        value: parseFloat(this.selectedBudget.total),
                        payment_methods: this.selectedBudget.payments,
                        payments: this.selectedBudget.valuesPayments,
                        parcels: this.selectedBudget.parcel,
                        discount: parseFloat(this.selectedBudget.discount) ? parseFloat(this.selectedBudget.discount) : 0,
                        date: this.selectedBudget.date,
                    },

                }).then((data) => {
                        this.selectedBudget.id= data.data.CreateTransaction.id
                    for(let exam in this.selectedBudget.exams){
                        this.$apollo.mutate({
                            mutation: require('@/graphql/transaction/CreateProductTransaction.gql'),
                            variables: {
                                price: this.selectedBudget.exams[exam].price
                            }
                        }).then(dataProduct => {
                            this.$apollo.mutate({
                                mutation: require('@/graphql/transaction/AddRelationsProductTransaction.gql'),
                                variables: {
                                    idBudget: data.data.CreateTransaction.id,
                                    idProduct: this.selectedBudget.exams[exam].id,
                                    idProductTransaction: dataProduct.data.CreateProductTransaction.id
                                }
                            }).then(dataaa => {
                                this.verifyUnpaidConsultations({id:dataProduct.data.CreateProductTransaction.id, product:this.selectedBudget.exams[exam]})
                                this.selectedBudget.exams[exam].id = dataProduct.data.CreateProductTransaction.id
                            }).catch(error => (error))
                        }).catch(error => (error))
                    }
                    for(let specialtie in this.selectedBudget.specialties){
                        this.$apollo.mutate({
                            mutation: require('@/graphql/transaction/CreateProductTransaction.gql'),
                            variables: {
                                price: this.selectedBudget.specialties[specialtie].price
                            }
                        }).then(dataProduct => {
                            this.$apollo.mutate({
                                mutation: require('@/graphql/transaction/AddRelationsProductTransaction.gql'),
                                variables: {
                                    idBudget: data.data.CreateTransaction.id,
                                    idProduct: this.selectedBudget.specialties[specialtie].id,
                                    idProductTransaction: dataProduct.data.CreateProductTransaction.id
                                }
                            }).then(dataaa => {
                                this.verifyUnpaidConsultations({id:dataProduct.data.CreateProductTransaction.id, product:this.selectedBudget.specialties[specialtie]})
                                this.selectedBudget.specialties[specialtie].id = dataProduct.data.CreateProductTransaction.id
                            }).catch(error => (error))
                        }).catch(error => (error))
                    }
                    if(this.selectedBudget.doctor) {
                        this.AddRelationsIntakeDoctor(data)
                    }
                    else{
                        this.AddRelationsIntake(data)
                    }
                }).catch((error) => {
                    console.error('nao criando transaction: ',error)
                })
            },
            async AddRelationsIntakeDoctor(data){
                this.$apollo.mutate({
                    mutation: require('@/graphql/transaction/AddRelationsNewIntake.gql'),
                    variables: {
                        idBudget: data.data.CreateTransaction.id,
                        idColaborator: this.selectedBudget.colaborator.neo4j_id,
                        idPatient: this.selectedBudget.user.id,
                        idDoctor: this.selectedBudget.doctor.neo4j_id
                    },

                })
                    .then((dataa) => {
                        this.CreateOuttakeClinic(data)
                    }).catch((error) => {
                    console.error('ligações da transaction nao funcionando: ', error)
                })
            },
            async AddRelationsIntake(data){
                await this.$apollo.mutate({
                    mutation: require('@/graphql/transaction/AddRelationsNewIntake.gql'),
                    // Parameters
                    variables: {
                        idBudget: data.data.CreateTransaction.id,
                        idColaborator: this.selectedBudget.colaborator.neo4j_id,
                        idPatient: this.selectedBudget.user.id,
                    },

                })
                    .then((dataa) => {
                        this.CreateOuttakeClinic(data)
                    }).catch((error) => {
                    console.error('ligações da transaction nao funcionando: ', error)
                })
            },
            async CreateRelationsOuttakeClinic_ProductTransaction(outtake, product, idOuttake){
                await this.$apollo.mutate({
                    mutation: require('@/graphql/transaction/AddRelationsOuttakeClinicWithProductTransaction.gql'),
                    variables: {
                        idOuttake: idOuttake,
                        idProductTransaction: product.id,
                    }
                })
                await this.receipt(this.selectedBudget)
            },
            async CreateRelationsOuttakeClinic(outtake, idOuttake){
                await this.$apollo.mutate({
                    mutation: require('@/graphql/transaction/AddRelationsNewOuttakeClinic.gql'),
                    variables: {
                        idOuttake: idOuttake,
                        idClinic: outtake.clinic.id
                    }
                })
            },
            async CreateOuttakeClinic(data){
                for(let i in this.selectedBudget.perClinic){
                    this.$apollo.mutate({
                        mutation: require('@/graphql/transaction/NewPayOuttakeClinic.gql'),
                        variables: {
                            variables: {
                                date: this.selectedBudget.date,
                            }
                        },
                    }).then((NewPayOuttakeClinic) => {
                        this.CreateRelationsOuttakeClinic(this.selectedBudget.perClinic[i][0], NewPayOuttakeClinic.data.CreateTransaction.id)
                        for(let j in this.selectedBudget.perClinic[i]){
                            this.CreateRelationsOuttakeClinic_ProductTransaction(this.selectedBudget.perClinic[i][0], this.selectedBudget.perClinic[i][j], NewPayOuttakeClinic.data.CreateTransaction.id)
                        }
                    }).catch((error) => {
                        console.error(error)
                    })
                }

            },
            async receipt(intake) {
                this.selectedIntake = this.selectedBudget
                this.receiptDialog = true
            },

            clearCart() {
                this.$store.commit('clearShoppingCartItens');
                this.$store.commit('setSelectedBudget', undefined);
            },
            SelectNewPatient() {
                this.$store.commit('clearShoppingCartItens');
                this.$store.commit('setSelectedBudget', undefined);
                let user = undefined;
                this.$store.commit('setSelectedPatient', user)
            },

            verifyUnpaidConsultations(productTransaction){
                let unpaidConsultation = this.patient.consultations.find((consultation) => consultation.product.id === productTransaction.product.id && consultation.status === "Aguardando pagamento")
                if(unpaidConsultation){
                    this.saveRelationProductTransaction(unpaidConsultation.id, productTransaction.id)
                }
            },

            saveRelationProductTransaction(idConsultation, idProductTransaction){
                this.$apollo.mutate({
                    mutation: require('@/graphql/transaction/AddRelationProductTransactionConsultation.gql'),
                    variables:{
                        idConsultation: idConsultation,
                        idProductTransaction: idProductTransaction
                    },
                })
            },
        }
    }

</script>
