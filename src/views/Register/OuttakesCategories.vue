<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="categories"
          :search="search"
          item-key="name"
          show-expand
          single-expand
          class="elevation-1"
          :items-per-page="-1"
        >
          <template v-slot:top>
            <v-flex xs12 class="text-right pa-2">
              <v-layout row wrap>
                <v-text-field prepend-icon="search" v-model="search" label="Pesquisa" class="mx-2" />
                <v-spacer />

                <v-btn
                  rounded
                  color="primary"
                  dark
                  class="mb-2 mx-2"
                  @click="dialogCreateCategory = true"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
          </template>

          <template v-slot:expanded-item="{ item }">
            <td :colspan="headers.length+1">
              <v-data-table
                dense
                single-expand
                :headers="subHeaders"
                :items="item.subCategories.map((cat)=>({category:item.name,name:cat}))"
                :footer-props="{
      itemsPerPageText:'Itens por página',
      pageText:'{0}-{1} de {2}'
    }"
              >
                <template v-slot:item.action="{ item }">
                  <v-btn fab text class="error mx-1 my-1" x-small @click="confirmSubDeletion(item)">
                    <v-icon color="white">delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </td>
          </template>

          <template v-slot:item.action="{ item }">
            <v-btn fab text class="success mx-1 my-1" x-small @click="showCreateSubcategory(item)">
              <v-icon color="white">mdi-plus</v-icon>
            </v-btn>
            <v-btn fab text class="error mx-1 my-1" x-small @click="confirmDeletion(item)">
              <v-icon color="white">delete</v-icon>
            </v-btn>
          </template>

          <template v-slot:no-results>
            <v-alert
              :value="true"
              color="error"
              icon="warning"
            >Your search for "{{ search }}" found no results.</v-alert>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <div class="text-center">
      <v-dialog v-model="dialogCreateCategory" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Nova categoria</v-card-title>
          <v-card-text>
            <v-text-field label="Categoria" v-model="newCategory"></v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialogCreateCategory = false">Cancelar</v-btn>
            <v-btn :loading="loading" color="green darken-1" text @click="createCategory()">Criar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <div class="text-center">
      <v-dialog v-model="dialogCreateSubCategory" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Nova subCategoria</v-card-title>
          <v-card-text>
            <v-text-field label="Categoria" v-model="newSubCategory"></v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialogCreateSubCategory = false">Cancelar</v-btn>
            <v-btn :loading="loading" color="green darken-1" text @click="createSubCategory()">Criar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <div class="text-center">
      <v-dialog v-model="dialogRemoveCategory" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Deletar categoria?</v-card-title>

          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialogRemoveCategory = false">Não</v-btn>
            <v-btn :loading="loading" color="red darken-1" text @click="remove()">Sim</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <div class="text-center">
      <v-dialog v-model="dialogRemoveSubCategory" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Deletar subCategoria?</v-card-title>

          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialogRemoveSubCategory = false">Não</v-btn>
            <v-btn :loading="loading" color="red darken-1" text @click="removeSub()">Sim</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    
  </v-container>
</template>

<script>
export default {
  data: () => ({
    search: "",
    loading: false,
    dialogRemoveCategory: false,
    dialogRemoveSubCategory: false,
    dialogCreateCategory: false,
    dialogCreateSubCategory: false,
    newCategory: "",
    category: "",
    newSubCategory: "",
    categoryToRemove: { category: "", subCategory: "" },
    typeOptions: [
      { text: "sim", value: true },
      { text: "não", value: false }
    ],
    headers: [
      {
        text: "Nome",
        align: "left",
        value: "name",
        filterable: true
      },

      { text: "Ações", value: "action", sortable: false, align: "center" }
    ],
    subHeaders: [
      {
        text: "Nome",
        value: "name",
        align: "left",
        filterable: true
      },

      { text: "Ações", value: "action", sortable: false, align: "center" }
    ]
  }),

  computed: {
    categories() {
      return this.$store.getters.outtakesCategories;
    },
    categoriesName() {
      return this.categories.map(e => e.name);
    }
  },
  mounted() {
    this.$store.dispatch("getOuttakesCategories");
  },

  methods: {
    createCategory() {
      this.dialogCreateCategory = false;
      if (this.categoriesName.indexOf(this.newCategory) < 0) {
        this.$store.dispatch("addOuttakesCategory", {
          category: this.newCategory
        });
      } else console.log("ja existe");
    },

    showCreateSubcategory(item) {
      this.category = item.name;
      this.dialogCreateSubCategory = true;
    },

    async createSubCategory() {
      this.dialogCreateSubCategory = false;
      await this.$store.dispatch("addOuttakeSubcategory", {
        category: this.category,
        subCategory: this.newSubCategory
      });
    },

    confirmDeletion(item) {
      this.categoryToRemove.category = item.name;
      console.log(this.categoryToRemove);
      this.dialogRemoveCategory = true;
    },
    confirmSubDeletion(item) {
      this.categoryToRemove.category = item.category;
      this.categoryToRemove.subCategory = item.name;
      console.log(this.categoryToRemove);
      this.dialogRemoveSubCategory = true;
    },
    async remove() {
      await this.$store.dispatch(
        "removeOuttakeCategory",
        this.categoryToRemove
      );
      this.dialogRemoveCategory = false;
    },
    async removeSub() {
      await this.$store.dispatch(
        "removeOuttakeSubcategory",
        this.categoryToRemove
      );
      this.dialogRemoveSubCategory = false;
    }
  }
};
</script>

<style scoped>
</style>
