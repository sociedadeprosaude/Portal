<template>
    <v-container>
            <v-card>
                <v-layout row wrap>
                    <v-flex xs12>
                        <p  class="mt-3 font-italic font-weight-bold">Atualizado Com Sucesso</p>
                    </v-flex>
                    <v-flex xs12>
                        <v-btn color="success" @click="CloseDialog()">Fechar</v-btn>
                    </v-flex>
                </v-layout>
            </v-card>
    </v-container>
</template>

<script>
    import {mask} from "vue-the-mask";
    export default {
        name: "SuccessUpdateDischargeProcedures",
        directives: {
            mask
        },
        data() {
            return {}
        },
        methods:{
            CloseDialog(){
                this.$emit('closeDialog',false)
            }
        }
    };
</script>
