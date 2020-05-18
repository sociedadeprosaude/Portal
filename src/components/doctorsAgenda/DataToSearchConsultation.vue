<template>
    <v-container>
        <v-layout column>
            <v-flex sm12>
                <DataDoctorToSearchConsultation/>
            </v-flex>
            <v-flex xs12 class="mt-4">
                <v-date-picker
                        class="mx-2"
                        v-model="date"
                        locale="pt-br"
                        :allowed-dates="allowedDates"
                />
            </v-flex>
            <v-flex sm12 class="text-center mt-8 ml-2"  >
                <CardPatient ref="patientCard" max-width="300px"/>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    import DataDoctorToSearchConsultation from "../doctorsAgenda/DataDoctorToSearchConsultation"
    import CardPatient from "../Patient/DataPatient"

    let moment = require("moment/moment");

    export default {
        components: {DataDoctorToSearchConsultation, CardPatient},
        data: () => ({

            date: moment().format("YYYY-MM-DD"),

        }),

        async mounted()  {
            await this.$store.dispatch("getSchedules", {
                    start_date: moment()
                        .subtract(5, "hours")
                        .format("YYYY-MM-DD HH:mm:ss"),
                    final_date: moment()
                        .add(this.daysToListen, "days")
                        .format("YYYY-MM-DD 23:59:59")
                }
            );
        },

        watch: {

            date (val) {
                if (val === this.consultations[0].date) this.$vuetify.goTo(0, this.options);
                else this.$vuetify.goTo("#group-" + val, this.options);
            },
            doctor () {
                return this.$store.getters.doctorSelected
            },

            clinic () {
                return this.$store.getters.selectedClinic
            },

            specialty () {
                return this.$store.getters.selectedSpecialty
            },




        },

        computed: {

            doctor () {
                return this.$store.getters.doctorSelected;
            },

            clinic () {
                return this.$store.getters.selectedClinic
            },

            specialty () {
                return this.$store.getters.selectedSpecialty
            },

            options() {
                return {
                    duration: 500,
                    offset: 80,
                    easing: "easeInQuint",
                };
            },

            consultations () {
                return this.$store.getters.consultations.filter(a => {
                    if (this.doctor) {
                        if (this.doctor.cpf !== a.doctor.cpf) return  false;
                    }
                    if (this.specialty) {
                        if (this.specialty.name !== a.specialty.name) return false;
                    }
                    if (this.clinic) {
                        if (this.clinic !== a.clinic.name) return false;
                    }
                    return true;
                });
            }



        },

        methods: {

            allowedDates(val) {
                return (
                    console.log(Object.keys(this.consultationsDateFilter(this.consultations)).indexOf(val))
                );
            },

            consultationsDateFilter (consultations) {
                
                let res = {};
                consultations.sort((a,b)=>{
                    return a.date > b.date ? 1 : a.date < b.date ? -1 : 0
                });
                for (let cons in consultations) {
                    let targetDate = consultations[cons].date.split(" ")[0];
                    if (!res[targetDate]) {
                        res[targetDate] = [];
                    }
                    res[targetDate].push(consultations[cons]);
                }
                return res;
            }


        }
    }

</script>