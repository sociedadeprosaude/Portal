<template>
  <v-container>
    <v-row justify="start">
      <v-btn @click="back" color="error" rounded class="mb-2 elevation-6">
        <v-icon left>arrow_back</v-icon>VOLTAR
      </v-btn>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <v-row justify="center">
            <v-col xs="5">
              <v-select label="categoria" v-model="categoria" :items="categories"></v-select>
            </v-col>
            <v-col xs="2">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="mx-2"
                    fab
                    dark
                    small
                    color="blue"
                    @click="() => {verificador = !verificador}"
                  >
                    <v-icon color="primary" v-on="on">add</v-icon>
                  </v-btn>
                </template>
                <span>Adicionar nova Categoria</span>
              </v-tooltip>
            </v-col>

            <v-col xs="4">
              <v-currency-field
                label="valor"
                v-model="valor"
                :rules="[rules.required||rules.valor]"
                required
              ></v-currency-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col xs="12">
              <v-text-field label="Descrição" v-model="descricao"></v-text-field>
            </v-col>
            <v-col xs="12">
              <v-select
                label="Unidade"
                v-model="unit"
                :items="units"
                item-text="name"
                return-object
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col rigth>
              <submit-button text="Enviar" :loading="loading" :success="success" @click="enviar()"></submit-button>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="verificador">
      <v-card>
        Adicionar Nova Categoria
        <v-text-field v-model="categoriaNova"></v-text-field>
        <submit-button
          text="Adicionar"
          :loading="loading"
          :success="success"
          @click="adicionarCategoria()"
        ></submit-button>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import SubmitButton from "../../components/SubmitButton";

export default {
  components: { SubmitButton },
  data: () => ({
    descricao: "",
    categoria: "",
    unit: null,
    other: "OUTRO",
    valor: 0,
    verificador: false,
    categoriaNova: "",
    aviso: false,
    now: moment().valueOf(),
    loading: false,
    success: false,
    data: moment().format("YYYY-MM-DD HH:mm:ss"),
    rules: {
      valor: value => {
        const pattern = /(^(\d)+(,(\d)+)*$|^$)/;
        return pattern.test(value) || 'Digite apenas números exemplo:" 2.5 "';
      }
    }
  }),
  methods: {
    enviar() {
      this.loading = true;
      this.success = true;
      // Deletando esses dois campos se tiverem pra não salvar dados desnecessários no banco
      delete this.unit.exams;
      delete this.unit.specialties;
      this.$store.dispatch("AddSaida", {
        description: this.descricao,
        category: this.categoria,
        value: parseFloat(this.valor),
        id: moment().valueOf(),
        date: this.data,
        paid: this.data,
        colaborator: this.user,
        payment_method: "Dinheiro",
        unit: this.unit.name != this.other ? this.unit : null
      });
      setTimeout(() => {
        this.success = false;
      }, 1000);

      this.loading = false;
      this.descricao = "";
      this.valor = 0;
      this.categoria = "";
    },
    adicionarCategoria() {
      this.$store.dispatch("AddCategorie", { categoria: this.categoriaNova });
      this.success = true;
      this.loading = false;
      this.$store.dispatch("LoadCategories");
      setTimeout(() => {
        this.categoriaNova = "";
        this.verificador = false;
      }, 1000);
      this.verificador = !this.verificador;
      this.categoriaNova = "";
    },
    back() {
      this.$router.push("/caixa");
    }
  },
  mounted() {
    this.$store.dispatch("LoadCategories");
  },
  watch: {
    otherName: function(val) {
      this.unit.name = val;
    }
  },
  computed: {
    categories() {
      return this.$store.getters.outtakesCategories;
    },
    user() {
      return this.$store.getters.user;
    },
    units() {
      this.unit = this.selectedUnit;
      return [...this.$store.getters.units, { name: this.other }];
    },
    unitsName() {
      return [...this.units.map(unit => unit.name), "OUTRO"];
    },
    selectedUnit() {
      return this.$store.getters.selectedUnit;
    }
  }
};
</script>

<style>
</style>
