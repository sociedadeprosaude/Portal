<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 class="text-left">
        <v-btn @click="back" color="primary" rounded class="mb-2 elevation-6">
          <v-icon>close</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs12>
        <v-card class="round-card">
          <v-card-title class="ml-2 mr-3">
            <p
              v-if="searchSpecialty"
              class="titleSpecialty font-italic font-weight-bold"
            >Especialidades</p>
            <p
              v-if="registerSpecialty"
              class="titleSpecialty font-italic font-weight-bold"
            >CADASTRAR NOVA ESPECIALIDADE</p>
            <v-spacer></v-spacer>
            <v-btn
              v-if="registerSpecialty"
              color="primary"
              small
              dark
              fab
              @click="registerSpecialty= !registerSpecialty, searchSpecialty = !searchSpecialty"
            >
              <v-icon>keyboard_arrow_up</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-flex xs12 v-if="searchSpecialty">
              <v-layout>
                <v-flex xs11>
                  <v-text-field v-model="searchText" label="Especialidade"></v-text-field>
                </v-flex>
                <v-flex xs1 class="text-center">
                  <v-btn
                    v-if="selectedSpecialty"
                    style="justify-content: center"
                    text
                    icon
                    color="blue lighten-2"
                    @click="clearSearch"
                  >
                    <v-icon>close</v-icon>
                  </v-btn>
                  <v-btn
                    v-else
                    style="justify-content: center"
                    text
                    icon
                    color="blue lighten-2"
                    @click="registerSpecialty = !registerSpecialty, searchSpecialty = !searchSpecialty, registed = false"
                  >
                    <v-icon v-if="searchSpecialty">add</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-card v-if="selectedSpecialty" class="round-card">
                <v-card-title>
                  <h4 class="font-italic font-weight-bold primary--text">{{editedSpecialty.name}}</h4>
                </v-card-title>

                <v-card-text>
                  <v-layout wrap>
                    <v-flex xs12 sm12>
                      <v-textarea
                        label=" Regras "
                        v-model="editedSpecialty.rules"
                        outlined
                        prepend-icon="report_problem"
                        class="mt-5"
                      ></v-textarea>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 v-if="registerSpecialty">
              <v-card grid-list-x1 fluid class="mt-4">
                <v-form v-model="validRegister" lazy-validation>
                  <v-card-text>
                    <v-layout wrap>
                      <v-flex xs12 sm12>
                        <v-text-field
                          outlined
                          required
                          label="Nome"
                          v-model="editedSpecialty.name"
                          prepend-icon="description"
                          :rules="rules.campoObrigatorio"
                          class="ml-3 mr-3"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12 sm12>
                        <v-textarea
                          outlined
                          label="Regras"
                          v-model="editedSpecialty.rules"
                          class="ml-3 mr-3"
                          prepend-icon="report_problem"
                        ></v-textarea>
                      </v-flex>
                      <v-flex xs12 sm12>
                        <v-text-field
                          outlined
                          required
                          label="Preço"
                          v-model="editedSpecialty.price"
                          prepend-icon="attach_money"
                          :rules="rules.campoObrigatorio"
                          class="ml-3 mr-3"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <submit-button
                      :loading="loading"
                      :success="success"
                      text="Cadastrar Especialidade"
                      :disabled="!formRegister"
                      @click="validateRegister()"
                      class="ma-3"
                    ></submit-button>
                    <v-btn
                      color="error"
                      fab
                      small
                      v-if="registed"
                      :disabled="loading"
                      @click="alertDelete = true"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                    <v-dialog v-model="alertDelete" persistent max-width="350">
                      <v-card>
                        <v-card-title>
                          <strong>Deseja excluir esta especialidade?</strong>
                        </v-card-title>
                        <v-card-text>Este especialidade será excluído permanentemente.</v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="error"
                            text
                            @click="alertDelete = false, deleteSpecialty()"
                          >EXCLUIR</v-btn>
                          <v-btn color="primary" text @click="alertDelete = false">CANCELAR</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 v-if="loading" class="my-4">
        <v-progress-circular indeterminate class="primary--text"></v-progress-circular>
      </v-flex>
      <v-flex xs2 v-for="especialty in specialties" :key="especialty.name" class="mt-4">
        <v-card class="ma-3 pa-3 white" @click="editSpecialty(especialty)" ripple>
          <v-layout row wrap>
            <v-flex xs12>
              <span class="font-weight-bold">{{especialty.name}}</span>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import SubmitButton from "../../components/SubmitButton";

