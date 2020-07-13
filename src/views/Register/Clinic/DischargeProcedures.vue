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
        <template-discharge-procedures :outtake="outtake" :user="user" ></template-discharge-procedures>
    </v-container>
</template>

<script>
    import {mask} from "vue-the-mask";
    import TemplateDischargeProcedures from '../../../components/clinics/TemplateDischargeProcedures'
    export default {
        name: "DischargeProcedures",
        directives: {
            mask
        },
        components:{TemplateDischargeProcedures},
        data() {
            return {
                numberIntake:'',
                loading: false,
            };
        },
        methods: {
            async SearchIntake(number){
                this.loading= true;
                await this.$store.dispatch('getSpecificOuttake',{number:number, cnpj: this.user.cnpj})
                this.loading= false;
            }
        },
        computed: {
            user() {
                return this.$store.getters.user
            },
            outtake(){
                return this.$store.getters.outtakeClinic
            },
            contestvalue(){
                return this.$store.getters.contestValue;
            }
        }
    };
</script>
