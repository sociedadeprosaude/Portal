<template>
    <v-container fluid>
        <v-tabs>
            <v-tab href="#doctors">Registro de médicos</v-tab>
            <v-tab href="#specialties">Registro de especialidade</v-tab>

            <v-tab-item value="doctors">
                <register-doctors :doctors="doctors"></register-doctors>
            </v-tab-item>
            <v-tab-item value="specialties">
                <register-specialties :specialties="specialties"></register-specialties>
            </v-tab-item>
        </v-tabs>
    </v-container>
</template>
<script>

    import RegisterDoctors from "../../components/Doctors/RegisterDoctors";
    import RegisterSpecialties from "../../components/Doctors/RegisterSpecialties";

    export default {
        components: { RegisterDoctors, RegisterSpecialties},

        data: () => ({
            search: "",
            searchSpecialty: "",
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