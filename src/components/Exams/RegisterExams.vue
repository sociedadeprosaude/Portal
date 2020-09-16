<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex sm12>
        <v-card class="pt-3">
          <v-layout row wrap>
            <v-flex sm8>
              <ApolloQuery
                  :query="require('@/graphql/products/ReadProcucts.gql')"
                  :variables="{ type:'EXAM', schedulable:false}"
              >
                <template slot-scope="{ result: { data } }">
                  <v-flex xs12 sm12 class="mb-5">
                    <v-text-field
                        outlined
                        placeholder="Exames"
                        class="mx-5"
                        color="primary"
                        v-model="search"
                        :loading="loading"
                        id="search"
                    />
                    <div v-if="search">
                      <div v-for="(exam,i) in data.Product" :key="i">
                        <div v-if="exam.name.includes(search.toUpperCase()) ">
                          <listExams :exams="new Array(exam)" :loading="loading" @clear-search="search = ''"/>
                        </div>
                      </div>
                    </div>
                  </v-flex>
                </template>
              </ApolloQuery>
            </v-flex>
            <v-flex sm4 class="text-right pr-3 mt-2">
              <v-btn outlined class="primary--text" @click="newExam = true">cadastrar exame</v-btn>
            </v-flex>
          </v-layout>
        </v-card>
        <v-card>
<!--          <v-card-text v-if="exams.length !== 0">
            <listExams :exams="exams" :loading="loading" @clear-search="search = ''"/>
          </v-card-text>-->
        </v-card>
      </v-flex>
      <v-dialog v-model="newExam">
        <createExam :registed="registed" @close-dialog="newExam = false"/>
      </v-dialog>
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
    loading: undefined,
    newExam: false,
    registed: false
  }),
/*  watch:{
    search() {
      this.search = this.search.toUpperCase()
    },
  },*/
  mounted() {
    let self = this;
    window.addEventListener("keyup", function(e) {
      if (e.target.id === "search") {
        clearTimeout(self.typingTimer);
        self.typingTimer = setTimeout(() => {
          self.loading = true;
          self.$store
            .dispatch("loadSelectedExams", self.search.toUpperCase())
            .then(() => {
              self.loading = false;
            });
        }, 300);
      }
    });
    window.addEventListener("keydown", function(e) {
      if (e.target.id === "search") {
        clearTimeout(self.typingTimer);
      }
    });
  },

/*  Apollo:{
    loadProducts:{
      query,
      variables,

    }
  }*/
};
</script>