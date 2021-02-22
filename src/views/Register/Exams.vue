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