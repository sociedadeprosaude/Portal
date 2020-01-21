<template>
    <v-container fluid>
        <v-card class="elevation-3">
            <v-card-title class="headline grey lighten-2 justify-center align-center" primary-title>PRONTUÁRIO</v-card-title>
            <v-card-text>
                <vue-editor v-model="prontuario"/>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn color="error" @click="clear()">Fechar</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="save()" :disabled="!prontuario">Salvar</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
    import { VueEditor } from "vue2-editor";
    export default {
        props: ['consultation'],
        components: { VueEditor },
        data: () => ({
            prontuario: undefined,
        }),
        mounted(){
            //
        },
        methods: {
            clear() {
                this.prontuario = undefined,
                this.closeDialog()
            },
            closeDialog: function () {
                this.$emit('close-dialog')
            },
            save(){
                if(this.prontuario){
                    this.$store.dispatch('addProntuarioToConsultation',{prontuario:this.prontuario,})
                }
                //this.clear()
            }
        },
    };
</script>

<style scoped>

</style>