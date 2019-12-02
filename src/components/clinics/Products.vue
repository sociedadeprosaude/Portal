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
                    <v-card-text>
                        <v-list-item v-for="(item,index) in listProducts" :key="index">
                            <v-chip-group>
                            <v-chip v-if="item.type ==='appointment' " color="green" text-color="white">
                                <v-icon>assignment</v-icon>:<strong>{{item.product}} | {{item.doctor}} | R$ {{item.cost}} | R$ {{item.sale}}</strong>
                            </v-chip>
                            <v-chip v-else color="purple" text-color="white">
                                <v-icon>poll</v-icon>:<strong>{{item.product}} | R$ {{item.cost}} | R$ {{item.sale}}</strong>
                            </v-chip>
                            </v-chip-group>
                        </v-list-item>
                    </v-card-text>
                </v-layout>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        data: () => ({
            //
            listProducts:[
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
                {
                    type:'exam',
                    product:'SANGUE',
                    cost:'40.00',
                    sale:'70.00',
                },
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
                {
                    type:'appointment',
                    product:'DERMATOLOGIA',
                    doctor:'JONATAS REIS',
                    cost:'50.00',
                    sale:'80.00',
                },
                {
                    type:'appointment',
                    product:'DERMATOLOGIA',
                    doctor:'ADRIA CASTRO',
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
                    type:'exam',
                    product:'SANGUE',
                    cost:'40.00',
                    sale:'70.00',
                },
                {
                    type:'exam',
                    product:'SANGUE',
                    cost:'40.00',
                    sale:'70.00',
                },
            ]
        }),

        computed: {

            selectedClinic() {
                return this.$store.getters.selectedClinic;
            },
        },

        methods:{

            save(){
                //
            }
        },
    }
</script>

<style scoped>
</style>