<template>
    <v-content>
        <v-container fluid>
            <v-card class="elevation-3">
                <v-card-title class="headline grey lighten-2 justify-center align-center" primary-title>
                    <v-btn style="display: none" text color="transparent" class="transparent"></v-btn><v-spacer></v-spacer>ORIENTAÇÕES<v-spacer></v-spacer><v-btn color="error" @click="clear()">Fechar</v-btn>
                </v-card-title>

                <v-layout row wrap class="align-center justify-center">
                    <v-flex xs12>
                        <v-combobox
                                prepend-icon="spellcheck"
                                v-model="item"
                                :items="items"
                                outlined
                                chips
                                clearable
                                placeholder="Modelos pré-prontos"
                        >
                            <template v-slot:selection="data">
                                <v-chip
                                        :key="JSON.stringify(data.item)"
                                        :selected="data.selected"
                                        :disabled="data.disabled"
                                        class="v-chip--select-multi"
                                        @click.stop="data.parent.selectedIndex = data.index"
                                        @input="data.parent.selectItem(data.item)"
                                        color="info"
                                >
                                    <strong style="font-size: 15px">{{ data.item.text }}</strong>
                                </v-chip>
                            </template>
                        </v-combobox>
                    </v-flex>
                </v-layout>

                <v-card-text v-if="item">
                    <vue-editor v-model="item.value"/>
                </v-card-text>

                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" :disabled="!formIsValid" @click="documentDialog = true"><v-icon left>print</v-icon>GERAR PDF <v-icon right>fa fa-print</v-icon></v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-container>

        <v-dialog v-model="documentDialog">
            <orientations-p-d-f @close-dialog="documentDialog = false" :consultation="consultation" :item="item"></orientations-p-d-f>
        </v-dialog>

    </v-content>
</template>

