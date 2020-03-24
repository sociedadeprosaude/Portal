<template>
    <v-container fluid>
        <v-layout  wrap row class="justify-center">
            <v-flex xs12 sm8 class="text-center">
                <alert-consultation-canceled></alert-consultation-canceled>
            </v-flex>
            <v-flex xs12 sm8 class="text-center">
                <alertDiscountColaborator></alertDiscountColaborator>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import alertConsultationCanceled from "../components/doctorsAgenda/alertConsultationCanceled.vue";
    import alertDiscountColaborator from "../components/cashier/alertDiscountColaborator";


    export default {

        components: {
            alertConsultationCanceled,
            alertDiscountColaborator,
        }

    }

</script>