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
                                    placeholder="Especialidade"
                                    outlined
                                    color="write"
                                    class="mr-3"
                            />
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
                                            v-model="computedDateFormatted"
                                            placeholder="Data Inicial"
                                            hint="Data Inicial"
                                            v-on="on"
                                            class="mx-3"
                                    />
                                </template>
                                <v-date-picker v-model="date" no-title @input="menu1 = false" @change="getConsultationsDorctors()"></v-date-picker>
                            </v-menu>
                        </v-flex>
                    </v-layout>
                    <v-layout aling-center row wrap>
                        <v-flex xs12>
                            <CardDoctorsManagementConsultations @consultationSelect="consultatioSelect= $event" @patientSelect="patientSelected = $event" :especialtie="especialtie" :date="date"/>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
            <v-flex xs4>
                <CardInformationManagementConsultations :patient="patientSelected" :consultation="consultatioSelect"></CardInformationManagementConsultations>
            </v-flex>
        </v-layout>
</template>

<script>
    import moment from 'moment/moment'
    import CardDoctorsManagementConsultations from '../../../components/doctorsAgenda/ManagementConsultations/CardDoctorsManagementConsultations'
    import CardInformationManagementConsultations from '../../../components/doctorsAgenda/ManagementConsultations/CardInformationManagementConsultations'
    export default {
        components:{CardDoctorsManagementConsultations, CardInformationManagementConsultations},
        data: vm  => ({
            date: new Date().toISOString().substr(0, 10),
            dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
            menu1: false,
            loadingConsultations:false,
            especialtie: '',
            patientSelected:{},
            consultatioSelect:{}
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
            this.initialConfig();
            this.date = moment().format('YYYY-MM-DD');
            this.dateFormatted = moment().format('DD/MM/YYYY')
        },
        watch: {
            date (val) {
                this.dateFormatted = this.formatDate(this.date)
            },
        },
        methods: {
            async initialConfig() {
                await this.$store.dispatch("getSpecialties");
                this.especialidade = this.specialties[0]
                this.getConsultationsDorctors()

            },

            formatDate (date) {
                if (!date) return null;
                const [year, month, day] = date.split('-');
                return `${day}/${month}/${year}`
            },

            parseDate (date) {
                if (!date) return null;
                const [month, day, year] = date.split('/');
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            },

            returnOutRule(item){
                let dateConsultation = moment(item.consultation.date);
                let today = moment();
                let diff = today.diff(dateConsultation,'days');
                return diff > 21
            },
            async getConsultationsDorctors(){
                this.loadingConsultations= true
                await this.$store.dispatch('listenConsultations',
                    {
                        start_date: this.date,
                        final_date: moment().add(10, 'days').format('YYYY-MM-DD 23:59:59')
                    })
                this.loadingConsultations= false
            }
        },
    }
</script>
<style scoped>

</style>
