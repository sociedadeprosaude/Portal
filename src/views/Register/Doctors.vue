<template>
    <v-container fluid>
        <v-tabs>
            <v-tab href="#doctors">Registro de médicos</v-tab>
            <v-tab href="#specialties">Registro de especialidade</v-tab>
            <v-tab-item value="doctors">
              <ApolloQuery
                  :query="require('@/graphql/doctors/LoadDoctors.gql')"
              >
                <template slot-scope="{ result: { data } }">
                  <register-doctors v-if="data" :doctors="data.Doctor"></register-doctors>
                </template>
              </ApolloQuery>
            </v-tab-item>
            <v-tab-item value="specialties">
              <ApolloQuery
                  :query="require('@/graphql/products/ReadProcucts.gql')"
                  :variables="{ type:'SPECIALTY', schedulable:false}"
              >
                <template slot-scope="{ result: { data } }">
                  <register-specialties v-if="data" :specialties="data.Product" ></register-specialties>
                </template>
              </ApolloQuery>
            </v-tab-item>
        </v-tabs>
    </v-container>
</template>
<script>
  import RegisterDoctors from "../../components/Doctors/RegisterDoctors";
  import RegisterSpecialties from "../../components/Doctors/RegisterSpecialties";
  export default {
    components: { RegisterDoctors, RegisterSpecialties},
    data: () => ({}),
  };
</script>