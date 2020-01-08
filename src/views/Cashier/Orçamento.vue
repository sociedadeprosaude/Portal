<template>
    <v-container fluid class="ma-0 pa-0">
        <v-layout row wrap class="justify-center">
            <v-flex sm3 v-if="patient" class="hidden-print-only hidden-xs-only">
                <intakes-history></intakes-history>
            </v-flex>
            <v-flex xs12 sm6 class="hidden-print-only">
                <procedures-search></procedures-search>
            </v-flex>
            <v-flex sm3 class="hidden-print-only">
                <cart></cart>
            </v-flex>
            <v-flex class="hidden-screen-only">
                <receipt></receipt>
            </v-flex>


            <v-dialog v-model="aviso">
                <v-card dark color="red">
                    <v-card-title>Error</v-card-title>
                    <v-card-text>Orçamento não encontrada (código invalido)</v-card-text>
                </v-card>
            </v-dialog>
            <v-dialog v-model="aviso2">
                <v-card color="green" dark>
                    <v-card-title>Sucesso</v-card-title>
                    <v-card-text color="white">Orçamento pago com sucesso</v-card-text>
                </v-card>
            </v-dialog>
        </v-layout>
    </v-container>
</template>

<script>
    import moment from 'moment'
    import ProceduresSearch from "../../components/cashier/ProceduresSearch";
    import Cart from "../../components/cashier/Cart";
    import IntakesHistory from "../../components/cashier/IntakesHistory";
    import Receipt from "../../components/cashier/Receipt";

    export default {
        data: () => ({
            sheet: false,
            colorSelect: 'primary',
            search: '',
            loading: false,
            // items: '',
            categorySelect: undefined,
            typingTimer: undefined,
            pedido: [],
            medicoDia: [],
            aviso: false,
            aviso2: false,
            card: false,
            now: moment().valueOf(),
            data: moment().format("YYYY-MM-DD HH:mm:ss"),
            data2: moment().format("YYYY-MM-DD"),
            i: 0,
            taxa: 0,
            desconto: 0,
        }),
        components: {
            Receipt,
            ProceduresSearch,
            Cart,
            IntakesHistory
        },
        methods: {
        },
        computed: {
            pedid() {
                return this.$store.getters.pedido;
            },
            patient() {
                return this.$store.getters.selectedPatient
            }
        },
    }
</script>

<style scoped>
    @page {
        size: auto;
        margin: 0mm
    }

    .preco {
        margin-top: -20px;
    }

    #carrinho {
        position: absolute;
        right: 0;
        margin-right: 2%;
        width: 30%;
    }

    .botao {
        margin-right: 6px;
    }
</style>
