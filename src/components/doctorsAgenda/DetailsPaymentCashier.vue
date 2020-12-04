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
        <v-flex sm12 xs12 v-if="payment.paymentForm.length === 1 && this.paymentValues">
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
        <v-layout row wrap v-if="payment.paymentForm.length > 1">
          <v-flex xs12>
            <v-divider color="black"/>
          </v-flex>
          <v-flex v-for="(x , index) in payments" :key="index">
            <v-flex xs12 v-if="payment.paymentForm[index] === 'Crédito'">
              <span>Crédito: {{
                  payment.parcel[index]
                }}x de R$ {{ (payment.value[index] / payment.parcel[index]).toFixed(2) }}</span>
            </v-flex>
            <v-flex xs12 v-if="payment.paymentForm[index] === 'Débito'">
              <span>Débito: R$ {{ (payment.value[index]) }}</span>
            </v-flex>
            <v-flex xs12 v-if="payment.paymentForm[index] === 'Dinheiro'">
              <span>Dinheiro: R$ {{ (payment.value[index]) }}</span>
            </v-flex>
          </v-flex>
        </v-layout>
        <v-flex xs12>
          <v-divider color="black"/>
        </v-flex>
        <v-layout row wrap>
          <v-flex xs6>
            <span>Subtotal: R$ {{ this.subTotal.toLocaleString('en-us', {minimumFractionDigits: 2}) }}</span>
          </v-flex>
          <v-flex xs6>
            <span>Desconto: R$ {{ this.moneyDiscount.toLocaleString('en-us', {minimumFractionDigits: 2}) }}</span>
          </v-flex>
        </v-layout>

        <v-flex xs12>
          <v-divider/>
        </v-flex>
        <v-flex xs12 class="my-2">
          <h6 class="title font-weight-bold primary--text"> Total: R$
            {{ this.total.toLocaleString('en-us', {minimumFractionDigits: 2}) }}</h6>
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
            <v-btn                 :disabled="cartItems.length === 0 || this.paymentValues !== this.total || this.paymentNull === false"
                                   outlined :loading="loadingImp"
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
              >{{ alertMessage.text }}
              </v-alert>
            </v-fade-transition>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-dialog v-model="budgetToPrintDialog" v-if="budgetToPrint" persistent>
      <budget-to-print @close="CloseBudgetToPrint()" :budget="budgetToPrint"/>
    </v-dialog>
    <v-dialog
        transition="dialog-bottom-transition"
        fullscreen
        v-model="receiptDialog"
        v-if="selectedIntake"
        persistent
    >
      <receipt @close="CloseReceipt()" :budget="selectedIntake"/>
    </v-dialog>
  </v-container>
</template>
<script>


