<template>
    <v-container fluid class=" fill-height">
        <v-layout row wrap>
            <v-flex sm8>
                <procedures-search></procedures-search>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex sm3>
                <cart></cart>
            </v-flex>


            <!--            <v-flex class="d-print-none d-md-none" xs12>-->
            <!--                <v-container>-->
            <!--                    <v-card class=" elevation-2 " style="width:100%; height:100%">-->
            <!--                        <v-container>-->
            <!--                            <v-layout row wrap class="mx-3 align-center">-->
            <!--                                <v-flex xs10>-->
            <!--                                    <v-text-field-->
            <!--                                            label="Digitar Nome do Paciente"-->
            <!--                                            v-model="codigo"-->
            <!--                                    ></v-text-field>-->
            <!--                                </v-flex>-->
            <!--                                <v-flex xs2 class="text-center">-->
            <!--                                    <v-icon @click="pesquisarUsuario()">search</v-icon>-->
            <!--                                </v-flex>-->
            <!--                                <v-flex xs6 class="text-right">-->
            <!--                                    <v-btn outlined class="mr-2" color="primary" @click="sheet = !sheet">Pesquisar-->
            <!--                                    </v-btn>-->
            <!--                                </v-flex>-->
            <!--                                <v-flex xs6 class="text-right">-->
            <!--                                    <v-btn outlined class="mr-0" color="primary" @click="gerarCodigo()">Gerar Codigo-->
            <!--                                    </v-btn>-->
            <!--                                </v-flex>-->
            <!--                                <v-flex xs12 class="mt-4 v-card"-->
            <!--                                        style="overflow:auto; height:50vh; box-shadow: inset 0px 0px 5px grey;">-->
            <!--                                    <v-container>-->
            <!--                                        <v-layout row wrap>-->
            <!--                                            <v-flex xs12 v-if="exames.length > 0">-->
            <!--                                                <p>Exames</p>-->
            <!--                                                <v-card v-for="(item,index) in exames" class="mt-2" :key="item.nome">-->
            <!--                                                    <v-card-title class="py-2">-->
            <!--                                                        <span class="subtitle-1 font-weight-medium">{{item.nome}}</span>-->
            <!--                                                        <v-spacer></v-spacer>-->
            <!--                                                        <span class="subtitle-1 font-weight-light">-->
            <!--                                                <v-btn small icon @click="removeExame(index)">-->
            <!--                                                    <v-icon>cancel</v-icon>-->
            <!--                                                </v-btn>-->
            <!--                                            </span>-->
            <!--                                                    </v-card-title>-->
            <!--                                                    <v-card-text class="pt-1 pb-0">-->
            <!--                                                        {{item.clinica}}-->
            <!--                                                        <p class="text-right">-->
            <!--                                                            R$ {{item.preco}}-->
            <!--                                                        </p>-->
            <!--                                                    </v-card-text>-->
            <!--                                                </v-card>-->
            <!--                                            </v-flex>-->
            <!--                                            <v-divider></v-divider>-->
            <!--                                            <v-flex xs12 v-if="consultas.length > 0">-->
            <!--                                                <p>Consultas</p>-->
            <!--                                                <v-card v-for="(item,index) in consultas" class="mt-2" :key="item.nome">-->
            <!--                                                    <v-card-title class="py-2">-->
            <!--                                                        <span class="subtitle-1 font-weight-medium">{{item.nome}}</span>-->
            <!--                                                        <v-spacer></v-spacer>-->
            <!--                                                        <span class="subtitle-1 font-weight-light">-->
            <!--                                                <v-btn small icon @click="removeConsults(index)">-->
            <!--                                                    <v-icon>cancel</v-icon>-->
            <!--                                                </v-btn>-->
            <!--                                            </span>-->
            <!--                                                    </v-card-title>-->
            <!--                                                    <v-card-text class="pt-1 pb-0">-->
            <!--                                                        {{item.clinica}}-->
            <!--                                                        <p class="text-right">-->
            <!--                                                            R$ {{item.preco}}-->
            <!--                                                        </p>-->
            <!--                                                    </v-card-text>-->
            <!--                                                </v-card>-->
            <!--                                            </v-flex>-->
            <!--                                            <v-divider></v-divider>-->
            <!--                                            <v-flex xs12 v-if="pacotes.length > 0">-->
            <!--                                                <p>Pacotes</p>-->
            <!--                                                <v-card v-for="(item,index) in pacotes" class="mt-2" :key="item.nome">-->
            <!--                                                    <v-card-title class="py-2">-->
            <!--                                                        <span class="subtitle-1 font-weight-medium">{{item.nome}}</span>-->
            <!--                                                        <v-spacer></v-spacer>-->
            <!--                                                        <span class="subtitle-1 font-weight-light">-->
            <!--                                                <v-btn small icon @click="removePackages(index)">-->
            <!--                                                    <v-icon>cancel</v-icon>-->
            <!--                                                </v-btn>-->
            <!--                                            </span>-->
            <!--                                                    </v-card-title>-->
            <!--                                                    <v-card-text class="pt-1 pb-0">-->
            <!--                                                        <p class="text-right">-->
            <!--                                                            R$ {{item.preco}}-->
            <!--                                                        </p>-->
            <!--                                                    </v-card-text>-->
            <!--                                                </v-card>-->
            <!--                                            </v-flex>-->
            <!--                                        </v-layout>-->
            <!--                                    </v-container>-->
            <!--                                </v-flex>-->
            <!--                                <v-spacer></v-spacer>-->
            <!--                                <v-layout row wrap>-->
            <!--                                    <v-flex xs12>-->
            <!--                                        <v-select label="Forma de Pagamento" :items="FormasDePagamento"-->
            <!--                                                  v-model="formaPagamento"></v-select>-->
            <!--                                    </v-flex>-->
            <!--                                    <v-flex>-->
            <!--                                        <v-flex xs6 v-if="formaPagamento === 'credito'">-->
            <!--                                            <v-select :items="quantParcelas" v-model="parcelas"-->
            <!--                                                      label="quantidade de parcelas"></v-select>-->
            <!--                                        </v-flex>-->
            <!--                                        <v-layout wrap>-->
            <!--                                            <v-flex xs5>-->
            <!--                                                <v-text-field label="Desconto: %" v-model="desconto1"-->
            <!--                                                              required></v-text-field>-->
            <!--                                            </v-flex>-->
            <!--                                            <v-spacer></v-spacer>-->
            <!--                                            <v-flex xs5>-->
            <!--                                                <v-text-field label="Desconto: R$ " v-model="desconto2"-->
            <!--                                                              required></v-text-field>-->
            <!--                                            </v-flex>-->
            <!--                                        </v-layout>-->
            <!--                                    </v-flex>-->
            <!--                                    <v-flex xs12>-->
            <!--                                        <v-layout column wrap>-->
            <!--                                            <v-flex xs12>-->
            <!--                                                <span>Subtotal: R$ {{this.total.toLocaleString('en-us', {minimumFractionDigits: 2})}}</span>-->
            <!--                                            </v-flex>-->
            <!--                                            <v-flex xs12>-->
            <!--                                                <span>Desconto: R$ {{this.desconto2.toLocaleString('en-us', {minimumFractionDigits: 2})}}</span>-->
            <!--                                            </v-flex>-->
            <!--                                            <v-flex xs12>-->
            <!--                                                <h6 class="title font-weight-bold"> Total: R$-->
            <!--                                                    {{this.totalNovo.toLocaleString('en-us', {minimumFractionDigits:-->
            <!--                                                    2})}}</h6>-->
            <!--                                            </v-flex>-->
            <!--                                        </v-layout>-->
            <!--                                    </v-flex>-->
            <!--                                    <v-spacer></v-spacer>-->
            <!--                                    <v-flex class="mt-5" xs12>-->
            <!--                                        <v-layout row wrap class="align-end fill-height">-->
            <!--                                            <v-flex xs2 class="text-left">-->
            <!--                                                <v-btn v-if="total > 0" icon text class="mr-2">-->
            <!--                                                    <a v-bind:href="'https://api.whatsapp.com/send?text='+ encodeURIComponent(shareOrcamento())"-->
            <!--                                                       style="text-decoration:none">-->

            <!--                                                        <v-icon>share</v-icon>-->
            <!--                                                    </a>-->
            <!--                                                </v-btn>-->
            <!--                                            </v-flex>-->
            <!--                                            <v-flex xs5 class="text-right">-->
            <!--                                                <v-btn outlined class="mr-5" color="primary" @click="imprimir()">-->
            <!--                                                    Imprimir-->
            <!--                                                </v-btn>-->
            <!--                                            </v-flex>-->
            <!--                                            <v-flex xs5 class="text-right">-->
            <!--                                                <v-btn outlined color="primary" @click="pagar2()">Pagar</v-btn>-->
            <!--                                            </v-flex>-->
            <!--                                        </v-layout>-->
            <!--                                    </v-flex>-->
            <!--                                </v-layout>-->
            <!--                            </v-layout>-->
            <!--                        </v-container>-->
            <!--                    </v-card>-->
            <!--                </v-container>-->
            <!--            </v-flex>-->

            <!--            <v-bottom-sheet v-model="sheet" class="d-print-none d-md-none" xs12>-->
            <!--                <v-sheet class="text-center" height="500px">-->
            <!--                    <v-container>-->
            <!--                        <v-card class="elevation-0">-->
            <!--                            <v-flex>-->
            <!--                                <v-card-title>-->
            <!--                                    <v-flex xs12>-->
            <!--                                        <v-text-field-->
            <!--                                                label="Pesquisa"-->
            <!--                                                v-model="search"-->
            <!--                                                single-line-->
            <!--                                                prepend-icon="search"-->
            <!--                                        ></v-text-field>-->
            <!--                                    </v-flex>-->
            <!--                                    <v-flex xs4>-->
            <!--                                        <v-btn outlined class="botao"-->
            <!--                                               :color="categorySelect === 'exam' ? 'primary' : 'primary_light'" rounded-->
            <!--                                               @click="selectExam">Exames-->
            <!--                                        </v-btn>-->
            <!--                                    </v-flex>-->
            <!--                                    <v-flex xs4>-->
            <!--                                        <v-btn outlined class="botao"-->
            <!--                                               :color="categorySelect === 'appointment' ? 'primary' : 'primary_light'"-->
            <!--                                               rounded-->
            <!--                                               @click="selectAppointment">Consultas-->
            <!--                                        </v-btn>-->
            <!--                                    </v-flex>-->
            <!--                                    <v-flex xs4 class="pl-2">-->
            <!--                                        <v-btn outlined class="botao"-->
            <!--                                               :color="categorySelect === 'package' ? 'primary' : 'primary_light'"-->
            <!--                                               rounded-->
            <!--                                               @click="selectPackage">Pacotes-->
            <!--                                        </v-btn>-->
            <!--                                    </v-flex>-->
            <!--                                </v-card-title>-->
            <!--                            </v-flex>-->
            <!--                            <v-fade-transition>-->
            <!--                                <v-flex v-for="item in items" class="my-3" :key="item.id">-->
            <!--                                    <v-card>-->
            <!--                                        <v-card-title v-text="item.nome"></v-card-title>-->
            <!--                                        <v-card-text v-if="categorySelect !== 'appointment'">-->
            <!--                                            <v-slide-group>-->
            <!--                                                <v-slide-item v-for="n in item.clinicas"-->
            <!--                                                              :key="n.name"-->
            <!--                                                              v-slot:default="{ active, toggle }">-->
            <!--                                                    <v-btn class="mx-2"-->
            <!--                                                           :input-value="active"-->
            <!--                                                           active-class="blue white&#45;&#45;text"-->
            <!--                                                           depressed-->
            <!--                                                           rounded-->
            <!--                                                           @click="addProducts(item, n.venda, n.custo,n.nome)"-->
            <!--                                                    >-->
            <!--                                                        {{ n.nome }} | {{n.venda}}-->
            <!--                                                    </v-btn>-->
            <!--                                                </v-slide-item>-->
            <!--                                            </v-slide-group>-->
            <!--                                        </v-card-text>-->
            <!--                                        <v-card-text v-if="categorySelect === 'appointment'">-->
            <!--                                            <v-slide-group multiple show-arrows>-->
            <!--                                                <v-slide-item v-for="n in item.doctors"-->
            <!--                                                              :key="n.name"-->
            <!--                                                              v-slot:default="{ active, toggle }">-->
            <!--                                                    <v-btn class="mx-2"-->
            <!--                                                           :input-value="active"-->
            <!--                                                           active-class="blue white&#45;&#45;text"-->
            <!--                                                           depressed-->
            <!--                                                           rounded-->
            <!--                                                           @click="addProducts(item, n.venda, n.custo,n.clinica, n)"-->
            <!--                                                    >-->
            <!--                                                        {{n.clinica}} | {{n.name}} | {{n.price}}-->
            <!--                                                    </v-btn>-->
            <!--                                                </v-slide-item>-->
            <!--                                            </v-slide-group>-->
            <!--                                        </v-card-text>-->
            <!--                                        <v-card-text v-if="categorySelect == 'package'">-->
            <!--                                            <v-card class="elevation-0 py-0" v-if="item.exames">-->
            <!--                                                <v-card-title class="py-0 subtitle-1 font-weight-regular">Exames-->
            <!--                                                </v-card-title>-->
            <!--                                                <v-card-text>-->
            <!--                                                    <v-slide-group show-arrows>-->
            <!--                                                        <v-slide-item v-for="n in item.exames"-->
            <!--                                                                      v-slot:default="{ active, toggle }">-->
            <!--                                                            <v-btn class="mx-2 blue white&#45;&#45;text"-->
            <!--                                                                   depressed-->
            <!--                                                                   rounded-->
            <!--                                                            >-->
            <!--                                                                {{ n.produto }} | R${{n.preco}}-->
            <!--                                                            </v-btn>-->
            <!--                                                        </v-slide-item>-->
            <!--                                                    </v-slide-group>-->
            <!--                                                </v-card-text>-->
            <!--                                            </v-card>-->
            <!--                                            <v-card class="elevation-0 mt-0 py-0" v-if="item.consultas">-->
            <!--                                                <v-card-title class="py-0 subtitle-1 font-weight-regular">Consultas-->
            <!--                                                </v-card-title>-->
            <!--                                                <v-card-text>-->
            <!--                                                    <v-slide-group show-arrows>-->
            <!--                                                        <v-slide-item v-for="n in item.consultas"-->
            <!--                                                                      v-slot:default="{ active, toggle }">-->
            <!--                                                            <v-btn class="mx-2 blue white&#45;&#45;text"-->

            <!--                                                                   depressed-->
            <!--                                                                   rounded-->


            <!--                                                            >-->
            <!--                                                                {{ n.produto }} | R${{n.preco}}-->
            <!--                                                            </v-btn>-->
            <!--                                                        </v-slide-item>-->
            <!--                                                    </v-slide-group>-->
            <!--                                                </v-card-text>-->
            <!--                                            </v-card>-->
            <!--                                            <div class="py-0 subtitle-1 font-weight-bold text-right">-->
            <!--                                                Total R${{item.total}}-->
            <!--                                                <v-btn class="ml-5" outlined rounded color="primary"-->
            <!--                                                       @click="addProducts(item, item.total, item.custo)">Selecionar-->
            <!--                                                </v-btn>-->
            <!--                                            </div>-->
            <!--                                        </v-card-text>-->
            <!--                                    </v-card>-->
            <!--                                </v-flex>-->
            <!--                            </v-fade-transition>-->
            <!--                        </v-card>-->
            <!--                    </v-container>-->
            <!--                </v-sheet>-->
            <!--            </v-bottom-sheet>-->

