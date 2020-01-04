<template>
    <v-container>
        <v-layout row wrap class="align-center">
            <v-flex xs3 class="mx-2 text-center" v-for="clinic in clinics" :key="clinic.name">
                <v-card class="pa-2" :class="[clinic.property ? 'primary_light' : '']" @click="setProperty(clinic)">
                    <v-card-title>{{clinic.name}}</v-card-title>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "Units",
        computed: {
            clinics() {
                return this.$store.getters.clinics
            },
            units() {
                return this.$store.getters.units
            }
        },
        methods: {
            async loadInitialInfo() {
                this.$store.dispatch('getProSaudeUnits')
                await this.$store.dispatch('getClinics')
            },
            setProperty(clin) {
                this.$store.dispatch('setClinProperty', clin)
            }
        },
        mounted() {
            this.loadInitialInfo()
        }
    }
</script>

<style scoped>

</style>
