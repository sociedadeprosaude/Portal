<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs10 md11>
                <v-text-field
                label="Digite o Número de Prótocolo"
                v-model="numberIntake"
                outlined
                >
                </v-text-field>
            </v-flex>
            <v-flex xs2 md1>
                <v-btn @click="SearchIntake(numberIntake)"
                       rounded
                       fab
                       small
                       class="primary mt-2">
                    <v-icon>search</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {mask} from "vue-the-mask";
    export default {
        name: "HeaderDischargeProcedures",
        directives: {
            mask
        },
        data() {
            return {
                numberIntake:'',
                loading: false,
            };
        },
        methods: {
            async SearchIntake(number){
                this.$emit('SearchIntake',number)
            }
        }
    };
</script>
