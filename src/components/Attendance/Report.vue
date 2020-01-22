<template>
    <v-content>
        <v-container fluid>
            <v-card class="elevation-3">
                <v-card-title class="headline grey lighten-2 justify-center align-center" primary-title>LAUDOS</v-card-title>
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
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn color="error" @click="clear()">Fechar</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="success" @click="null">Salvar</v-btn>
                </v-card-actions>
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