<template>
    <v-container fluid>
        <v-layout row wrap v-if="clinics">
            <v-flex sm12>
                <v-card class="pt-3 mb-4">
                    <v-layout row wrap>
                      <v-flex sm8>
                        <v-text-field outlined
                                      v-model="search"
                                      placeholder="Clinicas"
                                      class="mx-5"
                                      color="primary"
                                      append-icon="search"
                        />
                      </v-flex>
                        <v-flex sm4 class="text-right pr-3 mt-2">
                            <v-btn outlined class="primary--text" @click="dataClinic = true">cadastrar clínica</v-btn>
                        </v-flex>
                    </v-layout>
                </v-card>

                <v-card>
                  <v-card-text>
                    <ListClinics @reload="reload" :clinics="clinics" :name="search"/>
                  </v-card-text>
                </v-card>
            </v-flex>
            <v-dialog v-model="dataClinic" width="500px" text hide-overlay>
                <RegisterNewClinic @reload="reload" @close-dialog="finishRegister()"/>
            </v-dialog>
        </v-layout>
      <v-layout class="align-center justify-center" row wrap v-else>
        <v-progress-circular :size="300" :width="10" color="primary" indeterminate>CARREGANDO...</v-progress-circular>
      </v-layout>
    </v-container>
</template>

<script>
    import RegisterNewClinic from "../../components/clinics/RegisterNewClinic";
    import ListClinics from "../../components/clinics/ListClinics"
    export default {
        components: {RegisterNewClinic, ListClinics},
        data: () => ({
            search: '',
            dataClinic: false,
            clinics: undefined,
        }),
      mounted(){
      },
      apollo: {
        LoadAllClinics: {
          query: require("@/graphql/clinics/LoadAllClinics.gql"),
          update(data){
            this.clinics = undefined
            let forEdit = Object.assign(data.Clinic)
            for(let clinic in forEdit) { forEdit[clinic].address = forEdit[clinic].has_address[0] }
            setTimeout(() => {
              this.clinics = forEdit;
          }, 1500);
            //this.clinics = forEdit
          },
        }
      },
      methods: {
        async reload(){
          console.log('create ?')
          await this.$apollo.queries.LoadAllClinics.refresh();
/*          setTimeout(() => {
            this.$apollo.queries.LoadAllClinics.refresh();
          }, 1500);*/
        },
        finishRegister(){
          this.dataClinic = false;
        },
      }
    }
</script>