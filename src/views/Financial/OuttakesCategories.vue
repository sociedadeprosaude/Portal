<template>
    <v-container fluid class="ma-0 mt-md-4 mr-md-2 ml-md-2 pa-0 align-start">
        <ApolloQuery
                :query="require('@/graphql/category/LoadCategories.gql')"
        >
            <template slot-scope="{ result: { data, loading } }">
                <v-progress-circular v-if="loading || !data" indeterminate x-large class="primary--text"/>
                <v-data-table
                        v-else-if="data"
                        :headers="headers"
                        :items="data ? data.Category : []"
                        item-text="name"
                        sort-by="name"
                        :search="search"
                        item-key="name"
                        :items-per-page="-1"
                >
                    <template v-slot:top>
                        <v-flex xs12 class="text-right pa-2">
                            <v-layout row wrap>
                                <v-text-field prepend-inner-icon="search" v-model="search" outlined dense label="Pesquisa" />
                                <v-spacer/>
                                <v-btn
                                        fab
                                        x-small
                                        rounded
                                        color="primary"
                                        dark
                                        class=" mx-2"
                                        @click="dialogCreateCategory = true"
                                >
                                    <v-icon>mdi-plus</v-icon>
                                </v-btn>
                            </v-layout>
                        </v-flex>
                    </template>

                    <template v-slot:item.action="{ item }">
                        <v-btn fab text class="error mx-1 my-1" x-small @click="confirmDeletion(item)">
                            <v-icon color="white">delete</v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </template>
        </ApolloQuery>
        <div class="text-center">
            <v-dialog v-model="dialogCreateCategory" width="500">
                <v-card>
                    <v-card-title class="headline grey lighten-2" primary-title>Nova categoria</v-card-title>
                    <v-card-text>
                        <v-text-field label="Categoria" v-model="newCategory"/>
                    </v-card-text>
                    <v-divider/>
                    <v-card-actions>
                        <v-spacer/>
                        <v-btn text @click="dialogCreateCategory = false">Cancelar</v-btn>
                        <v-btn :loading="loading" color="green darken-1" text @click="createCategory()">Criar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>

        <div class="text-center">
            <v-dialog v-model="dialogRemoveCategory" width="500">
                <v-card>
                    <v-card-title class="headline grey lighten-2" primary-title>Deletar categoria?</v-card-title>

                    <v-divider/>
                    <v-card-actions>
                        <v-spacer/>
                        <v-btn text @click="dialogRemoveCategory = false">Não</v-btn>
                        <v-btn :loading="loading" color="red darken-1" text @click="remove()">Sim</v-btn>
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
    dialogCreateCategory: false,
    newCategory: "",
    category: "",
    categoryToRemove: { category: "", id:"" },
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

                {text: "Ações", value: "action", sortable: false, align: "center"}
            ],
            subHeaders: [
                {
                    text: "Nome",
                    value: "name",
                    align: "left",
                    filterable: true
                },

                {text: "Ações", value: "action", sortable: false, align: "center"}
            ]
        }),

        computed: {
            categories() {
                return this.$store.getters.outtakesCategories;
            }
        },
        mounted() {
            this.$store.dispatch("getOuttakesCategories");
        },

        methods: {
            createCategory() {
                this.$apollo.mutate({
                    mutation: require('@/graphql/category/NewCategory.gql'),
                    variables: {
                        name: this.newCategory
                    }
                }).then((data) => {
                    console.log('data: ', data)
                });
                this.dialogCreateCategory = false;

            },
    confirmDeletion(item) {
      this.categoryToRemove.category = item.name;
      this.categoryToRemove.id = item.id
      this.dialogRemoveCategory = true;
    },

    async remove() {
      await this.$apollo.mutate({
        mutation: require("@/graphql/category/DeleteCategory.gql"),
        variables:{
          id: this.categoryToRemove.id
        }
      })
      console.log('deletado')
      this.dialogRemoveCategory = false;
    },
    
  }
};
</script>

        }
    };
</script>
