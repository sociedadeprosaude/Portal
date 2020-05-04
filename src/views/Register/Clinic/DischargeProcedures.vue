<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs10>
                <v-text-field
                typeof="number"
                labol="Digite o Número de Prótocolo"
                v-model="numberIntake"
                >
                </v-text-field>
            </v-flex>
            <v-flex xs2>
                <v-btn @click="SearchIntake(numberIntake)"
                       rounded
                       class="primary">
                    <v-icon>search</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {mask} from "vue-the-mask";

    export default {
        name: "DischargeProcedures",
        directives: {
            mask
        },
        data() {
            return {
                numberIntake:''
            };
        },
        methods: {
            SearchIntake(number){
                this.$store.dispatch('getSpecificIntake',number)
            }
        }
    };
</script>
