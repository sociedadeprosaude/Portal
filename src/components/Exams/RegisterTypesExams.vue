<template>
  <v-container fluid>
        <v-layout row wrap>
          <ApolloQuery
              :query="require('@/graphql/products/ReadProcucts.gql')"
              :variables="{ type:'EXAM', schedulable:false}"
          >
            <template slot-scope="{ result: { data } }">
              <v-flex xs12>
              <v-combobox
                  prepend-icon="assignment_turned_in"
                  v-model="status"
                  :items="data.Product"
                  label="Status"
                  chips
                  return-object
                  hide-details
                  outlined
                  readonly
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
                      :color="data.item.text === 'Pago' ? 'success' : data.item.text === 'Cancelado' ? 'error': 'warning'"
                  >{{ data.item.name }}
                  </v-chip>
                </template>
              </v-combobox>
              </v-flex>
            </template>
          </ApolloQuery>
          <v-flex sm12>
            <v-card class="pt-3 mb-4">
              <v-layout row wrap>
                <v-flex sm8>
                  <v-text-field
                    outlined
                    placeholder="Tipos de Exames"
                    class="mx-5"
                    color="primary"
                    v-model="searchType"
                    :loading="loading"
                    id="search"
                  />
                </v-flex>
                <v-flex sm4 class="text-right pr-3 mt-2">
                  <v-btn
                    outlined
                    class="primary--text"
                    @click="newExamType = true"
                  >cadastrar tipo de exame</v-btn>
                </v-flex>
              </v-layout>
            </v-card>

            <v-card>
              <v-card-text>
                <listExamsTypes :examsTypes="examsTypes" />
              </v-card-text>
            </v-card>
          </v-flex>
          <v-dialog v-model="newExamType">
            <createExamType @close-dialog="newExamType = false" :registed="registed" />
          </v-dialog>
        </v-layout>
  </v-container>
</template>
<script>
import listExamsTypes from "./listExamsTypes";
import createExamType from "./CreateExamType";

export default {
  name:"TypesExams",
  components: { listExamsTypes, createExamType },
  props:['examsTypes'],
  data: () => ({
    searchType: "",
    loading: undefined,
    newExamType: false,
    registed: false
  }),
  mounted() {
    let self = this;
    self.$store.dispatch("getExamsTypes");
  }
};
</script>