<script>
    import { VueEditor } from "vue2-editor";
    import OrientationsPDF from "./printing/orientationsPDF";
    export default {
        props: ['consultation'],
        components: {OrientationsPDF, VueEditor },
        data: () => ({
            documentDialog: false,
            item: undefined,
            items: [
                { text: 'PRÉ-OPERATÓRIO', value: "<p class=\"ql-align-center\"><strong>ANTES DA CIRURGIA</strong></p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\"><strong>Boa alimentação:</strong>&nbsp;É fundamental o paciente estar bem nutrido, pois a anemia e a falta de vitaminas podem atrapalhar a cicatrização. Sendo assim, uma alimentação balanceada e rica em vegetais e carne é o ideal para uma boa nutrição.</p><p class=\"ql-align-justify\"><strong>Infecções prévias:&nbsp;</strong>Comunique ao cirurgião, antes da cirurgia, se estiver com alguma infecção (furúnculo, foliculite, sinusite, dor de garganta, infecção urinária ou gripe, por exemplo).</p><p class=\"ql-align-justify\"><strong>Cigarro:&nbsp;</strong>Deixe de fumar um mês antes da cirurgia. O fumo pode prejudicar a cicatrização.</p><p class=\"ql-align-justify\"><strong>Bebidas Alcoólicas:</strong>&nbsp;Recomenda-se não ingerir bebidas alcoólicas no mínimo 03 dias antes e 10 dias após a cirurgia (período relativo a cicatrização e a ingestão de medicamentos pós-operatórios).</p><p class=\"ql-align-justify\"><strong>Medicamentos:</strong>&nbsp;Os medicamentos de uso continuo não devem ser suspensos sem autorização do cirurgião dentista ou médico responsável (remédios para pressão, tireoide ou calmante por exemplo). Se fizer uso regular anticoagulantes, medicamentos para osteoporose ou para emagrecer, comunique o profissional responsável com pelo menos uma semana de antecedência para obter as informações devidas.</p><p class=\"ql-align-justify\"><strong>Alergia:</strong>&nbsp;Comunicar com antecedência ao profissional se for portador de qualquer tipo de alergia.</p><p class=\"ql-align-justify\"><strong>Marca-passo:</strong>&nbsp;O paciente deverá comunicar ao profissional com antecedência se portador deste aparelho.</p><p class=\"ql-align-justify\"><strong>Stress:&nbsp;</strong>Tarefas estressantes deverão ser evitadas na véspera e no dia da cirurgia. Recomenda-se dormir cedo na noite anterior à cirurgia.</p><p class=\"ql-align-justify\"><strong>Particularidades:</strong>&nbsp;Informe sobre suas necessidades especiais no momento da internação. A equipe de profissionais da CDE Odontologia fará o possível para atendê-las.</p>"},
                { text: 'PÓS-OPERATÓRIO', value: "<h3 class=\"ql-align-center\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Orientações para pós-operatório de cirurgia do ombro</strong></h3><p class=\"ql-align-center\"><br></p><p><br></p><p>[doctor_medical_license]</p><p><br></p><p>Ao Paciente [patient_name]</p><p><br></p><p class=\"ql-align-justify\">Após sua alta hospitalar você deverá manter o braço apoiado na tipóia, evitando assim o edema (inchaço).O curativo realizado para a alta hospitalar não deve ser aberto, trocado e sob hipótese alguma molhado. Não deixe que o jato do chuveiro caia diretamente sobre o membro operado.Retorne a utilização de suas medicações de rotina e obedeça a prescrição médica pós-operatória.No caso de sangramento abundante no curativo, dor que não melhora com a medicação analgésica prescrita ou febre com temperatura corpórea maior que 38 graus, procure uma de nossas unidades e contate seu médico. Respeite as datas e horários dos retornos ambulatoriais agendados. As consultas são fundamentais para sua recuperação.</p>"},
                { text: 'NO DIA DA OPERAÇÃO', value: "<p class=\"ql-align-center\"><strong>NO DIA DA CIRURGIA</strong></p><p><br></p><p class=\"ql-align-justify\"><strong>Horário:&nbsp;</strong>Para que a cirurgia possa ser preparada corretamente, a equipe cirúrgica da CDE pede aos pacientes e acompanhantes que cheguem ao local da operação no horário marcado para que possamos recebê-los e atendê-los com tranquilidade.</p><p class=\"ql-align-justify\"><strong>Alimentação:&nbsp;</strong>O jejum pré-operatório é um fator importante na garantia da segurança de qualquer anestesia. Assim, solicitamos jejum de 8 horas para alimentos sólidos ou leite.</p><p class=\"ql-align-justify\"><strong>Medicamentos:&nbsp;</strong>Caso faça uso de alguma medicação para pressão, tireoide ou calmante, deverá mantê-la até o dia da cirurgia e tomá-lo com 5ml de água. (medida de um copinho de café). 2 horas antes.</p><p class=\"ql-align-justify\"><strong>Acompanhante:&nbsp;</strong>Venha sempre acompanhado para a cirurgia de pessoa adulta. Este deve permanecer com você até o momento da alta e o acompanhará após a cirurgia à sua residência. Sendo o paciente menor de idade deverá esse se fazer acompanhar dos pais ou de um responsável. Solicitamos ainda que, durante a cirurgia, o acompanhante permaneça na sala de recepção da CDE.</p><p class=\"ql-align-justify\"><strong>Vestuário:&nbsp;</strong>Traga roupas confortáveis e fáceis de vestir.</p><p class=\"ql-align-justify\"><strong>Exames:&nbsp;</strong>Traga os exames laboratoriais e radiográficos relacionado ao seu tratamento, caso esteja de posse dos mesmos. Solicitamos que preferencialmente, estes exames sejam entregues na CDE até 48 horas antes da cirurgia.</p><p class=\"ql-align-justify\"><strong>Objetos pessoais:</strong>&nbsp;Pertences como bolsas, relógios, pulseiras, celulares, óculos e demais itens pessoais sejam deixados em casa ou com o acompanhante.</p><p class=\"ql-align-justify\"><strong>Higiene:&nbsp;</strong>Escove os dentes e passe fio dental 1 hora antes do procedimento. Lave bem o rosto com água e sabão.</p><p class=\"ql-align-justify\"><strong style=\"color: rgb(95, 95, 95);\">Contatos:</strong><span style=\"color: rgb(95, 95, 95);\">&nbsp;Deixe sempre um telefone para que a equipe assistência possa entrar em contato.</span></p>"},
                { text: 'NOVO', value: ""},
            ],
        }),
        computed: {
            formIsValid() {
                return this.item
            },
        },
        mounted(){
            //
        },
        watch: {
            //
        },
        methods: {
            clear() {
                this.item = undefined
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