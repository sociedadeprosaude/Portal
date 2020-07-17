<template>
    <v-container fluid grid-list-xl>
        <v-layout class="align-center" wrap>
            <v-flex sm3>
                <v-btn text>
                    <v-icon color="blue">event</v-icon>
                    :
                    <v-chip small text-color="white" color="blue">Consulta</v-chip>
                </v-btn>
            </v-flex>
            <v-flex sm3>
                <v-btn text>
                    <v-icon color="blue">restore</v-icon>
                    :
                    <v-chip small text-color="white" color="blue">Retorno</v-chip>
                </v-btn>
            </v-flex>
            <v-flex sm2>
                <v-btn text>
                    <v-icon color="success">attach_money</v-icon>
                    :
                    <v-chip small text-color="white" color="success">Pago</v-chip>
                </v-btn>
            </v-flex>
            <v-flex sm4>
                <v-btn text>
                    <v-icon color="error">money_off</v-icon>
                    :
                    <v-chip small text-color="white" color="error">Aguardando Pagamento</v-chip>
                </v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
    export default {
        name:"HeaderCanceledConsultations",
    };
</script>
