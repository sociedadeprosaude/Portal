<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card grid-list-x1 fluid class="mt-4">
                    <v-form v-model="validRegister" lazy-validation>
                        <v-card-text>
                            <v-layout wrap>
                                <v-flex xs12 sm12>
                                    <v-text-field
                                            outlined
                                            required
                                            label="Nome"
                                            v-model="editedExamType.name"
                                            prepend-icon="description"
                                            :rules="rules.campoObrigatorio"
                                            class="ml-3 mr-3"
                                    />
                                </v-flex>
                                <v-flex xs12 sm12>
                                    <v-checkbox
                                            outlined
                                            required
                                            label="Agendável"
                                            v-model="editedExamType.scheduleable"
                                            class="ml-3 mr-3"
                                            color="primary"
                                    />
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer/>
                            <submit-button
                                    :loading="loading"
                                    :success="success"
                                    :text="registed ? 'Editar tipo de exame':'Cadastrar tipo de exame'"
                                    :disabled="!formRegister"
                                    @click="validateRegister()"
                                    class="ma-3"
                            />
                        </v-card-actions>
                    </v-form>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    import SubmitButton from "../SubmitButton";

    export default {

        components: {SubmitButton},
        props: ['registed','selectedExamType'],

        data: () => ({
            validRegister: true,
            loading: false,
            success: false,

            editedExamType: {
                name: '', scheduleable:false,
            },

            rules: {
                campoObrigatorio: [
                    v => !!v || 'Campo é Obrigatório',
                ],
            }
        }),

        mounted() {
            if(this.selectedExamType){
                this.editedExamType.id = this.selectedExamType.id
                this.editedExamType.name = this.selectedExamType.name;
                this.editedExamType.scheduleable = this.selectedExamType.scheduleable;
            }
        },
        watch:{
           selectedExamType(value){
               if(value){
                   this.editedExamType.id = this.selectedExamType.id;
                   this.editedExamType.name = this.selectedExamType.name;
                   this.editedExamType.scheduleable = this.selectedExamType.scheduleable;
               }
           } 
        },
        computed: {
            formRegister() {
                return this.editedExamType.name;
            },
        },

        methods: {
            handleEnter(e) {
                if (e.key === 'Enter') {
                    if (this.registerExamType) {
                        this.validateRegister()
                    } else {
                        this.searchExamTypes(this.searchText)
                    }
                }
            },

            validateRegister() {
                this.loading = true;
                this.registerProduct()
            },

            async registerProduct() {
                const examTypeData = {
                    id:this.editedExamType.id,
                    name: this.editedExamType.name.toUpperCase().replace(/\//g, "-"),
                    scheduleable:this.editedExamType.scheduleable
                };
                if(this.registed){
                    await this.$store.dispatch('editExamType', examTypeData);
                }
                    
                else{
                    await this.$store.dispatch('addExamType', examTypeData);
                    this.clear()
                }
                   
                this.success = true;
                this.loading = false;
                
                this.close();

            },

            clear() {
                this.editedExamType.name = '';
                this.editedExamType.scheduleable = false
                this.editedExamType.id = '';
            },

            close () {
                this.$emit('close-dialog')
            }

        },
    }
</script>