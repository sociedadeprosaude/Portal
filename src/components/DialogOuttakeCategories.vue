<template>
  <v-container>
    <v-dialog v-model="dialog" persistent max-width="1280">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on">Categorias</v-btn>
      </template>

      <v-card outlined>
        <v-card-text>
          <v-container>
            <v-expansion-panels>
              <v-expansion-panel v-for="(item,i) in categories" :key="i">
                <v-expansion-panel-header>{{item.name}}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <!-- Leve gambiarra, combobox não atualiza o model enquanto escreve, so se clicar em outro canto
                  esse input.native atualiza o model enquanto escreve-->
                  <v-combobox
                    outlined
                    @input.native="newSub[i]=$event.srcElement.value"
                    :items="item.subCategories"
                    label="Sub Categoria"
                  ></v-combobox>
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
          <v-spacer></v-spacer>
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
    removeSubcategory: async function(item, newSubs) {
      console.log(item);
      console.log(newSubs);
      //await this.$store.dispatch("addOuttakeSubcategory",{item,newSub});
    }
  },

  computed: {
    categories() {
      return this.$store.getters.outtakesCategories;
    }
  }
};
</script>
