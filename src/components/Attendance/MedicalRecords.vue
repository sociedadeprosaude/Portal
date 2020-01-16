<template>
    <v-container fluid>
        <v-card class="elevation-3">
            <v-card-title class="headline grey lighten-2 justify-center align-center" primary-title>Prontuário</v-card-title>
            <v-card-text>
                <vue-editor v-model="text" />
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn color="error" @click="clear()">Fechar</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="null">Salvar</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
    import { VueEditor } from "vue2-editor";
    export default {
        components: { VueEditor },
        data: () => ({
            text: undefined,
        }),
        methods: {
            clear() {
                this.text = undefined,
                this.closeDialog()
            },
            closeDialog: function () {
                this.$emit('close-dialog')
            },
        }
    };
</script>

<style scoped>

</style>