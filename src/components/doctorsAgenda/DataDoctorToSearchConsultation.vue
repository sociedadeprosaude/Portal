<template>
    <v-container class="ma-0 pa-0">
        <v-flex xs12 class=" justify-start text-left">
            <v-btn icon fab small @click="showFilter = !showFilter" color="background" dark>
                <v-icon v-if="showFilter">close</v-icon>
                <v-icon v-else>filter_alt</v-icon>
            </v-btn>
        </v-flex>
        <v-layout column v-if="showFilter">
                    <v-flex xs12 class="mt-2 pa-0 ">
                        <v-checkbox
                                class="pl-3 py-0 my-0"
                                v-model="examTypeCheck"
                                color="white"
                        >
                            <template v-slot:label>
                                <div class="white--text">Listar agendas de exames</div>
                            </template>
                        </v-checkbox>
                    </v-flex>
                    <v-flex xs12 class="ma-0 pa-0">
                        <v-combobox
                                v-if="!examTypeCheck"
                                class="pa-0 ma-0"
                                :items="specialties"
                                v-model="specialty"
                                item-text="name"
                                return-object
                                placeholder="Especialidade"
                                dense solo
                                color="blue"
                                clearable>
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
                        <v-combobox
                                v-else
                                class="pa-0 ma-0"
                                :items="examTypes"
                                v-model="examType"
                                item-text="name"
                                return-object
                                placeholder="Exames agendáveis"
                                dense solo
                                color="blue"
                                clearable>
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
                    <v-flex xs12 class="mt-n4 pa-0">
                        <v-combobox class="pa-0 pa"
                                    v-model="doctor"
                                    :items="doctors"
                                    return-object
                                    item-text="name"
                                    label="Médico"
                                    outlined
                                    dense
                                    chips
                                    solo
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
                                        color="primary"
                                >{{ data.item.name }}
                                </v-chip>
                            </template>
                        </v-combobox>
                    </v-flex>
                    <v-flex xs12 class="mt-n4 pa-0">
                        <v-select
                                v-model="clinic"
                                :items="clinics"
                                item-text="name"
                                label="Clínica"
                                solo dense
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
                                        color="primary"
                                >{{ data.item.name }}
                                </v-chip>
                            </template>
                        </v-select>
                    </v-flex>
                </v-layout>
    </v-container>
</template>
<script>

    export default {

        data: () => ({
            showFilter: false,
            specialty: undefined,
            clinic: undefined,
            doctor: undefined,
            examTypeCheck: false,
            examType: undefined
        }),

        computed: {

            clinics() {
                return this.$store.getters.clinics.filter(a => {
                    return a.property;
                });
            },

            specialties() {
                let espArray = Object.values(this.$store.getters.specialties);
                espArray = espArray.filter(specialty => {

                    if (!this.doctor) return true;
                    let find = false;
                    if (specialty.doctors) {
                        specialty.doctors.forEach(doctor => {
                            if (doctor.cpf === this.doctor.cpf) {
                                find = true;
                                return true;
                            }
                        });
                    }
                    return find;
                });
                return espArray;
            },

            doctors: {
                get: function () {
                    let docArray = Object.values(this.$store.getters.doctors);
                    docArray = docArray.filter(doctor => {
                        if (!this.specialty) return true;
                        let find = false;
                        doctor.specialties.forEach(specialty => {
                            if (specialty.name === this.specialty.name) {
                                find = true;
                                return true;
                            }
                        });
                        return find;
                    });
                    return docArray;
                }
            },

            examTypes() {
                return this.$store.getters.examsTypes.filter((examType) => {
                    return examType.scheduleable
                });
            }
        },
        mounted() {
            this.$store.dispatch("getExamsTypes");
            this.query = this.$route.params.q
            if (this.query) {
                console.log('query: ', this.query);
                this.specialty = this.query.specialty;
                this.clinic = this.query.clinic.name;
                this.doctor = this.query.doctor
            }
        },

        created() {
            window.addEventListener("scroll", this.handleScroll);
        },

        watch: {
            clinic(clinic) {
                this.$store.dispatch('selectClinic', clinic)
            },
            doctor(doctor) {
                this.$store.dispatch('selectDoctor', doctor)
            },
            specialty(specialty) {
                console.log('specialty', specialty)
                this.$store.dispatch('selectSpecialty', specialty)
            },
            examType(value) {
                console.log('exam', value)
                this.$store.dispatch('selectExamType', value)
            },
            examTypeCheck(value) {
                if (value) {
                    this.$store.dispatch('selectSpecialty', undefined)
                    this.specialty = undefined
                } else {
                    this.$store.dispatch('selectExamType', undefined)
                    this.examType = undefined
                }
                console.log('check', value)
                this.$store.dispatch('selectExamTypeCheck', value)

            }
        },

        methods: {
            handleScroll() {
                this.scrollPos = window.scrollY;
                let winHeight = window.innerHeight;
                let docHeight = document.documentElement.scrollHeight;
                this.offsetTop = (100 * this.scrollPos) / (docHeight - winHeight);
            },
        }
    }
</script>