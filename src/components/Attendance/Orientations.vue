<template>
    <v-container fluid>
        <v-card class="elevation-3">
            <v-card-title class="headline grey lighten-2 justify-center align-center" primary-title>
                <v-btn style="display: none" text color="transparent" class="transparent"></v-btn><v-spacer></v-spacer>ORIENTAÇÕES<v-spacer></v-spacer><v-btn color="error" @click="clear()">Fechar</v-btn>
            </v-card-title>
            <v-card-text>
                <vue-editor v-model="prontuario" :editor-toolbar="customToolbar"/>
<!--                <h1>{{ prontuario }}</h1>-->
<!--                <strong>{{consultation}}</strong>-->
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" :disabled="!formIsValid" @click="documentDialog = true"><v-icon left>print</v-icon>GERAR PDF <v-icon right>fa fa-print</v-icon></v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
    import { VueEditor } from "vue2-editor";
    export default {
        props: ['consultation'],
        components: { VueEditor },
        data: () => ({
            prontuario: "<p class=\"ql-align-center\"><br></p><p class=\"ql-align-center\"><strong>LAUDO MÉDICO NEUROLÓGICO</strong></p><p><br></p><p><br></p><p class=\"ql-align-justify\">Paciente: <strong><u>Georgina da Mata Marialva</u></strong> é portadora de quadro demencial senil.</p><p class=\"ql-align-justify\"><strong>Inválida.</strong></p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">Necessita de auxilio de pessoa da família para atividade da vida diária.</p><p class=\"ql-align-justify\"><strong><u>CID x: F01.</u></strong></p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-right\">Manaus, 24/03/2020</p><p class=\"ql-align-right\"><br></p><p class=\"ql-align-right\"><br></p><p class=\"ql-align-right\"><br></p><p class=\"ql-align-justify\"><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><strong>Dr. Renildo Sergio Batista dos Anjos</strong></p><p class=\"ql-align-right\"> <strong>Neurologia/ Neurocirurgia</strong></p><p class=\"ql-align-right\"> <strong>CRM/ AM 4825</strong></p><p class=\"ql-align-right\"> <strong>RQE – 1749/1750</strong></p>",
            customToolbar: [
                [],
                [],
                []
            ]
        }),
        mounted(){
            //
        },
        methods: {
            clear() {
                this.closeDialog()
            },
            closeDialog: function () {
                this.$emit('close-dialog')
            },
        },
    };
</script>

<style scoped>

</style>
<!--
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
&lt;!&ndash;                    <v-divider></v-divider>&ndash;&gt;
&lt;!&ndash;                    <v-card-actions>&ndash;&gt;
&lt;!&ndash;                        <v-btn color="error" @click="clear()">Fechar</v-btn>&ndash;&gt;
&lt;!&ndash;                        <v-spacer></v-spacer>&ndash;&gt;
&lt;!&ndash;                        <v-btn color="success" @click="null">Salvar</v-btn>&ndash;&gt;
&lt;!&ndash;                    </v-card-actions>&ndash;&gt;
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

</style>-->
