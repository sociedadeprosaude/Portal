<template>
    <v-container>
        <v-layout row wrap v-if="consultation.doctor">
            <v-flex xs12>
                <p class="text-left">Médico :{{consultation.doctor.name}}</p>
            </v-flex>
            <v-flex xs21>
                <p class="text-left">CRM: {{consultation.doctor.crm}}</p>
            </v-flex>
            <v-flex xs8>
                <p class="text-left">Dia: {{dateFormat(consultation.date)}}</p>
            </v-flex>
            <v-flex xs4>
                <p class="text-left">Hora: {{consultation.date.substring(11,16)}}</p>
            </v-flex>
            <v-flex xs12>
                <p class="text-left">Recibo: {{consultation.payment_number}}</p>
            </v-flex>
            <v-flex xs12>
                <p class="text-left">ESPECIALIDADE: {{consultation.specialty.id}}</p>
            </v-flex>
            <v-flex xs12>
                <p class="text-left">Tipo: {{consultation.type}} </p>
            </v-flex>
            <v-flex xs12>
                <p class="text-left">Status: {{consultation.status}}</p>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "CardConsultationManagementConsultations",
        props: ['consultation'],
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
            dateFormat(item){
               let date= item.substring(8,10) + '/' + item.substring(5,7) + '/' + item.substring(0,4)
                return date
            }

        },
    }
</script>
<style scoped>

</style>
