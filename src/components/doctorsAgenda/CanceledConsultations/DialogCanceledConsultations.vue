<template>
    <v-container>
        <v-layout>
            <div class="text-xs-center">
                    <v-card>
                        <v-card-title class="headline grey lighten-2" primary-title>
                            Informações
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12 sm6>
                                        <v-text-field readonly hide-details outlined prepend-icon="person"
                                                      label="Nome do Paciente" v-model="indexSelected.patient.name">
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6>
                                        <v-text-field readonly hide-details outlined prepend-icon="credit_card"
                                                      label="CPF" v-model="indexSelected.patient.cpf">
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12>
                                        <v-divider/>
                                    </v-flex>
                                    <v-flex xs12 sm6>
                                        <v-text-field readonly hide-details outlined prepend-icon="person"
                                                      label="Nome do Médico" v-model="indexSelected.doctor.name">
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6>
                                        <v-text-field readonly hide-details outlined prepend-icon="credit_card"
                                                      v-model="indexSelected.doctor.crm" label="CRM">
                                        </v-text-field>
                                    </v-flex>

                                    <v-flex xs12 sm6>
                                        <v-text-field readonly hide-details outlined prepend-icon="poll" :label="indexSelected.product.type === 'EXAM' ? 'Exame' : 'Especialidade'"
                                                      v-model="indexSelected.product.name"/>
                                    </v-flex>

                                    <v-flex xs12 sm6>
                                        <v-text-field readonly hide-details outlined prepend-icon="event"
                                                      label="Dia da Consulta" v-model="computedDateFormattedSelected">
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6>
                                        <v-text-field readonly hide-details outlined prepend-icon="access_alarm"
                                                      label="Hora da Consulta" v-model="indexSelected.hora">
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6>
                                        <v-text-field prepend-icon="assignment_turned_in" v-model="indexSelected.status"
                                                      label="Status" chips outlined hide-details readonly>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6>
                                        <v-text-field prepend-icon="assignment" v-model="indexSelected.type"
                                                      readonly outlined hide-details label="Modalidade">
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6>
                                        <v-text-field prepend-icon="receipt" label="Nº do Recibo"
                                                      v-model="indexSelected.num_recibo" outlined hide-details readonly>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12 lg12>
                                        <v-divider/>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-select
                                                prepend-icon="device_unknown"
                                                v-model="attendance"
                                                :items="attendanceOptions"
                                                label="Atendimento"
                                                chips
                                                outlined
                                                hide-details
                                                readonly>
                                        </v-select>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-checkbox
                                                v-model="call"
                                                label="Paciente não atendeu ?"
                                                color="red"
                                                value="red">
                                        </v-checkbox>
                                    </v-flex>
                                    <v-flex xs12 v-show="call">
                                        <v-text-field clearable label="ID da ligação" type="number" v-model="idCall"
                                                      outlined hide-details prepend-icon="call"/>
                                    </v-flex>
                                    <v-flex xs12 v-show="call">
                                        <v-textarea clearable label="Descrição da ligação" v-model="descriptionCall"
                                                    outlined hide-details prepend-icon="perm_phone_msg"/>
                                    </v-flex>
                                    <v-flex xs12 v-if="indexSelected.calls">
                                        <v-select
                                                :items="indexSelected.calls"
                                                item-text="idCall"
                                                return-object
                                                multiple
                                                v-model="indexSelected.calls"
                                                chips
                                                outlined
                                                readonly
                                        >
                                            <template v-slot:selection="data">
                                                <v-chip
                                                        :key="JSON.stringify(data.item)"
                                                        :input-value="data.selected"
                                                        :disabled="data.disabled"
                                                        class="v-chip--select-multi"
                                                        @click.stop="data.parent.selectedIndex = data.index"
                                                        @input="data.parent.selectItem(data.item)"
                                                        text-color="white"
                                                        color="info"
                                                >
                                                    {{ data.item.dayOfTheWeekCall }}:{{ data.item.dateHourCall }} - {{
                                                    data.item.idCall }} - {{ data.item.descriptionCall }}
                                                </v-chip>
                                            </template>
                                        </v-select>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-divider/>
                        <v-card-actions>
                            <v-btn color="warning" rounded @click="CloseDialog()">Voltar
                                <v-icon right>clear</v-icon>
                            </v-btn>
                            <v-spacer/>
                            <v-btn color="primary" rounded @click="registerCall()" :disabled="!this.idCall || !this.descriptionCall">
                                Registrar
                                <v-icon>phone_disabled</v-icon>
                            </v-btn>
                            <v-spacer/>
                            <v-btn color="error" rounded @click="deleteConsultation">Apagar
                                <v-icon right>delete</v-icon>
                            </v-btn>
                            <v-spacer/>
                            <v-btn
                                    color="success"
                                    rounded
                                    :to="{ name: 'AgendamentoConsultas', params: { q: indexSelected.consultation, type:'Remarcar'}}"
                                    :disabled="indexSelected.status !== 'Pago'"
                            >Remarcar
                                <v-icon right>assignment_turned_in</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
            </div>
        </v-layout>
    </v-container>
</template>

<script>
    let moment = require('moment/moment');
    export default {
        props:['indexSelected'],
        data: () => ({
            call: undefined,
            calls: [],
            descriptionCall: undefined,
            idCall: undefined,
            attendance:'Aguardando Atendimento',
            attendanceOptions: [
                    {text: 'Aguardando Atendimento'},
                    {text: 'Atendimento Realizado'},
                ],
        }),
        computed: {
            computedDateFormattedSelected() {
                return moment(this.indexSelected.data).format('DD/MM/YYYY')
            }
        },
        methods: {
            deleteConsultation () {
                this.$emit('delete', {... this.indexSelected.consultation})
                this.$emit('dialog', false)
            },
            CloseDialog(){
                this.$emit('dialog', false)
            },
            async registerCall(){
                let val = {
                    idCall: this.idCall,
                    descriptionCall: this.descriptionCall,
                    dateHourCall: moment().locale('pt-BR').format('DD/MM/YYYY HH:mm:ss'),
                    dayOfTheWeekCall: moment().format('dddd'),
                };
                if (this.indexSelected.calls === undefined){
                    this.calls.push(val);
                    let values ={
                        calls: this.calls,
                        idConsultation: this.indexSelected.co,
                    }
                    this.$emit('registerCall', values)
                    await this.$store.dispatch('addArrayCallsToConsultation', {
                        calls: this.calls,
                        idConsultation: this.indexSelected.idConsultation,
                    });
                    this.calls = []
                } else {
                    this.indexSelected.calls.push(val);
                    let values ={
                        calls: this.indexSelected.calls,
                        idConsultation: this.indexSelected.idConsultation,
                    }
                    this.$emit('registerCall', values)
                    await this.$store.dispatch('addArrayCallsToConsultation', {
                        calls: this.indexSelected.calls,
                        idConsultation: this.indexSelected.idConsultation,
                    })
                }
                this.resetData();
            },
            resetData () {
                this.call = undefined;
                this.idCall = undefined;
                this.descriptionCall = undefined;
                this.$emit('dialog', false)
            }
        },
    };
</script>
