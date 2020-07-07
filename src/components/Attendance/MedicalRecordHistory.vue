<template>
    <v-content>
        <v-container fluid>
            <v-layout row wrap>
                <v-flex xs12 v-if="medicalRecordsUser.length !== 0">
                    <v-expansion-panels inset>
                        <v-expansion-panel v-for="(item,i) in medicalRecordsUser" :key="i">
                            <v-expansion-panel-header class="primary white--text">
                                {{item.date | dateFilter }} - {{item.hour}} : {{item.type}} - {{item.doctor}} - {{item.specialty}}
                                <template v-slot:actions>
                                    <v-icon color="white">$expand</v-icon>
                                </template>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <br/>
                                <editor v-model="item.medicalRecord"
                                        disabled
                                        api-key="no-api-key"
                                        :init="{
                             menubar: false,
                             plugins: [],
                             toolbar:''
                           }"/>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-flex>
                <v-flex xs12 v-else>
                    <v-card>
                        <v-alert type="error">
                            O Paciente Ainda Não Tem Nenhum Prontuário Salvo de Consultas e/ou Retornos Anteriores!
                        </v-alert>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>
</template>

<script>
    import Editor from '@tinymce/tinymce-vue';
    export default {
        components: {'editor': Editor },
        props: ['id'],
        data: () => ({
            //
        }),
        mounted() {
            this.initialConfig()
        },
        methods: {
            async initialConfig() {
                await this.$store.dispatch('getMedicalRecords',{ patient: this.id })
            },
        },
        computed:{
            medicalRecordsUser(){
                let mrOfUser = this.$store.getters.medicalRecords
                console.log('oi:', mrOfUser)
                return mrOfUser
            }
        },
    };
</script>

<style scoped>
</style>