<template>
    <v-container fluid>
        <v-layout row wrap class="align-center justify-center">
            <v-flex xs8 sm4>
                <v-card>
                    <v-card-title><h2>Minha Conta</h2></v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-text-field v-model="user.name" label="Nome Completo"/>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field readonly v-model="user.email" label="Email"/>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field readonly v-model="user.cpf" v-mask="'###.###.###-##'"
                                              label="CPF"/>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field
                                        v-if="user.telephones"
                                        v-model="user.telephones[0]"
                                        v-mask="'(##)#####-####'"
                                        label="Telefone"
                                />
                            </v-flex>
                            <v-flex xs12>
                                <v-combobox
                                        :items="banks"
                                        item-text="name"
                                        label="Banco"
                                        v-model="bank.bank"
                                />
                            </v-flex>
                            <v-flex xs6 class="pr-1">
                                <v-text-field
                                        label="Agência"
                                        v-model="bank.branchBank"
                                        v-mask="['####', '####-#', '#####-#']"
                                />
                            </v-flex>
                            <v-flex xs6 class="pl-1">
                                <v-text-field
                                        label="Conta"
                                        type="number"
                                        v-model="bank.accountBank"
                                />
                            </v-flex>
                            <v-flex xs5>
                                <v-layout row wrap class="align-center">
                                    <v-text-field
                                            style="width:60px"
                                            label="CEP"
                                            v-model="address.cep"
                                            v-mask="mask.cep"
                                    />
                                    <v-btn @click="getAddressByCep(address)" class="transparent" text>
                                        <v-icon>search</v-icon>
                                    </v-btn>
                                </v-layout>
                            </v-flex>
                            <v-flex xs2>
                                <v-select
                                        class="ml-2"
                                        label="UF"
                                        hide-details
                                        single-line
                                        v-model="address.uf"
                                        :items="states"
                                        menu-props="auto"
                                />
                            </v-flex>
                            <v-spacer/>
                            <v-flex xs4>
                                <v-select
                                        label="Cidade"
                                        class="mr-2"
                                        single-line
                                        v-model="address.city"
                                        :items="cities[address.uf]"
                                        menu-props="auto"
                                        hide-details
                                />
                            </v-flex>

                            <v-flex xs10 class="pr-1">
                                <v-text-field label="Logradouro" v-model="address.street"/>
                            </v-flex>
                            <v-flex xs2 class="pl-1">
                                <v-text-field label="Número" v-model="address.number"/>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field label="Complemento" v-model="address.complement"/>
                            </v-flex>
                        </v-layout>
                    </v-card-text>

                    <v-card-actions class="text-right">
                        <v-spacer/>
                        <submit-button
                                color="success"
                                rounded
                                @reset="reset"
                                :success="success"
                                :loading="loading"
                                @click="updateAccount"
                                text="Salvar"
                        />
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>

        <v-dialog v-model="dialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Adicionar Usuário</v-card-title>
                <v-card-text>
                    <v-text-field slot="activator" v-model="name" persistent-hint label="Nome"/>

                    <v-text-field slot="activator" v-model="username" persistent-hint
                                  label="Nome de Usuário"/>

                    <v-text-field slot="activator" v-model="email" persistent-hint label="Email"/>

                    <v-text-field
                            slot="activator"
                            v-model="password"
                            persistent-hint
                            type="password"
                            label="Senha"
                    />

                    <v-layout row wrap>
                        <v-flex xs12>
                            <span>Permissões</span>
                        </v-flex>
                        <v-btn
                                @click="selectedPermissions.indexOf(permission) > -1 ? selectedPermissions.splice(selectedPermissions.indexOf(permission), 1) :
