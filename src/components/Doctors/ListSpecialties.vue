<template>
  <v-container fluid>
    <v-layout row wrap>
      <div style="width: 100%">
        <v-flex sm12 v-for="(specialty, i) in specialties" :key="i" class="mb-5">
          <v-card>
            <v-flex xs12 sm12>
              <v-card color="primary">
                <v-layout row wrap>
                  <v-flex sm10>
                    <p class="white--text text-left font-weight-bold pt-4 pb-3 pl-4">
                      {{specialty.name}}
                    </p>
                  </v-flex>
                  <v-flex sm2 class="text-right mt-2">
                    <v-btn icon dark><v-icon small @click="editSpecialty(specialty)">edit</v-icon></v-btn>
                    <ApolloMutation
                        :mutation="require('@/graphql/products/DeleteProducts.gql')"
                        :variables="{ id: specialty.id }"
                        @done="close($event)"
                    >
                      <template v-slot="{ mutate, loading, error }">
                        <v-progress-circular indeterminate color="primary" v-if="loading"/>
                        <v-btn icon dark><v-icon small @click="mutate()">delete</v-icon></v-btn>
                        <p v-if="error">Ocorreu um erro: {{ error }}</p>
                      </template>
                    </ApolloMutation>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-flex>
          </v-card>
        </v-flex>
      </div>
    </v-layout>
    <v-dialog v-model="editingSpecialty" max-width="500px">
      <EditSpecialty :specialty="specialty" @close="closeDialogs"/>
    </v-dialog>
  </v-container>
</template>

<script>
import EditSpecialty from "./EditSpecialty"
export default {
    props: ['specialties'],
    components: {EditSpecialty},
    data: () => ({
      specialty: undefined,
      editingSpecialty: false,
    }),
    methods: {
      editSpecialty (specialty) {
        this.specialty = specialty;
        console.log("parameter:", this.specialty)
        this.editingSpecialty = true;
      },
      closeDialogs () {
        this.specialty = undefined;
        this.editingSpecialty = false;
      },
      close(val){
        this.$router.push('/')
        console.log('reposta:', val.data)
      }
    },
  }
</script>