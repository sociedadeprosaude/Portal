<template>
  <v-container fluid>
        <v-layout row wrap>
          <v-flex sm12>
            <v-card class="pt-3 mb-4">
              <v-layout row wrap>
                <v-flex sm8>
                  <v-text-field
                    outlined
                    placeholder="Tipos de Exames"
                    class="mx-5"
                    color="primary"
                    v-model="searchType"
                    :loading="loading"
                    id="search"
                  />
                </v-flex>
                <v-flex sm4 class="text-right pr-3 mt-2">
                  <v-btn
                    outlined
                    class="primary--text"
                    @click="newExamType = true"
                  >cadastrar tipo de exame</v-btn>
                </v-flex>
              </v-layout>
            </v-card>

            <v-card>
              <v-card-text>
                <listExamsTypes @reloadDelete="reloadDelete" :products="products" />
              </v-card-text>
            </v-card>
          </v-flex>
          <v-dialog v-model="newExamType">
            <createExamType @reload="reload" @close-dialog="newExamType = false" :registed="registed" />
          </v-dialog>
        </v-layout>
  </v-container>
</template>
<script>
import listExamsTypes from "./listExamsTypes";
import createExamType from "./CreateExamType";

export default {
  name:"TypesExams",
  components: { listExamsTypes, createExamType },
  props:['examsTypes'],
  data: () => ({
    searchType: "",
    loading: undefined,
    newExamType: false,
    registed: false,
    products: undefined,
  }),
  apollo: {
    ReadProcucts: {
      query: require("@/graphql/products/ReadProcucts.gql"),
      variables () {
        return {
          type:'EXAM',
          schedulable: true,
        }
      },
      update(data){
        this.products = undefined;
        this.products = Object.assign(data.Product);
        //console.log('reativo:', this.products)
      },
    }
  },
  methods: {
    async reload(){
      console.log('create ?')
      setTimeout(() => {
        this.$apollo.queries.ReadProcucts.refresh();
      }, 1500);
    },
    async reloadDelete(){
      console.log('del ?')
      setTimeout(() => {
        this.$apollo.queries.ReadProcucts.refresh();
      }, 1500);
    },
  },
  mounted() {
    let self = this;
    self.$store.dispatch("getExamsTypes");
  }
};
</script>