<template>
    <v-container>
            <v-card>
                <v-layout row wrap>
                    <v-flex xs12>
                        <p  class="mt-3 font-italic font-weight-bold">Exame: {{ContestExam.name}}</p>
                    </v-flex>
                    <v-flex xs12>
                        <p>Valor Atual: {{ContestExam.cost}}</p>
                    </v-flex>
                    <v-flex xs2>
                    <v-spacer></v-spacer>
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field v-model="NewValue" label="Valor Correto"></v-text-field>
                    </v-flex>
                    <v-flex xs2>
                        <v-spacer></v-spacer>
                    </v-flex>
                    <v-flex xs12>
                        <v-btn color="success" @click="FunctionContestValue">Enviar</v-btn>
                    </v-flex>
                </v-layout>
            </v-card>
    </v-container>
</template>

<script>
    import {mask} from "vue-the-mask";

    export default {
        name: "TemplateDischargeProcedures",
        directives: {
            mask
        },
        props:['ContestExam'],
        data() {
            return {
                NewValue:''
            };
        },

        methods: {
            async FunctionContestValue(){
                this.$emit('ContestValue',this.NewValue)
            }
        }
    };
</script>
