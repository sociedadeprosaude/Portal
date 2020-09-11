<template>
  <v-card>
    <v-card-title class="headline grey lighten-2" primary-title>
      <span>Cadastro de Especialidade</span>
      <v-spacer />
      <v-btn text rounded @click="close()">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout row wrap class="align-center justify-center">
          <v-flex xs12>
            <v-text-field
              repend-icon="school"
              v-model="specialty"
              label="Especialidade"
              outlined
              rounded
              filled
            />
          </v-flex>

          <v-flex xs12>
            <v-currency-field
              outlined
              rounded
              filled
              clearable
              prefix="R$"
              v-model="price"
              label="Preço de Venda"
            />
          </v-flex>

          <v-flex xs12>
            <v-select
              label="É Necessário Agendar Exame(s) ?"
              v-model="exam"
              :items="typeOptions"
              outlined
              rounded
              filled
              chips
              color="pink"
              clearable
              hide-details
            >
              <template v-slot:selection="data">
                <v-chip
                  :key="JSON.stringify(data.item)"
                  :input-value="data.selected"
                  :disabled="data.disabled"
                  class="v-chip--select-multi"
                  @click.stop="data.parent.selectedIndex = data.index"
                  @input="data.parent.selectItem(data.item)"
                  text-color="white"
                  color="primary"
                  dense
                >{{ data.item.text }}</v-chip>
              </template>
            </v-select>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <ApolloMutation
          :mutation="require('@/graphql/products/CreateProducts.gql')"
          :variables="{specialty,type,price,schedulable,}"
          @done="close"
      >
        <template v-slot="{ mutate, loading, error }">
          <v-btn
              color="primary"
              :disabled="loading"
              @click.native="createProduct(mutate)"
          >Adicionar</v-btn>
          <p v-if="error">Ocorreu um erro: {{ error }}</p>
        </template>
      </ApolloMutation>
    </v-card-actions>
  </v-card>
</template>
<script>
import SubmitButton from "../SubmitButton";
export default {
  components: { SubmitButton },

  data: () => ({
    loading: false,
    success: false,
    specialty: undefined,
    price:0,
    type:"SPECIALTY",
    schedulable: false,
    exam: undefined,
    typeOptions: [
      { text: "sim", value: true },
      { text: "não", value: false }
    ]
  }),

  computed: {
    specialties() {
      return this.$store.getters.specialties;
    }
  },

  methods: {
    close() {
      this.$emit("close");
      this.specialty = undefined
      this.price = undefined
    },
    createProduct(mutate) {
      this.specialty = this.specialty.toUpperCase()
      setTimeout(() => {
        mutate();
      }, 0);
    },
    async registerSpecialty() {
      this.loading = true;
      await this.$store.dispatch("addSpecialty", {
        name: this.specialty.toUpperCase(),
        price:Number(this.price),
        status: "DEACTIVATE",
        exam: this.exam
      });
      await this.$store.dispatch("getSpecialties");
      this.success = true;
      this.loading = false;
      setTimeout(() => {
        this.specialty = undefined;
        this.exam = undefined;
        this.close();
      }, 1000);
    }
  }
};
</script>