export default {
  components: {
    SubmitButton
  },
  data: () => ({
    specialties: [],
    loading: false,
    success: false,
    searchText: undefined,
    searchSpecialty: true,
    registerSpecialty: false,
    searchData: null,
    validRegister: true,
    editData: false,
    parameter: "name",
    registed: false,

    alertDelete: false,

    editedSpecialty: {
      id: "",
      name: "",
      rules: "",
      price: 10
    },

    defaultSpecialty: {
      id: "",
      name: "",
      rules: "",
      price: 10
    },

    rules: {
      campoObrigatorio: [v => !!v || "Campo é Obrigatório"]
    }
  }),

  computed: {
    formRegister() {
      return this.editedSpecialty.name;
    },

    selectedSpecialty() {
      return this.$store.getters.selectedSpecialty;
    }
  },

  mounted() {
    //So chamar uma vez isso aqui
    //this.$store.dispatch("setPricesspecialties");

    window.addEventListener("keydown", this.handleEnter);
    this.searchSpecialtys();
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.handleEnter);
  },

  methods: {
    handleEnter(e) {
      if (e.key === "Enter") {
        if (this.registerSpecialty) {
          this.validateRegister();
        } else {
          this.searchSpecialtys(this.searchText);
        }
      }
    },
    async searchSpecialtys(searchText) {
      this.loading = true;
      this.loading = true;
      const data = searchText ? this.capitalize(searchText) : undefined;
      this.specialties = await this.$store.dispatch("searchSpecialty", data);
      this.loading = false;
    },

    alert() {
      if (this.selectedSpecialty === null) {
        alert("Especialidade não cadastrado");
        this.editedSpecialty = Object.assign({}, this.defaultSpecialty);
        this.editedSpecialty.name = this.searchData;
      }
    },

    clearSearch() {
      this.searchData = null;
      this.editedSpecialty = Object.assign({}, this.defaultSpecialty);
      this.$store.dispatch("selectSpecialty", null);
    },

    validateRegister() {
      this.loading = true;
      this.registerProduct();
    },

    async registerProduct() {
      const specialtyData = {
        id: "",
        name: this.capitalize(this.editedSpecialty.name).replace(/\//g, "-"),
        rules: this.editedSpecialty.rules,
        price: Number(this.editedSpecialty.price)
      };
      await this.$store.dispatch("updateSpecialty", specialtyData);
      this.success = true;
      this.loading = false;
      this.searchSpecialtys();
      setTimeout(() => {
        this.editedSpecialty = {
          id: "",
          name: "",
          rules: "",

          price: 10
        };
        this.success = false;
      }, 1000);
    },

    endRegister() {
      this.editedSpecialty = Object.assign({}, this.defaultSpecialty);

      if (this.registerSpecialty === true) {
        this.registerSpecialty = false;
        this.sucessRegister = false;
        this.searchSpecialty = true;
        this.searchData = null;
        this.editData = false;
        this.registed = false;
      }
    },

    capitalize(value) {
      value = value.toString();
      return value.toUpperCase();
    },

    back() {
      this.$router.back();
    },

    editSpecialty(specialty) {
      this.editedSpecialty = Object.assign({}, specialty);
      this.registerSpecialty = true;
      this.searchSpecialty = false;
      this.registed = true;
    },

    async deleteSpecialty() {
      this.loading = true;
      await this.$store.dispatch("deleteSpecialty", this.editedSpecialty.name);
      this.loading = false;
      this.editedSpecialty = {
        id: "",
        name: "",
        rules: "",
        price: 10
      };
      this.registed = false;
      this.searchSpecialtys();
    }
  }
};
</script>

<style>
.titleSpecialty {
  color: #757575;
  font-size: 20px;
}

.round-card {
  border-radius: 20px;
}
</style>
