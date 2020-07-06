<template>
    <v-container fluid>
        <v-card class="elevation-3">
            <v-card-title class="headline primary justify-center align-center white--text" primary-title>
                <v-btn style="display: none" text color="transparent" class="transparent"/>
                <v-spacer/>PRONTUÁRIO<v-spacer/><v-icon @click="clear()" color="white">close</v-icon>
            </v-card-title>
            <v-card-text>
                <editor v-model="prontuario"
                        api-key="no-api-key"
                        :init="{
         height: 500,
         menubar: false,
         plugins: [
           'advlist autolink lists link image charmap print preview anchor',
           'searchreplace visualblocks code fullscreen',
           'insertdatetime media table paste code help wordcount'
         ],
         toolbar:
           'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help'
       }"/>
                <!--<vue-editor v-model="prontuario"/>-->
<!--                {{this.consultation.id}}
                {{this.consultation.user.id}}-->
                {{prontuario}}
            </v-card-text>
            <v-divider/>
            <v-card-actions>
                <v-spacer/>
                <submit-button
                        @click="save()"
                        :disabled="!prontuario"
                        :loading="loading"
                        :success="success"
                        text="Salvar"
                />
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
    import { VueEditor } from "vue2-editor";
    import Editor from '@tinymce/tinymce-vue';
    import SubmitButton from "../SubmitButton";
    export default {
        props: ['consultation'],
        components: {SubmitButton, VueEditor, 'editor': Editor },
        data: () => ({
            prontuario: undefined,
            loading: false,
            success: false,
        }),
        mounted(){
        },
        methods: {
            clear() {
                this.prontuario = undefined;
                this.closeDialog()
            },
            closeDialog: function () {
                this.$emit('close-dialog')
            },
            save(){
                this.loading = true;
                if(this.prontuario){
                    this.$store.dispatch('addMedicalRecordsToConsultation',{
                        MedicalRecords:this.prontuario,
                        consultation: this.consultation.id,
                        patient: this.consultation.user.id
                    })
                }
                this.success = true;
                this.loading = false
            }
        },
    };
</script>

<style scoped>

</style>