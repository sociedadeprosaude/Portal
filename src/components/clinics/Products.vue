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
                    <v-btn @click="load">
                        carregar
                    </v-btn>
                    <v-card-text>
                        <v-list-item v-for="(item,index) in items" :key="index">
                            <v-chip-group v-model="selected">
                                <!--
                            <v-chip color="green" text-color="white">
                                <v-icon>assignment</v-icon>:<strong>{{item.product}} | {{item.doctor}} | R$ {{item.cost}} | R$ {{item.sale}}</strong>
                            </v-chip>
                            -->
                            <v-chip color="purple" text-color="white">
                                <v-icon>poll</v-icon>:<strong>{{item.exams.name}} | R$ {{item.exams.cost}} | R$ {{item.exams.price}}</strong>
                            </v-chip>
                            </v-chip-group>
                        </v-list-item>
                    </v-card-text>
                    {{selected}}
                </v-layout>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        data: () => ({
            selected: undefined,
            items: [],
        }),

        computed: {
            selectedClinic() {
                return this.$store.getters.selectedClinic;
            },
        },

        mounted () {
            this.$store.dispatch('loadClinics');
        },

        methods:{

            load() {
                this.items = this.$store.getters.clinics;
                console.log(this.items)
                /*
                let val = this.$store.getters.clinics;
                console.log(val)
                let lista = []
                for (const key in val.exams) {

                    if(val.exams.length !== 0 ){
                        lista.push(val.exams[key])
                    }else{
                        lista.push(val.specialities[key])
                    }
                }
                return lista
                 */
            }
        },
    }
</script>

<style scoped>
</style>