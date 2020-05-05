<template>
    <v-container>
        <v-layout row wrap>
            <v-card class="pa-2 fluid grid-list-xl align-center">
                <v-layout row wrap>
                    <v-flex xs12 sm6>
                        <v-combobox class="mx-1"
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
                                >{{ data.item.name }}
                                </v-chip>
                            </template>
                        </v-combobox>
                    </v-flex>
                    <v-flex xs12 sm6>
                        <v-combobox
                                class="mx-1"
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
                                >{{ data.item.name }}
                                </v-chip>
                            </template>
                        </v-combobox>
                    </v-flex>
                    <v-flex xs12 sm12>
                        <v-select
                                class="mx-1"
                                prepend-icon="location_city"
                                v-model="clinic"
                                :items="clinics"
                                item-text="name"
                                return-object
                                label="Clínica"
                                no-data-text="Nenhum médico para esta especialidade"
                                outlined
                                rounded
                                filled
                                chips
                                color="purple"
                                clearable
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
                                >{{ data.item.name }}
                                </v-chip>
                            </template>
                        </v-select>
                    </v-flex>
                    <v-flex xs12 sm6>
                        <v-select
                                class="mx-1"
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
                                >{{ data.item.text }}
                                </v-chip>
                            </template>
                        </v-select>
                    </v-flex>
                    <v-flex xs12 sm6 md3>
                        <v-select
                                class="mx-1"
                                v-model="times"
                                prepend-icon="alarm_add"
                                :items="timesOptions"
                                label="Horário"
                                outlined
                                rounded
                                filled
                                hint="Selecione o horario que o médico irá atender"
                                persistent-hint
                                chips
                                color="green"
                                clearable
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
                                >{{ data.item.text }}
                                </v-chip>
                            </template>
                        </v-select>
                    </v-flex>
                    <v-flex xs12 sm6 md3>
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
                                class="mx-1"
                        />
                    </v-flex>
                </v-layout>
                <v-card-actions class="text-left">
                    <v-spacer/>
                    <submit-button
                            @click="save"
                            :disabled="!formIsValid"
                            :loading="loading"
                            :success="success"
                            text="Salvar"
                    />
                </v-card-actions>
                <span class="mr-4" v-if="Object.keys(consultationsCreationInfo).length > 0"> Criando {{consultationsCreationInfo.created}}/{{consultationsCreationInfo.total}}, dia {{consultationsCreationInfo.day | dateFilter}}</span>
            </v-card>
        </v-layout>
    </v-container>
</template>

<script>
    import SubmitButton from "../../components/SubmitButton";

    let moment = require('moment/moment');
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
            maskVAGAS: '##',
            dataStart: '',
            dataTheEnd: '',
            dateFormatted: '',
            semana: [],
            vagas: '',
            medicos: '',
            especialidade: undefined,
            clinic: undefined,
            times: '',
            medicosOptions: [],
            timesOptions: [
                {text: '06:00'},
                {text: '06:30'},
                {text: '07:00'},
                {text: '07:30'},
                {text: '08:00'},
                {text: '08:30'},
                {text: '09:00'},
                {text: '09:30'},
                {text: '10:00'},
                {text: '10:30'},
                {text: '11:00'},
                {text: '11:30'},
                {text: '12:00'},
                {text: '12:30'},
                {text: '13:00'},
                {text: '13:30'},
                {text: '14:00'},
                {text: '14:30'},
                {text: '15:00'},
                {text: '15:30'},
                {text: '16:00'},
                {text: '16:30'},
                {text: '17:00'}
            ],

            semanaOptions: [
                {text: 'segunda-feira', value: 1},
                {text: 'terça-feira', value: 2},
                {text: 'quarta-feira', value: 3},
                {text: 'quinta-feira', value: 4},
                {text: 'sexta-feira', value: 5},
                {text: 'sábado', value: 6},
                {text: 'domingo', value: 0}
            ],
        }),
        computed: {
            consultationsCreationInfo() {
                return this.$store.getters.consultationsCreationInfo
            },
            specialties() {

                let espArray = Object.values(this.$store.getters.specialties);
                espArray = espArray.filter(specialty => {
                    if (!this.medicos) {
                        return true;
                    }
                    let find = false;
                    specialty.doctors.forEach(doctor => {
                        if (doctor.cpf === this.medicos.cpf) {
                            find = true;
                            return true;
                        }
                    });

                    return find;
                });
                return espArray;
            },
            formIsValid() {
                return this.medicos && this.dataStart && this.semana.length > 0 && this.vagas && this.especialidade && this.times && this.dataTheEnd && this.clinic
            },
            computedDateFormattedStart() {
                return this.formatDate(this.dataStart)
            },
            computedDateFormattedTheEnd() {
                return this.formatDate(this.dataTheEnd)
            },

            doctors() {
                let doctors = Object.values(this.$store.getters.doctors);
                if (this.especialidade) {
                    doctors = doctors.filter((a) => {
                        for (let spe in a.specialties) {
                            if (a.specialties[spe].name === this.especialidade.name) {
                                return true
                            }
                        }
                        return false
                    })
                }
                return doctors
            },
            clinics() {
                return this.$store.getters.clinics.filter(a => {
                    return a.property;
                });
            }
        },
        mounted() {
            this.$store.dispatch('getSpecialties');
            this.$store.dispatch('getDoctors');
            this.$store.dispatch('getClinics');
            this.dataStart = moment().format('YYYY-MM-DD');
            this.dataTheEnd = moment().format('YYYY-MM-DD');
            this.dateFormatted = moment().format('YYYY-MM-DD')
        },

        watch: {},
        methods: {
            formatDate(date) {
                if (!date) return null;
                const [year, month, day] = date.split('-');
                return `${day}/${month}/${year}`
            },
            cleanExamsAndSpecialtiesFromClinic(clinic) {
                delete clinic.exams;
                delete clinic.specialties;
                return clinic
            },
            clear() {
                this.dataStart = moment().format('YYYY-MM-DD');
                this.dataTheEnd = moment().format('YYYY-MM-DD');
                this.semana = [];
                this.vagas = '';
                this.medicos = '';
                this.especialidade = '';
                this.times = '';
                this.clinic = undefined
            },
            async save() {
                this.loading = true;
                let consultation = {
                    start_date: this.dataStart,
                    final_date: this.dataTheEnd,
                    specialty: this.especialidade,
                    hour: this.times,
                    clinic: this.cleanExamsAndSpecialtiesFromClinic(this.clinic),
                    doctor: this.medicos,
                    vacancy: this.vagas,
                    weekDays: this.semana
                };
                await this.$store.dispatch('createConsultation', consultation);
                this.success = true;
                this.loading = false
            }
        }
    }
</script>
