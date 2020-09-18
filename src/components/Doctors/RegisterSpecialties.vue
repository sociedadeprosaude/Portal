<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex sm12>
                <v-card class="pt-3">
                    <v-layout row wrap>
                        <v-flex sm8>
                            <v-text-field
                                    outlined
                                    placeholder="Especialidades"
                                    class="mx-5"
                                    color="primary"
                                    v-model="searchSpecialty"
                                    id="searchEspecialties"
                            />
                        </v-flex>
                        <v-flex sm4 class="text-right pr-3 mt-2">
                            <v-btn outlined class="primary--text" @click="creatingSpecialty = true">
                                cadastrar especialidade
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-card>
                <v-card>
                  <v-card-text>
                    <ListSpecialties :specialties="specialties"/>
                  </v-card-text>
                </v-card>
            </v-flex>
            <v-dialog v-model="creatingSpecialty" max-width="500px">
                <CreateSpecialty @close="creatingSpecialty = false"/>
            </v-dialog>
        </v-layout>

    </v-container>
</template>

<script>
    import CreateSpecialty from "./CreateSpecialty";
    import ListSpecialties from "./ListSpecialties";
    export default {
        components: {CreateSpecialty, ListSpecialties},
        props:['specialties'],
        data: () => ({
            searchSpecialty: "",
            creatingSpecialty: false,
        }),
    };
</script>