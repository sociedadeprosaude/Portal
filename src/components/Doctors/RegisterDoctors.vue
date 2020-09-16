<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex sm12>
                <v-card class="pt-3">
                    <v-layout row wrap>
                        <v-flex sm8>
                            <v-text-field
                                    outlined
                                    placeholder="Médicos"
                                    class="mx-5"
                                    color="primary"
                                    v-model="search"
                                    :loading="loading"
                                    id="search"
                            />
                        </v-flex>
                        <v-flex sm4 class="text-right pr-3 mt-2">
                            <v-btn outlined class="primary--text" @click="addDoctor">cadastrar médico</v-btn>
                        </v-flex>
                    </v-layout>
                </v-card>

                <v-card>
                    <v-card-text v-if="doctorsArray.length !== 0">
                        <ListDoctors @deleteDoctorFromDatabase="deleteDoctorFromDatabase($event)" :doctorsArray="doctorsArray" :doctors=doctors :loading="loading" @loading="loading = !loading"/>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-dialog v-model="creatingDoctor" max-width="500px">
                <CreateDoctorCard @clean="selectedDoctor = undefined" @close="creatingDoctor = false"/>
            </v-dialog>
        </v-layout>
    </v-container>
</template>
<script>
    import CreateDoctorCard from "../../components/Doctors/CreateDoctorCard";
    import ListDoctors from "../../components/Doctors/ListDoctors";
    export default {
        components: {CreateDoctorCard, ListDoctors},
        props:['doctors'],
        name:"RegisterDoctors",
        data: () => ({
            search: "",
            loading: undefined,
            creatingDoctor:"",
            selectedDoctor:"",
        }),

        computed: {

            doctorsArray() {
                let array = [];
                for (let doc in this.doctors) {
                    let holder = {
                        ...this.doctors[doc],
                        specialties: this.getSpecialties(this.doctors[doc]),
                    };
                    array.push(holder)
                }
                return array.filter(a => a.name >= this.search.toUpperCase())
            },
        },

        methods: {
            addDoctor() {
                this.selectedDoctor = undefined;
                this.creatingDoctor = true
            },
            getSpecialties(item) {
                if (!item.specialties) return '';
                let specialties = '';
                for (const key in item.specialties) {
                    specialties += item.specialties[key].name + ', '
                }
                specialties = specialties.slice(0, specialties.length - 2);
                return specialties
            },
            async deleteDoctorFromDatabase(doctor){
                await this.$store.dispatch('deleteConsultations', doctor);
                await this.$store.dispatch('deleteDoctor', doctor);
                this.loading = false;
            }
        }
    };

</script>