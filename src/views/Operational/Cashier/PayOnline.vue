<template>
  <v-container v-if="!fetching" fluid class="pa-0 ma-0 white">
    <!-- Inicio -->

    <div>
      <v-row align="center" class="block1">
        <v-col cols="12" class="text-center white--text">
          <h1>Selecione uma opção</h1>
        </v-col>
      </v-row>
    </div>
    <div>
      <v-card>
        <v-card-text class="text-center">
          <v-row>
            <v-col cols="12" sm="6">
              <v-btn
                @click="change(0)"
                width="60%"
                outlined
                :class="[option == 0 ? 'teal accent-2':'',  'light-blue--text text--darken-4']"
              >
                <b>Cartão de crédito</b>
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn
                @click="change(1)"
                width="60%"
                outlined
                :class="[option == 1 ? 'teal accent-2':'',  'light-blue--text text--darken-4']"
              >
                <b>Boleto</b>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <div class="block2">
      <v-container class="up text-center blue--text text--darken-4">
        <v-card class="my-4">
          <v-card-text class="pa-4">
            <v-row class="text-left">
              <v-col align-self="center" cols="1" class="hidden-xs-only">
                <v-icon v-if="option == 0" size="48" class="blue--text">mdi-credit-card</v-icon>
                <v-icon v-if="option == 1" size="48" class="blue--text">mdi-receipt</v-icon>
              </v-col>
              <v-col cols="12" sm="8">
                <v-row class="blue--text text--darken-4">
                  <v-icon
                    v-if="option == 0"
                    size="48"
                    class="blue--text d-flex d-sm-none"
                  >mdi-credit-card</v-icon>
                  <v-icon
                    v-if="option == 1"
                    size="48"
                    class="blue--text d-flex d-sm-none"
                  >mdi-receipt</v-icon>

                  <h3>
                    Pagamento
                    <div v-if="budget.specialties != null">
                      {{budget.specialties[0].name}}
                      <span
                        class="blue--text text--darken-4 font-weight-bold"
                        v-if="budget.specialties.length > 1"
                      >e outros</span>
                    </div>
                    <div v-else>
                      {{budget.exams[0].name}}
                      <span
                        class="blue--text text--darken-4 font-weight-bold"
                        v-if="budget.exams.length > 1"
                      >e outros</span>
                    </div>
                  </h3>
                </v-row>

                <v-row
                  v-if="budget"
                  class="mt-4 indigo--text text--darken-2 font-weight-bold"
                >{{consultationDate(budget.date)}}</v-row>
                <v-row
                  v-if="budget.form"
                  class="indigo--text text--darken-2 font-weight-bold"
                >{{budget.form.consultation.clinic.address.street}}</v-row>
                <v-row
                  v-if="budget.form"
                  class="indigo--text text--darken-2 font-weight-bold"
                >Consulta com: {{budget.form.consultation.doctor.name}}</v-row>
              </v-col>
              <v-spacer class="hidden-xs-only"></v-spacer>
              <v-col align-self="end" class="text-right">
                <v-row
                  align="end"
                  justify="end"
                  class="indigo--text text--darken-2 font-weight-bold pa-0 mr-2"
                >Valor R$ {{budget.total}}</v-row>
              </v-col>
            </v-row>
            <v-row></v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </div>

    <v-container v-if="option == 0">
      <v-row justify="center" align="center">
        <h2 class="blue--text text--darken-2 font-weight-bold">Preencha os dados</h2>
      </v-row>
      <v-divider class="mt-4"></v-divider>

      <v-form ref="formRegister" lazy-validation>
        <v-row>
          <v-col cols="12" sm="6">
            <div class="indigo--text text--darken-2 font-weight-bold">Número do cartão</div>
            <v-text-field
              v-model="card"
              label="Digite o número do cartão"
              background-color="white"
              required
              outlined
              solo
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <div class="indigo--text text--darken-2 font-weight-bold">Validade</div>
            <v-text-field
              v-model="date"
              label="Mês/ano"
              background-color="white"
              required
              solo
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <div class="indigo--text text--darken-2 font-weight-bold">CVV</div>
            <v-text-field
              v-model="cvv"
              label="Digite o código"
              solo
              background-color="white"
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <div class="indigo--text text--darken-2 font-weight-bold">CPF do dono do cartão</div>
            <v-text-field v-model="cardCpf" label="CPF" solo background-color="white" outlined></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <div class="indigo--text text--darken-2 font-weight-bold">Telefone do dono do cartão</div>
            <v-text-field
              v-model="cardPhone"
              label="telefone"
              solo
              background-color="white"
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <div class="indigo--text text--darken-2 font-weight-bold">Nome impresso no cartão</div>
            <v-text-field
              v-model="cardName"
              label="Nome impresso no cartão"
              solo
              background-color="white"
              required
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="9">
            <div class="indigo--text text--darken-2 font-weight-bold">Parcelar em</div>
            <v-select
              :items="parcels"
              v-model="parcel"
              background-color="white"
              label="Parcelar em"
              outlined
            ></v-select>
          </v-col>
          <v-col
            cols="3"
            align-self="center"
            class="text-right indigo--text text--darken-2 font-weight-bold"
          >
            Total:
            <span v-if="parcel==1">R$ {{price}}</span>
            <span v-else>{{parcel}}x R${{parcelsPrice}}</span>
          </v-col>

          <v-col class="text-center">
            <v-row justify="center">
              <v-col cols="12">
                <v-btn
                  :loading="loading"
                  :disabled="!pagSeguroLoaded || !parcelLoaded"
                  rounded
                  width="250px"
                  class="teal accent-2 light-blue--text text--darken-4"
                  @click="pay()"
                >Confirmar pagamento</v-btn>
              </v-col>
              <v-col cols="12">
                <v-btn rounded outlined width="250px" color="blue" @click="cb()">Voltar</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-container>

    <v-container v-else>
      <v-row align="center" justify="center">
        <v-btn
          :loading="loading"
          :disabled="!pagSeguroLoaded"
          rounded
          width="250px"
          class="teal accent-2 light-blue--text text--darken-4"
          @click="createBill()"
        >Gerar boleto</v-btn>
      </v-row>

      <v-row class="mt-4" align="center" justify="center">
        <v-btn rounded outlined width="250px" color="blue" @click="cb()">Voltar {{parcelsPrice}}</v-btn>
      </v-row>
    </v-container>
  </v-container>
  <v-container v-else>
    <v-overlay>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import moment from "moment";
