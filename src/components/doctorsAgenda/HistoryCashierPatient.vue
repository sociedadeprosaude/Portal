<template>
  <v-container fluid class="ma-0 pa-0 hidden-print-only">
    <v-layout row wrap>
      <v-card flat>
        <div v-show="option === 'intakes'">
          <v-flex xs12 v-for="intake in intakes" :key="intake.id">
            <v-card :class="['my-2 pl-2 py-2', diffByNow(intake) < 30000 ? 'green' : '']">
              <v-layout row wrap>
                <v-flex xs10>
                  <v-card flat @click="receipt(intake)">
                    <v-layout row wrap>
                      <v-flex xs10 class="text-left ripple">
                        <span class="my-sub-headline">{{ intake._id }}</span>
                      </v-flex>
                      <v-flex xs2>
                        <v-progress-circular indeterminate v-if="loading"
                                             class="primary--text"/>
                      </v-flex>
                      <v-flex xs12 class="text-left">
                        <p class="my-0">{{ intake.date.formatted | dateFilter }}</p>
                        <p>R$ {{ intake.value }}</p>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </v-flex>
                <v-flex xs2 v-if="!loading && !intake.cancelled_by">
                  <v-btn @click="cancelBuy(intake)" text
                         style="min-width: 0; width: 32px; height: 100%">
                    <v-icon class="secondary--text">delete</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs2 v-else>
                  <v-btn disabled text style="min-width: 0; width: 32px; height: 100%">
                    <v-icon class="secondary--text">cancel</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </div>
        <div v-show="option === 'budgets'">
          <v-flex xs12 v-for="budget in budgets" :key="budget.id">
            <v-card flat :class="['my-2 pl-2 py-2', diffByNow(budget) < 30000 ? 'green' : '']">
              <v-layout row wrap>
                <v-card ripple class="my-2 pa-2">
                  <v-layout row wrap>
                    <v-flex xs10>
                      <v-flex xs10 class="text-left ripple">
                        <span class="my-sub-headline">{{ budget._id }}</span>
                      </v-flex>
                      <v-flex xs2>
                        <v-progress-circular indeterminate v-if="loading"
                                             class="primary--text"/>
                      </v-flex>
                      <v-flex xs12 class="text-left">
                        <p class="my-0">{{ budget.date.formatted | dateFilter }}</p>
                        <p>R$ {{ budget.value }}</p>
                      </v-flex>
                      <v-flex xs2>
                        <v-progress-circular x-small indeterminate v-if="loading" class="primary--text"/>
                      </v-flex>
                    </v-flex>
                    <v-flex xs2>
                      <v-layout column>
                        <v-btn @click.stop="shareBudgetLink(budget)" icon>
                          <v-icon color="primary">share</v-icon>
                        </v-btn>
                        <v-btn @click.stop="selectBudget(budget)" icon>
                          <v-icon color="primary">description</v-icon>
                        </v-btn>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-layout>
            </v-card>
          </v-flex>
        </div>
      </v-card>
      <v-dialog v-model="cancelBuyDialog" v-if="selectedIntake" max-width="500px">
        <v-card class="pa-3">
          <v-card-title>
            <h4>Deseja cancelar o recibo {{ selectedIntake.id }}?</h4>
          </v-card-title>
          <v-card-text>
            <v-flex xs12>
              <v-text-field
                  type="password"
                  v-model="managerPassword"
                  outlined
                  placeholder="Senha do gerente"
              />
            </v-flex>
            <span class="red--text" v-if="error">{{ error }}</span>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn
                @click="cancelBuy(selectedIntake)"
                rounded
                class="red white--text"
                v-if="!loading"
            >Cancelar compra
            </v-btn>
            <v-progress-circular v-else class="primary--text" indeterminate/>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
          transition="dialog-bottom-transition"
          fullscreen
          v-model="receiptDialog"
          v-if="selectedIntake"
      >
        <receipt @close="receiptDialog = false" :budget="selectedIntake"/>
      </v-dialog>
    </v-layout>
  </v-container>
</template>
<script>
import constants from "../../utils/constants";
import receipt from "../cashier/Receipt"

let moment = require('moment');

