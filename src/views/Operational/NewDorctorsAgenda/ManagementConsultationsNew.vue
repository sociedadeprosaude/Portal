<template>
        <v-layout row wrap>
            <v-flex xs8>
                <v-card class="pa-4">
                    <v-layout aling-center row wrap>
                        <v-flex xs12 sm4>
                            <v-combobox
                                    v-model="especialtie"
                                    :items="specialties"
                                    item-text="name"
                                    return-object
                                    label="Especialidade"
                                    outlined
                                    color="write"
                            >
                            </v-combobox>
                        </v-flex>
                        <v-flex sm2>
                            <v-spacer></v-spacer>
                        </v-flex>
                        <v-flex xs4>
                            <v-menu
                                    ref="menu1"
                                    v-model="menu1"
                                    :close-on-content-click="false"
                                    transition="scale-transition"
                                    offset-y
                                    max-width="290px"
                                    min-width="290px"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                            outlined
                                            v-model="dateFormatted"
                                            label="Data Inicial"
                                            @blur="date = parseDate(dateFormatted)"
                                            v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker>
                            </v-menu>
                        </v-flex>
                    </v-layout>
                    <v-layout aling-center row wrap>
                        <v-flex xs12>
                            <CardDoctorsManagementConsultations :especialtie="especialtie" :date="date"></CardDoctorsManagementConsultations>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex xs4>
                <v-card class="pa-4" color="indigo darken-4">
                    <v-layout row wrap aling-center>
                        <v-flex xs12>
                            <p class="white--text">Consultas</p>
                        </v-flex>
                        <v-flex xs12>
                            <v-divider color="white"></v-divider>
                        </v-flex>
                        <v-flex xs12>
                            <p>Componente Paciente</p>
                        </v-flex>
                        <v-flex xs12>
                            <v-divider color="white"></v-divider>
                        </v-flex>
                        <v-flex xs12>
                            <p>Componente Consulta</p>
                        </v-flex>
                        <v-flex xs12>
                            <v-spacer></v-spacer>
                        </v-flex>
                        <v-flex xs5>
                            <v-btn>Apagar</v-btn>
                        </v-flex>
                        <v-flex xs2>
                            <v-spacer></v-spacer>
                        </v-flex>
                        <v-flex xs5>
                            <v-btn>Retorno</v-btn>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
</template>

<script>
    import moment from 'moment/moment'
    import CardDoctorsManagementConsultations from '../../../components/doctorsAgenda/ManagementConsultations/CardDoctorsManagementConsultations'

    export default {
        components:{CardDoctorsManagementConsultations},
        data: vm  => ({
            date: new Date().toISOString().substr(0, 10),
            dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
            menu1: false,
            especialtie: '',
        }),
        computed: {
            specialties() {
                return this.$store.getters.specialties;
            },
            computedDateFormatted () {
                return this.formatDate(this.date)
            },
        },
        mounted() {
            this.initialConfig()
            this.date = moment().format('YYYY-MM-DD')
            this.dateFormatted = moment().format('DD/MM/YYYY')
        },
        watch: {
            date (val) {
                this.dateFormatted = this.formatDate(this.date)
            },
        },
        methods: {
            async initialConfig() {
                await this.$store.dispatch("getSpecialties")
                this.especialidade = this.specialties[0]
            },
            formatDate (date) {
                if (!date) return null

                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            },
            parseDate (date) {
                if (!date) return null

                const [month, day, year] = date.split('/')
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            },

        },
    }
</script>
<style scoped>
</style>
