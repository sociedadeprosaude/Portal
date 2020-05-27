<template>
    <v-container>
        <v-layout row wrap v-if="patient.name">
            <v-flex xs12>
                <p class="text-left">{{patient.name}}</p>
            </v-flex>
            <v-flex xs12>
                <p class="text-left">CPF: {{patient.cpf}}</p>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "CardPatientManagementConsultations",
        props: ['patient'],
        data: () => ({

        }),
        computed: {

        },
        mounted() {
            this.initialConfig()

        },
        watch: {

        },
        methods: {

            async initialConfig() {

            },

        },
    }
</script>
<style scoped>

</style>
