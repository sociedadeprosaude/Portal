<template>
    <v-flex class="hidden-print-only d-none d-md-block" xs12>
        <v-card id="carrinho" class="ml-5 elevation-2 ">
            <v-container>
                <v-layout row wrap class="mx-3 align-center">
                    <v-flex sm11 xs12>
                        <v-text-field
                                label="Digitar Nome do Paciente"
                                v-model="codigo"
                        ></v-text-field>
                    </v-flex>
                    <v-flex sm1 xs2 class="text-center">
                        <v-icon @click="pesquisarUsuario()">search</v-icon>
                    </v-flex>
                    <v-flex xs12 class="text-right">
                        <v-btn outlined class="mr-5" color="primary" @click="gerarCodigo()">Gerar Codigo</v-btn>
                    </v-flex>
                    <v-flex xs12 class="mt-4 v-card"
                            style="overflow:auto; height:50vh; box-shadow: inset 0px 0px 5px grey;">
                        <v-layout row wrap>
                            <v-flex xs12 v-if="exames.length > 0">
                                <p>Exames</p>
                                <v-card v-for="(item,index) in exames" class="mt-2" :key="item.nome">
                                    <v-card-title class="py-2">
                                        <span class="subtitle-1 font-weight-medium">{{item.name}}</span>
                                        <v-spacer></v-spacer>
                                        <span class="subtitle-1 font-weight-light">
                                                <v-btn small icon @click="removeItem(item)">
                                                    <v-icon>cancel</v-icon>
                                                </v-btn>
                                            </span>
                                    </v-card-title>
                                    <v-card-text class="pt-1 pb-0">
                                        {{item.clinic}}
                                        <p class="text-right">
                                            R$ {{item.price}}
                                        </p>
                                    </v-card-text>
                                </v-card>
                            </v-flex>
                            <v-divider></v-divider>
                            <v-flex xs12 v-if="consultas.length > 0">
                                <p>Consultas</p>
                                <v-card v-for="(item,index) in consultas" class="ma-2" :key="item.doctor.name">
                                    <v-card-title class="py-2">
                                        <span class="subtitle-1 font-weight-medium">{{item.name}}</span>
                                        <v-spacer></v-spacer>
                                        <span class="subtitle-1 font-weight-light">
                                                <v-btn small icon @click="removeItem(item)">
                                                    <v-icon>cancel</v-icon>
                                                </v-btn>
                                            </span>
                                    </v-card-title>
                                    <v-card-text class="pt-1 pb-0">
                                        {{item.doctor.name}}
                                        <p class="text-right">
                                            R$ {{item.doctor.price}}
                                        </p>
                                    </v-card-text>

                                </v-card>
                            </v-flex>
                            <v-divider></v-divider>
                            <v-flex xs12 v-if="pacotes.length > 0">
                                <p>Pacotes</p>
                                <v-card v-for="(item,index) in pacotes" class="mt-2" :key="item.nome">
                                    <v-card-title class="py-2">
                                        <span class="subtitle-1 font-weight-medium">{{item.nome}}</span>
                                        <v-spacer></v-spacer>
                                        <span class="subtitle-1 font-weight-light">
                                                <v-btn small icon @click="removeItem(item)">
                                                    <v-icon>cancel</v-icon>
                                                </v-btn>
                                            </span>
                                    </v-card-title>
                                    <v-card-text class="pt-1 pb-0">
                                        <p class="text-right">
                                            R$ {{item.preco}}
                                        </p>
                                    </v-card-text>

                                </v-card>
                            </v-flex>

                        </v-layout>
                    </v-flex>


                    <v-spacer></v-spacer>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-select class="mt-5" label="forma de pagamento" :items="FormasDePagamento"
                                      v-model="formaPagamento"></v-select>
                        </v-flex>
                        <v-flex>
                            <v-flex xs6 v-if="formaPagamento === 'credito'">
                                <v-select :items="quantParcelas" v-model="parcelas"
                                          label="quantidade de parcelas"></v-select>
                            </v-flex>
                            <v-layout wrap>
                                <v-flex xs5>
                                    <v-text-field label="Desconto: %" v-model="desconto1"></v-text-field>
                                </v-flex>
                                <v-spacer></v-spacer>
                                <v-flex xs5>
                                    <v-text-field label="Desconto: R$ " v-model="desconto2"></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs6>
                            <v-layout column wrap>
                                <v-flex xs12>
                                    <span>Subtotal: R$ {{this.total.toLocaleString('en-us', {minimumFractionDigits: 2})}}</span>
                                </v-flex>
                                <v-flex xs12>
                                    <span>Desconto: R$ {{this.desconto2.toLocaleString('en-us', {minimumFractionDigits: 2})}}</span>
                                </v-flex>
                                <v-flex xs12>
                                    <h6 class="title font-weight-bold"> Total: R$
                                        {{this.totalNovo.toLocaleString('en-us', {minimumFractionDigits:
                                        2})}}</h6>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-flex xs6>
                            <v-layout row wrap class="align-end fill-height">
                                <v-flex xs6 class="text-right">
                                    <v-btn outlined class="mr-5" color="primary" @click="imprimir()">Imprimir
                                    </v-btn>
                                </v-flex>
                                <v-flex xs6 class="text-right">
                                    <v-btn outlined color="primary" @click="pagar2()">Pagar</v-btn>
                                </v-flex>
                                <v-flex xs12 class="text-right">
                                    <v-btn outlined color="primary" @click="limpar()">Novo Orçamento</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-layout>
            </v-container>
        </v-card>
    </v-flex>