<!--            <v-flex class="hidden-screen-only">-->
<!--                <v-card>-->
<!--                    <v-flex>-->
<!--                        <span>Nome do paciente: Nome</span>-->
<!--                    </v-flex>-->
<!--                    <v-flex>-->
<!--                        <span>Código: {{this.now.toString()}}</span>-->
<!--                    </v-flex>-->
<!--                    <v-flex>-->
<!--                        <span>Data: {{this.data}}</span>-->
<!--                    </v-flex>-->
<!--                    <p>Exames</p>-->
<!--                    <v-flex v-for="item in exames" :key="item.nome">-->
<!--                        <p class="ma-0">{{item.nome}}</p>-->
<!--                        <p class="text-right preco">{{item.preco}}</p>-->
<!--                    </v-flex>-->
<!--                    <v-divider></v-divider>-->
<!--                    <p>Consultas</p>-->
<!--                    <v-flex v-for="item in consultas" :key="item.nome">-->
<!--                        <p class="ma-0">{{item.nome}}</p>-->
<!--                        <p class="text-right preco">{{item.preco}}</p>-->
<!--                    </v-flex>-->
<!--                    <v-divider></v-divider>-->
<!--                    <p>Pacotes</p>-->
<!--                    <v-flex v-for="item in pacotes" :key="item.nome">-->

<!--                        <p class="ma-0">{{item.nome}}</p>-->
<!--                        <p class="text-right preco">{{item.preco}}</p>-->
<!--                    </v-flex>-->
<!--                    <v-divider></v-divider>-->
<!--                    <v-spacer></v-spacer>-->
<!--                    <v-flex>-->
<!--                        <span>Valor total: {{this.total}}</span>-->
<!--                    </v-flex>-->
<!--                </v-card>-->
<!--            </v-flex>-->
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
    import Vue from 'vue'
    import moment from 'moment'
    import ProceduresSearch from "../../components/cashier/ProceduresSearch";
    import Cart from "../../components/cashier/Cart";

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
            parcelas: '',
            quantParcelas: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
            taxa: 0,
            desconto: 0,
        }),
        components: {
            ProceduresSearch,
            Cart
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
