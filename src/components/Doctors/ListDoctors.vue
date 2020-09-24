<template>
    <v-container fluid>
        <v-layout row wrap>
            <div style="width: 100%">
                  <v-flex sm12 v-for="(doctor, i) in doctors" :key="i" class="mb-5">
                    <v-card>
                      <v-flex xs12 sm12>
                        <v-card color="primary">
                          <v-layout row wrap>
                            <v-flex sm10>
                              <p class="white--text text-left font-weight-bold pt-4 pb-3 pl-4">
                                {{doctor.name}}
                              </p>
                            </v-flex>
                            <v-flex sm2 class="text-right mt-2">
                              <v-btn icon dark @click="editDoctor(doctor)">
                                <v-icon>edit</v-icon>
                              </v-btn>
<!--                              <v-btn icon dark @click="deleteDoctor(doctor)">
                                <v-icon>delete</v-icon>
                              </v-btn>-->
                            </v-flex>
                          </v-layout>
                        </v-card>
                      </v-flex>
                    </v-card>
                  </v-flex>
            </div>
        </v-layout>

        <v-dialog v-model="editingDoctor" max-width="500px" v-if="editingDoctor">
            <CreateDoctorCard @clean="selectedDoctor = undefined, magic()" :doctor="selectedDoctor"
                              @close="editingDoctor = false"/>W
        </v-dialog>

        <v-dialog v-if="selectedDoctor" v-model="deletingDoctor" max-width="500px">
            <v-card>
                <v-card-title>
                    Deletar o médico?
                    <v-spacer/>
                    <v-btn text @click="deletingDoctor = false"><v-icon>close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-divider class="primary"/>
                    <v-layout row wrap class="font-weight-bold justify-center">{{selectedDoctor.name}}</v-layout>
                    <v-divider class="primary"/>
                </v-card-text>
                <v-card-actions class="mx-3">
                  <v-spacer/>
                    <ApolloMutation
                        :mutation="require('@/graphql/doctors/DeleteDoctors.gql')"
                        :variables="{ id: selectedDoctor.id }"
                        @done="deletingDoctor = false"
                    >
                      <template v-slot="{ mutate, loading, error }">
                        <v-progress-circular indeterminate color="primary" v-if="loading"></v-progress-circular>
                        <v-btn v-if="!loading" color="red" class="white--text" @click="mutate()">Apagar</v-btn>
                        <p v-if="error">Ocorreu um erro: {{ error }}</p>
                      </template>
                    </ApolloMutation>

                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
    import CreateDoctorCard from "../../components/Doctors/CreateDoctorCard";
    export default {
        props: ['doctors'],
        components: {CreateDoctorCard},
        data: () => ({
            selectedDoctor: undefined,
            editingDoctor: false,
            deletingDoctor: false,
        }),
        methods: {
            async editDoctor(doctor) {
                console.log('edit ?', doctor)
                this.selectedDoctor = doctor;
                this.editingDoctor = true;
            },
            async deleteDoctor(doctor){
                console.log('delete ?',doctor)
                this.selectedDoctor = doctor;
                this.deletingDoctor = true;
            },
          magic(){

            this.$router.push('/registros/doctors')
          }
        }
    }
</script>