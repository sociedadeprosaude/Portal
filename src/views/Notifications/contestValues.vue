<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 v-for="intake in intakes">
                <v-flex xs12 v-for="exam in intake.exams">
                    <v-card class="elevation-2 my-3">
                        <v-layout row wrap>
                            <v-flex xs3 class="align-center justify-center">
                                <p class="font-weight-black mt-5">
                                    {{exam.name}}
                                </p>
                            </v-flex>
                            <v-flex xs1>
                                <v-divider class="primary" vertical/>
                            </v-flex>
                            <v-flex xs1 class="text-center align-center justify-center">
                                <p class="mt-5"> PREÇO ATUAL: {{exam.price}}</p>
                            </v-flex>
                            <v-flex xs1>
                                <v-divider class="primary" vertical/>
                            </v-flex>
                            <v-flex xs2 class="text-center align-center justify-center">
                                <p class="mt-5"> PREÇO REQUERIDO: {{exam.NewValue}}</p>
                            </v-flex>
                            <v-flex xs1>
                                <v-divider class="primary" vertical/>
                            </v-flex>
                            <v-flex xs1>
                                <v-btn class="mt-4" rounded color="success">Alterar</v-btn>
                            </v-flex>
                            <v-flex xs1>
                                <v-divider class="primary" vertical/>
                            </v-flex>
                            <v-flex xs1>
                                <v-btn class="mt-4" rounded color="error">Cancelar</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {mask} from "vue-the-mask";

    export default {
        name: "contestValues",
        directives: {
            mask
        },
        data() {
            return {

            };
        },
        methods: {

        },
        computed: {
            intakes(){
                return this.$store.getters.contestValue
            }
        },
        mounted() {
            this.$store.dispatch('getContestValue');
        }
    };
</script>
