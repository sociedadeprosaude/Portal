<template>
    <v-container fluid>
        <v-card class="elevation-3">
            <v-card-title class="headline primary justify-center align-center white--text" primary-title>
                <v-spacer/>
                <v-layout class="align-center justify-center">
                <v-flex xs6>
                    <v-img v-if="selectedUnit"
                           :src="selectedUnit.logo"
                           width="400"
                    ></v-img>
                </v-flex>
                </v-layout>
                <v-spacer/>
                <!--commmnets-->
                <v-flex xs12>
                    <br/>
                    <span style="text-decoration: underline white">PRONTUÁRIO</span>
                </v-flex>
                <v-spacer/>
            </v-card-title>
            <v-card-text>
                <br/>
                <editor v-model="medicalRecord"
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
                {{medicalRecord}}
                <br/>
                {{medicalRecordsUser}}
                <br/>
                {{id}}
            </v-card-text>
            <v-divider/>
            <v-card-actions>
                <v-spacer/>
                <submit-button
                        @click="save()"
                        :disabled="!medicalRecord"
                        :loading="loading"
                        :success="success"
                        text="Salvar"
                />
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
    import Editor from '@tinymce/tinymce-vue';
    import SubmitButton from "../SubmitButton";
    export default {
        props: ['consultation', 'id'],
        components: {SubmitButton, 'editor': Editor },
        data: () => ({
            medicalRecord: undefined,
            loading: false,
            success: false,
        }),
        mounted() {
            this.initialConfig()
        },
        computed:{
            selectedUnit() {
                return this.$store.getters.selectedUnit
            },
            medicalRecordsUser(){
                let mrOfUser = this.$store.getters.medicalRecords
                return mrOfUser
            }
        },
        methods: {
            async initialConfig() {
                await this.$store.dispatch('getMedicalRecords',{ patient: this.id })
            },
            save(){
                this.loading = true;
                let history = []

                if(this.medicalRecordsUser.length !== 0){
                    let holder = {
                        medicalRecord:this.medicalRecord,
                        consultation: this.consultation.id,
                        patient: this.consultation.user.id,
                        date: this.consultation.date.split(' ')[0],
                        hour: this.consultation.date.split(' ')[1],
                        specialty: this.consultation.specialty.name,
                        doctor: this.consultation.doctor.name,
                        type: this.consultation.type,
                    }
                    this.medicalRecordsUser.push(holder)
                    this.$store.dispatch('addMedicalRecordsToConsultation',{
                        medicalRecords: this.medicalRecordsUser,
                        medicalRecord:this.medicalRecord,
                        consultation: this.consultation.id,
                        patient: this.consultation.user.id,
                    })
                    this.success = true;
                    this.loading = false;
                } else {
                    let holder = {
                        medicalRecord:this.medicalRecord,
                        consultation: this.consultation.id,
                        patient: this.consultation.user.id,
                        date: this.consultation.date.split(' ')[0],
                        hour: this.consultation.date.split(' ')[1],
                        specialty: this.consultation.specialty.name,
                        doctor: this.consultation.doctor.name,
                        type: this.consultation.type,
                    }
                    history.push(holder)
                    this.$store.dispatch('addMedicalRecordsToConsultation',{
                        medicalRecords: history,
                        medicalRecord:this.medicalRecord,
                        consultation: this.consultation.id,
                        patient: this.consultation.user.id,
                    })
                    this.success = true;
                    this.loading = false;
                }
            }
        },
    };
</script>

<style scoped>

</style>