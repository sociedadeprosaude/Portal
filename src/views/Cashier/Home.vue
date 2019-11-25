<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs3 class= "text-center" >
        <v-btn fab large dark class="botao" color="#2962FF" @click="cadastro">
          <v-icon size="80" >add</v-icon>
        </v-btn>
        <p class="word">Cadastrar</p>
      </v-flex>
      <v-flex xs3 class="text-center">
        <v-btn fab dark class="botao" color="#2962FF" @click="orcamento">
          <v-icon size="80" >shopping_cart</v-icon>
        </v-btn>
        <p class="word">Orçamento</p>
      </v-flex>
      <v-flex xs3 class="text-center">
        <v-btn fab dark class="botao" color="#2962FF" @click="relatorio">
          <v-icon size="80" >assignment</v-icon>
        </v-btn>
        <p class="word">Relatório</p>
      </v-flex>
      <v-flex xs3 class="text-center">
        <v-btn fab dark class="botao" color="#2962FF" @click="saidas">
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
      cadastro(){
        this.$router.push('/caixa/Cadastrar')
      },
      orcamento(){
        this.$router.push('/caixa/Orçamento')
      },
      relatorio(){
        this.$router.push('/caixa/Relatorio')
      },
      saidas(){
        this.$router.push('/caixa/Saidas')
      }
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