<template>
  <v-container fluid>
    <v-layout row wrap class="mb-3">
      <v-flex xs12 sm8>
        <img src="@/assets/logo-pro-saude.png" height="100px">
      </v-flex>
      <v-flex xs12 sm4>
        <v-layout row wrap>

          <v-flex xs10>

            <v-menu
              :close-on-content-click="false"
              v-model="dateMenu"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              max-width="290px"
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="computedDateFormatted"
                label="Data"
                persistent-hint
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker locale="pt-br" v-model="selectedDate" no-title @input="selectDate"></v-date-picker>
            </v-menu>
          </v-flex>

          <v-flex xs2>

            <v-menu>
              <v-btn
                slot="activator"
                icon
              >
                <v-icon>more_vert</v-icon>
              </v-btn>

              <v-list>
                <v-list-tile
                  v-for="(item, i) in menuItems"
                  :key="i"
                  @click="handleMenuClick(item)"
                >
                  <v-list-tile-title>{{ item }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-flex>

        </v-layout>
      </v-flex>

    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm5>
        <v-card class="mb-2">
          <v-card-title>
            <h1>
              Nova Entrada
            </h1>
          </v-card-title>
          <v-layout row wrap>
            <v-flex xs4 ma-3>
              <v-combobox
                v-model="intakeCategory"
                :items="intakeCategories"
                label="Categoria"
              ></v-combobox>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs4 ma-3>
              <v-text-field
                label="Valor (R$)"
                v-model="intakeValue"
                type="number"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-flex xs12 ma-3>
            <v-textarea
              label="Descição"
              v-model="intakeDescription"
              height="50px"
            ></v-textarea>
          </v-flex>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat class="primary_dark--text" @click.native="addIntake">
              Adicionar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs12 sm5>

        <v-card class="mb-2">
          <v-card-title>
            <h1>
              Nova Saída
            </h1>
          </v-card-title>
          <v-layout row wrap>
            <v-flex xs4 ma-3>
              <v-combobox
                v-model="expenseCategory"
                :items="expenseCategories"
                label="Categoria"
              ></v-combobox>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs4 ma-3>
              <v-text-field
                label="Valor (R$)"
                v-model="expenseValue"
                type="number"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-flex xs12 ma-3>
            <v-textarea
              label="Descição"
              v-model="expenseDescription"
              height="50px"
            ></v-textarea>
          </v-flex>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat class="primary_dark--text" @click.native="addExpense">
              Adicionar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>


    <h2 class="mt-4">
      Entradas
    </h2>
    <v-data-table
      :headers="headers"
      :items="intakes"
      hide-actions
      no-data-text="Nenhuma entrada hoje"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <tr @click="handleItemClick(props.item, 'description')">
          <td>{{ props.item.category }}</td>
          <td>{{ props.item.value }}</td>
          <td class="text-xs-right">
            <v-btn flat class="primary_dark--text" @click.native="handleItemClick(props.item, 'deleteIntake')">
              <v-icon>delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-layout row wrap v-if="intakesSubtotal !== 0">
      <v-flex xs12>
        <v-card>
          <v-divider></v-divider>
          <v-layout row wrap>
            <v-flex xs1 pl-2>
              <v-card-title>Total:</v-card-title>
            </v-flex>
            <v-flex xs3>
              <v-card-title class="font-weight-bold ml-0 pl-0">{{ intakesSubtotal.toFixed(2) }}</v-card-title>
            </v-flex>

            <v-flex xs1 pr-5>
              <v-card-title>Dinheiro:</v-card-title>
            </v-flex>
            <v-flex xs3>
              <v-card-title class="font-weight-bold ml-0 pl-0">{{ moneySubtotal.toFixed(2) }}</v-card-title>
            </v-flex>

            <v-flex xs4>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>


    <h2 class="mt-4">
      Saidas
    </h2>
    <v-data-table
      :headers="headers"
      :items="expenses"
      hide-actions
      no-data-text="Nenhuma despeja hoje"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <tr @click="handleItemClick(props.item, 'description')">
          <td>{{ props.item.category }}</td>
          <td>{{ props.item.value }}</td>
          <td class="text-xs-right">
            <v-btn flat class="primary_dark--text" @click.native="handleItemClick(props.item, 'deleteExpense')">
              <v-icon>delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-layout row wrap v-if="expensesSubtotal !== 0">
      <v-flex xs12>
        <v-card>
          <v-divider></v-divider>
          <v-layout row wrap>
            <v-flex xs4 pl-2>
              <v-card-title>Total</v-card-title>
            </v-flex>
            <v-flex xs4>
              <v-card-title class="font-weight-bold ml-0 pl-0">{{ expensesSubtotal.toFixed(2) }}</v-card-title>
            </v-flex>
            <v-flex xs4>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>

    <h2 class="mt-4">
      Resumo
    </h2>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-layout row wrap>
            <v-flex xs12 sm4>
              <v-layout row wrap>
                <v-card-title>{{rawIntakeName}} (com devoluções):</v-card-title>
                <v-card-title class="font-weight-bold ml-0 pl-0">{{rawIntake}}</v-card-title>
              </v-layout>
            </v-flex>
            <v-flex xs12 sm4>
              <v-layout row wrap>
                <v-card-title>{{liquidCostName}}:</v-card-title>
                <v-card-title class="font-weight-bold ml-0 pl-0">{{liquidCost.value}}</v-card-title>
              </v-layout>
            </v-flex>
            <v-flex xs12 sm4>
              <v-layout row wrap>
                <v-card-title>Saldo:</v-card-title>
                <v-card-title class="font-weight-bold ml-0 pl-0">{{(rawIntake - liquidCost.value).toFixed(2)}}
                </v-card-title>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>


          <v-layout row wrap>
            <v-spacer></v-spacer>
            <v-flex xs12 sm4>
              <v-layout row wrap>
                <v-card-title>Débito:</v-card-title>
                <v-card-title class="font-weight-bold ml-0 pl-0">{{debitIntake}}
                </v-card-title>
              </v-layout>
            </v-flex>
            <v-flex xs12>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-layout row wrap>
              <v-spacer></v-spacer>
              <v-flex xs12 sm4>
                <v-layout row wrap>
                  <v-card-title>Crédito:</v-card-title>
                  <v-card-title class="font-weight-bold ml-0 pl-0">{{creditIntake}}
                  </v-card-title>
                </v-layout>
              </v-flex>
              <v-flex xs12>
              </v-flex>
            </v-layout>
          </v-layout>


            <v-layout row wrap>
              <v-spacer></v-spacer>
              <v-flex xs12 sm4>
                <v-layout row wrap>
                  <v-card-title>Custos Extras:</v-card-title>
                  <v-card-title class="font-weight-bold ml-0 pl-0">{{(parseFloat(expensesSubtotal) -
                    parseFloat(liquidCost.value)).toFixed(2) - paybackExpense}}
                  </v-card-title>
                </v-layout>
              </v-flex>
              <v-flex xs12>
              </v-flex>
            </v-layout>

          <v-layout row wrap>
            <v-spacer></v-spacer>
            <v-flex xs12 sm4>
              <v-layout row wrap>
                <v-card-title>Dinheiro em caixa:</v-card-title>
                <v-card-title class="font-weight-bold ml-0 pl-0">{{(intakesSubtotal - expensesSubtotal - creditIntake - debitIntake).toFixed(2)}}
                </v-card-title>
              </v-layout>
            </v-flex>
          </v-layout>

            <v-layout row wrap>
              <v-spacer></v-spacer>
              <v-flex xs12 sm4>
                <v-layout row wrap>
                  <v-card-title>Saldo Final:</v-card-title>
                  <v-card-title class="font-weight-bold ml-0 pl-0">{{(intakesSubtotal - expensesSubtotal).toFixed(2)}}
                  </v-card-title>
                </v-layout>
              </v-flex>
            </v-layout>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="descriptionDialog"
      width="500"
    >

      <v-card>
        <v-card-title
          class="headline primary_light lighten-2"
          primary-title
        >
          <span>{{ selectedExpense.category }}</span>
          <v-spacer></v-spacer>
          <span>R$ {{ selectedExpense.value }}</span>
        </v-card-title>

        <v-card-text>
          {{ selectedExpense.description === null ? 'Nenhum descrição' : selectedExpense.description}}
        </v-card-text>

        <v-divider></v-divider>

      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import constants from '../../utils/constants'

  export default {
    name: "Home",
    data() {
      return {
        menuItems: [
          'Minha Conta',
          'Sair'
        ],
        expenseCategory: '',
        expenseDescription: '',
        expenseValue: '',
        intakeCategory: '',
        intakeDescription: '',
        intakeValue: '',
        selectedDate: this.$store.getters.currentDate,
        dateMenu: false,
        deletionMode: false,
        descriptionDialog: false,
        selectedExpense: {},
        headers: [
          {
            text: 'Categoria',
            align: 'left',
            value: 'category'
          },
          {text: 'Valor (R$)', value: 'value'},
          {text: '', value: ''}
        ],

      }
    },
    computed: {
      currentDate() {
        return this.$store.getters.currentDate
      },
      intakeCategories() {
        let filtered = this.$store.getters.categories.filter(
          function intakes(category) {
            return category.class === 'intake'
          }
        )
        let names = []
        for (let filter in filtered) {
          names.push(filtered[filter].name)
        }
        return names
      },
      expenseCategories() {
        let filtered = this.$store.getters.categories.filter(
          function intakes(category) {
            return category.class === 'expense'
          }
        )
        let names = []
        for (let filter in filtered) {
          names.push(filtered[filter].name)
        }
        return names
      },
      expenses() {
        return this.$store.getters.expenses
      },
      intakes() {
        return this.$store.getters.intakes
      },
      intakesSubtotal() {
        let intakes = this.$store.getters.intakes
        let total = 0.0
        for (let intake in intakes) {
          if (intakes[intake].category !== constants.DEBIT && intakes[intake].category !== constants.CREDIT) {
            total = total + parseFloat(intakes[intake].value)
          }
        }
        return total
      },
      moneySubtotal() {
        let intakes = this.$store.getters.intakes
        let total = 0.0
        for (let intake in intakes) {
          if (intakes[intake].category !== constants.DEBIT && intakes[intake].category !== constants.CREDIT) {
            total = total + parseFloat(intakes[intake].value)
          } else {
            total = total - parseFloat(intakes[intake].value)
          }
        }
        return total
      },
      expensesSubtotal() {
        let expenses = this.$store.getters.expenses
        let total = 0.0
        for (let expense in expenses) {
          total = total + parseFloat(expenses[expense].value)
        }
        return total
      },
      rawIntake() {
        let intakes = this.$store.getters.intakes
        let filter = intakes.filter(
          function rawIntake(intake) {
            return intake.category === constants.CATEGORY_RAW_INTAKE
          })
        if (filter.length === 0) {
          let response = []
          response[0] = {
            value: 0.0
          }
          return response[0].value - this.paybackExpense
        }
        return filter[0].value - this.paybackExpense
      },
      rawIntakeName() {
        return constants.CATEGORY_RAW_INTAKE
      },
      liquidCost() {
        let expenses = this.$store.getters.expenses
        let filter = expenses.filter(
          function liquidCost(expense) {
            return expense.category === constants.CATEGORY_LIQUID_COST
          })
        if (filter.length === 0) {
          let response = []
          response[0] = {
            value: 0.0
          }
          return response[0]
        }
        return filter[0]
      },
      liquidCostName() {
        return constants.CATEGORY_LIQUID_COST
      },
      computedDateFormatted() {
        return this.formatDate(this.selectedDate)
      },
      creditIntake() {
        let filter = this.$store.getters.intakes.filter(function (intake) {
          return intake.category === constants.CREDIT
        })
        if (filter.length === 0) {
          return 0.00
        }
        return filter[0].value
      },
      debitIntake() {
        let filter = this.$store.getters.intakes.filter(function (intake) {
          return intake.category === constants.DEBIT
        })
        if (filter.length === 0) {
          return 0.00
        }
        return filter[0].value
      },
      paybackExpense() {
        let filter = this.$store.getters.expenses.filter(function (intake) {
          return intake.category === constants.CATEGORY_PAYBACK
        })
        if (filter.length === 0) {
          return 0.00
        }
        return filter[0].value
      }
    },
    methods: {
      deleteExpensive(expense) {
        this.deletionMode = true
        let self = this
        let payload = {
          expense: expense
        }
        this.$store.dispatch('deleteExpense', payload)
          .then(response => {
          })
      },
      addExpense() {
        if (this.expenseCategory.toLocaleLowerCase() === constants.CATEGORY_LIQUID_COST.toLocaleLowerCase() ||
          this.expenseCategory.toLocaleLowerCase() === constants.CATEGORY_LIQUID_COST_VARIATION.toLocaleLowerCase()) {
          console.log(this.expenseCategory.toLocaleLowerCase())
          let expenses = this.expenses
          for (let expense in expenses) {
            if (expenses[expense].category === constants.CATEGORY_LIQUID_COST) {
              this.deleteExpensive(expenses[expense])
            }
          }
          this.expenseCategory = constants.CATEGORY_LIQUID_COST
        }
        if (this.expenseCategory.toLocaleLowerCase() === constants.CATEGORY_PAYBACK.toLocaleLowerCase() ||
          this.expenseCategory.toLocaleLowerCase() === constants.CATEGORY_PAYBACK_VARIATION.toLocaleLowerCase()) {
          let expenses = this.expenses
          for (let expense in expenses) {
            if (expenses[expense].category === constants.CATEGORY_PAYBACK) {
              this.deleteExpensive(expenses[expense])
            }
          }
          this.expenseCategory = constants.CATEGORY_PAYBACK
        }
        let payload = {
          category: this.expenseCategory,
          expense: {
            value: this.expenseValue.replace(',', '.'),
            description: this.expenseDescription,
            created_at: this.selectedDate
          }
        }
        this.$store.dispatch('addExpense', payload)
      },
      addIntake() {
        if (this.intakeCategory.toLocaleLowerCase() === constants.CATEGORY_RAW_INTAKE.toLocaleLowerCase()) {
          let intakes = this.intakes
          for (let intake in intakes) {
            if (intakes[intake].category === constants.CATEGORY_RAW_INTAKE) {
              this.deleteIntake(intakes[intake])
            }
          }
          this.intakeCategory = constants.CATEGORY_RAW_INTAKE
        }
        if (this.intakeCategory.toLocaleLowerCase() === constants.DEBIT.toLocaleLowerCase() ||
          this.intakeCategory.toLocaleLowerCase() === constants.DEBIT_VARIATION.toLocaleLowerCase()) {
          let intakes = this.intakes
          for (let intake in intakes) {
            if (intakes[intake].category === constants.DEBIT) {
              this.deleteIntake(intakes[intake])
            }
          }
          this.intakeCategory = constants.DEBIT
        }
        if (this.intakeCategory.toLocaleLowerCase() === constants.CREDIT.toLocaleLowerCase() ||
          this.intakeCategory.toLocaleLowerCase() === constants.CREDIT_VARIATION.toLocaleLowerCase()) {
          let intakes = this.intakes
          for (let intake in intakes) {
            if (intakes[intake].category === constants.CREDIT) {
              this.deleteIntake(intakes[intake])
            }
          }
          this.intakeCategory = constants.CREDIT
        }
        let payload = {
          category: this.intakeCategory,
          intake: {
            value: this.intakeValue.replace(',', '.'),
            description: this.intakeDescription,
            created_at: this.selectedDate
          }
        }
        this.$store.dispatch('addIntake', payload)
      },
      deleteIntake(intake) {
        this.deletionMode = true
        let self = this
        let payload = {
          intake: intake
        }
        this.$store.dispatch('deleteIntake', payload)
          .then(response => {
          })
      },
      showDescription(expense) {
        if (!this.deletionMode) {
          this.selectedExpense = expense
          this.descriptionDialog = true
        } else {
          this.deletionMode = false
        }
      },
      handleItemClick(expense, property) {
        switch (property) {
          case 'deleteExpense':
            this.deleteExpensive(expense)
            break;
          case 'deleteIntake':
            this.deleteIntake(expense)
            break;
          case 'description':
            this.showDescription(expense)
            break;
        }
      },
      formatDate(date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      selectDate(date) {
        this.dateMenu = false
        this.$store.dispatch('setDate', date)
        this.$store.dispatch('getExpenses', this.currentDate)
        this.$store.dispatch('getIntakes', this.currentDate)
      },
      handleMenuClick(item) {
        switch (item) {
          case this.menuItems[0]:
            this.$router.push('/conta')
            break;
          case this.menuItems[1]:
            this.$store.dispatch('logout')
            break;
        }
      }
    },
    beforeMount() {
      this.$store.dispatch('getCategories')
      this.$store.dispatch('getExpenses', this.currentDate)
      this.$store.dispatch('getIntakes', this.currentDate)
      this.$store.dispatch('setExpensesIntakesListener', true)
      this.$store.dispatch('startExpensesIntakesListener')
    },
    beforeDestroy() {
      this.$store.dispatch('stopExpensesIntakesListener')
    }
  }
</script>

<style scoped>

</style>