import SubmitButton from "../SubmitButton";
import BudgetToPrint from "../../components/cashier/BudgetToPrint";
import Receipt from "../cashier/Receipt";
import gql from 'graphql-tag'
import MutationBuilder from "../../classes/MutationBuilder"
import {uuid} from 'vue-uuid'

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
      loadingImp:false,
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
      payment: {paymentForm: ['Dinheiro'], value: ['0'], parcel: ['1']},
      idUser: '',
      data: moment().format("YYYY-MM-DD HH:mm:ss"),
      parcelas: '1',
      skipPatients: true,
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
    clinic() {
      return this.$store.getters.getShoppingCartItemsByCategory.clinics
    },
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
      return this.percentageDiscount
    },
    idBudget(){
      return this.$store.getters.getIdBudget
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
      if(this.moneyDiscount.length === 0){
        return (parseFloat(this.subTotal).toFixed(2))
      }
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
  methods: {
    CloseReceipt() {
      this.$store.commit('setSelectedBudget', undefined);
      this.$store.commit('clearShoppingCartItens');
      this.card = false;
      this.paymentLoading = false
      this.paymentSuccess = true
      this.clearCart()
      this.receiptDialog = false
    },
    CloseBudgetToPrint() {
      this.budgetToPrintDialog = false
      this.skipPatients = false
      this.$apollo.queries.loadPatient.refresh()

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
    async imprimir() {
      this.loadingImp= true
      let user = this.patient
      this.idUser = user.id
      if (!user) {
        this.loadingImp = false
        this.alertMessage.model = true
        this.alertMessage.text = 'Escolha um paciente'
        return
      }
      if(this.idBudget !== undefined){
        this.saveBudget(this.generateBudget());
        this.selectedBudget._id = this.idBudget
        this.budgetToPrint = this.selectedBudget;
        this.$store.commit('setIdBudget',undefined)
      }
      else{
        this.saveBudget(this.generateBudget());
        this.budgetToPrint = this.selectedBudget;
      let budgetId = uuid.v4()
      let mutationBuilder = new MutationBuilder()
        mutationBuilder.addMutation({
          mutation: require('@/graphql/budget/CreateBudget.gql'),
          variables:{
            id: budgetId,
            value: parseFloat(this.selectedBudget.total),
            payment_methods:[this.selectedBudget.payments.map(p => `"${p}"`)],
            payments:[this.selectedBudget.valuesPayments],
            parcels:[this.selectedBudget.parcel.map(p => `"${p}"`)],
            discount:parseFloat(this.selectedBudget.discount) ? parseFloat(this.selectedBudget.discount) : 0,
            date:
                {
                  formatted: moment(this.selectedBudget.date.formatted).format("YYYY-MM-DDTHH:mm:ss")
                }
          }
        })
      let productsBudgetIds = []
      let products = this.selectedBudget.exams.concat(this.selectedBudget.specialties)
      products = products.filter(p => p)
      for (let product in products) {
        let prodId = uuid.v4()
        products[product].prodId = prodId
        productsBudgetIds.push(prodId)
        mutationBuilder.addMutation({
          mutation: require('@/graphql/productBudget/CreateProductBudget.gql'),
          variables:{
            id: prodId,
            price: products[product].price
          }
        })
        mutationBuilder.addMutation({
          mutation: require('@/graphql/productBudget/addBudgetHasProductBudget.gql'),
          variables:{
            idBudget: budgetId,
            idProductBudget: prodId
          }
        })
        mutationBuilder.addMutation({
          mutation: require('@/graphql/productBudget/addProductHasProductBudget.gql'),
          variables:{
            idProduct: products[product].id,
            idProductBudget: prodId
          }
        })
        products[product].clinic ? mutationBuilder.addMutation({
          mutation: require('@/graphql/productBudget/addClinicHasProductBudget.gql'),
          variables:{
            idClinic: products[product].clinic.id,
            idProductBudget: prodId
          }
        }) : ''
      }
        mutationBuilder.addMutation({
          mutation: require('@/graphql/budget/addUserHasBudget.gql'),
          variables:{
            idUser: this.selectedBudget.user.id,
            idBudget: budgetId
          }
        })
        mutationBuilder.addMutation({
          mutation: require('@/graphql/budget/addUserHasBudget.gql'),
          variables:{
            idUnit: this.selectedBudget.unit.id,
            idBudget: budgetId
          }
        })
        mutationBuilder.addMutation({
          mutation: require('@/graphql/budget/addColaboratorHasBudget.gql'),
          variables:{
            idColaborator: this.selectedBudget.colaborator.id,
            idBudget: budgetId
          }
        })

        let response = await this.$apollo.mutate({
          mutation: mutationBuilder.generateMutationRequest(),
        })
        response= response.data.mutation0._id
        this.budgetToPrint._id = response

        console.log('response :', response)
      }
      this.loadingImp= false
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
        date: {formatted:moment().format('YYYY-MM-DD HH:mm:ss')},
        user: this.$store.getters.selectedPatient,
        colaborator: this.$store.getters.user,
        doctor: this.selectedDoctor && this.selectedDoctor.name === this.noDoctorKeyWord ? undefined : this.selectedDoctor,
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
      this.idUser = user.id
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
      this.selectedBudget.valuesPayments.forEach(value => {
        value = parseFloat(value)
      })

      let transactionId = await this.makeTransaction()


      // await this.createProductTransaction(this.selectedBudget.exams, transaction.data.CreateTransaction)
      if (this.selectedBudget.doctor) {
        this.AddRelationsIntakeDoctor(transactionId)
      } else {
        this.AddRelationsIntake(transactionId)
      }
    },
    async makeTransaction() {
      let transactionId = uuid.v4()
      let mutationBuilder = new MutationBuilder()
      mutationBuilder.addMutation({
        mutation: require('@/graphql/transaction/CreateTransactionPayment.gql'),
        variables:{
          id: transactionId,
          value: parseFloat(this.selectedBudget.total),
          payment_methods:[this.selectedBudget.payments.map(p => `"${p}"`)],
            payments:[this.selectedBudget.valuesPayments],
          parcels:[this.selectedBudget.parcel.map(p => `"${p}"`)],
        discount:parseFloat(this.selectedBudget.discount) ? parseFloat(this.selectedBudget.discount) : 0,
      date: {
        formatted: moment(this.selectedBudget.date.formatted).format("YYYY-MM-DDTHH:mm:ss")}
        }
      })

      let productsTransactionIds = []
      let products = this.selectedBudget.exams.concat(this.selectedBudget.specialties)
      products = products.filter(p => p)
      console.log('products: ', products)
      for (let product in products) {
        console.log('product: ', products[product])
        let prodId = uuid.v4()
        products[product].prodId = prodId
        productsTransactionIds.push(Object.assign({},products[product]))
        mutationBuilder.addMutation({
          mutation: require('@/graphql/productTransaction/CreateProductTransaction.gql'),
          variables:{
            id: prodId,
            price: parseFloat(products[product].price),
          }
        })
        mutationBuilder.addMutation({
          mutation: require('@/graphql/productTransaction/addTransactionsHasProductTransaction.gql'),
          variables:{
            idProductTransaction: prodId,
            idTransaction: transactionId
          }
        })
        mutationBuilder.addMutation({
          mutation: require('@/graphql/productTransaction/addProductHasProductTransaction.gql'),
          variables:{
            idProductTransaction: prodId,
            idProduct: products[product].id
          }
        })
        products[product].clinic ? mutationBuilder.addMutation({
          mutation: require('@/graphql/productTransaction/addClinicHasProductTransaction.gql'),
          variables:{
            idProductTransaction: prodId,
            idClinic: products[product].clinic.id
          }
        }) : ''
        if(products[product].type === "exam"){
          let chargeID = uuid.v4()
          let CostProductClinic = await this.$apollo.mutate({
            mutation: require ('@/graphql/clinics/LoadCostProductClinic.gql'),
            variables:{
              idClinic: products[product].clinic.id,
              idProduct: products[product].id
            }
          })
          mutationBuilder.addMutation({
            mutation: require ('@/graphql/charge/CreateCharge.gql'),
            variables:{
              id: chargeID,
              value: -CostProductClinic.data.CostProductClinic[0].cost,
              date: {formatted:moment().format("YYYY-MM-DDTHH:mm:ss") },
              type: 'Clinic'
            }
          })
          mutationBuilder.addMutation({
            mutation: require('@/graphql/charge/AddRelationsProductTransactionHasCharge.gql'),
            variables:{
              idCharge: chargeID,
              idProductTransaction: prodId
            }
          })
          mutationBuilder.addMutation({
            mutation: require('@/graphql/charge/AddRelationUnitHasCharge.gql'),
            variables:{
              idCharge: chargeID,
              idUnit: this.selectedBudget.unit.id
            }
          })
        }
      }


      if(this.idBudget !== undefined){
        mutationBuilder.addMutation({
          mutation: require('@/graphql/budget/addTransctionHasBudget.gql'),
          variables:{
            idBudget: this.idBudget,
            idTransaction: transactionId
          }
        })
      }
      console.log('mutation: ', mutationBuilder.getMutationString())
      let response = await this.$apollo.mutate({
        mutation: mutationBuilder.generateMutationRequest(),
      })

      this.verifyUnpaidConsultations(productsTransactionIds);

      return transactionId;
    },
    async AddRelationsIntakeDoctor(transactionId) {
      this.$apollo.mutate({
        mutation: require('@/graphql/transaction/AddRelationsNewIntakeDoctor.gql'),
        variables: {
          idBudget: transactionId,
          idColaborator: this.selectedBudget.colaborator.id,
          idPatient: this.selectedBudget.user.id,
          idDoctor: this.selectedBudget.doctor.id,
          idUnit: this.selectedBudget.unit.id
        },

      })
          .then((dataa) => {
            this.receipt(this.selectedBudget)
          }).catch((error) => {
        console.error('Relações da transaction: ', error)
      })
    },
    async AddRelationsIntake(transactionId) {
      await this.$apollo.mutate({
        mutation: require('@/graphql/transaction/AddRelationsNewIntake.gql'),
        // Parameters
        variables: {
          idBudget: transactionId,
          idColaborator: this.selectedBudget.colaborator.id,
          idPatient: this.selectedBudget.user.id,
          idUnit: this.selectedBudget.unit.id
        },

      })
          .then((dataa) => {
            this.receipt(this.selectedBudget)
          }).catch((error) => {
            console.error('ligações da transaction nao funcionando: ', error)
          })
    },
    async receipt(intake) {
      this.selectedIntake = intake
      this.receiptDialog = true
      this.skipPatients = false
    },

    clearCart() {
      this.$store.commit('clearShoppingCartItens');
      this.$store.commit('setSelectedBudget', undefined);
    },
    SelectNewPatient() {
      this.$store.commit('clearShoppingCartItens');
      this.$store.commit('setDiscount', 0);
      this.$store.commit('setIdBudget', undefined)
      this.$store.commit('setSelectedBudget', undefined);
      let user = undefined;
      this.$store.commit('setSelectedPatient', user)
    },

    verifyUnpaidConsultations(productTransactions) {
      for (const key in productTransactions) {
        const productTransaction = productTransactions[key];
        let unpaidConsultation = this.patient.consultations.find((consultation) => consultation.product && consultation.product.id === productTransaction.id && consultation.status === "Aguardando pagamento")
        
        if (unpaidConsultation) {
          this.saveRelationProductTransaction(unpaidConsultation.id, productTransaction.prodId)
        }
      }
    },

    saveRelationProductTransaction(idConsultation, idProductTransaction) {
      this.$apollo.mutate({
        mutation: require('@/graphql/transaction/AddRelationProductTransactionConsultation.gql'),
        variables: {
          idConsultation: idConsultation,
          idProductTransaction: idProductTransaction
        },
      })
    },
  },
  apollo: {
    loadPatient: {
      query: require("@/graphql/patients/GetPatient.gql"),
      variables() {
        return {
          id: this.idUser
        }
      },
      update(data) {
        this.skipPatients = true
        this.$store.commit('setSelectedPatient', data.Patient[0]);
      },
      skip() {
        return this.skipPatients
      }
    },
  }
}

</script>
