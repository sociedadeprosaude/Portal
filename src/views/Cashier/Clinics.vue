<template>
    <v-container>
        <v-layout align-left justify-left>
            <v-btn
                    @click="back"
                    color="error"
                    rounded
                    class="mb-2 elevation-6"
            >
                <v-icon left>arrow_back</v-icon>
                VOLTAR
            </v-btn>
        </v-layout>
        <v-layout row wrap>
            <v-flex>
                <v-data-table
                        :headers="headers"
                        :search="search"
                        :items="desserts"
                        sort-by="cnpj"
                        class="elevation-6"
                >
                    <template v-slot:top>
                        <v-toolbar flat color="white">
                            <v-spacer></v-spacer>
                            <template>
                                <v-container>
                                    <v-flex>
                                        <v-text-field
                                                v-model="search"
                                                append-icon="search"
                                                label="Pesquisa"
                                                color="black"
                                                single-line
                                                hide-details
                                        ></v-text-field>
                                    </v-flex>
                                </v-container>
                            </template>
                            <v-spacer></v-spacer>
                            <v-divider
                                    class="mx-4"
                                    inset
                                    vertical
                            ></v-divider>
                            <v-dialog v-model="dialog" persistent width="500px">
                                <template v-slot:activator="{ on }">
                                    <v-btn rounded color="black" dark class="mb-2 elevation-6" v-on="on">
                                        <v-icon left>add</v-icon>
                                        Nova Clinica
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title class="headline grey lighten-2" primary-title>
                                        <span class="headline">{{ formTitle }}</span>
                                    </v-card-title>

                                    <v-card-text>
                                        <v-container grid-list-md>
                                            <v-layout wrap>

                                                <v-flex xs6>
                                                    <v-text-field
                                                            v-model="editedItem.nome"
                                                            label="Nome da Clinica"
                                                            placeholder="Nome da Clinica"
                                                            outlined
                                                            clearable
                                                            hide-details
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs6>
                                                    <v-text-field
                                                            v-mask="mask.cnpj"
                                                            v-model="editedItem.cnpj"
                                                            label="CNPJ"
                                                            placeholder="CNPJ"
                                                            outlined
                                                            clearable
                                                            hide-details
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs6>
                                                    <v-text-field
                                                            v-mask="mask.telefone"
                                                            v-model="editedItem.telefone"
                                                            label="Telefone"
                                                            placeholder="Telefone"
                                                            outlined
                                                            clearable
                                                            hide-details
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs6>
                                                    <v-text-field
                                                            v-model="cep"
                                                            v-mask="mask.cep"
                                                            label="CEP"
                                                            placeholder="CEP"
                                                            outlined
                                                            clearable
                                                            hide-details
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs12>
                                                    <v-alert
                                                        v-model="alertCEP"
                                                        dense
                                                        outlined
                                                        dismissible
                                                        type="warning"
                                                        >
                                                        O CEP não foi localizado
                                                        </v-alert>
                                                </v-flex>
                                                <v-flex xs12>
                                                    <v-text-field
                                                            v-model="editedItem.address"
                                                            label="Logradouro"
                                                            placeholder="Logradouro"
                                                            outlined
                                                            hide-details
                                                            clearable
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs4>
                                                    <v-text-field
                                                            v-model="editedItem.number"
                                                            label="Nº"
                                                            placeholder="ex.: 157"
                                                            outlined
                                                            hide-details
                                                            clearable
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs8>
                                                    <v-text-field
                                                            v-model="editedItem.neighborhood"
                                                            label="Bairro"
                                                            placeholder="Bairro"
                                                            outlined
                                                            hide-details
                                                            clearable
                                                    ></v-text-field>
                                                </v-flex>

                                                <v-flex xs12>
                                                    <v-text-field
                                                            v-model="editedItem.complement"
                                                            label="Complemento"
                                                            placeholder="Complemento"
                                                            outlined
                                                            hide-details
                                                            clearable
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-flex xs7>
                                                    <v-select
                                                            :items="stateOptions"
                                                            label="Estado"
                                                            placeholder="Estado"
                                                            v-model="editedItem.state"
                                                            outlined
                                                            chips
                                                            hide-details
                                                            clearable
                                                    ></v-select>
                                                </v-flex>
                                                <v-flex xs5>
                                                    <v-text-field
                                                            label="Cidade"
                                                            placeholder="Cidade"
                                                            v-model="editedItem.city"
                                                            outlined
                                                            chips
                                                            hide-details
                                                            clearable
                                                    ></v-text-field>
                                                </v-flex>
                                                <p class="text-justify">Horario de Funcionamento de Segunda-Feira a Sexta-Feira:</p>
                                                <v-flex xs6>
                                                    <v-text-field
                                                            v-model="editedItem.startWeek"
                                                            label="Abre as:"
                                                            placeholder="Ex.: 08:00"
                                                            outlined
                                                            v-mask="mask.time"
                                                            clearable
                                                            hide-details
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-spacer></v-spacer>
                                                <v-flex xs6>
                                                    <v-text-field
                                                            v-model="editedItem.endWeek"
                                                            label="Fecha as:"
                                                            placeholder="Ex.: 18:00"
                                                            outlined
                                                            v-mask="mask.time"
                                                            clearable
                                                            hide-details
                                                    ></v-text-field>
                                                </v-flex>
                                                <p class="text-justify">Horario de Funcionamento de Sábado:</p>
                                                <v-flex xs6>
                                                    <v-text-field
                                                            v-model="editedItem.startSaturday"
                                                            label="Abre as:"
                                                            placeholder="Ex.: 06:00"
                                                            outlined
                                                            v-mask="mask.time"
                                                            clearable
                                                            hide-details
                                                    ></v-text-field>
                                                </v-flex>
                                                <v-spacer></v-spacer>
                                                <v-flex xs6>
                                                    <v-text-field
                                                            v-model="editedItem.endSaturday"
                                                            label="Fecha as:"
                                                            placeholder="Ex.: 12:00"
                                                            outlined
                                                            v-mask="mask.time"
                                                            clearable
                                                            hide-details
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                        </v-container>
                                    </v-card-text>
                                    <v-divider></v-divider>
                                    <v-card-actions>
                                        <v-btn color="error" @click="close">Cancelar</v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                                color="success"
                                                @click="save"
                                                :disabled="!formIsValid"
                                                >
                                                Salvar
                                                </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-toolbar>
                    </template>

                    <template v-slot:item.action="{ item }">

                        <v-btn @click="editItem(item)" small dark fab color="black" class="mr-2">
                            <v-icon>
                                edit
                            </v-icon>
                        </v-btn>
                        <v-btn @click="deleteItem(item)" small dark fab color="black" class="mr-2">
                            <v-icon>
                                delete
                            </v-icon>
                        </v-btn>

                        <v-dialog v-model="Consultation" width="500px" text  hide-overlay>
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" small dark fab color="black" class="mr-2" @click="selectClinic(item)">
                                    <v-icon>assignment</v-icon>
                                </v-btn>
                            </template>
                            <Consultations v-if="clinicSelected"></Consultations>
                        </v-dialog>

                        <v-dialog v-model="Exam" width="500px" text  hide-overlay>
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" small dark fab color="black" class="mr-2" @click="selectClinic(item)">
                                    <v-icon>poll</v-icon>
                                </v-btn>
                            </template>
                            <Exams v-if="clinicSelected"></Exams>
                        </v-dialog>

                        <v-dialog v-model="Product" width="500px" text  hide-overlay>
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" small dark fab color="black" class="mr-2" @click="selectClinic(item)">
                                    <v-icon>playlist_add_check</v-icon>
                                </v-btn>
                            </template>
                            <Products v-if="clinicSelected"></Products>
                        </v-dialog>

                        <v-dialog v-model="Configuration" width="500px" text  hide-overlay>
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" small dark fab color="black" class="mr-2" @click="selectClinic(item)">
                                    <v-icon>build</v-icon>
                                </v-btn>
                            </template>
                            <Configurations v-if="clinicSelected"></Configurations>
                        </v-dialog>

                    </template>

                    <template v-slot:no-results>
                        <v-alert :value="true" color="error" icon="warning">
                            Your search for "{{ search }}" found no results.
                        </v-alert>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import {mask} from 'vue-the-mask';
    import axios from 'axios';
    import Exams from "@/components/cashier/Exams";
    import Consultations from "@/components/cashier/Consultations";
    import Products from "@/components/cashier/Products";
    import Configurations from "@/components/cashier/Configurations";
    export default {
        components: {Configurations, Products, Consultations, Exams },
        directives: {mask},
        data: () => ({
            Exam: false,
            Consultation: false,
            dialog: false,
            Product: false,
            Configuration: false,
            search:'',
            mask: {
                cnpj: '##.###.###/####-##',
                telefone: '(##) #####-####',
                cep: '########',
                time:'##:##',
            },
            stateOptions: [
                'Acre (AC)',
                'Alagoas (AL)',
                'Amapá (AP)',
                'Amazonas (AM)',
                'Bahia (BA)',
                'Ceará (CE)',
                'Distrito Federal (DF)',
                'Espírito Santo (ES)',
                'Goiás (GO)',
                'Maranhão (MA)',
                'Mato Grosso (MT)',
                'Mato Grosso do Sul (MS)',
                'Minas Gerais (MG)',
                'Pará (PA)',
                'Paraíba (PB)',
                'Paraná (PR)',
                'Pernambuco (PE)',
                'Piauí (PI)',
                'Rio de Janeiro (RJ)',
                'Rio Grande do Norte (RN)',
                'Rio Grande do Sul (RS)',
                'Rondônia (RO)',
                'Roraima (RR)',
                'Santa Catarina (SC)',
                'São Paulo (SP)',
                'Sergipe (SE)',
                'Tocantins (TO)'
            ],
            headers: [
                {
                    text: 'Clinica',
                    value: 'nome',
                    align: 'left',
                    sortable: false,
                },
                { text: 'CNPJ', value: 'cnpj', align: 'left', sortable: false },
                { text: 'Telefone', value: 'telefone', align: 'left', sortable: false },
                { text: 'Actions', value: 'action', align: 'center', sortable: false }
            ],

            editedIndex: -1,
                editedItem: {
                    nome:'',
                    cnpj: '',
                    telefone: '',
                    address:'',
                    number:'',
                    neighborhood:'',
                    cep:'',
                    complement:'',
                    state: '',
                    city: '',
                    startWeek: '',
                    endWeek: '',
                    startSaturday:'',
                    endSaturday:''
            },
            cep:'',
            alertCEP:false,
            defaultItem: {
                nome:'',
                cnpj: '',
                telefone: '',
                address:'',
                number:'',
                neighborhood:'',
                cep:'',
                complement:'',
                state: '',
                city: '',
                startWeek: '',
                endWeek: '',
                startSaturday:'',
                endSaturday:''
            },

        }),

        computed: {

            formIsValid () {
                return this.editedItem.nome && this.editedItem.telefone
            },

            formTitle () {
                return this.editedIndex === -1 ? 'Formulario de Cadastro de Clinicas' : 'Formulario de Cadastro de Clinicas'
            },

            desserts(){
                return this.$store.getters.allClinics;
            },

            clinicSelected () {
                console.log(this.$store.getters.selectedClinic);
                return this.$store.getters.selectedClinic;
            },


        },

        mounted() {
            this.$store.dispatch('loadClinic')
        },

        watch: {

            dialog (val) {
                val || this.close()
            },

            cep(val){
                if(val.length === 8){
                    axios
                        .get('https://viacep.com.br/ws/'+ val + '/json/')
                        .then((response) => {
                            if(response.data.erro){
                                this.alertCEP = true
                            }else{
                                this.alertCEP = false
                                this.editedItem.address = response.data.logradouro;
                                this.editedItem.neighborhood = response.data.bairro;
                                this.editedItem.city = response.data.localidade;
                                var array = this.stateOptions;
                                /* console.log(
                                    array.find(function(element) {
                                        if(element.includes('AM')){
                                            return element;
                                        }

                                        return '';
                                    })
                                ); */
                                this.editedItem.state = array.find(function(element) {
                                    if(element.includes(response.data.uf)){
                                        return element;
                                    }
                                    return '';
                                });
                            }

                        })
                }else{
                    this.editedItem.address = '';
                    this.editedItem.neighborhood = '';
                    this.editedItem.state='';
                    this.editedItem.city = '';
                }
            },

        },

        created () {
            this.initialize()
        },

        methods: {

            selectClinic (item) {
                this.editedIndex = this.desserts.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.$store.dispatch('selectClinic', item);
            },

            initialize () {
                //
            },

            editItem (item) {
                this.editedIndex = this.desserts.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.cep = this.editedItem.cep;
                this.dialog = true;
            },

            deleteItem (item) {
                const index = this.desserts.indexOf(item);
                confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1);
                this.$store.dispatch('deleteClinic', item).then(() => {
                    this.$store.dispatch('loadClinic');
                });
            },

            close () {
                this.dialog = false;
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1
                }, 300)
            },

            back(){
                this.$router.push('/Cadastrar')
            },

            save () {
                if (this.editedIndex > -1) {
                    Object.assign(this.desserts[this.editedIndex], this.editedItem);
                } else {
                    this.desserts.push(this.editedItem);
                }

                let clinicData = {
                    endereco: {
                        bairro:this.editedItem.neighborhood,
                        cep:this.cep,
                        cidade:this.editedItem.city,
                        complemento:this.editedItem.complement,
                        estado:this.editedItem.state,
                        logradouro:this.editedItem.address,
                        numero:this.editedItem.number,
                    },
                    nome:this.editedItem.nome.toUpperCase(),
                    cnpj:this.editedItem.cnpj,
                    telefone:this.editedItem.telefone,
                    abreSemana: this.editedItem.startWeek,
                    fechaSemana: this.editedItem.endWeek,
                    abreSabado: this.editedItem.startSaturday,
                    fechaSabado: this.editedItem.endSaturday,
                };
                this.$store.dispatch('createClinic', clinicData);
                this.close();
                this.$store.dispatch('loadClinic');
            },
        },
    }
</script>
<style scoped>
</style>
