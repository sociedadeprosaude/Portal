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

                    <v-flex xs12>
                        <v-select
                                prepend-icon="edit"
                                :items="options"
                                label="Opções"
                                outlined
                                v-model="option"
                                clearable
                                chips
                                hide-details
                        ></v-select>
                    </v-flex>

                    <v-layout v-if="option === 'Consultas' " align-center justify-center wrap>
                        <strong>Consultas Cadastradas da Clinica para EDIÇÂO</strong>
                            <v-flex>
                                <v-select
                                        :items="allSpecialties"
                                        item-text="name"
                                        item-value="name"
                                        return-object
                                        v-model="consultation"
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
                        {{consultation.doctors}}
                    </v-layout>

                    <v-layout v-else-if="option === 'Exames' " align-center justify-center wrap>
                        <strong>Exames Cadastrados da Clinica para EDIÇÂO</strong>
                        <v-flex>
                            <v-select
                                    :items="allExams"
                                    item-text="name"
                                    item-value="name"
                                    return-object
                                    v-model="exam"
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
                                    >{{ data.item.name }} | R$  {{ data.item.cost }} | R$ {{ data.item.price }}</v-chip>
                                </template>
                            </v-select>
                        </v-flex>
                        {{exam}}
                        <v-btn @click="pegar">pegar</v-btn>
                    </v-layout>

                    <v-layout v-else align-center justify-center wrap>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout align-center justify-center wrap>
                                    <v-flex>
                                        <v-alert type="warning" outlined text>
                                            Selecione uma das Opções acima para
                                            <strong>EDITAR</strong>
                                            Consultas ou Exames.
                                        </v-alert>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                    </v-layout>

                </v-layout>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
    import {mask} from 'vue-the-mask';
    export default {
        directives: {mask},
        data: () => ({
            exam: undefined,
            consultation: undefined,
            option: undefined,
            options: [
                'Consultas',
                'Exames'
            ],
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

        watch: {
            //
        },

        methods:{
            pegar(){
                let val = this.exam;
                console.log(val)
                console.log(val.name)
                console.log(val.cost)
                console.log(val.price)
            }
        }
    }
</script>
<style scoped>
</style>