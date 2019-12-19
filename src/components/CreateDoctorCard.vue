<template>
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
            <span>{{ formTitle }}</span>
            <v-spacer></v-spacer>
            <v-btn text rounded @click="close">
                <v-icon>clear</v-icon>
            </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-container grid-list-md>
                <v-layout wrap>
                    <v-flex xs12>
                        <v-text-field
                                clearable
                                prepend-icon="person"
                                v-model="name"
                                label="Nome do Médico(a)"
                                outlined
                                rounded
                                filled
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                :disabled="doctor !== undefined"
                                clearable
                                v-mask="maskCPF"
                                prepend-icon="credit_card"
                                v-model="cpf"
                                label="CPF"
                                outlined
                                rounded
                                filled
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                clearable
                                v-mask="maskCRM"
                                prepend-icon="credit_card"
                                v-model="crm"
                                label="CRM"
                                outlined
                                rounded
                                filled
                        ></v-text-field>
                    </v-flex>
                    <v-flex>
                        <v-select
                                prepend-icon="school"
                                :items="specialtyOptions"
                                item-text="name"
                                item-value="name"
                                return-object
                                label="Especialidade(s)"
                                multiple
                                v-model="specialties"
                                clearable
                                chips
                                outlined
                                rounded
                                filled
                        >
                            <template v-slot:selection="data">
                                <v-chip
                                        :key="JSON.stringify(data.item)"
                                        :input-value="data.selected"
                                        :disabled="data.disabled"
                                        class="v-chip--select-multi"
                                        @click.stop="data.parent.selectedIndex = data.index"
                                        @input="data.parent.selectItem(data.item)"
                                        text-color="white"
                                        color="info"
                                >{{ data.item.name }}</v-chip>
                            </template>
                        </v-select>
                    </v-flex>

                    <v-flex>
                        <v-select
                                prepend-icon="location_city"
                                v-model="clinic"
                                :items="clinics"
                                return-object
                                item-text="name"
                                label="Clínica"
                                outlined
                                rounded
                                filled
                                chips
                                multiple
                                color="purple"
                                clearable
                        >
                            <template v-slot:selection="data">
                                <v-chip
                                        :key="JSON.stringify(data.item)"
                                        :input-value="data.selected"
                                        :disabled="data.disabled"
                                        class="v-chip--select-multi"
                                        @click.stop="data.parent.selectedIndex = data.index"
                                        @input="data.parent.selectItem(data.item)"
                                        text-color="white"
                                        color="info"
                                >{{ data.item.name }}</v-chip>
                            </template>
                        </v-select>
                    </v-flex>

                    <v-flex xs12 v-for="spec in specialties" :key="spec.name">
                        <v-layout row wrap class="align-center">
                            <v-flex xs6 class="text-left">
                                <span class="my-sub-headline">
                                    {{spec.name}}
                                </span>
                            </v-flex>
                            <v-flex xs6>
                                <v-radio-group v-model="spec.payment_method">
                                    <v-layout row wrap>
                                        <v-flex xs4>
                                            <v-radio
                                                    label="Consulta"
                                                    value="unit"
                                            ></v-radio>
                                        </v-flex>
                                        <v-spacer></v-spacer>
                                        <v-flex xs4>
                                            <v-radio
                                                    label="Dia"
                                                    value="daily"
                                            ></v-radio>
                                        </v-flex>
                                    </v-layout>
                                </v-radio-group>
                            </v-flex>
                            <v-flex xs6>
                                <v-currency-field
                                        prepend-icon="attach_money"
                                        outlined
                                        rounded
                                        filled
                                        clearable
                                        label="Custo"
                                        prefix="R$"
                                        v-model="spec.cost"
                                ></v-currency-field>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs6>
                                <v-currency-field
                                        prepend-icon="monetization_on"
                                        outlined
                                        rounded
                                        filled
                                        clearable
                                        prefix="R$"
                                        v-model="spec.price"
                                        label="Venda"
                                ></v-currency-field>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-flex xs4 v-if="!doctor">
                <submit-button
                        :disabled="!formIsValid"
                        text="Salvar"
                        :success="success"
                        :loading="loading" @click="save"></submit-button>
            </v-flex>
            <v-flex xs12 v-else>
                <submit-button
                        v-if="!doctor"
                        :disabled="!formIsValid"
                        text="Apagar"
                        @reset="success = false"
                        :success="success"
                        :loading="loading" @click="erase"></submit-button>
                <submit-button
                        :disabled="!formIsValid"
                        text="Editar"
                        @reset="success = false"
                        :success="success"
                        :loading="loading" @click="save"></submit-button>
            </v-flex>
        </v-card-actions>
    </v-card>