export default {
  props: ['option'],
  components: {receipt},
  data() {
    return {
      loading: false,
      selectedIntake: undefined,
      receiptDialog: false,
      cancelBuyDialog: false,
      managerPassword: "",
      error: undefined,
      idUser: '',
      skipPatients: true,
    };
  },
  methods: {
    async shareBudgetLink(budget) {
      await navigator.clipboard.writeText(`http://medikon.web.app/pagamento?orcamento=${budget.id}`)
      window.alert('Endereço para pagamento copiado')
    },
    async selectBudget(budget) {
      this.loading = true;
      this.$store.commit('clearShoppingCartItens');
      for (let i in budget.products) {
        if (!budget.products[i].clinic[0]) {
          budget.products[i].type = budget.products[i].with_product[0].type
          budget.products[i].name = budget.products[i].with_product[0].name
          budget.products[i].clinic = budget.products[i].clinic
          budget.products[i].id = budget.products[i].with_product[0].id
        } else {
          if (budget.products[i].clinic[0].name.length) {
            budget.products[i].type = budget.products[i].with_product[0].type
            budget.products[i].name = budget.products[i].with_product[0].name
            budget.products[i].clinic = budget.products[i].clinic[0]
            budget.products[i].id = budget.products[i].with_product[0].id
            this.$store.commit('addShoppingCartItem', budget.products[i])
          }
        }
      }
      this.$store.commit('setSelectedBudget', budget)
      this.$store.commit('setDiscount', budget.discount)
      this.$store.commit('setIdBudget', budget._id)
      /* budget = await this.$store.dispatch("getBudget", budget.id.toString());
      this.$store.commit("clearShoppingCartItens");
      this.$store.commit("setSelectedBudget", budget);
      for (let exam in budget.exams) {
          this.$store.commit("addShoppingCartItem", budget.exams[exam]);
      }
      for (let spec in budget.specialties) {
          this.$store.commit("addShoppingCartItem", budget.specialties[spec]);
      } */
      this.loading = false;
      this.$emit('SelectBudget', false)
    },
    diffByNow(product) {
      let now = moment();
      let date = moment(product.date, "YYYY-MM-DD HH:mm:ss");
      return now.valueOf() - date.valueOf();
    },
    async receipt(intake) {
      this.loading = true;
      this.selectedIntake = intake;
      this.receiptDialog = true;
      this.loading = false;
    },
    async cancelBuy(intake) {
      if (!this.cancelBuyDialog) {
        this.selectedIntake = intake;
        this.cancelBuyDialog = true;
        return;
      }
      if (this.managerPassword !== constants.MANAGER_PASSWORD) {
        this.error = "Senha incorreta";
        return;
      } else {
        this.error = undefined;
      }
      this.loading = true;
      intake.user = this.patient;
      await this.$apollo.mutate({
        mutation: require('@/graphql/transaction/IntakeCancel.gql'),
        variables: {
          idColaborator: this.$store.getters.user.id,
          idTransaction: intake.id
        }
      })
      for (let i in intake.products) {
        await this.$apollo.mutate({
          mutation: require('@/graphql/transaction/DeleteProductTransaction.gql'),
          variables: {
            idProductTransaction: intake.products[i].id
          }
        })
        if (intake.products[i].with_charge) {
          await this.$apollo.mutate({
            mutation: require('@/graphql/charge/DeleteCharge.gql'),
            variables: {
              id: intake.products[i].with_charge.id
            }
          })
        }
      }
      this.skipPatients = false
      this.idUser = intake.user.id
      this.$apollo.queries.loadPatient.refresh()
      this.cancelBuyDialog = false;

      // await this.$store.dispatch("cancelIntake", intake);
      /* this.patient.intakes = await this.$store.dispatch(
           "getUserIntakes",
           this.patient
       ); */
      // this.$store.commit("setSelectedPatient", this.patient);
      this.loading = false;
    }
  },


  computed: {
    patient() {
      return this.$store.getters.selectedPatient;
    },
    intakes() {
      let intakes = Object.assign({}, this.patient.intakes)
      return intakes;
    },
    budgets() {
      let budgets = Object.assign({}, this.patient.budgets)
      return budgets;
    }
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
};
</script>