export default {
  name: "PayOnline",

  data() {
    return {
      loading: false,
      fetching: true,
      budget: undefined,
      option: 0,
      card: "4111111111111111",
      date: "12/2026",
      cvv: "013",
      brand: "visa",
      cardName: "Andre Luiz", //tem que ter dois no nome, se for so um da erro
      cardCpf: "22111944785",
      cardPhone: "",
      parcel: 1,
      parcels: [1, 2, 3, 4, 5],
      parcelsPrice: null,
      parcelLoaded: true
    };
  },
  async mounted() {
    //await this.$store.dispatch("setSessionId");

    this.cardPhone = this.user != null ? this.user.telephones[0] : "";

    const id = this.$route.params.id;
    this.budget = await this.$store.dispatch("getBudget", id);
    console.log(this.budget);
    this.fetching = false;
  },
  methods: {
    // changeParcel() {
    //   this.$store.dispatch("changeParcelBudget", {
    //     id: this.budget.id,
    //     parcel: [this.parcel],
    //     payments: ["Credito"],
    //     valuesPayments: [Number(this.price)]
    //   });
    // },
    async change(option) {
      this.option = option;
      await this.$store.dispatch("setSessionId");
    },
    consultationDate(dateRaw) {
      const date = moment(dateRaw);
      return date.format("DD/MM/YYYY") + " ás " + date.format("hh:mm");
    },
    async createCardToken() {
      const cardToken = await this.$store.dispatch("createCardToken", {
        cardNumber: this.card,
        brand: this.brand,
        cvv: this.cvv,
        expirationMonth: this.date.split("/")[0],
        expirationYear: this.date.split("/")[1]
      });
      return cardToken.card.token;
    },
    async pay() {
      const cardToken = await this.createCardToken();

      const phone = this.cardPhone
        .replace(/[^\w\s]/gi, "") //Removendo () e -
        .substring(2); //tirando o ddd 92
      var obj = {
        creditCardHolderName: this.cardName,
        creditCardHolderCPF: this.cardCpf,
        creditCardHolderAreaCode: "92",
        creditCardHolderPhone: phone,
        creditCardToken: cardToken, //tokenCartao

        senderName: this.user.name, //nome do comprador
        senderCPF: "02446454267", //+this.form.user.cpf, //cpf do comprador, tem que ser valido
        senderAreaCode: "11",
        senderPhone: phone, //fone do comprador
        senderEmail: "comprador@sandbox.pagseguro.com.br",
        senderHash: this.senderHash, //hash

        itemId1: "0001",
        itemDescription1: "pagamento credito ProSaude",
        itemAmount1: this.price, //Preco
        itemQuantity1: "1",
        installmentQuantity: this.parcel,
        installmentValue: this.parcel == 1 ? this.price : this.parcelsPrice,

        paymentMode: "default",
        paymentMethod: "creditCard",
        receiverEmail: "andrebluee96@gmail.com", //email cadastrado no sandbox/production
        currency: "BRL",

        notificationURL:
          "https://us-central1-prosaudedev.cloudfunctions.net/requests-pagSeguroCreditCallback",
        reference: "REF1234",
        shippingAddressStreet: "Manaus",
        shippingAddressNumber: "123",
        shippingAddressComplement: "Manaus",
        shippingAddressDistrict: "Manaus",
        shippingAddressPostalCode: "01452002",
        shippingAddressCity: "Manaus",
        shippingAddressState: "AM",
        shippingAddressCountry: "BRA",

        billingAddressStreet: "Manaus",
        billingAddressNumber: "123",
        billingAddressComplement: "Manaus",
        billingAddressDistrict: "Manaus",
        billingAddressPostalCode: "01452002",
        billingAddressCity: "Manaus",
        billingAddressState: "AM",
        billingAddressCountry: "BRA"
      };
      this.loading = true;
      this.$store
        .dispatch("checkoutCard", obj)
        .then(res => {
          console.log(res.transaction);
          this.$store.dispatch("addDataBudget", {
            id: this.budget.id,
            pagSeguroCode: res.transaction.code[0],
            parcel: [`${this.parcel}`],
            payments: ["Credito"],
            valuesPayments: [Number(this.price)],
            cpf: this.budget.user.cpf
          });
        })
        .catch(err => {
          console.log("erro no cartao");
          console.log(err);
        })
        .finally(() => (this.loading = false));
    },
    async createBill() {
      const phone = this.cardPhone
        .replace(/[^\w\s]/gi, "") //Removendo () e -
        .substring(2); //tirando o ddd 92
      var obj = {
        paymentMethod: "boleto",
        paymentMode: "default",
        currency: "BRL",

        itemId1: "0001",
        itemDescription1: "Consultas e exames proSaude", //descricao
        itemAmount1: this.price, //Preco
        itemQuantity1: "1",
        notificationURL:
          "https://us-central1-prosaudedev.cloudfunctions.net/requests-pagSeguroBillCallback",

        senderName: this.user.name, //nome do comprador
        senderCPF: "02446454267", //+this.form.user.cpf, //cpf do comprador, tem que ser valido
        senderAreaCode: "92",
        senderPhone: phone, //fone do comprador
        senderEmail: "comprador@sandbox.pagseguro.com.br",
        senderHash: this.senderHash, //hash

        reference: "REF1234",
        shippingAddressStreet: "Manaus",
        shippingAddressNumber: "123",
        shippingAddressComplement: "Manaus",
        shippingAddressDistrict: "Manaus",
        shippingAddressPostalCode: "01452002",
        shippingAddressCity: "Manaus",
        shippingAddressState: "AM",
        shippingAddressCountry: "BRA"
      };
      this.loading = true;
      this.$store
        .dispatch("checkoutBill", obj)
        .then(res => {
          console.log("boleto criado");
          console.log(res);
          console.log(res.transaction.paymentLink[0]);
          this.$store.dispatch("addDataBudget", {
            id: this.budget.id,
            pagSeguroCode: res.transaction.code[0],
            parcel: [`${this.parcel}`],
            payments: ["Boleto"],
            valuesPayments: [Number(this.price)],
            cpf: this.budget.user.cpf
          });
        })
        .catch(err => {
          console.log("erro no boleto");
          console.log(err);
        })
        .finally(() => (this.loading = false));
    }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    senderHash() {
      return this.$store.getters.senderHash;
    },
    pagSeguroLoaded() {
      return this.$store.getters.pagSeguroLoaded;
    },
    price() {
      return (Math.round(this.budget.total * 100) / 100).toFixed(2);
    }
  },
  watch: {
    pagSeguroLoaded(val) {
      if (val)
        PagSeguroDirectPayment.getInstallments({
          amount: Number(this.price),
          brand: "visa",
          maxInstallmentNoInterest: 5,
          success: function(response) {
            const parcelas = response.installments;
          },
          error: function(response) {
            // callback para chamadas que falharam.
          },
          complete: function(response) {}
        });
    },
    parcel(val) {
      if (this.pagSeguroLoaded) {
        this.parcelLoaded = false;
        var self = this;
        PagSeguroDirectPayment.getInstallments({
          amount: Number(this.price),
          brand: "visa",
          maxInstallmentNoInterest: 5,
          success: function(response) {
            console.log(response);
            const installmentAmount =
              response.installments.visa[val - 1].installmentAmount;
            self.parcelsPrice = "" + installmentAmount;
          },
          error: function(response) {
            // callback para chamadas que falharam.
          },
          complete: function(response) {
            self.parcelLoaded = true;
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.block1 {
  background-color: #055df9;
  height: 200px;
}

.block2 {
  margin-top: 40px;
}

.on-hover {
  opacity: 0.6;
  cursor: pointer;
}

.v-btn {
  text-transform: none !important;
}

.up {
  margin-top: -60px;
}
</style>