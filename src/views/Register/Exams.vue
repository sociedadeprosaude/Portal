<template>
  <v-container fluid>
    <v-tabs>
      <v-tab href="#exams">Registro de exams</v-tab>
      <v-tab href="#types">Registro de tipos de exams</v-tab>

      <v-tab-item value="exams">
        <v-layout row wrap>
          <v-flex sm12>
            <v-card class="pt-3 mb-4">
              <v-layout row wrap>
                <v-flex sm8>
                  <v-text-field
                    outlined
                    placeholder="Exames"
                    class="mx-5"
                    color="primary"
                    v-model="search"
                    :loading="loading"
                    id="search"
                  />
                </v-flex>
                <v-flex sm4 class="text-right pr-3 mt-2">
                  <v-btn outlined class="primary--text" @click="newExam = true">cadastrar exame</v-btn>
                </v-flex>
              </v-layout>
            </v-card>

            <v-card>
              <v-card-text v-if="exams.length !== 0">
                <listExams :exams="exams" :loading="loading" @clear-search="search = ''" />
              </v-card-text>
            </v-card>
          </v-flex>
          <v-dialog v-model="newExam">
            <createExam :registed="registed" @close-dialog="newExam = false" />
          </v-dialog>
        </v-layout>
      </v-tab-item>
      <v-tab-item value="types">
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
                  <v-btn outlined class="primary--text" @click="newExamType = true">cadastrar tipo de exame</v-btn>
                </v-flex>
              </v-layout>
            </v-card>

            <v-card>
              <v-card-text>
                <listExamsTypes :examsTypes="examsTypes" />
              </v-card-text>
            </v-card>
          </v-flex>
          <v-dialog v-model="newExamType">
            <createExamType @close-dialog="newExamType = false" :registed="registed" />
          </v-dialog>
        </v-layout>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>
<script>
import listExams from "../../components/Exams/listExams";
import listExamsTypes from "../../components/Exams/listExamsTypes";
import createExam from "../../components/Exams/CreateExam";
import createExamType from "../../components/Exams/CreateExamType";

export default {
  components: { listExams,listExamsTypes, createExam,  createExamType},

  data: () => ({
    search: "",
    searchType:"",
    loading: undefined,
    newExam: false,
    newExamType:false,
    registed: false
  }),

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

    self.$store.dispatch('getExamsTypes')
  },

  computed: {
    exams() {
      return this.$store.getters.examsSelected;
    },
    examsTypes(){
      
      let e = this.$store.getters.examsTypes
      console.log('--',e)
        return e
    }
  }
};
</script>