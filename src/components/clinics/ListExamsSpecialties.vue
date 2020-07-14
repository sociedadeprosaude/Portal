<template>
    <v-container fluid>
        <v-card width="100%">
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
                                    <v-btn fab icon color="primary" x-small @click="editExam(item)">
                                        <v-icon>edit</v-icon>
                                    </v-btn>
                                    <v-btn fab icon color="error" class="mt-2" x-small>
                                        <v-icon @click="deleteExam(item)">delete</v-icon>
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
                        <v-expansion-panels v-model="panel" accordion>
                            <v-expansion-panel v-for="(item,index) in allSpecialties" :key="index">
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
                                                        <v-btn fab icon color="primary" x-small
                                                               @click="editSpecialty(item, doctor)">
                                                            <v-icon>edit</v-icon>
                                                        </v-btn>
                                                        <v-btn fab icon color="error" class="mt-2" x-small>
                                                            <v-icon @click="deleteSpecialty(doctor, item)">delete
                                                            </v-icon>
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
                </v-layout>
            </v-card-text>
            <v-dialog v-model="addExamToClinic" width="500px" text hide-overlay>
                <Exams @close-dialog="closeDialogs"/>
            </v-dialog>
            <v-dialog v-model="addSpecialtyToClinic" width="500px" text hide-overlay>
                <Consultations @close-dialog="closeDialogs"/>
            </v-dialog>
            <v-dialog v-model="editExamInClinic" width="500px" text hide-overlay>
                <formEditExamInClinic @close-dialog="closeDialogs" :exam="this.exam" :clinic="this.clinic"/>
            </v-dialog>
            <v-dialog v-model="editSpecialtyInClinic" width="500px" text hide-overlay>
                <formEditSpecialtyInClinic @close-dialog="closeDialogs" :specialty="this.specialty"
                                           :doctor="this.doctor" :clinic="this.clinic"/>
            </v-dialog>
            <v-dialog v-model="deleteExamInClinic" width="500px" text hide-overlay>
                <deleteExamFromClinic @close-dialog="closeDialogs" :item="this.item" :clinic="this.clinic"/>
            </v-dialog>
            <v-dialog v-model="deleteSpecialtyInClinic" width="500px" text hide-overlay>
                <deleteSpecialtyFromClinic @close-dialog="closeDialogs" :specialty="this.specialty"
                                           :doctor="this.doctor" :clinic="this.clinic"/>
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
    import formEditSpecialtyInClinic from "./formEditSpecialtyInClinic";

    export default {
        props: ['clinic'],
        components: {
            Exams,
            Consultations,
            formEditExamInClinic,
            formEditSpecialtyInClinic,
            deleteExamFromClinic,
            deleteSpecialtyFromClinic
        },
        data: () => ({
            addExamToClinic: false,
            addSpecialtyToClinic: false,
            editExamInClinic: false,
            editSpecialtyInClinic: false,
            deleteExamInClinic: false,
            deleteSpecialtyInClinic: false,

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
            specialty: undefined,
            cpf: undefined,
            crm: undefined,
            doctor: undefined,
            cost: 0,
            price: 0,
            rules: null,
            obs: null,
            payment: undefined,
            paymentOptions: [
                {text: 'Consultas', value: 'unit'},
                {text: 'Dia', value: 'daily'},
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

            listando() {
                let val = this.$store.getters.clinics.filter((a) => {
                    return a.name === this.selectedClinic.name;
                });
                return val
            },

            allExams() {

                let clinic = this.listando[0];
                let exams = [];

                for (let i in clinic.exams) {
                    exams.push({
                        ...clinic.exams[i],
                    });
                }
                return exams;
            },

            allSpecialties() {

                let clinic = this.listando[0];
                let specialties = [];

                for (let i in clinic.specialties) {
                    specialties.push({
                        ...clinic.specialties[i],
                    });
                }
                return specialties
            },
        },

        mounted() {
            this.$store.dispatch('loadClinics');
        },

        methods: {
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
            async editExam(item) {
                this.exam = item;
                this.editExamInClinic = true;
            },
            async editSpecialty(item, doctor) {
                this.specialty = item;
                this.doctor = doctor;
                this.editSpecialtyInClinic = true;
            },
            selectClinic(clinic, index) {
                if (!clinic) {
                    clinic = this.defaultItem;
                    this.$store.dispatch('putIndex', index);
                }
                this.$store.dispatch('selectClinic', clinic);
            },
            async addExam(clinic) {
                await this.selectClinic(clinic);
                this.addExamToClinic = true;
            },
            async addSpecialty(clinic) {
                await this.selectClinic(clinic);
                this.addSpecialtyToClinic = true;
            },
            deleteExam(item) {
                this.item = item;
                this.deleteExamInClinic = true;
            },
            deleteSpecialty(doctor, specialty) {
                this.doctor = doctor;
                this.specialty = specialty;
                this.deleteSpecialtyInClinic = true;
            },
            closeDialogs() {
                this.addExamToClinic = false;
                this.addSpecialtyToClinic = false;
                this.editExamInClinic = false;
                this.editSpecialtyInClinic = false;
                this.deleteExamInClinic = false;
                this.deleteSpecialtyInClinic = false;
            },
        }
    }
</script>
<style scoped>
</style>