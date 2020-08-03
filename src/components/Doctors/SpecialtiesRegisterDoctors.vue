<template>
    <v-container fluid>
                <v-layout row wrap>
                    <v-flex sm12>
                        <v-card class="pt-3">
                            <v-layout row wrap>
                                <v-flex sm8>
                                    <v-text-field
                                            outlined
                                            placeholder="Especialidades"
                                            class="mx-5"
                                            color="primary"
                                            v-model="searchSpecialty"
                                            :loading="loading"
                                            id="searchEspecialties"
                                    />
                                </v-flex>
                                <v-flex sm4 class="text-right pr-3 mt-2">
                                    <v-btn outlined class="primary--text" @click="creatingSpecialty = true">
                                        cadastrar especialidade
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-card>
                        <v-card>
                            <v-card-text v-if="specialties.length !== 0">
                                <ListSpecialties :specialties="specialties" :loading="loading"/>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                    <v-dialog v-model="creatingSpecialty" max-width="500px">
                        <CreateSpecialty @close="creatingSpecialty = false"/>
                    </v-dialog>
                </v-layout>
    </v-container>
</template>
<script>
    import CreateSpecialty from "../../components/Doctors/CreateSpecialty";
    import ListSpecialties from "../../components/Doctors/ListSpecialties";

    export default {
        components: {CreateSpecialty, ListSpecialties},

        data: () => ({
            search: "",
            searchSpecialty: "",
            loading: undefined,
            creatingDoctor: false,
            selectedDoctor: undefined,
            creatingSpecialty: false,

        }),

        mounted() {
            this.initialConfiguration();
        },

        computed: {
            loadingDoctors() {
                return !this.$store.getters.doctorsLoaded
            },
            specialties() {
                return this.$store.getters.specialties.filter((a) => a.name >= this.searchSpecialty.toUpperCase())
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