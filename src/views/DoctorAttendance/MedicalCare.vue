<template>
    <v-layout row wrap v-if="this.$vuetify.breakpoint.name !== 'xs'">
        <v-flex xs8>
            <v-card class="pa-4">
                <v-layout aling-center row wrap>
<!--                    <v-flex xs12 class="mt-4 pa-0 ">
                        <v-checkbox
                                class="pl-3 py-0 my-0"
                                v-model="examTypeCheck"
                                color="primary"
                        >
                            <template v-slot:label>
                                <div >Listar agendas de exames</div>
                            </template>
                        </v-checkbox>
                    </v-flex>-->
                    <v-flex v-if="!examTypeCheck" xs12 sm4>
                        <v-combobox
                                v-model="specialty"
                                :items="specialties"
                                item-text="name"
                                return-object
                                placeholder="Especialidade"
                                outlined
                                color="write"
                                class="mr-3"
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
                                        color="primary"
                                >{{ data.item.name }}
                                </v-chip>
                            </template>
                        </v-combobox>
                    </v-flex>
                    <v-flex v-else>
                        <v-combobox
                                v-model="examType"
                                :items="examTypes"
                                item-text="name"
                                return-object
                                placeholder="Exames"
                                outlined
                                color="write"
                                class="mr-3"
                        />
                    </v-flex>
                    <v-flex xs12 sm4>
                        <!--disabled-->
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
                                <!--disabled-->
                                <v-text-field
                                        outlined
                                        v-model="computedDateFormatted"
                                        placeholder="Data Inicial"
                                        hint="Data Inicial"
                                        v-on="on"
                                        class="mx-3"
                                />
                            </template>
                            <!--disabled-->
                            <v-date-picker v-model="date" no-title @input="menu1 = false"
                                           @change="getConsultationsDorctors()"/>
                        </v-menu>
                    </v-flex>
                </v-layout>
                <!--dividir em tabs aqui: 2-->
                <v-layout aling-center row wrap>
                    <v-flex xs12>
                        <CardManagementConsultationsOfUserDoctor @consultationSelect="consultatioSelect= $event"
                                                                 @patientSelect="patientSelected = $event" :filterByExam="examTypeCheck" :examType="examType"
                                                                 :specialty="specialty" :date="date"/>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-flex>
        <v-flex xs4>
            <CardManagementConsultationsInformation :patient="patientSelected" :consultation="consultatioSelect"/>
        </v-flex>
    </v-layout>

    <v-layout row wrap v-else>
        <v-tabs grow
                dark
                background-color="primary"
        >
            <v-tab href="#consultations" v-if="!patientSelected.name" >Consultas</v-tab>
            <v-tab href="#attendance">Atendimentos</v-tab>

            <v-tab-item value="consultations">
                <v-layout aling-center row wrap>
                    <!--                    <v-flex xs12 class="mt-4 pa-0 ">
                                            <v-checkbox
                                                    class="pl-3 py-0 my-0"
                                                    v-model="examTypeCheck"
                                                    color="primary"
                                            >
                                                <template v-slot:label>
                                                    <div >Listar agendas de exames</div>
                                                </template>
                                            </v-checkbox>
                                        </v-flex>-->
                    <v-flex xs12 class="transparent"><span style="color: transparent">.</span></v-flex>
                    <v-flex v-if="!examTypeCheck" xs12 sm4>
                        <v-combobox
                                v-model="specialty"
                                :items="specialties"
                                item-text="name"
                                return-object
                                placeholder="Especialidade"
                                outlined
                                color="write"
                                class="mx-1"
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
                                        color="primary"
                                >{{ data.item.name }}
                                </v-chip>
                            </template>
                        </v-combobox>
                    </v-flex>
                    <v-flex v-else>
                        <v-combobox
                                v-model="examType"
                                :items="examTypes"
                                item-text="name"
                                return-object
                                placeholder="Exames"
                                outlined
                                color="write"
                                class="mr-3"
                        />
                    </v-flex>
                    <v-flex xs12 sm4>
                        <!--disabled-->
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
                                <!--disabled-->
                                <v-text-field
                                        outlined
                                        v-model="computedDateFormatted"
                                        placeholder="Data Inicial"
                                        hint="Data Inicial"
                                        v-on="on"
                                        class="mx-1"
                                />
                            </template>
                            <!--disabled-->
                            <v-date-picker v-model="date" no-title @input="menu1 = false"
                                           @change="getConsultationsDorctors()"/>
                        </v-menu>
                    </v-flex>
                    <v-flex>
                        <v-card>
                            <v-layout aling-center row wrap>
                                <v-flex xs12>
                                    <CardManagementConsultationsOfUserDoctor @consultationSelect="consultatioSelect= $event"
                                                                             @patientSelect="patientSelected = $event" :filterByExam="examTypeCheck" :examType="examType"
                                                                             :specialty="specialty" :date="date"/>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-tab-item>
            <v-tab-item value="attendance">
                <v-flex xs12>
                    <CardManagementConsultationsInformation :patient="patientSelected" :consultation="consultatioSelect"/>
                </v-flex>
            </v-tab-item>
        </v-tabs>
    </v-layout>
