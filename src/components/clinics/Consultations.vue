<template >
    <v-card width="500" >
        <v-card-title class="headline grey lighten-2" primary-title>
            <span class="headline">Cadastro de Consultas</span>
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
                                v-model="this.selectedClinic.name"
                                hide-details
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-select
                                prepend-icon="assignment"
                                :items="specialties"
                                return-object
                                item-text="name"
                                label="Consultas"
                                outlined
                                v-model="consultations"
                                clearable
                                chips
                                hide-details
                        ></v-select>
                    </v-flex>
                    <v-flex xs12>
                        <v-select
                                multiple
                                prepend-icon="assignment_ind"
                                :items="doctors"
                                item-text="name"
                                return-object
                                no-data-text="Nenhum médico para esta especialidade"
                                label="Médicos"
                                outlined
                                v-model="doctor"
                                clearable
                                chips
                                hide-details
                        ></v-select>
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
                        <v-text-field
                                prepend-icon="attach_money"
                                outlined
                                clearable
                                label="Preço de Custo"
                                placeholder="ex.: 50.00"
                                v-mask="['###.##' , '##.##', '####.##']"
                                v-model="cost"
                                prefix="R$"
                                hide-details
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                        <v-text-field
                                prepend-icon="monetization_on"
                                outlined
                                clearable
                                label="Preço de Venda"
                                placeholder="ex.: 80.00"
                                v-mask="['###.##' , '##.##', '####.##']"
                                v-model="sale"
                                prefix="R$"
                                hide-details
                        ></v-text-field>
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
                </v-layout>
            </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-layout align-center justify-center>
                <v-btn color="error" @click="clear()">CANCELAR</v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    :disabled="!formIsValid"
                    @click="save()"
                    color="success"
                >
                    SALVAR
                </v-btn>
            </v-layout>
        </v-card-actions>
    </v-card>
</template>

<script>
    import {mask} from 'vue-the-mask';
    export default {
        directives: {mask},
        data: () => ({
            cost: null,
            sale: null,
            obs: null,
            consultations: undefined,
            doctor: [],
            payment:'Consultas',
            paymentOptions: [
                'Consultas',
                'Dia'
            ],
        }),
        computed: {
            specialties(){
                return this.$store.getters.specialties
            },
            formIsValid() {
                return this.sale && this.cost && this.consultations && this.doctors.length > 0
            },
            selectedClinic() {
                return this.$store.getters.selectedClinic;
            },
            doctors () {
                let doctors = Object.values(this.$store.getters.doctors)
                if(this.consultations) {
                    doctors = doctors.filter((a) => {
                        for (let spe in a.specialties) {
                            if (a.specialties[spe].name === this.consultations.name) {
                                return true
                            }
                        }
                        return false
                        // return a.specialties.indexOf(this.especialidade.name) > -1
                    })
                }
                return doctors
            },
        },

        mounted() {
            this.$store.dispatch('getSpecialties')
            this.$store.dispatch('getDoctors')
        },

        watch: {
            //
        },

        methods:{
            save(){

                for (let i in this.doctors){
                    let consultationData = {
                        clinic: this.selectedClinic.name,
                        //clinic: this.clinic,
                        consultation: this.consultations,
                        doctor:this.doctor[i],
                        cost:this.cost,
                        sale:this.sale,
                        obs:this.obs,
                        payment: this.payment,
                    };
                    this.$store.dispatch('addAppointment', consultationData);
                }

                this.clear()
            },

            clear () {
                this.cost = null;
                this.sale =  null;
                this.obs =  null;
                this.consultations = null;
                this.doctor = [];
                this.payment = 'Consultas';
                this.$store.dispatch('selectClinic', null);
            },


        }
    }
</script>
<style scoped>
</style>