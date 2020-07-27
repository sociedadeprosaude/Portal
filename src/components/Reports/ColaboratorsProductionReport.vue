<template>
  <v-container>
    <v-layout row wrap class="justify-center">
      <v-flex xs12 class="text-center" v-if="!loading">
        <v-container v-for="(resumeUnit,i) in intakesResumeByUnit " :key="i">
          <v-row>{{resumeUnit.unit}}</v-row>
          <v-divider></v-divider>

          <v-layout row wrap>
            <v-card
              class="pa-3 ma-3"
              width="300px"
              v-for="(resume, name) in resumeUnit.resumes"
              :key="name"
            >
              <v-layout row wrap>
                <v-flex xs12 class="mb-4">
                  <span class="my-sub-headline">{{name}}</span>
                </v-flex>
                <v-flex xs6>
                  <v-layout column wrap>
                    <span
                      v-for="i in 3"
                      :key="i"
                    >{{Object.keys(resume)[i - 1]}}: {{resume[Object.keys(resume)[i - 1]]}}</span>
                  </v-layout>
                </v-flex>
                <v-divider vertical></v-divider>
                <v-flex xs5>
                  <v-layout column wrap>
                    <span
                      v-for="i in 2"
                      :key="i"
                    >{{Object.keys(resume)[i + 2]}}: {{resume[Object.keys(resume)[i + 2]]}}</span>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card>
          </v-layout>
        </v-container>
      </v-flex>
      <v-flex xs12 class="text-center" v-else>
        <v-progress-circular indeterminate class="primary--text"></v-progress-circular>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: [
    "intakes",
    "loading",
    "intakesResume",
    "colaborators",
    "selectedColaborator",
    "paymentMethods",
    "intakesResumeByUnit"
  ]
};
</script>

<style scoped>
</style>
