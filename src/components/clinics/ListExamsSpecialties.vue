<template>
    <v-container fluid>
        <v-card width="100%" >
            <v-card-text>
                <v-flex xs12 class="mt-4 mb-3">
                    <v-card-title>
                        <span class="text-left primary--text font-weight-bold ml-2">Exames</span>
                        <v-spacer/>
                        <v-btn icon small class="primary" @click="addExam(clinic)">
                            <v-icon class="white--text">add</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-divider class="primary"/>
                </v-flex>
                <v-layout v-if="allExams.length !== 0" class="align-start justify-start" wrap>
                    <v-flex sm4 v-for="(item,index) in allExams" :key="index">
                        <v-card outlined class="borderCard mx-2 mr-2 grey_light">
                            <v-layout row wrap class="mt-2 mr-2 ml-2">
                                <v-flex xs10>
                                    <p class="text-left font-weight-black">{{ item.name }}</p>
                                    <p class="text-left mt-n4">Custo: R$ {{ item.cost }}</p>
                                    <p class="text-left mt-n4">Preço: R$ {{ item.price }}</p>
                                </v-flex>
                                <v-flex xs2>
                                    <v-btn fab icon color="primary" x-small @click="ExamSelectedEdit(item)">
                                        <v-icon>edit</v-icon>
                                    </v-btn>
                                    <v-btn fab icon color="error" class="mt-2" x-small>
                                        <v-icon @click="examSelectedDelete(item, clinic)">delete</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                </v-layout>
                <v-layout v-if="allExams.length === 0" class="align-center justify-center" wrap>
                    <v-card-text class="justify-center text-center">
                        <span class="font-italic">Não há <strong>exames</strong> cadastrados para esta clínica.</span>
                    </v-card-text>
                </v-layout>
                <v-flex xs12 class="mt-4 mb-3">
                    <v-card-title>
                        <span class="text-left primary--text font-weight-bold ml-2">Especialidades</span>
                        <v-spacer/>
                        <v-btn icon small class="primary" @click="addSpecialty(clinic)">
                            <v-icon class="white--text">add</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-divider class="primary"/>
                </v-flex>
                <v-layout class="align-center justify-center" wrap>
                    <v-layout v-if="allSpecialties.length !== 0" class="align-center justify-center" wrap>
                        <v-expansion-panels  v-model="panel" accordion >
                            <v-expansion-panel v-for="(item,index) in allSpecialties" :key="index" >
                                <v-expansion-panel-header class="primary white--text">
                                    {{item.name}}
                                    <template v-slot:actions>
                                        <v-icon color="white">$expand</v-icon>
                                    </template>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-layout class="align-start justify-start mt-3" wrap>
                                    <v-flex sm4 v-for="(doctor,index2) in item.doctors" :key="index2">
                                        <v-card outlined class="borderCard mx-2 mr-2 grey_light">
                                            <v-layout row wrap class="mt-2 mr-2 ml-2">
                                                <v-flex xs10>
                                                    <p class="text-left font-weight-black">{{ doctor.name }}</p>
                                                    <p class="text-left mt-n4">Custo: R$ {{ doctor.cost }}</p>
                                                    <p class="text-left mt-n4">Preço: R$ {{ doctor.price }}</p>
                                                </v-flex>
                                                <v-flex xs2>
                                                    <v-btn fab icon color="primary" x-small @click="pre(index, index2)">
                                                        <v-icon>edit</v-icon>
                                                    </v-btn>
                                                    <v-btn fab icon color="error" class="mt-2" x-small>
                                                        <v-icon>delete</v-icon>
                                                    </v-btn>
                                                </v-flex>
                                            </v-layout>
                                        </v-card>
                                    </v-flex>
                                    </v-layout>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-layout>
                    <v-layout v-if="allSpecialties.length === 0" class="align-center justify-center" wrap>
                        <v-card-text class="justify-center text-center">
                            <span class="font-italic">Não há <strong>especialidades</strong> cadastrados para esta clínica.</span>
                        </v-card-text>
                    </v-layout>


                    <v-layout v-if="formConsultation === true" class="align-center justify-center" row wrap>
                        <v-dialog>
                            <v-flex xs12>
                                <v-text-field
                                        prepend-icon="assignment"
                                        label="Consultas"
                                        outlined
                                        v-model="specialtie"
                                        readonly
                                        hide-details>
                                </v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field
                                        prepend-icon="assignment_ind"
                                        label="Médicos"
                                        outlined
                                        v-model="doctor"
                                        readonly
                                        hide-details>
                                </v-text-field>
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
                                        hide-details>
                                </v-select>
                            </v-flex>
                            <v-flex xs6>
                                <v-currency-field
                                        prepend-icon="attach_money"
                                        outlined
                                        clearable
                                        label="Preço de Custo"
                                        prefix="R$"
                                        v-model="cost"
                                        hide-details>
                                </v-currency-field>
                            </v-flex>
                            <v-flex xs6>
                                <v-currency-field
                                        prepend-icon="monetization_on"
                                        outlined
                                        clearable
                                        label="Preço de Venda"
                                        prefix="R$"
                                        v-model="price"
                                        hide-details>
                                </v-currency-field>
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
                                        hide-details>
                                </v-textarea>
                            </v-flex>
                            <v-divider/>
                            <v-card-actions>
                                <v-layout class="align-center justify-center" >
                                    <v-btn color="error" @click="clear(), closeDialog()">CANCELAR</v-btn>
                                    <v-spacer/>
                                    <v-btn
                                            :disabled="!formIsValidS"
                                            @click="editConsultation(), closeDialog()"
                                            color="success"
                                    >
                                        SALVAR
                                    </v-btn>
                                </v-layout>
                            </v-card-actions>
                        </v-dialog>

                    </v-layout>


                    <v-layout v-if="formExam === true" class="align-center justify-center " row wrap>


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
                                    hide-details>
                            </v-currency-field>
                        </v-flex>
                        <v-flex xs6>
                            <v-currency-field
                                    prepend-icon="monetization_on"
                                    outlined
                                    clearable
                                    label="Preço de Venda"
                                    prefix="R$"
                                    v-model="exam.price"
                                    hide-details>
                            </v-currency-field>
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
                                    hide-details>
                            </v-textarea>
                        </v-flex>
                        <v-divider/>
                        <v-card-actions>
                            <v-layout align-center justify-center>
                                <v-btn color="error" @click="clear(), closeDialog()">CANCELAR</v-btn>
                                <v-spacer/>
                                <v-btn
                                        :disabled="!formIsValidE"
                                        @click="editExam(), closeDialog()"
                                        color="success"
                                >
                                    SALVAR
                                </v-btn>
                            </v-layout>
                        </v-card-actions>
                    </v-layout>

                </v-layout>
            </v-card-text>
            <v-dialog v-model="addExamToClinic" width="500px" text hide-overlay>
                <Exams @close-dialog="closeDialogs"/>
            </v-dialog>
            <v-dialog v-model="addSpecialtyToClinic" width="500px" text hide-overlay>
                <Consultations @close-dialog="closeDialogs"/>
            </v-dialog>
            <v-dialog v-model="editExamInClinic" width="500px" text hide-overlay>
                <formEditExamInClinic @close-dialog="closeDialogs" :exam="this.exam"/>
            </v-dialog>
            <v-dialog v-model="deleteItemInClinic" width="500px" text hide-overlay>
                <deleteExamFromClinic @close-dialog="closeDialogs" :item="this.item" :clinic="this.clinic" />
            </v-dialog>
            <v-dialog>
                <deleteSpecialtyFromClinic/>
            </v-dialog>
        </v-card>
    </v-container>
