<template>
  <v-container fluid>
<!--    <v-layout align-left justify-left>-->
<!--      <v-btn-->
<!--              @click="back"-->
<!--              color="primary"-->
<!--              rounded-->
<!--              class="mb-2 elevation-6"-->
<!--      ><v-icon>close</v-icon>-->
<!--      </v-btn>-->
<!--    </v-layout>-->
    <v-layout row wrap>
<!--      <v-flex xs4 class= "text-center" >-->
<!--        <v-btn fab large dark class="botao" color="primary" @click="pacotes">-->
<!--          <v-icon size="80" >create_new_folder</v-icon>-->
<!--        </v-btn>-->
<!--        <p class="word">Pacotes</p>-->
<!--      </v-flex>-->
      <v-flex xs6 class="text-center">
        <v-btn fab dark class="botao" color="primary" @click="orcamento">
          <v-icon size="80" >shopping_cart</v-icon>
        </v-btn>
        <p class="word">Orçamento</p>
      </v-flex>
      <v-flex xs6 class="text-center">
        <v-btn fab dark class="botao" color="primary" @click="saidas">
          <v-icon size="80" >attach_money</v-icon>
        </v-btn>
        <p class="word">Saidas</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
    data: () => ({
    }),
  methods:{
      pacotes(){
        this.$router.push('/caixa/Bundles')
      },
      orcamento(){
        this.$router.push('/caixa/Orçamento')
      },
      saidas(){
        this.$router.push('/caixa/Saidas')
      },
      back(){
      this.$router.push('/')
      },
  }
};
</script>

<style scoped>
  .botao{
    margin-top: 15%;
    width: 120px;
    height: 120px;
  }
  .word{
    font-size: 32px;
    margin-top: 5%;
  }
</style>
