<template>
    <v-container fluid>
        <v-card class="elevation-3">
            <v-card-title class="headline grey lighten-2 justify-center align-center" primary-title>
                <v-btn style="display: none" text color="transparent" class="transparent"></v-btn><v-spacer></v-spacer>LAUDOS<v-spacer></v-spacer><v-btn color="error" @click="clear()">Fechar</v-btn>
            </v-card-title>
            <v-card-text>
                <vue-editor v-model="prontuario"/>
<!--                <div>{{ prontuario }}</div>-->
                <!--<strong>{{consultation}}</strong>-->
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
            save(){
                //console.log(this.consultation)
/*                if(this.prontuario){
                    this.$store.dispatch('addProntuarioToConsultation',{
                        prontuario:this.prontuario,
                        consultation: this.consultation.id,
                        patient: this.consultation.user.cpf
                    })
                }*/
                /*this.clear()*/
            }
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
                    <v-btn style="display: none" text color="transparent" class="transparent"></v-btn><v-spacer></v-spacer>LAUDOS<v-spacer></v-spacer><v-btn color="error" @click="clear()">Fechar</v-btn>
                </v-card-title>
                <v-card-text>
                    ULTRASSONOGRAFIA DA TIREÓIDE

                    Paciente:[patient_name]

                    Médico Executante: [doctor_name]

                    Exame realizado com transdutor linear multifrequencial.

                    Lobo Direito tópico, de contornos regulares, limites precisos e volume normal.
                    Parênquima glandular homogêneo.
                    Medidas:	Longitudinal: 		[ ] cm.
                    Antero-Posterior: 	[ ] cm.
                    Transversal: 		[ ] cm.
                    Volume: 		        [ ] cm3.

                    Lobo Esquerdo tópico, de contornos regulares, limites precisos e volume normal.
                    Parênquima glandular homogêneo.
                    Medidas:	Longitudinal: 		[ ] cm.
                    Antero-Posterior: 	[ ] cm.
                    Transversal: 		[ ] cm.
                    Volume: 		        [ ] cm3.

                    Istmo com parênquima de textura acústica habitual, com aproximadamente [ ] cm de espessura média.


                    CONCLUSÃO

                    Ultrassom da glândula Tireóide dentro dos limites da normalidade.
                </v-card-text>
&lt;!&ndash;                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="null">Salvar</v-btn>
                </v-card-actions>&ndash;&gt;
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
