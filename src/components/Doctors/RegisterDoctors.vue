<template>
    <v-container fluid>
        <v-layout row wrap v-if="doctors">
            <v-flex sm12>
                <v-card class="pt-3">
                    <v-layout row wrap>
                        <v-flex sm8>
                            <v-text-field
                                    outlined
                                    placeholder="Médicos"
                                    class="mx-5"
                                    color="primary"
                                    v-model="search"
                                    append-icon="search"
                            />
                        </v-flex>
                        <v-flex sm4 class="text-right pr-3 mt-2">
                            <v-btn outlined class="primary--text" @click="addDoctor">cadastrar médico</v-btn>
                        </v-flex>
                    </v-layout>
                </v-card>

                <v-card>
                    <v-card-text v-if="doctors.length !== 0">
                        <ListDoctors @reload="reload" :doctors=doctors :name="search" />
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-dialog v-model="creatingDoctor" max-width="500px">
                <CreateDoctorCard @reload="reload" @clean="selectedDoctor = undefined" @close="creatingDoctor = false"/>
            </v-dialog>
        </v-layout>
      <v-layout class="align-center justify-center" row wrap v-else>
        <v-progress-circular :size="300" :width="10" color="primary" indeterminate>CARREGANDO...</v-progress-circular>
      </v-layout>
    </v-container>
</template>
<script>
    import CreateDoctorCard from "../../components/Doctors/CreateDoctorCard";
    import ListDoctors from "../../components/Doctors/ListDoctors";
    export default {
        components: {CreateDoctorCard, ListDoctors},
        //props:['doctors'],
        name:"RegisterDoctors",
        data: () => ({
            search: "",
            creatingDoctor:"",
            selectedDoctor:"",
            doctors: undefined,
        }),
      apollo: {
        LoadDoctors: {
          query: require("@/graphql/doctors/LoadDoctors.gql"),
          update(data){
            //this.doctors = undefined;
            this.doctors = Object.assign(data.Doctor);
            //console.log('reativo:', this.products)
          },
        }
      },
      methods: {
          async reload(){
            console.log('create ?')
            setTimeout(() => {
              this.$apollo.queries.LoadDoctors.refresh();
            }, 1500);
          },
            addDoctor() {
                this.selectedDoctor = undefined;
                this.creatingDoctor = true
            },
        }
    };
</script>