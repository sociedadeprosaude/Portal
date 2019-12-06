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
                <v-container fluid class="align-center justify-center">
                    <v-row justify="center" align-center justify-center wrap>
                        <v-subheader>Hoje: {{date | dateFilter}}</v-subheader>

                        <v-expansion-panels popout>
                            <v-expansion-panel
                                    v-for="(doctor, i) in doctors"
                                    :key="i"
                                    hide-actions
                                    class="elevation-6"
                            >
                                <v-expansion-panel-header>
                                    <v-row align="center" class="spacer" no-gutters>

                                        <v-col cols="1" xs="2">
                                            <v-icon color="primary">person</v-icon>:
                                        </v-col>
                                        <v-col class="hidden-xs-only" xs="3">
                                            <strong  v-html="doctor"></strong>
                                        </v-col>

                                        <v-col cols="3" xs="2">
                                            <v-icon color="primary">payment</v-icon>:
                                            <strong v-html="especialidade"></strong>
                                        </v-col>

                                        <v-col cols="1" xs="2">
                                            <v-icon color="primary">event</v-icon>:
                                            <strong v-html="doctor.consultas"></strong>
                                        </v-col>

                                        <v-col cols="1" xs="2">
                                            <v-icon color="primary">restore</v-icon>:
                                            <strong v-html="doctor.retornos"></strong>
                                        </v-col>

                                    </v-row>
                                </v-expansion-panel-header>

                                <v-expansion-panel-content>
                                    <v-divider></v-divider>
                                    <v-card>
                                        <v-list three-line subheader>
                                            <v-layout wrap>
                                                <v-flex sm3
                                                        xs12
                                                        v-for="(patient, i) in patients"
                                                        :key="i"
                                                        v-if="patient.status === 'Pago'"
                                                >
                                                    <v-list-item
                                                            @click="Attendances"
                                                            :disabled="patient.attendance === 'Atendimento Realizado' ? true : false"
                                                    >
                                                        <v-list-tile-content>
                                                            <v-list-tile-title>
                                                                <span :class="`${patient.color}--text`" style="font-weight: bolder">{{patient.paciente}}</span>
                                                            </v-list-tile-title>
                                                            <v-list-tile-sub-title>
                                                                {{patient.cpf}} -
                                                                {{patient.telefone}}
                                                            </v-list-tile-sub-title>
                                                            <v-list-tile-action-text>
                                                                {{patient.data | dateFilter}} -
                                                                {{patient.hora}}
                                                            </v-list-tile-action-text>
                                                        </v-list-tile-content>

                                                        <v-list-tile-action>
                                                            <v-btn icon ripple text>
                                                                <v-icon v-if="patient.modalidade === 'Retorno'" :color="patient.color">restore</v-icon>
                                                                <v-icon v-if="patient.modalidade === 'Consulta'" :color="patient.color">event</v-icon>
                                                                <v-icon v-if="patient.attendance === 'Atendimento Realizado'" color="success">how_to_reg</v-icon>
                                                                <v-icon v-if="patient.attendance === 'Aguardando Atendimento'" color="warning">how_to_reg</v-icon>
                                                            </v-btn>
                                                        </v-list-tile-action>
                                                    </v-list-item>
                                                </v-flex>
                                            </v-layout>
                                        </v-list>
                                    </v-card>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-row>
                </v-container>
                -->
            </v-card>

        </v-layout>
    </v-container>
</template>

<script>
    var moment = require('moment');
    export default {
        data: () => ({

            //START DUMMY=====================
            /*patients: [
                {
                    color: 'primary',
                    paciente: 'JACKSON KELVIN DE SOUZA',
                    cpf:'01972524275',
                    telefone:'092999984796',
                    data: '2019-09-27',
                    hora: '08:30',
                    status: 'Pago',
                    modalidade: 'Consulta',
                    attendance:'Atendimento Realizado',
                },
                {
                    color: 'primary',
                    paciente: 'JACKSON KELVIN DE SOUZA',
                    cpf:'01972524275',
                    telefone:'092999984796',
                    data: '2019-09-27',
                    hora: '08:30',
                    status: 'Pago',
                    modalidade: 'Retorno',
                    attendance:'Atendimento Realizado',
                },
                {
                    color: 'primary',
                    paciente: 'JACKSON KELVIN DE SOUZA',
                    cpf:'01972524275',
                    telefone:'092999984796',
                    data: '2019-09-27',
                    hora: '08:30',
                    status: 'Aguardando pagamento',
                    modalidade: 'Consulta',
                    attendance:'Aguardando Atendimento',
                },
                {
                    color: 'primary',
                    paciente: 'JACKSON KELVIN DE SOUZA',
                    cpf:'01972524275',
                    telefone:'092999984796',
                    data: '2019-09-27',
                    hora: '08:30',
                    status: 'Aguardando pagamento',
                    modalidade: 'Retorno',
                    attendance:'Aguardando Atendimento',
                },
                {
                    color: 'primary',
                    paciente: 'JACKSON KELVIN DE SOUZA',
                    cpf:'01972524275',
                    telefone:'092999984796',
                    data: '2019-09-27',
                    hora: '08:30',
                    status: 'Pago',
                    modalidade: 'Consulta',
                    attendance:'Aguardando Atendimento',
                },
                {
                    color: 'primary',
                    paciente: 'JACKSON KELVIN DE SOUZA',
                    cpf:'01972524275',
                    telefone:'092999984796',
                    data: '2019-09-27',
                    hora: '08:30',
                    status: 'Pago',
                    modalidade: 'Retorno',
                    attendance:'Aguardando Atendimento',
                },
                {
                    color: 'primary',
                    paciente: 'JACKSON KELVIN DE SOUZA',
                    cpf:'01972524275',
                    telefone:'092999984796',
                    data: '2019-09-27',
                    hora: '08:30',
                    status: 'Aguardando pagamento',
                    modalidade: 'Consulta',
                    attendance:'Aguardando Atendimento',
                },
                {
                    color: 'primary',
                    paciente: 'JACKSON KELVIN DE SOUZA',
                    cpf:'01972524275',
                    telefone:'092999984796',
                    data: '2019-09-27',
                    hora: '08:30',
                    status: 'Aguardando pagamento',
                    modalidade: 'Retorno',
                    attendance:'Aguardando Atendimento',
                },
            ],
             */
            //END DUMMY====================================
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
                return this.date && this.doctor && this.especialidade
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
                    name: this.doctor,
                    specialtie: this.especialidade
                }

                console.log(deletar)
                this.$store.dispatch('removeAppointmentByDay', deletar)
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
