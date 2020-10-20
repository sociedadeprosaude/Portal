<template>
    <v-container v-if="consultation" fluid class=" ma-0 pa-0">
        <v-layout>
            <v-flex>
                <v-card flat class="item-to-print ma-0 mb-0" >
                    <v-layout row wrap>
                        <v-flex xs6 class="text-left hidden-print-only">
                            <v-btn  text @click="$emit('close')">
                                <v-icon>close</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex xs6 class="text-right hidden-print-only">
                            <v-btn text :loading="loader" @click="print()">
                                <v-icon>print</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex>
                            <v-card flat class="pa-10 py-2">
                                <v-flex xs12 class="white" style="color: white">.</v-flex>
                                <v-layout
                                        row
                                        wrap
                                        class="align-center pa-4"
                                        style="border: 2px solid #2196f3; border-radius: 16px"
                                >
                                    <v-flex xs6 class="text-left">
                                        <v-layout column wrap>
                                            <strong>Hoje: {{ hoje }} - {{dia}}</strong>
                                            <span
                                                    class="my-sub-headline primary--text"
                                                    style="font-size: 1.4em"
                                            >Dr. {{consultation.doctor.name}}</span>
                                            <v-flex>
                                                <span class="primary--text font-weight-bold">CRM:</span>
                                                <span class="font-weight-bold">{{consultation.doctor.crm}}</span>
                                            </v-flex>

                                            <div >
                                                <v-flex>
                                                    <span class="primary--text font-weight-bold">Procedimento: </span>
                                                    <span class="font-weight-bold">{{ this.consultation.product.type === 'EXAM' ? 'Exame' : 'Especialidade' }}</span>
                                                </v-flex>
                                                <v-flex>
                                                    <span class="primary--text font-weight-bold">{{ this.consultation.product.type === 'EXAM' ? 'Exame' : 'Especialidade' }}: </span>
                                                    <span class="font-weight-bold">{{this.consultation.product.name}}</span>
                                                </v-flex>
                                            </div>

                                            <v-flex>
                                                <span class="primary--text font-weight-bold">Data:</span>
                                                <span class="font-weight-bold">{{this.consultation.date | dateFilter}}</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-spacer></v-spacer>
                                    <v-flex xs4>
                                        <v-img v-if="selectedUnit"
                                               :src="selectedUnit.logo"
                                               width="400"
                                        ></v-img>

                                    </v-flex>
                                    <v-flex xs12>
                                        <v-divider class="primary my-2"></v-divider>
                                    </v-flex>
                                    <v-flex xs6 class="text-left">
                                        <v-layout column wrap align-start justify-start>
                                            <span
                                                    class="my-sub-headline primary--text"
                                                    style="font-size: 1.4em"
                                            >{{this.consultation.dependent ? this.consultation.dependent.name : this.consultation.patient.name}}</span>
                                            <v-flex v-if="!this.consultation.dependent">
                                                <span class="primary--text font-weight-bold">CPF:</span>
                                                <span class="font-weight-bold">{{this.consultation.patient.cpf}}</span>
                                            </v-flex>
                                            <v-flex>
                                                <span class="primary--text font-weight-bold">Data de Nascimento:</span>
                                                <span class="font-weight-bold">{{formatbirthDate()}}</span>
                                                <br/>
                                            </v-flex>
                                            <v-flex>
                                                <span class="primary--text font-weight-bold">Idade:</span>
                                                <span class="font-weight-bold">{{formatIdade()}}</span>
                                                <br/>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>

                                    <v-flex xs6 class="text-center">
                                        <v-layout row wrap justify-end align-end>
                                            <!--<v-layout column wrap>-->
                                            <v-flex xs5>
                                                <span class="my-sub-headline primary--text" style="font-size: 1.4em">Triagem</span>
                                                <v-text-field prefix="Peso:" type="number" suffix="KG" hide-details
                                                              v-model="p"></v-text-field>
                                                <v-text-field
                                                        prefix="Altura:"
                                                        type="number"
                                                        suffix="cm"
                                                        hide-details
                                                        v-model="alt"
                                                ></v-text-field>
                                                <v-text-field
                                                        prefix="P.A:"
                                                        suffix="PA"
                                                        v-mask="'##x##'"
                                                        v-model="pa"
                                                        hide-details
                                                ></v-text-field>
                                            </v-flex>
                                            <!--</v-layout>-->
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 class="mt-2 py-1 px-4">
                                        <v-layout row wrap class="align-center"></v-layout>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex>
                            <v-card flat class="pa-10 py-2">
                                <v-flex xs12 class="white" style="color: white">.</v-flex>
                                <v-layout
                                        row
                                        wrap
                                        class="align-center pa-4"
                                        style="border: 2px solid #2196f3; border-radius: 16px"
                                >
                                    <v-flex xs12 style="height: 550px" >
                                    </v-flex>
                                    <v-flex xs12 class="mt-2 py-1 px-4">
                                        <v-layout row wrap class="align-center"></v-layout>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    var moment = require("moment/moment");
    import {mask} from 'vue-the-mask';

    export default {
        name: "Receipt",
        props: ['consultation', 'openDocument'],
        computed: {

            user() {
                return this.$store.getters.user
            },
            selectedUnit() {
                return this.$store.getters.selectedUnit
            },
        },
        directives: {mask},
        data: () => ({
            alt: '',
            p: '',
            pa: '',
            exames: ['ULTRASSONOGRAFIA', 'ELETROCARDIOGRAMA', 'ELETROENCEFALOGRAMA', 'ECOCARDIOGRAMA', 'VIDEOLARIGONSCOPIA'],
            consultationHour: moment().locale('pt-BR').format('YYYY-MM-DD HH:mm:ss'),
            hoje: moment().locale('pt-BR').format('DD/MM/YYYY HH:mm:ss'),
            dia: moment().format('dddd'),
            dependent: undefined,
            idade: '',
            birthDate: '',
            loader: false,
            payment_number: undefined,
            skipCost: true
        }),
        mounted() {
            //this.saveConsultationHour()
        },
        methods: {
            formatbirthDate(){
                const date = this.consultation.dependent ? this.consultation.dependent.birth_date : this.consultation.patient.birth_date
                let formatbirthDateFormat = moment(date).format('DD/MM/YYYY')
                return formatbirthDateFormat
            },

            formatIdade(){
                let idade;
                let date = this.consultation.dependent ? this.consultation.dependent.birth_date : this.consultation.patient.birth_date;
                let patt = new RegExp(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/);
                if(patt.test(date)) date = moment(date,"DD/MM/YYYY").format("YYYY-MM-DD");
                idade = moment().diff(moment(date, 'YYYY-MM-DD'), 'years');
                return idade
            },
            async print() {
                this.loader = true;
                if (this.consultation.product.price === 0) {
                        console.log('Gratuito')
                        this.skip = false
                        this.$apollo.queries.findProductTransaction.refresh() 
                } else {
                    this.loader = false
                    window.print()
                }

            },
            inititize() {
                this.consultationHour = moment().locale('pt-BR').format('YYYY-MM-DD HH:mm:ss')
                this.hoje = moment().locale('pt-BR').format('DD/MM/YYYY HH:mm:ss')
                this.dia = moment().format('dddd')
            },
            /* saveConsultationHour() {
                this.inititize()
                if(this.openDocument){
                    this.$store.dispatch('setConsultationHour',{consultation:this.consultation.id,patient:this.user.cpf ,consultationHour:this.consultationHour,day:this.dia})
                        .then((result)=>{
                            if(result){
                                this.consultationHour = result.consultationHour
                                this.hoje = moment(result.consultationHour).locale('pt-BR').format('DD/MM/YYYY HH:mm:ss')
                                this.dia = result.day
                            }
                        })
                }

            }, */
            async setNewtransaction(){
                const transaction = await this.$apollo.mutate({
                    mutation: require('@/graphql/transaction/NewPayIntake.gql'),
                    variables: {
                        value: this.consultation.product.price,
                        date: {
                            formatted: moment().format('YYYY-MM-DDTHH:mm'),
                        }
                    },

                });

                const transactionId = transaction.data.CreateTransaction.id
                
                const productTransaction = await this.$apollo.mutate({
                        mutation: require('@/graphql/transaction/CreateProductTransaction.gql'),
                        variables: {
                            price: this.consultation.product.price
                        }
                 });

                const productTransactionId = productTransaction.data.CreateProductTransaction.id
                
                await this.$apollo.mutate({
                    mutation: require('@/graphql/transaction/AddRelationsProductTransaction.gql'),
                    variables: {
                        idBudget: transactionId,
                        idProduct: this.consultation.product.id,
                        idProductTransaction: productTransactionId
                    }
                });

                this.AddRelationsIntake(transactionId)
                this.saveRelationProductTransactionwithConsultation(productTransactionId)
            },

            async AddRelationsIntake(transactionId){
                
                await this.$apollo.mutate({
                    mutation: require('@/graphql/transaction/AddRelationsNewIntake.gql'),
                    variables: {
                        idBudget: transactionId,
                        idColaborator: this.user.neo4j_id, //TODO Trocar quando finalizar autenticação do colaborador
                        idPatient: this.consultation.patient.id,
                        idDoctor: this.consultation.doctor.id
                    },

                });

                console.log('Transation',transactionId)
            },
            
            async saveRelationProductTransactionwithConsultation(idProductTransaction){
                await this.$apollo.mutate({
                    mutation: require('@/graphql/transaction/AddRelationProductTransactionConsultation.gql'),
                    variables:{
                        idConsultation: this.consultation.id,
                        idProductTransaction: idProductTransaction
                    },
                })
            },

            CreateChargee(data){
                this.$apollo.mutate({
                    mutation: require ('@/graphql/charge/CreateCharge.gql'),
                    variables:{
                        date: {formatted: moment().format('YYYY-MM-DDTHH:mm:ss')},
                        cost: data.CostProductDoctor[0].cost,
                        type: 'doctor'
                    }
                }).then((dataa)=> {
                    this.RelationsCharge(dataa)
                })
            },
            RelationsCharge(data){
                this.$apollo.mutate({
                    mutation: require ('@/graphql/charge/RelationsCharge.gql'),
                    variables:{
                        idCharge: data.data.CreateCharge.id,
                        idProductTransaction: this.ConsultationSelect.productTransaction.id
                    }
                }).then((data) => {
                    this.documentDialog = true
                })
            },

        },//TODO Verificar consultationHour

        /* watch: {
            openDocument(value) {
                this.saveConsultationHour()
                return value
            }

        }, */
        apollo:{
            findProductTransaction:{
                query:require("@/graphql/transaction/FindProductTransactionbyConsultation.gql"),
                variables(){
                    return {
                        idConsultation: this.consultation.id
                    }
                },
                update(data){
                    console.log(data.ProductTransaction)

                    if(data.ProductTransaction.length == 0)
                        this.setNewtransaction()

                    this.loader = false
                    window.print()
                    this.skip = true;
                },
                skip(){
                    return this.skip
                }
            },
            loadCostProductDoctor: {
                query: require("@/graphql/doctors/GetCostProductDoctor.gql"),
                variables(){
                    return {
                        idDoctor: this.consultation.doctor.id,
                        idProduct: this.consultation.product.id
                    }
                },
                update(data) {
                    this.CreateChargee(data)
                    this.skipCost = true
                },
                skip (){
                    return this.skipCost
                }
            }
        }
    }
</script>
