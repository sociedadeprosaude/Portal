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
                    doctor: this.doctor,
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
