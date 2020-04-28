<template >
    <v-card width="500" >
        <v-card-title class="headline grey lighten-2" primary-title>
            <span class="headline">Cadastro de Consultas</span>
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
                                v-model="sale"
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
    export default {
        data: () => ({
            cost: 0,
            sale: 0,
            obs: null,
            consultations:'',
            doctor: [],
            payment:'',
            paymentOptions: [
                { text: 'Consultas', value: 'unit'},
                { text: 'Dia', value: 'daily'},
            ],
        }),
        computed: {
            specialties(){
                return this.$store.getters.specialties;
            },
            formIsValid() {
                return this.consultations && this.doctors.length > 0 && this.payment
            },
            selectedClinic() {
                return this.$store.getters.selectedClinic;
            },
            doctors () {
                let doctors = Object.values(this.$store.getters.doctors);
                if(this.consultations) {
                    doctors = doctors.filter((a) => {
                        for (let spe in a.specialties) {
                            if (a.specialties[spe].name === this.consultations.name) {
                                return true
                            }
                        }
                        return false
                    })
                }
                return doctors
            },
        },

        mounted() {
            this.$store.dispatch('getSpecialties');
            this.$store.dispatch('getDoctors');
        },

        watch: {

        },

        methods:{
            save(){
                for (let i in this.doctor){
                    let data = {
                        clinic: this.selectedClinic,
                        specialtie: this.consultations.name,
                        doctor: this.doctor[i].name,
                        crm: this.doctor[i].crm,
                        cpf: this.doctor[i].cpf,
                        cost: this.cost,
                        price: this.sale,
                        obs: this.obs,
                        payment: this.payment,
                    };
                    this.$store.dispatch('addAppointment', data);
                }
                this.clear()
            },

            clear () {
                this.cost = 0;
                this.sale = 0;
                this.obs =  null;
                this.consultations = null;
                this.doctor = [];
                this.payment = '';
                this.closeDialog()
            },

            closeDialog: function() {
                this.$emit('close-dialog')
            }
        }
    }
</script>
<style scoped>
</style>