</template>

<script>
    export default {
        name: "Cart",
        data() {
            return {
                codigo: undefined,
                formaPagamento: '',
                total: 0,
                totalCusto: 0,
                desconto1: 0,
                desconto2: 0,
                FormasDePagamento: ["dinheiro", "credito", "debito"],
                totalNovo: 0,
            }
        },
        computed: {
            exames () {
                return this.$store.getters.getShoppingCartItemsByCategory.exams
            },
            consultas () {
                return this.$store.getters.getShoppingCartItemsByCategory.consultations
            },
            pacotes () {
                return this.$store.getters.getShoppingCartItemsByCategory.packages
            }
        },
        watch: {
            desconto1: function () {
                this.desconto2 = ((this.desconto1 * this.total) / 100);
                this.totalNovo = this.total - this.desconto2
            },
            desconto2: function () {
                this.desconto1 = ((this.desconto2 * 100) / this.total);
            },
            total: function (val) {
                this.totalNovo = val - this.desconto2;
            }
        },
        methods: {
            removeItem(item) {
                this.$store.commit('removeShoppingCartItem', item)
            },
            shareOrcamento() {
                var text = "";
                if (this.exames.length > 0) {
                    text = "Exames\n";
                    for (let index = 0; index < this.exames.length; index++) {
                        text += "\t" + this.exames[index].nome + "\n\tClinica: " + this.exames[index].clinica + "\n\tPreço: " + this.exames[index].preco + "\n"
                    }
                }
                if (this.consultas.length > 0) {
                    text += this.exames.length ? "\n\nConsultas\n" : "Consultas\n";
                    for (let index = 0; index < this.consultas.length; index++) {
                        text += "\t" + this.consultas[index].nome + "\n\tClinica: " + this.consultas[index].clinica + "\n\tPreço: " + this.consultas[index].preco + "\n"

                    }
                }

                text += "\n\nSubtotal: R$" + this.total.toLocaleString('en-us', {minimumFractionDigits: 2});
                text += "\nDesconto: R$" + this.desconto2.toLocaleString('en-us', {minimumFractionDigits: 2});
                text += "\nTotal: R$" + this.totalNovo.toLocaleString('en-us', {minimumFractionDigits: 2});
                return text
            },
            removeExame(index) {
                this.total = this.total - parseFloat(this.exames[index].preco);
                this.exames.splice(index, 1)
            },
            removeConsults(index) {
                this.total -= parseFloat(this.consultas[index].preco);
                this.consultas.splice(index, 1);
                this.medicoDia.splice(index, 1);
            },
            removePackages(index) {
                this.total -= parseFloat(this.pacotes[index].preco);
                this.pacotes.splice(index, 1)
            },
            gerarCodigo() {
                if (this.codigo === '') {
                    this.codigo = this.now.toString();
                    this.$store.dispatch('CadastrarVenda', {
                        consultas: this.consultas,
                        exames: this.exames,
                        pacotes: this.pacotes,
                        codigo: this.codigo,
                        preco: this.total,
                        custo: this.totalCusto
                    });
                }
            },
            imprimir() {
                if (this.codigo === '') {
                    this.codigo = this.now.toString();
                }
                this.$store.dispatch('CadastrarVenda', {
                    consultas: this.consultas,
                    exames: this.exames,
                    pacotes: this.pacotes,
                    codigo: this.codigo,
                    preco: this.total,
                    custo: this.totalCusto
                });
                window.print();
            },
            pesquisarUsuario() {
                this.$store.dispatch('searchPatient', this.codigo).then(() => {
                    this.categorySelect = 'appointment';
                    for (this.i = 0; this.i < this.pedid[0].consultas.length; this.i++) {
                        this.addProducts(this.pedid[0].consultas[this.i], this.pedid[0].consultas[this.i].preco, this.pedid[0].consultas[this.i].custo, this.pedid[0].consultas[this.i].clinica)
                    }
                    console.log('mostrando', this.pedid[0].exames);
                    this.categorySelect = 'exams';
                    for (this.i = 0; this.i < this.pedid[0].exames.length; this.i++) {
                        this.addProducts(this.pedid[0].exames[this.i], this.pedid[0].exames[this.i].price, this.pedid[0].exames[this.i].cost, this.pedid[0].exames[this.i].clinic)
                    }
                }).catch(() => {
                    this.aviso = true;
                })
            },
            pagar2() {
                if (this.codigo === '' || this.codigo === undefined) {
                    //falar para digitar nome de usuario
                    //aviso
                } else {
                    if (this.formaPagamento === 'credito') {
                        this.taxa = 2.4 + (0.3 * parseInt(this.parcelas))
                    }
                    if (this.formaPagamento === 'debito') {
                        this.taxa = 1.7 / 100
                    }
                    if (this.formaPagamento === 'dinheiro') {
                        this.taxa = 0
                    }
                    if (this.desconto1 !== 0) {
                        this.desconto = this.desconto1
                    }
                    if (this.desconto2 !== 0) {
                        this.desconto = this.desconto2
                    }
                    if (this.desconto1 !== 0 && this.desconto2 !== 0) {
                        this.desconto = this.total - this.totalNovo
                    }
                    this.$store.dispatch('AddSale', {
                        consultas: this.consultas,
                        exames: this.exames,
                        pacotes: this.pacotes,
                        codigo: this.codigo,
                        price: this.total,
                        pagamento: this.formaPagamento,
                        parcelas: this.parcelas,
                        taxa: this.taxa,
                        desconto: this.desconto,
                        data: this.data,
                        custo: this.totalCusto,
                        medicoDia: this.medicoDia
                    }).then(() => {
                        this.aviso2 = true;
                    });
                    this.card = false
                }
            },
            limpar() {
                this.i = 0;
                this.pacotes = [];
                this.total = 0;
                this.codigo = '';
                this.search = '';
                this.desconto1 = '';
                this.desconto2 = '';
                this.medicoDia = [];
                this.totalCusto = 0;
                this.formaPagamento = '';

            },
        }
    }
</script>

<style scoped>

</style>
