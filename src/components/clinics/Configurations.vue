<template>
    <v-card width="800">
        <v-card-title class="headline grey lighten-2" primary-title>
            <span class="headline">Edição de Produtos Cadastrados</span>
            <v-spacer></v-spacer>
            <v-btn small color="error" @click="clear()"><v-icon>close</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
            <v-container grid-list-md>
                <v-layout align-center justify-center wrap>

                    <v-flex xs12>
                        <v-text-field
                                prepend-icon="business"
                                label="Clinicas"
                                outlined
                                readonly
                                v-model="selectedClinic.name"
                                hide-details
                        ></v-text-field>
                    </v-flex>

                    <v-flex xs12>
                        <v-select
                                prepend-icon="edit"
                                :items="options"
                                label="Opções"
                                outlined
                                v-model="option"
                                clearable
                                chips
                                hide-details
                        ></v-select>
                    </v-flex>

                    <v-layout v-if="option === 'Consultas' && allSpecialties.length !== 0" align-center justify-center wrap>
                        <strong>Consultas Cadastradas da Clinica para EDIÇÂO</strong>
                        <v-expansion-panels  v-model="panel" accordion >
                            <v-expansion-panel v-for="(item,index) in allSpecialties" :key="index" >
                                <v-expansion-panel-header class="primary white--text">
                                    {{item.name}}
                                    <template v-slot:actions>
                                        <v-icon color="white">$expand</v-icon>
                                    </template>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-simple-table>
                                        <template v-slot:default>
                                            <thead>
                                            <tr>
                                                <v-layout row wrap>
                                                    <v-flex xs10>
                                                        <v-layout row wrap>
                                                            <v-flex xs6><th class="text-left">Name</th></v-flex>
                                                            <v-flex xs3><th class="text-left">Custo R$</th></v-flex>
                                                            <v-flex xs3><th class="text-left">Venda R$</th></v-flex>
                                                        </v-layout>
                                                    </v-flex>
                                                    <v-flex xs1>
                                                        <th></th>
                                                    </v-flex>
                                                </v-layout>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="(doctor,index2) in item.doctors" :key="index2">
                                                <v-layout row wrap>
                                                    <v-flex xs10>
                                                        <v-layout row wrap>
                                                            <v-flex xs6><td class="text-left">{{ doctor.name }}</td></v-flex>
                                                            <v-flex xs3><td class="text-left">R$ {{ doctor.cost }}</td></v-flex>
                                                            <v-flex xs3><td class="text-left">R$ {{ doctor.price }}</td></v-flex>
                                                        </v-layout>
                                                    </v-flex>
                                                    <v-flex xs1>
                                                        <td class="text-left">
                                                            <v-btn fab color="warning" small @click="pre(index,index2)">
                                                                <v-icon>edit</v-icon>
                                                            </v-btn>
                                                        </td>
                                                    </v-flex>
                                                </v-layout>
                                            </tr>
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                </v-expansion-panel-content>

                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-layout>

                    <v-layout v-else-if="option === 'Exames' && allExams.length !== 0" align-center justify-center wrap>
                        <strong>Exames Cadastrados da Clinica para EDIÇÂO</strong>
                        <v-flex>
                            <v-combobox
                                    :items="allExams"
                                    item-text="name"
                                    item-value="name"
                                    return-object
                                    v-model="exam"
                                    chips
                                    clearable
                                    outlined
                            >
                                <template v-slot:selection="data">
                                    <v-chip
                                            :key="JSON.stringify(data.item)"
                                            :selected="data.selected"
                                            :disabled="data.disabled"
                                            class="v-chip--select-multi"
                                            @click.stop="data.parent.selectedIndex = data.index"
                                            @input="data.parent.selectItem(data.item)"
                                            text-color="white"
                                            color="info"
                                    >{{ data.item.name }} | R$  {{ data.item.cost }} | R$ {{ data.item.price }}</v-chip>
                                </template>
                            </v-combobox>
                        </v-flex>
                        <v-btn v-if="exam" color="warning" @click="formExam = true">
                            <v-icon>edit</v-icon>
                            Editar Exame selecionado
                        </v-btn>
                    </v-layout>

                    <v-layout v-else-if="option === 'Exames' && allExams.length === 0" align-center justify-center wrap>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout align-center justify-center wrap>
                                    <v-flex>
                                        <v-alert type="error" outlined text>
                                            Não há <strong>Exames</strong> Cadastradas para esta Clinica.
                                        </v-alert>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                    </v-layout>

                    <v-layout v-else-if="option === 'Consultas' && allSpecialties.length === 0" align-center justify-center wrap>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout align-center justify-center wrap>
                                    <v-flex>
                                        <v-alert type="error" outlined text>
                                            Não há <strong>Consultas</strong> Cadastradas para esta Clinica.
                                        </v-alert>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                    </v-layout>

                    <v-layout v-else align-center justify-center wrap>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout align-center justify-center wrap>
                                    <v-flex>
                                        <v-alert type="warning" outlined text>
                                            Selecione uma das Opções acima para
                                            <strong>EDITAR</strong>
                                            Consultas ou Exames.
                                        </v-alert>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                    </v-layout>

                    <v-layout v-if="formConsultation === true" align-center justify-center row wrap>
                        <v-flex xs12></v-flex><v-flex xs12></v-flex><v-flex xs12></v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    prepend-icon="assignment"
                                    label="Consultas"
                                    outlined
                                    v-model="specialtie"
                                    readonly
                                    hide-details
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    prepend-icon="assignment_ind"
                                    label="Médicos"
                                    outlined
                                    v-model="doctor"
                                    readonly
                                    hide-details
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-select
                                    prepend-icon="payment"
                                    :items="paymentOptions"
                                    label="Forma de Pagamento"
                                    outlined
                                    v-model="payment"
                                    clearable
                                    chips
                                    hide-details
                            ></v-select>
                        </v-flex>
                        <v-flex xs6>
                            <v-currency-field
                                    prepend-icon="attach_money"
                                    outlined
                                    clearable
                                    label="Preço de Custo"
                                    prefix="R$"
                                    v-model="cost"
                                    hide-details
                            ></v-currency-field>
                        </v-flex>
                        <v-flex xs6>
                            <v-currency-field
                                    prepend-icon="monetization_on"
                                    outlined
                                    clearable
                                    label="Preço de Venda"
                                    prefix="R$"
                                    v-model="price"
                                    hide-details
                            ></v-currency-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-textarea
                                    outlined
                                    v-model="obs"
                                    label="Observação:"
                                    counter
                                    clearable
                                    maxlength="280"
                                    full-width
                                    single-line
                                    hide-details
                            ></v-textarea>
                        </v-flex>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-layout align-center justify-center>
                                <v-btn color="error" @click="clear()">CANCELAR</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn
                                        :disabled="!formIsValidS"
                                        @click="editConsultation"
                                        color="success"
                                >
                                    SALVAR
                                </v-btn>
                            </v-layout>
                        </v-card-actions>
                    </v-layout>

                    <v-layout v-if="formExam === true" align-center justify-center row wrap>
                        <v-flex xs12></v-flex><v-flex xs12></v-flex><v-flex xs12></v-flex>

                        <v-flex xs12>
                            <v-text-field prepend-icon="poll" outlined v-model="exam.name" readonly></v-text-field>
                        </v-flex>


                        <v-flex xs6>
                            <v-currency-field
                                    prepend-icon="attach_money"
                                    outlined
                                    clearable
                                    label="Preço de Custo"
                                    prefix="R$"
                                    v-model="exam.cost"
                                    hide-details
                            ></v-currency-field>
                        </v-flex>
                        <v-flex xs6>
                            <v-currency-field
                                    prepend-icon="monetization_on"
                                    outlined
                                    clearable
                                    label="Preço de Venda"
                                    prefix="R$"
                                    v-model="exam.price"
                                    hide-details
                            ></v-currency-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-textarea
                                    outlined
                                    v-model="exam.obs"
                                    label="Observação:"
                                    counter
                                    clearable
                                    maxlength="280"
                                    full-width
                                    single-line
                                    hide-details
                            ></v-textarea>
                        </v-flex>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-layout align-center justify-center>
                                <v-btn color="error" @click="clear()">CANCELAR</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn
                                        :disabled="!formIsValidE"
                                        @click="editExam"
                                        color="success"
                                >
                                    SALVAR
                                </v-btn>
                            </v-layout>
                        </v-card-actions>
                    </v-layout>

                </v-layout>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        data: () => ({
            panel: [0],
            formExam: undefined,
            formConsultation: undefined,
            exam: undefined,
            consultation: undefined,
            option: undefined,
            options: [
                'Consultas',
                'Exames'
            ],
            specialtie: undefined,
            cpf: undefined,
            crm: undefined,
            doctor: undefined,
            cost: undefined,
            price: undefined,
            rules: null,
            obs: null,
            payment: undefined,
            paymentOptions: [
                { text: 'Consultas', value: 'unit'},
                { text: 'Dia', value: 'daily'},
            ],
        }),
        computed: {
            formIsValidE() {
                return this.exam.name && this.exam.cost && this.exam.price
            },
            formIsValidS() {
                return this.cost && this.price && this.doctor && this.specialtie && this.payment
            },
            selectedClinic() {
                return this.$store.getters.selectedClinic;
            },

            listando () {
                let val = this.$store.getters.clinics.filter((a) => {
                    return a.name === this.selectedClinic.name;
                });
                return val
                //return this.$store.getters.clinics
            },

            allExams () {

                let clinic = this.listando[0];
                let exams = [];

                for (let i in clinic.exams){
                    exams.push({
                        ...clinic.exams[i],
                    });
                }
                return exams;
            },

            allSpecialties () {

                let clinic = this.listando[0];
                let specialties = [];

                for (let i in clinic.specialties){
                    specialties.push({
                        ...clinic.specialties[i],
                    });
                }
                return specialties
            },
        },

        mounted () {
            this.$store.dispatch('loadClinics');
        },

        watch: {
            //
        },

        methods:{
            pre(index, index2) {
                //console.log("shavdhsavd:",this.allSpecialties[index].doctors[index2])
                this.specialtie = this.allSpecialties[index].doctors[index2].specialtie;
                this.cpf = this.allSpecialties[index].doctors[index2].cpf;
                this.crm = this.allSpecialties[index].doctors[index2].crm;
                this.doctor = this.allSpecialties[index].doctors[index2].name;
                this.cost = this.allSpecialties[index].doctors[index2].cost;
                this.price = this.allSpecialties[index].doctors[index2].price;
                this.obs = this.allSpecialties[index].doctors[index2].rules;
                this.payment = this.allSpecialties[index].doctors[index2].payment_method;
                this.formConsultation = true;
            },
            editConsultation(){
                let data = {
                    clinic: this.selectedClinic,
                    specialtie: this.specialtie,
                    doctor: this.doctor,
                    crm: this.crm,
                    cpf: this.cpf,
                    cost: this.cost,
                    price: this.price,
                    obs: this.obs,
                    payment: this.payment,
                };
                //console.log("Q?:",data)
                this.$store.dispatch('addAppointment', data);
                this.clear()
            },
            editExam(){
                let examData = {
                    clinic: this.selectedClinic,
                    exam: this.exam.name,
                    cost:this.exam.cost,
                    sale:this.exam.price,
                    rules: this.exam.rules,
                    obs: this.exam.obs,
                };
                //console.log("payload:",examData)
                this.$store.dispatch('addExamToClinic', examData);
                this.clear()
            },

            clear () {
                this.$store.dispatch('selectClinic', null);
            },
        }
    }
</script>
<style scoped>
</style>