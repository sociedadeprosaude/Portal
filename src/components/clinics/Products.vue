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
                    {{listando}}
                    <!--
                    {{allExams}}
                    {{allConsultations}}
                    -->
                    <v-list shaped>
                        <v-subheader>Consultas</v-subheader>
                        <v-list-item-group v-model="item" color="primary">
                            <v-list-item
                                    v-for="(item, i) in items"
                                    :key="i"
                            >
                                <v-list-item-content>
                                    <v-list-item-title>
                                        <v-chip v-if="item.type ==='appointment' " color="success" text-color="white">
                                            <v-icon>assignment</v-icon>:<strong>{{item.product}} | {{item.doctor}} | R$ {{item.cost}} | R$ {{item.sale}}</strong>
                                        </v-chip>
                                        <v-chip v-else color="info" text-color="white">
                                            <v-icon>poll</v-icon>:<strong>{{item.product}} | R$ {{item.cost}} | R$ {{item.sale}}</strong>
                                        </v-chip>
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                    {{item}}
                </v-layout>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        data: () => ({
            item: undefined,
            items: [
                {
                    type:'appointment',
                    product:'DERMATOLOGIA',
                    doctor:'JONATAS REIS',
                    cost:'50.00',
                    sale:'80.00',
                },
                {
                    type:'exam',
                    product:'SANGUE',
                    cost:'40.00',
                    sale:'70.00',
                },
                {
                    type:'appointment',
                    product:'DERMATOLOGIA',
                    doctor:'ADRIA CASTRO',
                    cost:'50.00',
                    sale:'80.00',
                },
            ],
        }),

        computed: {
            selectedClinic() {
                return this.$store.getters.selectedClinic;
            },
            listando () {
                let val = this.$store.getters.clinics.filter((a) => {
                    return a.name === this.selectedClinic.name;
                })
                return val
                //return this.$store.getters.clinics
            },
            /*
            allExams () {
                let val = this.$store.getters.clinics
                let exames = []
                for (//) {
                    if(this.selectedClinic.name === val.name){
                        exames.push(val.exams)
                    }
                }
                return exames
            },
            allConsultaions () {
                let val = this.$store.getters.clinics
                let consultas = []
                for () {
                    if(this.selectedClinic.name === val.name){
                        consultas.push(val.specialtie)
                    }
                }
                return consultas
            }
             */
        },

        mounted () {
            this.$store.dispatch('loadClinics');
        },

        methods:{
            //
        },
    }
</script>

<style scoped>
</style>