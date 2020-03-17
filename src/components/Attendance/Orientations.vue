<template>
    <v-content>
            <v-container fluid>
                <v-card class="elevation-3">
                    <v-card-title class="headline grey lighten-2 justify-center align-center" primary-title>
                        <v-btn style="display: none" text color="transparent" class="transparent"></v-btn><v-spacer></v-spacer>ORIENTAÇÕES<v-spacer></v-spacer><v-btn color="error" @click="clear()">Fechar</v-btn>
                    </v-card-title>
                    <v-card-text>
                        Orientações para pós-operatório de cirurgia do ombro

                        [doctor_medical_license]

                        Ao Paciente [patient_name]

                        Após sua alta hospitalar você deverá manter o braço apoiado na tipóia, evitando assim o edema (inchaço).O curativo realizado para a alta hospitalar não deve ser aberto, trocado e sob hipótese alguma molhado. Tome banho, protegendo o curativo com plástico de cozinha (MAGIPACK ®). Não deixe que o jato do chuveiro caia diretamente sobre o membro operado.Retorne a utilização de suas medicações de rotina e obedeça a prescrição médica pós-operatória.No caso de sangramento abundante no curativo, dor que não melhora com a medicação analgésica prescrita ou febre com temperatura corpórea maior que 38 graus, procure uma de nossas unidades e contate seu médico. Respeite as datas e horários dos retornos ambulatoriais agendados. As consultas são fundamentais para sua recuperação.
                    </v-card-text>
<!--                    <v-divider></v-divider>-->
<!--                    <v-card-actions>-->
<!--                        <v-btn color="error" @click="clear()">Fechar</v-btn>-->
<!--                        <v-spacer></v-spacer>-->
<!--                        <v-btn color="success" @click="null">Salvar</v-btn>-->
<!--                    </v-card-actions>-->
                </v-card>
            </v-container>
    </v-content>
</template>

<script>
    export default {
        props:['consultation'],
        data: () => ({
            //
        }),
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