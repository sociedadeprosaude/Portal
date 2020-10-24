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
                <p class="text-left">Dia: {{dateFormat(date)}}</p>
            </v-flex>
            <v-flex xs4>
                <p class="text-left">Hora: {{hour.substring(0,5)}}</p>
            </v-flex>
            <v-flex xs12 v-if="user.type !== 'DOCTOR'">
                <p class="text-left">Recibo: {{consultation.payment_number}}</p>
            </v-flex>
            <v-flex xs12>
                <p v-if="consultation.product.type === 'SPECIALTY'" class="text-left">ESPECIALIDADE: {{consultation.product.name}}</p>
                <p v-else class="text-left">EXAME: {{consultation.product.name}}</p>
            </v-flex>
            <v-flex xs12>
                <p class="text-left">Tipo: {{consultation.type}} </p>
            </v-flex>
            <v-flex xs12>
                <p class="text-left" v-if="user.type !== 'DOCTOR'">Status: {{consultation.status}}</p>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import moment from 'moment';
    export default {
        name: "CardConsultationManagementConsultations",
        props: ['consultation'],
        data: () => ({
            date:undefined,
            hour:undefined
        }),
        computed: {
            user(){
                return this.$store.getters.user
            },
        },
        watch: {
            consultation(value){
                if(value){
                    this.date = this.consultation.date.formatted.split("T")[0]
                    this.hour = this.consultation.date.formatted.split("T")[1]
                }
            }
        },
        methods: {

            dateFormat(date){
                return moment(date).format("DD/MM/YYYY")
            }

        },
    }
</script>
<style scoped>

</style>
