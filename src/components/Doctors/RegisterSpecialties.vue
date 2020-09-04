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
                                    :loading="loading"
                                    id="searchEspecialties"
                            />
                        </v-flex>
                      <v-flex xs12>

                      </v-flex>
                      <v-flex xs12>
                        <!-- Apollo Query -->
                        <ApolloQuery
                            :query="require('@/graphql/products/ReadProcucts.gql')"
                            :variables="{ type:'SPECIALTY', schedulable:false}"
                        >
                          <template slot-scope="{ result: { data } }">
                            <v-combobox
                                class="mx-1"
                                label="Especialidade"
                                prepend-icon="school"
                                v-model="specialty"
                                :items="data ? data.Product:[]"
                                item-text="name"
                                return-object
                                outlined
                                rounded
                                filled
                                dense
                                chips
                                color="pink"
                                clearable
                            >
                              <template v-slot:selection="data">
                                <v-chip
                                    :key="JSON.stringify(data.item)"
                                    :input-value="data.selected"
                                    :disabled="data.disabled"
                                    class="v-chip--select-multi"
                                    @click.stop="data.parent.selectedIndex = data.index"
                                    @input="data.parent.selectItem(data.item)"
                                    text-color="white"
                                    color="info"
                                >{{ data.item.name }}</v-chip>
                              </template>
                            </v-combobox>
                          </template>
                        </ApolloQuery>
                      </v-flex>
                        <v-flex sm4 class="text-right pr-3 mt-2">
                            <v-btn outlined class="primary--text" @click="creatingSpecialty = true">
                                cadastrar especialidade
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-card>
                <v-card>
                    <v-card-text v-if="specialties.length !== 0">
                        <ListSpecialties :specialties="specialties" :loading="loading"/>
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
            loading: undefined,
            creatingSpecialty: false,
            specialty: undefined,

        }),
        methods: {
            getSpecialties(item) {
                if (!item.specialties) return '';
                let specialties = '';
                for (const key in item.specialties) {
                    specialties += item.specialties[key].name + ', '
                }
                specialties = specialties.slice(0, specialties.length - 2);
                return specialties
            },
        },
    };

</script>