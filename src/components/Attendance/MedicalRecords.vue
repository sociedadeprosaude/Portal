<template>
    <v-container fluid>
        <v-card class="elevation-3">
            <v-card-title class="headline grey lighten-2 justify-center align-center" primary-title>
                <v-btn style="display: none" text color="transparent" class="transparent"></v-btn><v-spacer></v-spacer>PRONTUÁRIO<v-spacer></v-spacer><v-btn color="error" @click="clear()">Fechar</v-btn>
            </v-card-title>
            <v-card-text>
               <!-- :editor-toolbar="customToolbar"-->
                <vue-editor v-model="prontuario"/>
<!--                <div>{{ prontuario }}</div>-->
                <!--<strong>{{consultation}}</strong>-->
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
<!--                <v-btn color="error" @click="clear()">Fechar</v-btn>-->
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
/*            prontuario: "<p>paciente:</p><p>mulher</p><p>42 anos</p><p>menopausa</p><p><br></p>",*/
/*            customToolbar: [
                [],
                [],
                []
            ]*/
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
                if(this.prontuario){
                    this.$store.dispatch('addProntuarioToConsultation',{
                        prontuario:this.prontuario,
                        consultation: this.consultation.id,
                        patient: this.consultation.user.cpf
                    })
                }
                /*this.clear()*/
            }
        },
    };
</script>

<style scoped>

</style>