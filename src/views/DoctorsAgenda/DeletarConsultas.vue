<template>
    <v-container>
        <v-layout row wrap>

            <v-card>

            <template>
                <v-container fluid grid-list-xl>
                    <v-layout align-center wrap>
                        <v-flex xs12 sm4>
                            <v-select
                                    label="Especialidade"
                                    prepend-icon="school"
                                    v-model="especialidade"
                                    :items="specialties"
                                    item-text="name"
                                    return-object
                                    outlined
                                    rounded
                                    filled
                                    chips
                                    color="pink"
                                    clearable
                            ></v-select>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-flex xs12 sm4>
                            <v-select
                                    prepend-icon="account_circle"
                                    v-model="doctor"
                                    :items="doctors"
                                    item-text="name"
                                    return-object
                                    label="Médico"
                                    no-data-text="Nenhum médico para esta especialidade"
                                    outlined
                                    rounded
                                    filled
                                    chips
                                    color="purple"
                                    clearable
                            ></v-select>
                        </v-flex>
                        <v-flex xs12 sm4>
                            <v-menu
                                    ref="menu"
                                    v-model="menu"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    min-width="290px"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                            v-model="computedDateFormatted"
                                            label="Dia para Deletar"
                                            prepend-icon="event_busy"
                                            outline
                                            hint="Selecione o dia para deletar as consultas do mesmo."
                                            persistent-hint
                                            color="error"
                                            clearable
                                            rounded
                                            filled
                                            readonly
                                            v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                        ref="picker"
                                        v-model="date"
                                        :min="new Date().toISOString().substr(0, 10)"
                                        locale="pt-br"
                                        color="red"
                                        @change="save"
                                ></v-date-picker>
                            </v-menu>
                        </v-flex>
                    </v-layout>

                    <v-layout align-center justify-center>
                        <v-btn
                                @click="deleteConsultasDia"
                                color="error"
                                rounded
                                :disabled="!formIsValid"
                        >
                            DELETAR
                            <v-icon right>delete_forever</v-icon>
                        </v-btn>
                    </v-layout>

                </v-container>
            </template>



