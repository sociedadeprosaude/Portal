<template>
  <v-container fluid>
    <v-tabs>
      <v-tab href="#exams">Registro de exams</v-tab>
      <v-tab href="#types">Registro de tipos de exams</v-tab>

      <v-tab-item value="exams">
        <register-exams :exams="exams" ></register-exams>
      </v-tab-item>
      <v-tab-item value="types">
        <register-types-exams :examsTypes="examsTypes"></register-types-exams>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>
<script>
import RegisterExams from "../../components/Exams/RegisterExams";
import RegisterTypesExams from "../../components/Exams/RegisterTypesExams";


export default {
  components: { RegisterExams, RegisterTypesExams },

  data: () => ({
    searchType: "",
    loading: undefined,
    newExam: false,
    newExamType: false,
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

    self.$store.dispatch("getExamsTypes");
  },

  computed: {
    exams() {
      return this.$store.getters.examsSelected;
    },
    examsTypes() {
      let e = this.$store.getters.examsTypes;
      return e;
    }
  }
};
</script>