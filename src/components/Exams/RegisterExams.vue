<template>
  <v-container fluid>
    <v-layout row wrap v-if="products">
      <v-flex sm12>
        <v-card class="pt-3">
          <v-layout row wrap>
            <v-flex sm8>
              <v-flex xs12 sm12 class="mb-5">
                <v-text-field
                    outlined
                    placeholder="Exames"
                    class="mx-5"
                    color="primary"
                    v-model="search"
                    append-icon="search"
                />
                <div>
                  <div>
                    <div>
                      <listExams @reload="reload" :exams="products" :name="search"/>
                    </div>
                  </div>
                </div>
              </v-flex>

            </v-flex>
            <v-flex sm4 class="text-right pr-3 mt-2">
              <v-btn outlined class="primary--text" @click="newExam = true">cadastrar exame</v-btn>
            </v-flex>
          </v-layout>
        </v-card>
        <v-card>
        </v-card>
      </v-flex>
      <v-dialog v-model="newExam">
        <createExam @reload="reload" :registed="registed" @close-dialog="newExam = false"/>
      </v-dialog>
    </v-layout>
    <v-layout class="align-center justify-center" row wrap v-else>
      <v-progress-circular :size="300" :width="10" color="primary" indeterminate>CARREGANDO...</v-progress-circular>
    </v-layout>
  </v-container>
</template>

<script>
  import listExams from "./listExams";
  import createExam from "./CreateExam";

export default {
  components: { listExams, createExam },
  props:['exams'],
  data: () => ({
    search: "",
    name: undefined,
    loading: undefined,
    newExam: false,
    registed: false,
    products: undefined,
  }),
  apollo: {
    ReadProcucts: {
      query: require("@/graphql/products/ReadProcucts.gql"),
      variables () {
        return {
          type:'EXAM',
          schedulable: false,
        }
      },
      update(data){
        this.products = Object.assign(data.Product)
      },
    }
  },
  methods: {
    reload(){
      this.$apollo.queries.ReadProcucts.refresh();
    },
  }
};
</script>