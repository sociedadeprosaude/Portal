<template>
    <v-container fluid class=" fill-height">
        <v-layout row wrap class="justify-center">
            <v-flex sm3 v-if="patient" class="hidden-print-only">
                <intakes-history></intakes-history>
            </v-flex>
            <v-flex sm6 class="hidden-print-only">
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
            // addProducts(item, preco, custo, clinica, total) {
            //
            //     if (this.categorySelect === 'exam') {
            //         let product = {
            //             name: item.name,
            //             price: preco,
            //             cost: custo,
            //             clinic: clinica
            //         };
            //         if (this.exames) {
            //             let tamanho = this.exames.length;
            //             Vue.set(this.exames, tamanho, product);
            //             let tamanho2 = this.pedido.length;
            //             Vue.set(this.pedido, tamanho2, product);
            //             this.total = parseInt(this.total) + parseInt(product.price);
            //             this.totalNovo = this.total - this.desconto2;
            //             this.totalCusto = parseInt(this.totalCusto) + parseInt(product.cost);
            //         } else {
            //             this.exames[0] = product;
            //         }
            //     }
            //     if (this.categorySelect === 'appointment') {
            //         console.log('item: ', item);
            //         console.log('total: ', total);
            //         if (total.recebeu === undefined) {
            //             let product = {
            //                 nome: item.nome,
            //                 price: preco,
            //                 cost: custo,
            //                 clinic: clinica,
            //                 medico: total.nome,
            //                 recebimento: total.pagamento,
            //                 recebeu: ''
            //             };
            //             if (this.consultas) {
            //                 let tamanho = this.consultas.length;
            //                 Vue.set(this.consultas, tamanho, product);
            //                 let tamanho2 = this.pedido.length;
            //                 Vue.set(this.pedido, tamanho2, product);
            //                 this.total = parseInt(this.total) + parseInt(product.proce);
            //                 this.totalNovo = this.total - this.desconto2;
            //                 if (product.recebimento === 'Consultas') {
            //                     this.totalCusto = parseInt(this.totalCusto) + parseInt(product.cost);
            //                 } else {
            //                     let medico = {
            //                         name: total.nome,
            //                         consulta: item.nome,
            //                         data: this.data2,
            //                         cost: custo,
            //                         clinic: clinica
            //                     };
            //                     if (this.medicoDia) {
            //                         let tamanho = this.medicoDia.length;
            //                         Vue.set(this.medicoDia, tamanho, medico)
            //                     } else {
            //                         this.medicoDia[0] = medico;
            //                     }
            //                 }
            //             } else {
            //                 this.consultas[0] = product;
            //             }
            //         } else {
            //             let product = {
            //                 name: item.nome,
            //                 price: preco,
            //                 cost: custo,
            //                 clinic: clinica,
            //                 medico: total.nome,
            //                 recebimento: total.pagamento,
            //                 recebeu: total.recebeu
            //             };
            //             console.log('consulta: ', product);
            //             if (this.consultas) {
            //                 let tamanho = this.consultas.length;
            //                 Vue.set(this.consultas, tamanho, product);
            //                 let tamanho2 = this.pedido.length;
            //                 Vue.set(this.pedido, tamanho2, product);
            //                 this.total = parseInt(this.total) + parseInt(product.price);
            //                 this.totalNovo = this.total - this.desconto2;
            //                 if (product.recebimento === 'Consultas') {
            //                     this.totalCusto = parseInt(this.totalCusto) + parseInt(product.cost);
            //                 } else {
            //                     let medico = {
            //                         name: total.nome,
            //                         consulta: item.nome,
            //                         data: this.data2,
            //                         cost: custo,
            //                         clinic: clinica
            //                     };
            //                     console.log("medico: ", medico);
            //                     if (this.medicoDia) {
            //                         let tamanho = this.medicoDia.length;
            //                         Vue.set(this.medicoDia, tamanho, medico)
            //                     } else {
            //                         this.medicoDia[0] = medico;
            //                     }
            //                 }
            //             } else {
            //                 this.consultas[0] = product;
            //             }
            //         }
            //         if (this.categorySelect === 'package') {
            //             let product = {
            //                 name: item.nome,
            //                 price: preco,
            //                 cost: custo
            //             };
            //             if (this.pacotes) {
            //                 let tamanho = this.pacotes.length;
            //                 Vue.set(this.pacotes, tamanho, product);
            //                 let tamanho2 = this.pedido.length;
            //                 Vue.set(this.pedido, tamanho2, product);
            //                 this.total = parseInt(this.total) + parseInt(product.price);
            //                 this.totalNovo = this.total - this.desconto2
            //                 this.totalCusto = parseInt(this.totalCusto) + parseInt(product.cost);
            //             } else {
            //                 this.pacotes[0] = product;
            //             }
            //         }
            //     }
            // }
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