selectedPermissions.push(permission)"
                                :class="[selectedPermissions.indexOf(permission) > -1 ? 'primary' : 'white']"
                                v-for="permission in permissions"
                                :key="permission"
                        >{{permission}}
                        </v-btn>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary_dark darken-1" flat @click.native="dialog = false">Cancelar</v-btn>
                    <v-btn color="primary_dark darken-1" flat @click.native="addUser">Adicionar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import {mask} from "vue-the-mask";
    import SubmitButton from "../../components/SubmitButton";

    export default {
        name: "Register",
        directives: {
            mask
        },
        components: {
            SubmitButton
        },
        data() {
            return {

                dialog: false,
                name: "",
                username: "",
                email: "",
                password: "",
                permissions: ["caixa", "prontuario"],
                selectedPermissions: [],
                userAccount: undefined,
                mask: {
                    cpf: "###.###.###-##",
                    telephone: "(##) #####-####",
                    cep: "##.###-###"
                },
                states: ["AC", "AL", "AM"],
                cities: {
                    AC: [],
                    AL: [],
                    AM: ["Iranduba", "Manaus", "Parintins", "AUTAZES"]
                },
                addressObj: {},
                bankObj: {},
                loading: false,
                success: false,
                banks: [
                    {
                        "cod": "001",
                        "name": "Banco do Brasil S.A."
                    },
                    {
                        "cod": "003",
                        "name": "Banco da Amazônia S.A."
                    },
                    {
                        "cod": "004",
                        "name": "Banco do Nordeste do Brasil S.A."
                    },
                    {
                        "cod": "007",
                        "name": "Banco Nacional de Desenvolvimento Econômico e Social BNDES"
                    },
                    {
                        "cod": "010",
                        "name": "Credicoamo Crédito Rural Cooperativa"
                    },
                    {
                        "cod": "011",
                        "name": "Credit Suisse Hedging-Griffo Corretora de Valores S.A."
                    },
                    {
                        "cod": "012",
                        "name": "Banco Inbursa S.A."
                    },
                    {
                        "cod": "014",
                        "name": "Natixis Brasil S.A. Banco Múltiplo"
                    },
                    {
                        "cod": "015",
                        "name": "UBS Brasil Corretora de Câmbio, Títulos e Valores Mobiliários S.A."
                    },
                    {
                        "cod": "016",
                        "name": "Coop de Créd. Mútuo dos Despachantes de Trânsito de SC e Rio Grande do Sul"
                    },
                    {
                        "cod": "017",
                        "name": "BNY Mellon Banco S.A."
                    },
                    {
                        "cod": "018",
                        "name": "Banco Tricury S.A."
                    },
                    {
                        "cod": "021",
                        "name": "Banestes S.A. Banco do Estado do Espírito Santo"
                    },
                    {
                        "cod": "024",
                        "name": "Banco Bandepe S.A."
                    },
                    {
                        "cod": "025",
                        "name": "Banco Alfa S.A."
                    },
                    {
                        "cod": "029",
                        "name": "Banco Itaú Consignado S.A."
                    },
                    {
                        "cod": "033",
                        "name": "Banco Santander (Brasil) S. A."
                    },
                    {
                        "cod": "036",
                        "name": "Banco Bradesco BBI S.A."
                    },
                    {
                        "cod": "037",
                        "name": "Banco do Estado do Pará S.A."
                    },
                    {
                        "cod": "040",
                        "name": "Banco Cargill S.A."
                    },
                    {
                        "cod": "041",
                        "name": "Banco do Estado do Rio Grande do Sul S.A."
                    },
                    {
                        "cod": "047",
                        "name": "Banco do Estado de Sergipe S.A."
                    },
                    {
                        "cod": "060",
                        "name": "Confidence Corretora de Câmbio S.A."
                    },
                    {
                        "cod": "062",
                        "name": "Hipercard Banco Múltiplo S.A."
                    },
                    {
                        "cod": "063",
                        "name": "Banco Bradescard S.A."
                    },
                    {
                        "cod": "064",
                        "name": "Goldman Sachs do Brasil  Banco Múltiplo S. A."
                    },
                    {
                        "cod": "065",
                        "name": "Banco AndBank (Brasil) S.A."
                    },
                    {
                        "cod": "066",
                        "name": "Banco Morgan Stanley S. A."
                    },
                    {
                        "cod": "069",
                        "name": "Banco Crefisa S.A."
                    },
                    {
                        "cod": "070",
                        "name": "Banco de Brasília S.A."
                    },
                    {
                        "cod": "074",
                        "name": "Banco J. Safra S.A."
                    },
                    {
                        "cod": "075",
                        "name": "Banco ABN Amro S.A."
                    },
                    {
                        "cod": "076",
                        "name": "Banco KDB do Brasil S.A."
                    },
                    {
                        "cod": "077",
                        "name": "Banco Inter S.A."
                    },
                    {
                        "cod": "078",
                        "name": "Haitong Banco de Investimento do Brasil S.A."
                    },
                    {
                        "cod": "079",
                        "name": "Banco Original do Agronegócio S.A."
                    },
                    {
                        "cod": "080",
                        "name": "BT Corretora de Câmbio Ltda."
                    },
                    {
                        "cod": "081",
                        "name": "BBN Banco Brasileiro de Negocios S.A."
                    },
                    {
                        "cod": "082",
                        "name": "Banco Topazio S.A."
                    },
                    {
                        "cod": "083",
                        "name": "Banco da China Brasil S.A."
                    },
                    {
                        "cod": "084",
                        "name": "Uniprime Norte do Paraná - Cooperativa de Crédito Ltda."
                    },
                    {
                        "cod": "085",
                        "name": "Cooperativa Central de Crédito Urbano - Cecred"
                    },
                    {
                        "cod": "089",
                        "name": "Cooperativa de Crédito Rural da Região da Mogiana"
                    },
                    {
                        "cod": "091",
                        "name": "Central de Cooperativas de Economia e Crédito Mútuo do Est RS - Unicred"
                    },
                    {
                        "cod": "092",
                        "name": "BRK S.A. Crédito, Financiamento e Investimento"
                    },
                    {
                        "cod": "093",
                        "name": "Pólocred Sociedade de Crédito ao Microempreendedor e à Empresa de Pequeno Porte"
                    },
                    {
                        "cod": "094",
                        "name": "Banco Finaxis S.A."
                    },
                    {
                        "cod": "095",
                        "name": "Banco Confidence de Câmbio S.A."
                    },
                    {
                        "cod": "096",
                        "name": "Banco BMFBovespa de Serviços de Liquidação e Custódia S/A"
                    },
                    {
                        "cod": "097",
                        "name": "Cooperativa Central de Crédito Noroeste Brasileiro Ltda - CentralCredi"
                    },
                    {
                        "cod": "098",
                        "name": "Credialiança Cooperativa de Crédito Rural"
                    },
                    {
                        "cod": "099",
                        "name": "Uniprime Central – Central Interestadual de Cooperativas de Crédito Ltda."
                    },
                    {
                        "cod": "100",
                        "name": "Planner Corretora de Valores S.A."
                    },
                    {
                        "cod": "101",
                        "name": "Renascença Distribuidora de Títulos e Valores Mobiliários Ltda."
                    },
                    {
                        "cod": "102",
                        "name": "XP Investimentos Corretora de Câmbio Títulos e Valores Mobiliários S.A."
                    },
                    {
                        "cod": "104",
                        "name": "Caixa Econômica Federal"
                    },
                    {
                        "cod": "105",
                        "name": "Lecca Crédito, Financiamento e Investimento S/A"
                    },
                    {
                        "cod": "107",
                        "name": "Banco Bocom BBM S.A."
                    },
                    {
                        "cod": "108",
                        "name": "PortoCred S.A. Crédito, Financiamento e Investimento"
                    },
                    {
                        "cod": "111",
                        "name": "Oliveira Trust Distribuidora de Títulos e Valores Mobiliários S.A."
                    },
                    {
                        "cod": "113",
                        "name": "Magliano S.A. Corretora de Cambio e Valores Mobiliarios"
                    },
                    {
                        "cod": "114",
                        "name": "Central Cooperativa de Crédito no Estado do Espírito Santo - CECOOP"
                    },
                    {
                        "cod": "117",
                        "name": "Advanced Corretora de Câmbio Ltda."
                    },
                    {
                        "cod": "118",
                        "name": "Standard Chartered Bank (Brasil) S.A. Banco de Investimento"
                    },
                    {
                        "cod": "119",
                        "name": "Banco Western Union do Brasil S.A."
                    },
                    {
                        "cod": "120",
                        "name": "Banco Rodobens SA"
                    },
                    {
                        "cod": "121",
                        "name": "Banco Agibank S.A."
                    },
                    {
                        "cod": "122",
                        "name": "Banco Bradesco BERJ S.A."
                    },
                    {
                        "cod": "124",
                        "name": "Banco Woori Bank do Brasil S.A."
                    },
                    {
                        "cod": "125",
                        "name": "Brasil Plural S.A. Banco Múltiplo"
                    },
                    {
                        "cod": "126",
                        "name": "BR Partners Banco de Investimento S.A."
                    },
                    {
                        "cod": "127",
                        "name": "Codepe Corretora de Valores e Câmbio S.A."
                    },
                    {
                        "cod": "128",
                        "name": "MS Bank S.A. Banco de Câmbio"
                    },
                    {
                        "cod": "129",
                        "name": "UBS Brasil Banco de Investimento S.A."
                    },
                    {
                        "cod": "130",
                        "name": "Caruana S.A. Sociedade de Crédito, Financiamento e Investimento"
                    },
                    {
                        "cod": "131",
                        "name": "Tullett Prebon Brasil Corretora de Valores e Câmbio Ltda."
                    },
                    {
                        "cod": "132",
                        "name": "ICBC do Brasil Banco Múltiplo S.A."
                    },
                    {
                        "cod": "133",
                        "name": "Confederação Nacional das Cooperativas Centrais de Crédito e Economia Familiar e"
                    },
                    {
                        "cod": "134",
                        "name": "BGC Liquidez Distribuidora de Títulos e Valores Mobiliários Ltda."
                    },
                    {
                        "cod": "135",
                        "name": "Gradual Corretora de Câmbio, Títulos e Valores Mobiliários S.A."
                    },
                    {
                        "cod": "136",
                        "name": "Confederação Nacional das Cooperativas Centrais Unicred Ltda – Unicred do Brasil"
                    },
                    {
                        "cod": "137",
                        "name": "Multimoney Corretora de Câmbio Ltda"
                    },
                    {
                        "cod": "138",
                        "name": "Get Money Corretora de Câmbio S.A."
                    },
                    {
                        "cod": "139",
                        "name": "Intesa Sanpaolo Brasil S.A. - Banco Múltiplo"
                    },
                    {
                        "cod": "140",
                        "name": "Easynvest - Título Corretora de Valores SA"
                    },
                    {
                        "cod": "142",
                        "name": "Broker Brasil Corretora de Câmbio Ltda."
                    },
                    {
                        "cod": "143",
                        "name": "Treviso Corretora de Câmbio S.A."
                    },
                    {
                        "cod": "144",
                        "name": "Bexs Banco de Câmbio S.A."
                    },
                    {
                        "cod": "145",
                        "name": "Levycam - Corretora de Câmbio e Valores Ltda."
                    },
                    {
                        "cod": "146",
                        "name": "Guitta Corretora de Câmbio Ltda."
                    },
                    {
                        "cod": "149",
                        "name": "Facta Financeira S.A. - Crédito Financiamento e Investimento"
                    },
                    {
                        "cod": "157",
                        "name": "ICAP do Brasil Corretora de Títulos e Valores Mobiliários Ltda."
                    },
                    {
                        "cod": "159",
                        "name": "Casa do Crédito S.A. Sociedade de Crédito ao Microempreendedor"
                    },
                    {
                        "cod": "163",
                        "name": "Commerzbank Brasil S.A. - Banco Múltiplo"
                    },
                    {
                        "cod": "169",
                        "name": "Banco Olé Bonsucesso Consignado S.A."
                    },
                    {
                        "cod": "172",
                        "name": "Albatross Corretora de Câmbio e Valores S.A"
                    },
                    {
                        "cod": "173",
                        "name": "BRL Trust Distribuidora de Títulos e Valores Mobiliários S.A."
                    },
                    {
                        "cod": "174",
                        "name": "Pernambucanas Financiadora S.A. Crédito, Financiamento e Investimento"
                    },
                    {
                        "cod": "177",
                        "name": "Guide Investimentos S.A. Corretora de Valores"
                    },
                    {
                        "cod": "180",
                        "name": "CM Capital Markets Corretora de Câmbio, Títulos e Valores Mobiliários Ltda."
                    },
                    {
                        "cod": "182",
                        "name": "Dacasa Financeira S/A - Sociedade de Crédito, Financiamento e Investimento"
                    },
                    {
                        "cod": "183",
                        "name": "Socred S.A. - Sociedade de Crédito ao Microempreendedor"
                    },
                    {
                        "cod": "184",
                        "name": "Banco Itaú BBA S.A."
                    },
                    {
                        "cod": "188",
                        "name": "Ativa Investimentos S.A. Corretora de Títulos Câmbio e Valores"
                    },
                    {
                        "cod": "189",
                        "name": "HS Financeira S/A Crédito, Financiamento e Investimentos"
                    },
                    {
                        "cod": "190",
                        "name": "Cooperativa de Economia e Crédito Mútuo dos Servidores Públicos Estaduais do Rio"
                    },
                    {
                        "cod": "191",
                        "name": "Nova Futura Corretora de Títulos e Valores Mobiliários Ltda."
                    },
                    {
                        "cod": "194",
                        "name": "Parmetal Distribuidora de Títulos e Valores Mobiliários Ltda."
                    },
                    {
                        "cod": "196",
                        "name": "Fair Corretora de Câmbio S.A."
                    },
                    {
                        "cod": "197",
                        "name": "Stone Pagamentos S.A."
                    },
                    {
                        "cod": "204",
                        "name": "Banco Bradesco Cartões S.A."
                    },
                    {
                        "cod": "208",
                        "name": "Banco BTG Pactual S.A."
                    },
                    {
                        "cod": "212",
                        "name": "Banco Original S.A."
                    },
                    {
                        "cod": "213",
                        "name": "Banco Arbi S.A."
                    },
                    {
                        "cod": "217",
                        "name": "Banco John Deere S.A."
                    },
                    {
                        "cod": "218",
                        "name": "Banco BS2 S.A."
                    },
                    {
                        "cod": "222",
                        "name": "Banco Credit Agrícole Brasil S.A."
                    },
                    {
                        "cod": "224",
                        "name": "Banco Fibra S.A."
                    },
                    {
                        "cod": "233",
                        "name": "Banco Cifra S.A."
                    },
                    {
                        "cod": "237",
                        "name": "Banco Bradesco S.A."
                    },
                    {
                        "cod": "241",
                        "name": "Banco Clássico S.A."
                    },
                    {
                        "cod": "243",
                        "name": "Banco Máxima S.A."
                    },
                    {
                        "cod": "246",
                        "name": "Banco ABC Brasil S.A."
                    },
                    {
                        "cod": "249",
                        "name": "Banco Investcred Unibanco S.A."
                    },
                    {
                        "cod": "250",
                        "name": "BCV - Banco de Crédito e Varejo S/A"
                    },
                    {
                        "cod": "253",
                        "name": "Bexs Corretora de Câmbio S/A"
                    },
                    {
                        "cod": "254",
                        "name": "Parana Banco S. A."
                    },
                    {
                        "cod": "260",
                        "name": "Nu Pagamentos S.A."
                    },
                    {
                        "cod": "265",
                        "name": "Banco Fator S.A."
                    },
                    {
                        "cod": "266",
                        "name": "Banco Cédula S.A."
                    },
                    {
                        "cod": "268",
                        "name": "Barigui Companhia Hipotecária"
                    },
                    {
                        "cod": "269",
                        "name": "HSBC Brasil S.A. Banco de Investimento"
                    },
                    {
                        "cod": "271",
                        "name": "IB Corretora de Câmbio, Títulos e Valores Mobiliários Ltda."
                    },
                    {
                        "cod": "300",
                        "name": "Banco de la Nacion Argentina"
                    },
                    {
                        "cod": "318",
                        "name": "Banco BMG S.A."
                    },
                    {
                        "cod": "320",
                        "name": "China Construction Bank (Brasil) Banco Múltiplo S/A"
                    },
                    {
                        "cod": "341",
                        "name": "Itaú Unibanco  S.A."
                    },
                    {
                        "cod": "366",
                        "name": "Banco Société Générale Brasil S.A."
                    },
                    {
                        "cod": "370",
                        "name": "Banco Mizuho do Brasil S.A."
                    },
                    {
                        "cod": "376",
                        "name": "Banco J. P. Morgan S. A."
                    },
                    {
                        "cod": "389",
                        "name": "Banco Mercantil do Brasil S.A."
                    },
                    {
                        "cod": "394",
                        "name": "Banco Bradesco Financiamentos S.A."
                    },
                    {
                        "cod": "399",
                        "name": "Kirton Bank S.A. - Banco Múltiplo"
                    },
                    {
                        "cod": "412",
                        "name": "Banco Capital S. A."
                    },
                    {
                        "cod": "422",
                        "name": "Banco Safra S.A."
                    },
                    {
                        "cod": "456",
                        "name": "Banco MUFG Brasil S.A."
                    },
                    {
                        "cod": "464",
                        "name": "Banco Sumitomo Mitsui Brasileiro S.A."
                    },
                    {
                        "cod": "473",
                        "name": "Banco Caixa Geral - Brasil S.A."
                    },
                    {
                        "cod": "477",
                        "name": "Citibank N.A."
                    },
                    {
                        "cod": "479",
                        "name": "Banco ItauBank S.A."
                    },
                    {
                        "cod": "487",
                        "name": "Deutsche Bank S.A. - Banco Alemão"
                    },
                    {
                        "cod": "488",
                        "name": "JPMorgan Chase Bank, National Association"
                    },
                    {
                        "cod": "492",
                        "name": "ING Bank N.V."
                    },
                    {
                        "cod": "494",
                        "name": "Banco de La Republica Oriental del Uruguay"
                    },
                    {
                        "cod": "495",
                        "name": "Banco de La Provincia de Buenos Aires"
                    },
                    {
                        "cod": "505",
                        "name": "Banco Credit Suisse (Brasil) S.A."
                    },
                    {
                        "cod": "545",
                        "name": "Senso Corretora de Câmbio e Valores Mobiliários S.A."
                    },
                    {
                        "cod": "600",
                        "name": "Banco Luso Brasileiro S.A."
                    },
                    {
                        "cod": "604",
                        "name": "Banco Industrial do Brasil S.A."
                    },
                    {
                        "cod": "610",
                        "name": "Banco VR S.A."
                    },
                    {
                        "cod": "611",
                        "name": "Banco Paulista S.A."
                    },
                    {
                        "cod": "612",
                        "name": "Banco Guanabara S.A."
                    },
                    {
                        "cod": "613",
                        "name": "Omni Banco S.A."
                    },
                    {
                        "cod": "623",
                        "name": "Banco Pan S.A."
                    },
                    {
                        "cod": "626",
                        "name": "Banco Ficsa S. A."
                    },
                    {
                        "cod": "630",
                        "name": "Banco Intercap S.A."
                    },
                    {
                        "cod": "633",
                        "name": "Banco Rendimento S.A."
                    },
                    {
                        "cod": "634",
                        "name": "Banco Triângulo S.A."
                    },
                    {
                        "cod": "637",
                        "name": "Banco Sofisa S. A."
                    },
                    {
                        "cod": "641",
                        "name": "Banco Alvorada S.A."
                    },
                    {
                        "cod": "643",
                        "name": "Banco Pine S.A."
                    },
                    {
                        "cod": "652",
                        "name": "Itaú Unibanco Holding S.A."
                    },
                    {
                        "cod": "653",
                        "name": "Banco Indusval S. A."
                    },
                    {
                        "cod": "654",
                        "name": "Banco A. J. Renner S.A."
                    },
                    {
                        "cod": "655",
                        "name": "Banco Votorantim S.A."
                    },
                    {
                        "cod": "707",
                        "name": "Banco Daycoval S.A."
                    },
                    {
                        "cod": "712",
                        "name": "Banco Ourinvest S.A."
                    },
                    {
                        "cod": "719",
                        "name": "Banif - Bco Internacional do Funchal (Brasil) S.A."
                    },
                    {
                        "cod": "735",
                        "name": "Banco Neon S.A."
                    },
                    {
                        "cod": "739",
                        "name": "Banco Cetelem S.A."
                    },
                    {
                        "cod": "741",
                        "name": "Banco Ribeirão Preto S.A."
                    },
                    {
                        "cod": "743",
                        "name": "Banco Semear S.A."
                    },
                    {
                        "cod": "745",
                        "name": "Banco Citibank S.A."
                    },
                    {
                        "cod": "746",
                        "name": "Banco Modal S.A."
                    },
                    {
                        "cod": "747",
                        "name": "Banco Rabobank International Brasil S.A."
                    },
                    {
                        "cod": "748",
                        "name": "Banco Cooperativo Sicredi S. A."
                    },
                    {
                        "cod": "751",
                        "name": "Scotiabank Brasil S.A. Banco Múltiplo"
                    },
                    {
                        "cod": "752",
                        "name": "Banco BNP Paribas Brasil S.A."
                    },
                    {
                        "cod": "753",
                        "name": "Novo Banco Continental S.A. - Banco Múltiplo"
                    },
                    {
                        "cod": "754",
                        "name": "Banco Sistema S.A."
                    },
                    {
                        "cod": "755",
                        "name": "Bank of America Merrill Lynch Banco Múltiplo S.A."
                    },
                    {
                        "cod": "756",
                        "name": "Banco Cooperativo do Brasil S/A - Bancoob"
                    },
                    {
                        "cod": "757",
                        "name": "Banco Keb Hana do Brasil S. A."
                    }
                ]
            };

        },

        computed: {
            address: {
                set(val) {
                    this.addressObj = val;
                },
                get() {
                    return this.addressObj;
                }
            },
            bank: {
                set (val) {
                    this.bankObj = val;
                },
                get () {
                    return this.bankObj;
                }
            },
            user() {
                let user = this.$store.getters.user;
                if (!user.address) {
                    this.address = {
                        cep: "",
                        uf: "",
                        city: "",
                        street: "",
                        number: "",
                        complement: ""
                    };
                } else {
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.address = user.address;
                }
                if (!user.bank) {
                    this.bank = {
                        bank: "",
                        accountBank: "",
                        branchBank: "",
                    };
                } else {
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.bank = user.bank;
                }
                return user;
            }
        },
        methods: {
            async initialConfig() {
                this.user = await this.$store.getters.user;
                if (!this.user.address) {
                    this.user.address = {
                        cep: "",
                        uf: "",
                        city: "",
                        street: "",
                        number: "",
                        complement: ""
                    };
                }
            },
            reset() {
                this.success = false;
            },
            updateAccount() {
                this.loading = true;
                this.$store.dispatch("updateAccount", {
                    ...this.user,
                    address: this.address,
                    bank: this.bank,

                });
                this.loading = false;
                this.success = true
            },
            addUser() {
                let payload = {
                    name: this.name,
                    email: this.email,
                    username: this.username,
                    password: this.password,
                    permissions: this.selectedPermissions
                };
                this.$store.dispatch("addUser", payload).then(response => {
                    this.name = "";
                    this.username = "";
                    this.email = "";
                    this.password = "";
                    this.selectedPermissions = [];
                    this.dialog = false;
                });
            },
            async getAddressByCep(address) {
                let resp;
                let foundAddress = undefined;
                try {
                    resp = await this.$store.dispatch(
                        "getAddressByCep",
                        address.cep.replace(".", "").replace("-", "")
                    );
                    if (resp.erro) {
                        return;
                    }
                } catch (e) {
                    return;
                }
                foundAddress = {
                    cep: resp.cep,
                    street: resp.logradouro,
                    complement: resp.complemento,
                    city: resp.localidade,
                    uf: resp.uf
                };
                this.address = foundAddress;
            }

        }
    };
</script>

<style scoped>
</style>