</template>

<script>
    import formEditExamInClinic from "../../components/clinics/formEditExamInClinic"
    import Exams from "../../components/clinics/Exams";
    import Consultations from "../../components/clinics/Consultations";
    import deleteExamFromClinic from "./deleteExamFromClinic";
    import deleteSpecialtyFromClinic from "./deleteSpecialtyFromClinic";
    export default {
        props:['clinic'],
        components: {Exams, Consultations, formEditExamInClinic, deleteExamFromClinic, deleteSpecialtyFromClinic},
        data: () => ({
            addExamToClinic: false,
            addSpecialtyToClinic: false,
            editExamInClinic: false,
            deleteItemInClinic: false,

            item: undefined,

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
            cost: 0,
            price: 0,
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
                return this.exam.name
            },
            formIsValidS() {
                return this.doctor && this.specialtie && this.payment
            },
            selectedClinic() {
                return this.clinic
            },

            listando () {
                let val = this.$store.getters.clinics.filter((a) => {
                    return a.name === this.selectedClinic.name;
                });
                return val
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
        },

        methods:{
            pre(index, index2) {
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
            async ExamSelectedEdit(item){
                this.exam = item;
                this.editExamInClinic = true;

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
                this.$store.dispatch('addExamToClinic', examData);
                this.clear()
            },

            clear () {
                this.closeDialog();
                if (this.option === 'Consultas') {
                    this.formConsultation = undefined;
                    this.consultation = undefined;
                    this.specialtie = undefined;
                    this.cpf = undefined;
                    this.crm = undefined;
                    this.doctor = undefined;
                    this.cost = 0;
                    this.price = 0;
                    this.rules = null;
                    this.obs = null;
                    this.payment = undefined;
                    this.panel =  [0];
                }
                if (this.option === 'Exames'){
                    this.formExam = undefined;
                    this.exam = undefined;
                }
                this.option = undefined;
            },

            closeDialog: function() {
                this.$emit('close-dialog')
            },

            async addExam(clinic) {
                await this.selectClinic(clinic);
                this.addExamToClinic = true;
            },
            async addSpecialty(clinic) {
                await this.selectClinic(clinic);
                this.addSpecialtyToClinic = true;
            },
            examSelectedDelete (item) {
                this.item= item;
                this.deleteItemInClinic = true;
            },
            closeDialogs() {
                this.addExamToClinic = false;
                this.addSpecialtyToClinic = false;
                this.editExamInClinic = false;
                this.deleteItemInClinic = false;
            },
            selectClinic(clinic, index) {
                this.$store.dispatch('selectClinic', clinic);
            },
        }
    }
</script>
<style scoped>
</style>