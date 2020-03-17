<template>
    <v-content>
        <v-container fluid>
            <v-card class="elevation-3">
                <v-card-title class="headline grey lighten-2 justify-center align-center" primary-title>
                    <v-btn style="display: none" text color="transparent" class="transparent"></v-btn><v-spacer></v-spacer>PRESCRIÇÃO MÉDICA<v-spacer></v-spacer><v-btn color="error" @click="clear()">Fechar</v-btn>
                </v-card-title>
                <v-card-text>
                    AINDA SEM MODELO BASE FEITO
                </v-card-text>
<!--                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="null">Salvar</v-btn>
                </v-card-actions>-->
            </v-card>
        </v-container>
    </v-content>
</template>

<script>
    export default {
        props:['consultation'],
        data: () => ({
            name: null,
            crm: null,
            email: null,
            password: null,
            show: false,
            specialties: [],
            specialtiesOptions: [
                'Clinico Geral',
                'Cirurgiao Geral',
                'Cardiologia',
                'Dermatologia',
                'Endocrinologia',
                'Fonoaudiologia',
                'Gastrenterologia',
                'Ginecologia',
                'Infectologia',
                'Mastologia',
                'Neurologia',
                'Neuropediatria',
                'Nutricionista',
                'Oncologia',
                'Obstetrícia',
                'Ortopedia',
                'Otorrinolaringologia',
                'Peneumologia',
                'Psiquiatria',
                'Psicologia',
                'Proctologia',
                'Pediatria',
                'Reumatologia',
                'Urologia'
            ],
        }),
        computed:{
            formIsValid () {
                return this.email && this.password && this.name && this.crm && this.specialties.length > 0
            },
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