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
                <v-layout v-if="allExams && allExams.length !== 0" class="align-start justify-start" wrap>
                    <v-flex sm4 v-for="(item,index) in allExams" :key="index" v-if="item.type === 'EXAM'">
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
                <v-layout v-if="allExams && allExams.length === 0" class="align-center justify-center" wrap>
                    <v-card-text class="justify-center text-center">
                        <span class="font-italic">Não há <strong>exames</strong> cadastrados para esta clínica.</span>
                    </v-card-text>
                </v-layout>
              <v-layout v-if="!allExams" class="align-center justify-center" row wrap>
                <v-progress-circular :size="300" :width="10" color="primary" indeterminate>CARREGANDO...</v-progress-circular>
              </v-layout>
                <v-flex xs12 class="mt-4 mb-3">
                    <v-card-title>
                        <span class="text-left primary--text font-weight-bold ml-2">Especialidades</span>
                        <v-spacer/>
                        <v-btn icon small class="primary" to="/registros/doctors">
                            <v-icon class="white--text">add</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-divider class="primary"/>
                </v-flex>
                <v-layout class="align-center justify-center" wrap>
                    <v-layout v-if="allSpecialties && allSpecialties.length !== 0" class="align-center justify-center" wrap>
                      <v-flex sm4 v-for="(item,index) in allSpecialties" :key="index">
                        <v-card outlined class="borderCard mx-2 mr-2 grey_light">
                          <v-layout row wrap class="mt-2 mr-2 ml-2">
                            <v-flex xs10>
                              <p class="text-left font-weight-black">{{ item.name }}</p>
                              <div v-for="(spc,index) in item.is_specialist_of" :key="index">
                                <p class="text-left font-weight-black primary" style="color: white">{{spc.name}}</p>
                                <p class="text-left font-weight-black mt-n4">Metodo de Pagamento: {{ spc.payment_method === 'unit' ? "Consulta" : "Dia" }} </p>
                                <p class="text-left mt-n4">Custo: R$ {{spc.cost}}</p>
                                <p class="text-left mt-n4">Preço: R$ {{spc.price}}</p>
                              </div>
                            </v-flex>
                            <v-flex xs2>
                              <v-btn fab icon color="primary" x-small to="/registros/doctors"><v-icon>edit</v-icon></v-btn>
                              <v-btn fab icon color="error" class="mt-2" x-small to="/registros/doctors"><v-icon>delete</v-icon></v-btn>
                            </v-flex>
                          </v-layout>
                        </v-card>
                      </v-flex>
                    </v-layout>
                    <v-layout v-if="allSpecialties && allSpecialties.length === 0" class="align-center justify-center" wrap>
                        <v-card-text class="justify-center text-center">
                            <span class="font-italic">Não há <strong>especialidades</strong> cadastrados para esta clínica.</span>
                        </v-card-text>
                    </v-layout>
                </v-layout>
              <v-layout v-if="!allSpecialties" class="align-center justify-center" row wrap>
                <v-progress-circular :size="300" :width="10" color="primary" indeterminate>CARREGANDO...</v-progress-circular>
              </v-layout>
            </v-card-text>
            <v-dialog v-model="addExamToClinic" width="500px" text hide-overlay>
                <Exams @reload="reload" :clinic="clinic" @close-dialog="closeDialogs"/>
            </v-dialog>
            <v-dialog  v-model="editExamInClinic" width="500px" text hide-overlay>
                <formEditExamInClinic @reload="reload" @close-dialog="closeDialogs" :exam="this.exam" :clinic="this.clinic"/>
            </v-dialog>
            <v-dialog v-model="deleteExamInClinic" width="500px" text hide-overlay>
                <deleteExamFromClinic @reload="reload" @close-dialog="closeDialogs" :item="this.item" :clinic="this.clinic"/>
            </v-dialog>
        </v-card>
    </v-container>
</template>

