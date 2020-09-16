<template>
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
            <span>{{ formTitle }}</span>
            <v-spacer/>
            <v-btn text rounded @click="close()">
                <v-icon>clear</v-icon>
            </v-btn>
        </v-card-title>
        <v-divider/>
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
                        />
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
                        />
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
                        />
                    </v-flex>
                    <v-flex>
                      <!-- Apollo Query -->
                      <ApolloQuery
                          :query="require('@/graphql/products/ReadProcucts.gql')"
                          :variables="{ type:'SPECIALTY', schedulable:false}"
                      >
                        <template slot-scope="{ result: { data } }">
                        <v-select
                                prepend-icon="school"
                                :items="data.Product"
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
                                        @input="data.parent.selectItem({},data.item)"
                                        text-color="white"
                                        color="info"
                                >{{ data.item.name }}
                                </v-chip>
                            </template>
                        </v-select>
                        </template>
                      </ApolloQuery>
                    </v-flex>

                    <v-flex>
                      <!-- Apollo Query -->
                      <ApolloQuery
                          :query="require('@/graphql/clinics/LoadClinics.gql')"
                          :variables="{property: true}"
                      >
                        <template slot-scope="{ result: { data } }">
                        <v-select
                                prepend-icon="location_city"
                                v-model="clinic"
                                :items="data.Clinic"
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
                                >{{ data.item.name }}
                                </v-chip>
                            </template>
                        </v-select>
                        </template>
                      </ApolloQuery>
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
                                            <v-radio label="Consulta" value="unit"/>
                                        </v-flex>
                                        <v-spacer/>
                                        <v-flex xs4>
                                            <v-radio label="Dia" value="daily"/>
                                        </v-flex>
                                    </v-layout>
                                </v-radio-group>
                            </v-flex>
                            <v-flex xs12>
                                <v-currency-field
                                        prepend-icon="attach_money"
                                        outlined
                                        rounded
                                        filled
                                        clearable
                                        label="Custo"
                                        prefix="R$"
                                        v-model="spec.cost"
                                />
                            </v-flex>
                            <v-spacer/>

                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
            <v-spacer/>
            <v-flex xs4 v-if="!doctor">
              <ApolloMutation
                  :mutation="require('@/graphql/doctors/CreateDoctors.gql')"
                  :variables="{name ,crm, cpf}"
                  @done="close"
              >
                <template v-slot="{ mutate, loading, error }">
                  <v-btn
                      color="primary"
                      :disabled="loading"
                      @click.native="createDoctor(mutate)"
                  >Adicionar</v-btn>
                  <p v-if="error">Ocorreu um erro: {{ error }}</p>
                </template>
              </ApolloMutation>
            </v-flex>
            <v-flex xs12 v-else>
              <ApolloMutation
                  :mutation="require('@/graphql/doctors/UpdateDoctors.gql')"
                  :variables="{name ,crm, cpf, id}"
                  @done="close"
              >
                <template v-slot="{ mutate, loading, error }">
                  <v-btn color="primary" @click.native="updateDoctor(mutate)">Editar</v-btn>
                  <p v-if="error">Ocorreu um erro: {{ error }}</p>
                </template>
              </ApolloMutation>
            </v-flex>
        </v-card-actions>
    </v-card>
</template>

<script>
    import {mask} from 'vue-the-mask'
    export default {
        name: "CreateDoctorCard",
        props: ['doctor'],
        directives: { mask },
        mounted() {
          console.log('tem ?', this.doctor)
            this.$store.dispatch('getClinics');
            this.$store.dispatch('getSpecialties');
            if (this.doctor) {
                console.log(this.doctor)
                this.name = this.doctor.name;
                this.cpf = this.doctor.cpf;
                this.id = this.doctor.id;
                this.crm = this.doctor.crm;
                this.specialties = this.doctor.specialties;
                this.clinic = this.doctor.clinics
            }
        },
        data() {
            return {
                clinic: undefined,
                maskCRM: '######',
                maskCPF: '###.###.###-##',
                paymentMethod: 'unit',
                name: '',
                crm: '',
                cpf: '',
                id: '',
                specialties: undefined,
                obs: null,
                formTitle: 'Cadastro de Médicos',
                loading: false,
                success: false,
                error: undefined
            }
        },
        computed: {
            clinics() {
                return this.$store.getters.clinics.filter(a => {
                    return a.property;
                });
            },
            specialtyOptions() {
                return JSON.parse(JSON.stringify(this.$store.getters.specialties))
            },
            formIsValid() {
                if (!this.name || this.name.length <= 0) {
                    return false
                }
                if (!this.cpf || this.cpf.length <= 0) {
                    return false
                }
                if (!this.crm || this.crm.length <= 0) {
                    return false
                }
                if (!this.specialties || this.specialties.length <= 0) {
                    return false
                } else {
                    for (let spec in this.specialties) {
                        if (!this.specialties[spec].payment_method) {
                            return false
                        }
                    }
                }
                return true
            },
        },
        methods: {
            updateDoctor(mutate) {
              setTimeout(() => {
                mutate();
              }, 0);
            },
            createDoctor(mutate) {
              this.name = this.name.toUpperCase()
              setTimeout(() => {
                mutate();
              }, 0);
            },
            close() { this.$emit('close'); },
            clear() {
                this.name = undefined;
                this.crm = undefined;
                this.cpf = undefined;
                this.specialties = undefined;
                this.clinic = undefined;
                this.$emit('clean')
            },
            async save() {
                this.loading = true;
                for (let spec in this.specialties) {
                    delete this.specialties[spec].doctors
                    if (!this.specialties[spec].cost) {
                        this.specialties[spec].cost = 0.00
                    }
                    if (!this.specialties[spec].price) {
                        this.specialties[spec].price = 0.00
                    }
                }
                let doctor = {
                    name: this.name.toUpperCase(),
                    cpf: this.cpf.replace(/\./g, '').replace('-', ''),
                    email: this.email,
                    crm: this.crm,
                    specialties: this.specialties,
                    clinics: this.clinic,
                    type: 'doctor'
                };
                await this.$store.dispatch('addDoctor', doctor);
                for (let i in this.clinic) {
                    for (let j in this.specialties) {
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
                        await this.$store.dispatch('addAppointmentFromDoctors', data);
                    }
                }
                this.success = true;
                this.loading = false;
                this.clear();
                setTimeout(() => {
                    this.success = false;
                    this.close()
                }, 800)
            }
        }
    }
</script>

<style scoped>
</style>
