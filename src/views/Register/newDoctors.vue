<template>
    <v-container fluid>
        <v-tabs>
            <v-tab href="#doctors">Registro de médicos</v-tab>
            <v-tab href="#specialties">Registro de especialidade</v-tab>

            <v-tab-item value="doctors">
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
                                <ListDoctors :doctors="doctorsArray" :loading="loading"/>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-dialog v-model="creatingDoctor" max-width="500px">
                        <CreateDoctorCard @clean="selectedDoctor = undefined" @close="creatingDoctor = false"/>
                    </v-dialog>
                </v-layout>
            </v-tab-item>
            <v-tab-item value="specialties">
                <v-layout row wrap>
                    <v-flex sm12>
                        <v-card class="pt-3">
                            <v-layout row wrap>
                                <v-flex sm8>
                                    <v-text-field
                                            outlined
                                            placeholder="Tipos de Exames"
                                            class="mx-5"
                                            color="primary"
                                            v-model="search"
                                            :loading="loading"
                                            id="search"
                                    />
                                </v-flex>
                                <v-flex sm4 class="text-right pr-3 mt-2">
                                    <v-btn outlined class="primary--text">cadastrar tipo de
                                        exame
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>

                </v-layout>
            </v-tab-item>
        </v-tabs>
    </v-container>
</template>
<script>
    import CreateDoctorCard from "../../components/Doctors/CreateDoctorCard";
    import ListDoctors from "../../components/Doctors/ListDoctors";

    export default {
        components: {CreateDoctorCard, ListDoctors},

        data: () => ({
            search: "",
            loading: undefined,
            creatingDoctor: false,

        }),

        mounted() {
            this.initialConfiguration();
        },

        computed: {
            loadingDoctors() {
                return !this.$store.getters.doctorsLoaded
            },
            specialties() {
                return this.$store.getters.specialties
            },
            doctors() {
                return this.$store.getters.doctors
            },
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
            async initialConfiguration (){
                await this.$store.dispatch('getClinics');
                await this.$store.dispatch('getDoctors');
                await this.$store.dispatch('getSpecialties');
            },
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
        }
    };

</script>