</template>

<script>
    import {mask} from 'vue-the-mask'
    import SubmitButton from "./SubmitButton";

    export default {
        name: "CreateDoctorCard",
        props: ['doctor'],
        directives: {
            mask,
        },
        components: {
            SubmitButton
        },
        beforeDestroy() {
            this.doctor = undefined
        },
        mounted() {

            this.$store.dispatch('getClinics')
            this.$store.dispatch('getSpecialties')
            if (this.doctor) {
                this.name = this.doctor.name
                this.cpf = this.doctor.cpf
                this.crm = this.doctor.crm
                this.specialties = this.doctor.specialties
            }
        },
        data() {
            return {
                clinic: undefined,
                maskCRM: '######',
                maskCPF: '###.###.###-##',
                paymentMethod: 'unit',
                name: undefined,
                crm: undefined,
                cpf: undefined,
                specialties: undefined,
                obs: null,
                formTitle: 'Cadastro de Médicos',
                loading: false,
                success: false,
            }
        },
        computed: {
            clinics() {
                return this.$store.getters.clinics
            },
            specialtyOptions() {
                return this.$store.getters.specialties
            },
            formIsValid() {
                return this.name
                    && this.crm
                    && this.specialties
                    && this.cpf
                    && this.name.length > 0 && this.crm.length > 0 && this.specialties.length > 0 && this.cpf.length > 0
            },
        },
        methods: {
            close() {
                this.clear()
                this.$emit('close')
            },
            clear () {
                this.name = undefined
                this.crm = undefined
                this.cpf = undefined
                this.specialties = undefined
                this.clinic = undefined
            },
            erase() {
            },
            edit() {
            },
            async save() {
                this.loading = true
                let doctor = {
                    name: this.name.toUpperCase(),
                    cpf: this.cpf.replace(/\./g, '').replace('-', ''),
                    email: this.email,
                    crm: this.crm,
                    specialties: this.specialties,
                    clinics: this.clinic,
                    // birth_date: this.birthDate,
                    // sex: this.sex,
                    // telephones: this.telephones,
                    // addresses: this.addresses,
                    type: 'doctor'
                }
                await this.$store.dispatch('addDoctor', doctor)
                await this.$store.dispatch('getDoctors')
                //==========================começo da nova função
                for (let i in this.clinic){
                    for (let j in this.specialties){
                        let data = {
                            clinic: this.clinic[i],
                            specialtie: this.specialties[j].name,
                            doctor: this.name.toUpperCase(),
                            crm: this.crm,
                            cpf: this.cpf.replace(/\./g, '').replace('-', ''),
                            obs: this.obs,
                            cost: this.specialties[j].cost,
                            price: this.specialties[j].price,
                            paymentMethod: this.specialties[j].payment_method,
                        };
                        //console.log("imprimir:",data)
                        await this.$store.dispatch('addAppointmentFromDoctors', data);
                    }
                }
                //=============fim da nova função
                this.success = true
                this.loading = false
                setTimeout(() => {
                    this.close()
                }, 800)
            }
        }
    }
</script>

<style scoped>
</style>
