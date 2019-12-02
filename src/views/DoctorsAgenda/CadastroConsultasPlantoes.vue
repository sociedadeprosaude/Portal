<template>
    <v-container>
        <v-layout row wrap>
            <v-card class="pa-2">
                <template>
                    <v-container fluid grid-list-xl>
                        <v-layout align-center wrap>
                            <v-flex xs12 sm6>
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
                        <v-flex xs12 sm6>
                            <v-select
                                    prepend-icon="account_circle"
                                    v-model="medicos"
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
                            <v-flex xs12 sm12>
                                <v-select
                                        prepend-icon="account_circle"
                                        v-model="clinic"
                                        :items="clinics"
                                        item-text="name"
                                        label="Clínica"
                                        no-data-text="Nenhum médico para esta especialidade"
                                        outlined
                                        rounded
                                        filled
                                        chips
                                        color="purple"
                                        clearable
                                ></v-select>
                            </v-flex>
                    </v-layout>
                </v-container>
            </template>

            <template>
                <v-container fluid grid-list-xl>
                    <v-layout align-center wrap>

                        <v-flex sm3>
                            <v-menu
                                    ref="menu1"
                                    v-model="menu1"
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
                                            v-model="computedDateFormattedStart"
                                            label="Data Inicial"
                                            prepend-icon="event"
                                            readonly
                                            outlined
                                            rounded
                                            filled
                                            clearable
                                            v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                        ref="picker"
                                        v-model="dataStart"
                                        locale="pt-br"
                                        :min="new Date().toISOString().substr(0, 10)"
                                        @change="save1"
                                ></v-date-picker>
                            </v-menu>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-flex sm3>
                            <v-menu
                                    ref="menu2"
                                    v-model="menu2"
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
                                            v-model="computedDateFormattedTheEnd"
                                            label="Data Final"
                                            prepend-icon="event"
                                            readonly
                                            outlined
                                            rounded
                                            filled
                                            clearable
                                            v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                        ref="picker"
                                        v-model="dataTheEnd"
                                        locale="pt-br"
                                        :min="new Date().toISOString().substr(0, 10)"
                                        @change="save2"
                                ></v-date-picker>
                            </v-menu>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-flex sm6>
                            <v-select
                                    v-model="semana"
                                    prepend-icon="event"
                                    :items="semanaOptions"
                                    label="Dias da Semana"
                                    hint="Selecione os dias da semana que o médico irá atender"
                                    persistent-hint
                                    outlined
                                    rounded
                                    filled
                                    multiple
                                    chips
                                    color="blue"
                                    clearable
                            ></v-select>
                        </v-flex>
                    </v-layout>
                </v-container>
            </template>

            <template>
                <v-container fluid grid-list-xl>
                    <v-layout align-center wrap>
                        <v-flex xs12 sm6>
                            <v-select
                                    v-model="times"
                                    prepend-icon="alarm_add"
                                    :items="timesOptions"
                                    label="Horários"
                                    attach
                                    outlined
                                    rounded
                                    filled
                                    hint="Selecione o horario que o médico irá atender"
                                    persistent-hint
                                    chips
                                    color="green"
                                    clearable
                            ></v-select>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-flex xs12 sm6 md6>
                            <v-text-field
                                    prepend-icon="looks_6"
                                    v-model="vagas"
                                    :mask="maskVAGAS"
                                    label="Número de Vagas"
                                    placeholder="exemplo: 22"
                                    outlined
                                    rounded
                                    filled
                                    chips
                                    color="red"
                                    clearable
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
            </template>

            <v-layout align-end justify-end>
                <submit-button
                        @click="save"
                        :disabled="!formIsValid"
                        :loading="loading"
                        :success="success"
                        text="Salvar"

                >
                </submit-button>
                <v-dialog
                        v-model="loader"
                        hide-overlay
                        persistent
                        width="300"
                >
                    <v-card
                            color="success"
                            dark
                    >
                        <v-card-text>
                            Salvando...
                            <v-progress-linear
                                    indeterminate
                                    color="white"
                                    class="mb-0"
                            ></v-progress-linear>
                        </v-card-text>
                    </v-card>
                </v-dialog>
                <v-snackbar
                        v-model="snackbar"
                        :bottom="y === 'bottom'"
                        :left="x === 'left'"
                        color="success"
                        :multi-line="mode === 'multi-line'"
                        :right="x === 'right'"
                        :top="y === 'top'"
                        :vertical="mode === 'vertical'"
                >
                    {{this.mensagem}}
                    <v-spacer></v-spacer>
                    <v-icon dark>event_available</v-icon>
                </v-snackbar>
            </v-layout>

            </v-card>

        </v-layout>
    </v-container>
</template>

