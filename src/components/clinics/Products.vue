<template>
    <v-card width="500">
        <v-card-title class="headline grey lighten-2" primary-title>
            <span class="headline">Produtos Cadastrados</span>
        </v-card-title>
        <v-card-text>
            <v-container grid-list-md>
                <v-layout align-center justify-center wrap>
                    <v-flex xs12>
                        <v-text-field
                                prepend-icon="business"
                                label="Clinicas"
                                outlined
                                readonly
                                v-model="selectedClinic.name"
                                hide-details
                        ></v-text-field>
                    </v-flex>

                    <v-layout row wrap class="align-center justify-center">
                        <strong>Prototype Edit</strong>
                        <v-flex>
                            <v-select
                                    :items="allExams"
                                    item-text="name"
                                    item-value="name"
                                    return-object
                                    v-model="options"
                                    chips
                                    outlined
                            >
                                <template v-slot:selection="data">
                                    <v-chip
                                            :key="JSON.stringify(data.item)"
                                            :selected="data.selected"
                                            :disabled="data.disabled"
                                            class="v-chip--select-multi"
                                            @click.stop="data.parent.selectedIndex = data.index"
                                            @input="data.parent.selectItem(data.item)"
                                            text-color="white"
                                            color="info"
                                    >{{ data.item }}</v-chip>
                                </template>
                            </v-select>
                        </v-flex>
                    </v-layout>
                    <!--
                    {{options}}
                    {{options.doctors}}
                    -->
                    <v-card-text>
                        <v-list-item v-for="(item,index) in allExams" :key="index">
                            <v-chip color="red" text-color="white">
                                <v-icon>poll</v-icon>:<strong>{{item.name}} | {{item.cost}} | R$ {{item.price}}</strong>
                                <v-btn class="ml-1" small icon @click="preprocess(index)">
                                    <v-icon>cancel</v-icon>
                                </v-btn>
                            </v-chip>
                        </v-list-item>
                    </v-card-text>

                    <v-dialog v-model="dialog" max-width="355">
                        <v-card>
                            <v-card-title class="headline">Deletar o Item Selecionado ?</v-card-title>
                            <v-divider></v-divider>
                            <v-card-text>
                                <strong>{{product}}</strong>
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-btn color="error" rounded @click="dialog = false">
                                    NÃO
                                </v-btn>
                                <v-spacer></v-spacer>
                                <v-btn color="success" rounded @click="removeProduct">
                                    SIM
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <!--
                    <v-list v-if=" allExams.length !== 0">
                        <v-subheader><strong>EXAMES</strong></v-subheader>
                        <v-list-item-group v-model="item" color="primary">
                            <v-list-item v-for="(item, i) in allExams" :key="i">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        <v-chip color="info" text-color="white">
                                            <v-icon>poll</v-icon>:<strong>{{item.name}} | R$ {{item.cost}} | R$ {{item.price}}</strong>
                                        </v-chip>
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>

                    <v-list v-if=" allSpecialties.length !== 0">
                        <v-subheader><strong>CONSULTAS</strong></v-subheader>
                        <v-list-item-group v-model="item" color="primary">
                            <v-list-item v-for="(item, i) in allSpecialties" :key="i">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        <v-chip color="info" text-color="white">
                                            <v-icon>assignment</v-icon>:<strong>{{item.name}} | {{item.doctors.name}}nome do medico | R$ {{item.doctors.cost}} | R$ {{item.doctors.price}}</strong>
                                        </v-chip>
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                    -->

                </v-layout>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        data: () => ({
            dialog: false,
            item: undefined,
            product: undefined,
            options: undefined,
        }),

        computed: {
            selectedClinic() {
                return this.$store.getters.selectedClinic;
            },

            listando () {
                let val = this.$store.getters.clinics.filter((a) => {
                    return a.name === this.selectedClinic.name;
                });
                return val
                //return this.$store.getters.clinics
            },

            allExams () {

                let clinic = this.listando[0];
                let exams = [];

                for (let i in clinic.exams){
                    exams.push({
                        ...clinic.exams[i],
                    });
                }
                console.log('EXAMES::',exams)
                return exams;
            },

            allSpecialties () {

                let clinic = this.listando[0];
                let specialties = [];

                for (let i in clinic.specialties){
                    specialties.push({
                        ...clinic.specialties[i],
                    });
                }
                console.log('DOCTORS:',specialties)
                return specialties
            },
        },

        mounted () {
            this.$store.dispatch('loadClinics');
        },

        methods:{
            preprocess(index){
                this.product = this.allExams[index].name;
                this.dialog = true
            },
            removeProduct(){
                let info = {
                    product: this.product,
                    clinic: this.selectedClinic
                }
                console.log(info)
                //this.$store.dispatch('removeExamFromClinic', info)
                //this.$store.dispatch('removeClinicFromExam', info)
            },
        },
    }
</script>

<style scoped>
</style>