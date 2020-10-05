<template>
    <v-container
      class="d-flex align-center justify-center"
      style="height:100%"
    >
      <v-card
      >
        <v-card-text class="headline font-weight-medium">
            Ops! Ocorreu um erro na autenticação. Por favor, comunique a equipe técnica!
        </v-card-text>

        <v-card-actions class="justify-center">
            <v-btn class="primary subtitle-2 px-5 py-2" style="text-transform:none"  rounded @click="logOut" >Entendi</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
</template>

<script>
export default {
    methods:{
        logOut(){
            this.$store.dispatch('logOut')
        }
    }
}
</script>

<style>

</style>