<script>
    import SubmitButton from "../../components/SubmitButton";
    var moment = require('moment');
    export default {

        components: {
          SubmitButton
        },

        data: () => ({
            loading: false,
            success: false,
            y: 'top',
            x: null,
            mode: '',
            moment: moment,
            maskVAGAS:'##',
            dataStart:'',
            dataTheEnd:'',
            dateFormatted: '',
            semana:[],
            vagas:'',
            medicos: '',
            especialidade: undefined,
            clinic: undefined,
            times:'',
            medicosOptions: [],
            timesOptions: [
                { text: '06:00'},
                { text: '06:30'},
                { text: '07:00'},
                { text: '07:30'},
                { text: '08:00'},
                { text: '08:30'},
                { text: '09:00'},
                { text: '09:30'},
                { text: '10:00'},
                { text: '10:30'},
                { text: '11:00'},
                { text: '11:30'},
                { text: '12:00'},
                { text: '12:30'},
                { text: '13:00'},
                { text: '13:30'},
                { text: '14:00'},
                { text: '14:30'},
                { text: '15:00'},
                { text: '15:30'},
                { text: '16:00'},
                { text: '16:30'},
                { text: '17:00'}
            ],
            menu1: false,
            menu2: false,
            semanaOptions: [
                { text: 'segunda-feira', value: 1},
                { text: 'terça-feira', value: 2},
                { text: 'quarta-feira', value: 3},
                { text: 'quinta-feira', value: 4},
                { text: 'sexta-feira', value: 5},
                { text: 'sábado', value: 6},
                { text: 'domingo', value: 0}
            ],
        }),
        computed:{
            specialties(){
                return this.$store.getters.specialties
            },
            formIsValid () {
                return this.medicos && this.dataStart && this.semana.length > 0 && this.vagas && this.especialidade && this.times && this.dataTheEnd && this.clinic
            },
            computedDateFormattedStart () {
                return this.formatDate(this.dataStart)
            },
            computedDateFormattedTheEnd () {
                return this.formatDate(this.dataTheEnd)
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

            clinics() {
                return this.$store.getters.clinics
            }
        },
        mounted() {
            this.$store.dispatch('getSpecialties')
            this.$store.dispatch('getDoctors')
            this.$store.dispatch('getClinics')
            this.dataStart = moment().format('YYYY-MM-DD')
            this.dataTheEnd = moment().format('YYYY-MM-DD')
            this.dateFormatted = moment().format('YYYY-MM-DD')
        },
        watch: {
            menu1 (val) {
                val && setTimeout(() => (this.$refs.picker.activePicker = 'MONTH'))
            },
            menu2 (val) {
                val && setTimeout(() => (this.$refs.picker.activePicker = 'MONTH'))
            }
        },

        methods: {
            saveDatesTimeVacancy () {
                var dataInicio = moment(this.dataStart,'YYYY-MM-DD')
                var dataFim = moment(this.dataTheEnd,'YYYY-MM-DD')
                var num_dias = dataFim.diff(dataInicio,'days')
                var datas = []

                if(this.semana.indexOf(dataInicio.day()) != -1){
                    datas.push(dataInicio.format('YYYY-MM-DD'))
                }
                for (let index = 0; index < num_dias; index++) {
                    if(this.semana.indexOf(dataInicio.add(1,'day').day()) != -1){
                        datas.push(dataInicio.format('YYYY-MM-DD'))
                    }
                }
                var medico = this.$store.getters.medico({especialidade: this.especialidade,medico:this.medicos})
                const medicoInfos = {
                    datas: datas,
                    horas: this.times,
                    vagas: this.vagas,
                    medico: medico,
                    espMed: this.especialidade
                }
                this.$store.dispatch('addDatesTimeVacancy', medicoInfos)
                this.clear()
            },
            save1 (dataStart) {
                this.$refs.menu1.save1(dataStart)
            },
            save2 (dataTheEnd) {
                this.$refs.menu2.save2(dataTheEnd)
            },
            formatDate (date) {
                if (!date) return null
                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            },
            clear () {
                this.dataStart = moment().format('YYYY-MM-DD')
                this.dataTheEnd = moment().format('YYYY-MM-DD')
                this.semana =[]
                this.vagas =''
                this.medicos = ''
                this.especialidade = ''
                this.times = ''
            },
            async save () {
                this.loading = true
                let consultation = {
                    start_date: this.dataStart,
                    final_date: this.dataTheEnd,
                    specialty: this.especialidade,
                    hour: this.times,
                    clinic: this.clinic,
                    doctor: this.medicos,
                    vacancy: this.vagas,
                    weekDays: this.semana
                }
                await this.$store.dispatch('createConsultation', consultation)
                // setTimeout(() => (this.saveDatesTimeVacancy()), 1000)
                this.success = true
                this.loading = false
            }
        }
    }
</script>

<style scoped>
</style>
