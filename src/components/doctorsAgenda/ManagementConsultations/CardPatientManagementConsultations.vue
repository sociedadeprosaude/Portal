<template>
    <v-container>
        <v-layout row wrap v-if="patient">
            <v-flex xs12>
                <p class="text-left">Nome: {{dependent ? dependent.name : patient.name}}</p>
            </v-flex>
            <v-flex xs12>
                <p class="text-left" v-if="dependent">Data de Nascimento: {{formartDate(dependent.birth_date.formatted)}}</p>
                <p class="text-left" v-else>CPF: {{patient.cpf}}</p>
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