<script>
    import formEditExamInClinic from "../../components/clinics/formEditExamInClinic"
    import Exams from "../../components/clinics/Exams";
    import deleteExamFromClinic from "./deleteExamFromClinic";
    export default {
        props: ['clinic'],
        components: {
            Exams,
            formEditExamInClinic,
            deleteExamFromClinic,
        },
        data: () => ({
            addExamToClinic: false,
            editExamInClinic: false,
            deleteExamInClinic: false,
            item: undefined,
            panel: [0],
            formExam: undefined,
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
          allExams: undefined,
          allSpecialties: undefined,
        }),
        mounted() {
            this.filterCPC();
            this.filterCPD();
        },
        methods: {
          async filterCPD() {
            const costs = await this.$apollo.mutate({
              mutation: require('@/graphql/doctors/LoadCostProductDoctors.gql'),
            })
            let costProductDoctor = costs.data.CostProductDoctor
            if(this.clinic && this.clinic.has_doctor.length > 0){
              for(let costpd in costProductDoctor) {
                  for (let doctor in this.clinic.has_doctor) {
                    for (let spc in this.clinic.has_doctor[doctor].is_specialist_of) {
                      if (costProductDoctor[costpd].with_doctor && costProductDoctor[costpd].with_doctor.length > 0 && costProductDoctor[costpd].with_product && costProductDoctor[costpd].with_product.length > 0) {
                        if (costProductDoctor[costpd].with_doctor[0].name === this.clinic.has_doctor[doctor].name && this.clinic.has_doctor[doctor].is_specialist_of[spc].name === costProductDoctor[costpd].with_product[0].name) {
                          this.clinic.has_doctor[doctor].is_specialist_of[spc].cost = costProductDoctor[costpd].cost;
                          this.clinic.has_doctor[doctor].is_specialist_of[spc].payment_method = costProductDoctor[costpd].payment_method;
                        }
                      }
                    }
                  }
                }
              }
            this.allSpecialties = this.clinic.has_doctor
          },
          async filterCPC(){
            const dataCostProductClinic = await this.$apollo.mutate({
              mutation: require('@/graphql/clinics/LoadCostProductClinics.gql'),
            })
            let CostProductClinic = dataCostProductClinic.data.CostProductClinic
            //console.log(CostProductClinic)
            if(this.clinic && this.clinic.has_product.length > 0){
              for(let costpc in CostProductClinic){
                for(let item in this.clinic.has_product){
                  if(CostProductClinic[costpc].with_clinic && CostProductClinic[costpc].with_clinic.length > 0 && CostProductClinic[costpc].with_product.length > 0){
                    if(CostProductClinic[costpc].with_clinic[0].name === this.clinic.name && this.clinic.has_product[item].name === CostProductClinic[costpc].with_product[0].name){
                      this.clinic.has_product[item].idcpc = CostProductClinic[costpc].id;
                      this.clinic.has_product[item].cost = CostProductClinic[costpc].cost;
                    }
                  }
                }
              }
            }
            this.allExams = this.clinic.has_product
          },

          async reload(){
            //this.allExams = undefined;
            const clin = await this.$apollo.mutate({
              mutation: require('@/graphql/clinics/ReloadClinic.gql'),
              variables: {
                id: this.clinic.id,
              }
            })
            let products = Object.assign(clin.data.Clinic[0].has_product)
            this.clinic.has_product = products
            this.clinic.providers = clin.data.Clinic[0].providers
            console.log(this.clinic)
            await this.filterCPC();

          },
            async editExam(item) {
                this.exam = item;
                this.editExamInClinic = true;
            },
            async addExam(clinic) {
                this.clinic = clinic
                this.addExamToClinic = true;
            },
            deleteExam(item) {
                this.item = item;
                this.deleteExamInClinic = true;
            },
            closeDialogs() {
                this.addExamToClinic = false;
                this.editExamInClinic = false;
                this.deleteExamInClinic = false;
            },
        }
    }
</script>
<style scoped>
</style>