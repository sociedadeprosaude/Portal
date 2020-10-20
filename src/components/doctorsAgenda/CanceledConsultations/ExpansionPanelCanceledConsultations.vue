<template>
    <v-container class="align-center justify-center py-0">
        <v-layout column class="align-center justify-center" wrap>
            <v-subheader>Gerenciamento de Consultas Canceladas de Todas as Especilidades e Médicos<br/></v-subheader>

            <v-expansion-panels>
                <v-expansion-panel
                        class="elevation-6"
                        hide-actions
                        v-model="panel"
                >
                    <v-expansion-panel-header>
                        <v-layout class="align-center" row wrap>
                            <v-chip small color="primary" text-color="white">
                                <v-avatar>
                                    <v-icon>settings</v-icon>
                                </v-avatar>
                                Gerenciamento de Consultas Canceladas
                            </v-chip>
                        </v-layout>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content>
                        <v-divider/>
                        <v-card class="elevation-0">
                            <v-list three-line subheader>
                                <v-layout wrap>
                                    <v-flex sm3
                                            xs12
                                            v-for="(item,index) in consultations"
                                            v-bind:key="index"
                                    >
                                        <v-list-item
                                                class="py-3"
                                                @click="viewConsultation = {
                                                                    idConsultation:item.id,
                                                                    patient: item.patient,
                                                                    data: item.date.formatted.split('T')[0],
                                                                    hora: item.date.formatted.split('T')[1],
                                                                    product:item.product,
                                                                    status: item.status,
                                                                    type: item.type,
                                                                    calls: item.calls,
                                                                    doctor:item.doctor,
                                                                    num_recibo:item.payment_number,
                                                                    consultation:item
                                                        }">
                                            <v-list-item-content>
                                                <v-list-item-title class="primary--text">
                                                                    <span style="font-weight: bolder">
                                                                        {{item.patient.dependent ? item.patient.dependent.name:
                                                                    item.patient.name}}
                                                                    </span>
                                                </v-list-item-title>
                                                <br>
                                                <v-list-item-subtitle class="text-center font-weight-bold">
                                                    {{item.patient.dependent ? 'Nascimento:' +
                                                    item.patient.dependent.birth_date.formatted
                                                    : 'CPF:' + item.patient.cpf}}
                                                </v-list-item-subtitle>
                                                <br>
                                                <v-list-item-subtitle class="text-center font-weight-bold">
                                                    Telefone: {{item.patient.telephones ? item.patient.telephones[0] : 'Número não informado'}}
                                                </v-list-item-subtitle>
                                                <br>
                                                <v-list-item-action-text>
                                                    {{item.date.split(' ')[0] | dateFilter}} -
                                                    {{item.date.split(' ')[1]}}
                                                    <div v-if="item.calls">
                                                        <v-icon large color="red">phone_disabled</v-icon>
                                                        <v-icon color="red">arrow_forward</v-icon>
                                                        <v-chip class="white--text" color="red">{{item.calls.length}}
                                                        </v-chip>
                                                    </div>
                                                </v-list-item-action-text>
                                            </v-list-item-content>
                                            <br>
                                            <v-list-item-action class="ml-2">
                                                <v-btn icon ripple text>
                                                    <v-icon v-if="item.type === 'Retorno'" color="primary">restore
                                                    </v-icon>
                                                    <v-icon v-if="item.type === 'Consulta'" color="primary">event
                                                    </v-icon>
                                                    <v-icon v-if="item.status === 'Pago'" color="success">attach_money
                                                    </v-icon>
                                                    <v-icon v-if="item.status === 'Aguardando pagamento'" color="error">
                                                        money_off
                                                    </v-icon>
                                                </v-btn>
                                            </v-list-item-action>
                                        </v-list-item>
                                    </v-flex>
                                </v-layout>
                            </v-list>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name:"ExpansionPanelCanceledConsultations",
        props:['consultations'],
        data: () => ({
            panel:[true],
            statusSelected:'',
            indexSelected:''
        }),
        computed: {
            viewConsultation: {
                get: function(){
                    return this.indexSelected;
                },
                set: function (index) {
                   this.statusSelected = index.status;
                    this.$emit('patient', index.pacienteObj )
                    this.$emit('dialog', true)
                    this.$emit('indexSelected', {...index})
                }
            },

        }
    };
</script>
