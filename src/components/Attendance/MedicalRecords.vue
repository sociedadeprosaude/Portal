<template>
    <v-container fluid>
        <v-card class="elevation-3">
            <v-card-title class="headline grey lighten-2 justify-center align-center" primary-title>
                <v-btn style="display: none" text color="transparent" class="transparent"></v-btn><v-spacer></v-spacer>PRONTUÁRIO<v-spacer></v-spacer><v-btn color="error" @click="clear()">Fechar</v-btn>
            </v-card-title>
            <v-card-text>
                <vue-editor v-model="prontuario"/>
                {{this.consultation.id}}
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <submit-button
                        @click="save()"
                        :disabled="!prontuario"
                        :loading="loading"
                        :success="success"
                        text="Salvar"
                ></submit-button>
<!--                <v-btn color="success" @click="save()" :disabled="!prontuario">Salvar</v-btn>-->
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
    import { VueEditor } from "vue2-editor";
    import SubmitButton from "../SubmitButton";
    export default {
        props: ['consultation'],
        components: {SubmitButton, VueEditor },
        data: () => ({
            prontuario: undefined,
            loading: false,
            success: false,
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
                //console.log(this.consultation)
                this.loading = true
                if(this.prontuario){
                    this.$store.dispatch('addProntuarioToConsultation',{
                        prontuario:this.prontuario,
                        consultation: this.consultation.id,
                        patient: this.consultation.user.cpf
                    })
                }
                this.success = true
                this.loading = false
                /*this.clear()*/
            }
        },
    };
</script>

<style scoped>

</style>