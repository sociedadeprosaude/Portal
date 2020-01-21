<template>
    <v-container fluid>
        <v-card class="elevation-3">
            <v-card-title class="headline grey lighten-2 justify-center align-center" primary-title>PRONTUÁRIO</v-card-title>
            <v-card-text>
                AINDA SEM MODELO BASE FEITO
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
    var moment = require('moment');
    export default {
        props:['consultation'],
        data: () => ({
            medico: 'JACKSON KELVIN DE SOUZA',
            crm:'55874',
            paciente: 'JACKSON KELVIN DE SOUZA',
            moment: moment,
            exams: [],
            dateFormatted: '',
            examsOptions: [],
        }),
        computed: {
            formIsValid() {
                return this.exams.length > 0
            },
        },
        mounted() {
            this.paciente =  this.consultation.user.dependent ? this.consultation.user.dependent.name : this.consultation.user.name
        },
        watch: {
        },
        methods: {
            clear() {
                this.closeDialog()
            },
            closeDialog: function () {
                this.$emit('close-dialog')
            },
        },
    }
</script>
<style scoped>
</style>