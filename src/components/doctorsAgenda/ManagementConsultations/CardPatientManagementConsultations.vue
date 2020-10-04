<template>
    <v-container>
        <v-layout row wrap v-if="patient">
            <v-flex xs12>
                <p class="text-left">Nome: {{dependent ? dependent.name : patient.name}}</p>
            </v-flex>
            <v-flex xs12>
                <p class="text-left">Data de Nascimento: {{dependent ? formartDate(dependent.birth_date) : patient.cpf}}</p>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import moment from 'moment'
    export default {
        name: "CardPatientManagementConsultations",
        props: ['patient','dependent'],
        data: () => ({

        }),
        methods: {
            formartDate(date){
                return moment(date,"YYYY-MM-DD").format("DD/MM/YYYY")
            }
        },
    }
</script>
<style scoped>

</style>