<!--
                <template>
                    <v-container class="align-center justify-center">
                        <v-layout column align-center justify-center wrap>
                            <v-subheader>Hoje: {{date | dateFilter}}</v-subheader>
                            <v-expansion-panel popout>
                                <v-expansion-panel-content
                                        v-for="(message, i) in menssagens"
                                        :key="i"
                                        class="elevation-6"
                                        hide-actions
                                >
                                    <template v-slot:header>
                                        <v-layout align-center row spacer>

                                            <v-flex sm6 md3 hidden-xs-only :class="`${message.color}--text`">
                                                <strong>Médico:</strong>
                                                <v-chip small :color="message.color" text-color="white">
                                                    <v-avatar>
                                                        <v-icon>account_circle</v-icon>
                                                    </v-avatar>
                                                    {{message.medico}}
                                                </v-chip>
                                            </v-flex>

                                            <v-flex sm6 md3 hidden-xs-only :class="`${message.color}--text`">
                                                <strong>CRM-AM:</strong>
                                                <v-chip small :color="message.color" text-color="white">
                                                    <v-avatar>
                                                        <v-icon>payment</v-icon>
                                                    </v-avatar>
                                                    {{message.crm}}
                                                </v-chip>
                                            </v-flex>

                                            <v-flex row wrap xs5 sm3 :class="`${message.color}--text`">
                                                <strong>Consultas: </strong>
                                                <v-chip small :color="message.color" text-color="white">
                                                    <v-avatar>
                                                        <v-icon>event</v-icon>
                                                    </v-avatar>
                                                    {{message.consultas}}
                                                </v-chip>
                                            </v-flex>

                                            <v-flex row wrap xs5 sm3 :class="`${message.color}--text`">
                                                <strong>Retornos: </strong>
                                                <v-chip small :color="message.color" text-color="white">
                                                    <v-avatar>
                                                        <v-icon>restore</v-icon>
                                                    </v-avatar>
                                                    {{message.retornos}}
                                                </v-chip>
                                            </v-flex>
                                        </v-layout>
                                    </template>

                                    <v-card>
                                        <v-divider></v-divider>
                                        <v-list three-line subheader>
                                            <v-layout row wrap>
                                                <v-flex sm3
                                                        xs12
                                                        v-for="item in message.pacientes"
                                                        :key="item.paciente"
                                                >
                                                    <v-list-tile
                                                            @click="visualizarConsulta = {
                                                            idConsulta:item.idConsulta,
                                                            idPaciente: item.idPaciente,
                                                            paciente: item.paciente,
                                                            cartaoId: item.cartaoId,
                                                            data: item.data,
                                                            hora: item.hora,
                                                            cpf:item.cpf,
                                                            telefone:item.telefone,
                                                            crm: message.crm,
                                                            status: item.status,
                                                            modalidade: item.modalidade,
                                                            medico:message.medico,
                                                            num_recibo:item.num_recibo,
                                                            pacienteObj:item.pacienteObj
                                                        }"
                                                    >
                                                        <v-list-tile-content>
                                                            <v-list-tile-title>
                                                                <span :class="`${message.color}--text`" style="font-weight: bolder">{{item.paciente}}</span>
                                                            </v-list-tile-title>
                                                            <v-list-tile-sub-title>
                                                                {{item.cpf}}
                                                            </v-list-tile-sub-title>
                                                            <v-list-tile-sub-title>
                                                                {{item.telefone}}
                                                            </v-list-tile-sub-title>
                                                            <v-list-tile-action-text>
                                                                {{item.data | dateFilter}} -
                                                                {{item.hora}}
                                                            </v-list-tile-action-text>
                                                        </v-list-tile-content>

                                                        <v-list-tile-action>
                                                            <v-btn icon ripple flat>
                                                                <v-icon v-if="item.modalidade === 'Retorno'" :color="message.color">restore</v-icon>
                                                                <v-icon v-if="item.modalidade === 'Consulta'" :color="message.color">event</v-icon>
                                                                <v-icon v-if="item.status === 'Pago'" color="success">attach_money</v-icon>
                                                                <v-icon v-if="item.status === 'Aguardando pagamento'" color="error">money_off</v-icon>
                                                            </v-btn>
                                                        </v-list-tile-action>
                                                    </v-list-tile>
                                                </v-flex>
                                            </v-layout>
                                        </v-list>
                                    </v-card>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-layout>
                    </v-container>
                </template>
                -->

            </v-card>

        </v-layout>
    </v-container>
</template>

<script>
    var moment = require('moment');
    export default {
        data: () => ({
            moment: moment,
            menu: false,
            especialidade: undefined,
            doctor: null,
            date: null,
            dateFormatted: '',
            loading: false,
            success: false,
        }),

        computed:{

            formIsValid () {
                return this.date  && this.doctor && this.especialidade
            },

            specialties(){
                return this.$store.getters.specialties
            },

            doctors () {
                let doctors = Object.values(this.$store.getters.doctors)
                if(this.especialidade) {
                    doctors = doctors.filter((a) => {
                        for (let spe in a.specialties) {
                            if (a.specialties[spe].name === this.especialidade.name) {
                                return true
                            }
                        }
                        return false
                        // return a.specialties.indexOf(this.especialidade.name) > -1
                    })
                }
                return doctors
            },

            computedDateFormatted () {
                return this.formatDate(this.date)
            },
        },
        async mounted() {
            this.$store.dispatch('getSpecialties')
            this.$store.dispatch('getDoctors')
            this.date = moment().format('YYYY-MM-DD')
            this.dateFormatted = moment().format('YYYY-MM-DD')
        },

        watch: {
            menu (val) {
                val && setTimeout(() => (this.$refs.picker.activePicker = 'MONTH'))
            }
        },

        methods: {

            save (date) {
                this.$refs.menu.save(date)
            },

            formatDate (date) {
                if (!date) return null
                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            },

            deleteConsultasDia () {

                var deletar = {
                    date: this.date,
                    doctor: this.doctor,
                    especialidade: this.especialidade
                }

                console.log(deletar)
                //this.$store.dispatch('removeAppointmentByDay', deletar)
                this.clear()

            },

            clear () {
                this.date = moment().format('YYYY-MM-DD');
                this.doctor = null;
                this.especialidade = undefined;
            },
        },
    }
</script>

<style scoped>
</style>
