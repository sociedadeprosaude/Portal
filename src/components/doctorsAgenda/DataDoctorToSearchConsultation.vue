<template>
    <v-container class="ma-0 pa-0">
        <v-layout column>
            <v-flex xs12>
                <v-combobox
                        :items="specialties"
                        v-model="specialty"
                        item-text="name"
                        return-object
                        placeholder="Especialidade"
                        rounded solo dense
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
                                color="info"
                        >{{ data.item.name }}
                        </v-chip>
                    </template>
                </v-combobox>
            </v-flex>
            <v-flex xs12 class="">
                <v-combobox class="pa-0 pa"
                            v-model="doctor"
                            :items="doctors"
                            return-object
                            item-text="name"
                            label="Médico"
                            outlined
                            rounded
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
                                color="info"
                        >{{ data.item.name }}
                        </v-chip>
                    </template>
                </v-combobox>
            </v-flex>
            <v-flex xs12>
                <v-select
                        v-model="clinic"
                        :items="clinics"
                        item-text="name"
                        label="Clínica"
                        rounded solo dense
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
        </v-layout>
    </v-container>
</template>
<script>

    export default {

        data: () => ({
            specialty: undefined,
            clinic: undefined,
            doctor: undefined,
        }),

        computed: {

            clinics() {
                return this.$store.getters.clinics.filter(a => {return a.property;});
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
        },


        created() {
            window.addEventListener("scroll", this.handleScroll);
        },

        watch: {
            clinic (clinic) {
                this.$store.dispatch('selectClinic', clinic)
            },
            doctor (doctor) {
                this.$store.dispatch('selectDoctor', doctor)
            },
            specialty (specialty){
                this.$store.dispatch('selectSpecialty', specialty)
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