</template>

<script>
    import moment from 'moment/moment'
    import CardManagementConsultationsOfUserDoctor from "../../components/Attendance/CardManagementConsultationsOfUserDoctor";
    import CardManagementConsultationsInformation from "../../components/Attendance/CardManagementConsultationsInformation";
    export default {
        components: {CardManagementConsultationsInformation,CardManagementConsultationsOfUserDoctor,},
        data: vm => ({
            date: new Date().toISOString().substr(0, 10),
            dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
            menu1: false,
            loadingConsultations: false,
            specialty: '',
            examType:'',
            examTypeCheck:false,
            patientSelected: {},
            consultatioSelect: {}
        }),
        computed: {
            specialties() {
                let userDoctorSpecialties =  this.$store.getters.user.specialties
                let allDoctors = this.$store.getters.specialties;
                let specialtiesOfDoctorLogged = []
                for(let i in userDoctorSpecialties){
                    for(let j in allDoctors){
                        if ( userDoctorSpecialties[i].id === allDoctors[j].id){
                            specialtiesOfDoctorLogged.push(allDoctors[j])
                        }
                    }
                }
                //return this.$store.getters.user.specialties
                //return this.$store.getters.specialties;
                return specialtiesOfDoctorLogged
            },
            computedDateFormatted() {
                return this.formatDate(this.date)
            },
            examTypes() {
                return this.$store.getters.examsTypes.filter((examType)=>{
                    return examType.scheduleable
                });
            }
        },
        mounted() {
            this.initialConfig();
            this.date = moment().format('YYYY-MM-DD');
            this.dateFormatted = moment().format('DD/MM/YYYY')
        },
        watch: {
            date(val) {
                this.dateFormatted = this.formatDate(this.date)
            }
        },
        methods: {
            async initialConfig() {
                await this.$store.dispatch("getSpecialties");
                this.specialty = this.specialties[0];
                this.getConsultationsDorctors()

            },
            formatDate(date) {
                if (!date) return null;
                const [year, month, day] = date.split('-');
                return `${day}/${month}/${year}`
            },

            parseDate(date) {
                if (!date) return null;
                const [month, day, year] = date.split('/');
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            },

            returnOutRule(item) {
                let dateConsultation = moment(item.consultation.date);
                let today = moment();
                let diff = today.diff(dateConsultation, 'days');
                return diff > 21
            },
            async getConsultationsDorctors() {
                this.loadingConsultations = true;
                await this.$store.dispatch('listenConsultations',
                    {
                        start_date: this.date,
                        final_date: moment().add(10, 'days').format('YYYY-MM-DD 23:59:59')
                    });
                this.loadingConsultations = false
            }
        },
    }
</script>
<style scoped>
</style>