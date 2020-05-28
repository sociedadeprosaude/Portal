<template>
    <v-container>
        <v-layout row wrap v-if="!loading">
            <v-flex xs12>
                <span class="my-headline">Colaboradores</span>
            </v-flex>
            <Collaborators :collaborators="collaborators"/>

            <v-flex xs12>
                <span class="my-headline">Médicos</span>
            </v-flex>
            <Doctors/>

            <v-flex xs12 class="text-center">
                <paymeny-report :colaborators="collaborators"/>
            </v-flex>
        </v-layout>

        <v-layout row wrap v-else>
            <v-flex xs12 class="text-center">
                <v-progress-circular size="64" indeterminate color="primary"/>
            </v-flex>
        </v-layout>

    </v-container>
</template>

<script>
    import PaymenyReport from "../../components/labor/PaymenyReport";
    import Collaborators from "../../components/labor/Collaborators";
    import Doctors from "../../components/labor/Doctors";


    export default {
        name: "Home",
        components: {
            PaymenyReport,
            Collaborators,
            Doctors
        },
        computed: {
            collaborators () {
                return this.$store.getters.colaborators.filter(a => {
                    return a.status !== 'pending'
                })
            },
        }


    }
</script>
