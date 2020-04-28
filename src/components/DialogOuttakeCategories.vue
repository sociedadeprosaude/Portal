<template>
  <v-container>
    <v-dialog v-model="dialog" persistent max-width="1280">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on">Adicionar subCategorias</v-btn>
      </template>

      <v-card outlined>
        <v-card-title>Categorias</v-card-title>
        <v-card-text>
          <v-container>
            <v-expansion-panels>
              <v-expansion-panel v-for="(item,i) in categories" :key="i">
                <v-expansion-panel-header>{{item.name}}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-combobox
                    outlined
                    @input.native="newSub[i]=$event.srcElement.value"
                    v-model="newSub[i]"
                    :items="item.subCategories"
                    label="Sub Categoria"
                  />
                  <v-row justify="space-around">
                    <v-btn outlined @click="newSubcategory(item,newSub[i])">Adicionar</v-btn>
                    <v-btn outlined @click="removeSubcategory(item,newSub[i])">remover</v-btn>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="dialog = false;">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "DialogOuttakeCategories",
  data() {
    return { dialog: false, newSub: [] };
  },
  methods: {
    newSubcategory: async function(category, newSubcategory) {
      if (category.subCategories.indexOf(newSubcategory) < 0) {
        await this.$store.dispatch("addOuttakeSubcategory", {
          category,
          newSubcategory
        });
      }
    },
    removeSubcategory: async function(category, delSubcategory) {
      const subIndex = category.subCategories.indexOf(delSubcategory);

      if (subIndex >= 0) {
        await this.$store.dispatch("removeOuttakeSubcategory", {
          category,
          subIndex
        });
      }
    }
  },

  computed: {
    categories() {
      return this.$store.getters.outtakesCategories;
    }
  }
};
</script>
