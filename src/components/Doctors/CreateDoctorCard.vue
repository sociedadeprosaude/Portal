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
              <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
              <v-btn v-else color="primary" @click="createDoctor()">Adicionar</v-btn>
            </v-flex>
            <v-flex xs12 v-else>
              <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
              <v-btn v-else color="primary" @click="updateDoctor()">Editar</v-btn>
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
        data() {
            return {
              name: '',
              crm: '',
              cpf: '',
              id: '',
              loading: false,
              //==========
                clinic: undefined,
                maskCRM: '######',
                maskCPF: '###.###.###-##',
                paymentMethod: 'unit',
                specialties: undefined,
                formTitle: 'Cadastro de Médicos',
            }
        },
       mounted() {
          console.log('tem ?', this.doctor)
          if (this.doctor) {
            this.specialties = this.doctor.is_specialist_of;
            console.log(this.specialties)
            this.id = this.doctor.id;
            this.name = this.doctor.name;
            this.cpf = this.doctor.cpf;
            this.crm = this.doctor.crm;
            this.filterClinic();
            this.filterCPD();
          }
        },
        methods: {
          async filterCPD() {
            const costs = await this.$apollo.mutate({
              mutation: require('@/graphql/doctors/LoadCostProductDoctors.gql'),
            })
            let costProductDoctor = costs.data.CostProductDoctor
            console.log(costProductDoctor)
            for(let cost in costProductDoctor){
              for(let product in this.specialties) {
                console.log(costProductDoctor[cost])
                console.log(costProductDoctor[cost].with_doctor[0])
                console.log(costProductDoctor[cost].with_product[0])
                if(this.specialties[product].id === costProductDoctor[cost].with_product[0].id && costProductDoctor[cost].with_doctor[0].id === this.id){
                  this.specialties[product].cost = costProductDoctor[cost].cost
                  this.specialties[product].payment_method = costProductDoctor[cost].payment_method
                  this.specialties[product].idCostProductDoctor = costProductDoctor[cost].id
                }
              }
            }
          },
          async filterClinic() {
            const unitys = await this.$apollo.mutate({
              mutation: require('@/graphql/clinics/LoadClinics.gql'),
              variables: {property: true},
            })
            let clins = []
            let clinics = unitys.data.Clinic
            for(let unity in clinics){
              for(let doctor in clinics[unity].has_doctor)
                if(clinics[unity].has_doctor[doctor].id === this.id){
                  clins.push(clinics[unity])
                }
            }
            this.clinic = clins
          },
          async updateDoctor() {
            this.loading = true
            await this.$apollo.mutate({
              mutation: require('@/graphql/doctors/UpdateDoctors.gql'),
              variables: {
                id: this.id,
                name: this.name.toUpperCase(),
                crm: this.crm,
              },
            });
            for(let product in this.specialties) {
              await this.$apollo.mutate({
                mutation: require('@/graphql/doctors/UpdateCostProductDoctor.gql'),
                variables: {
                  id: this.specialties[product].idCostProductDoctor,
                  cost: this.specialties[product].cost,
                  payment_method: this.specialties[product].payment_method,
                },
              });
            }
            //falta clinicas
            this.loading = false
            this.$router.push('/')
          },

          async createDoctor() {
            this.loading = true
            const dataDoctor = await this.$apollo.mutate({
              mutation: require('@/graphql/doctors/CreateDoctors.gql'),
              variables: {
                name: this.name.toUpperCase(),
                crm: this.crm,
                cpf: this.cpf.replace(/\./g, '').replace('-', ''),
              },
            });
            const idDoctor = dataDoctor.data.CreateDoctor.id
            for(let product in this.specialties) {
              const CostProductDoctor = await this.$apollo.mutate({
                mutation: require('@/graphql/doctors/CreateCostProductDoctor.gql'),
                variables: {
                  cost: this.specialties[product].cost,
                  payment_method: this.specialties[product].payment_method,
                },
              });
              const idCostProductDoctor = CostProductDoctor.data.CreateCostProductDoctor.id
              const dataRelations = await this.$apollo.mutate({
                mutation: require('@/graphql/doctors/AddCostProductDoctorWithProducAndDoctortAndAddDoctorIsSpecialistOf.gql'),
                variables: {
                  idCostProduct: idCostProductDoctor,
                  idProduct: this.specialties[product].id,
                  idDoctor: idDoctor,
                },
              });
            }
            for(let unity in this.clinic) {
              const dataRelationClinic = await this.$apollo.mutate({
                mutation: require('@/graphql/doctors/AddClinicHasDoctor.gql'),
                variables: {
                  idClinic: this.clinic[unity].id,
                  idDoctor: idDoctor,
                },
              });
            }
            this.loading = false
            this.$router.push('/')
          },
/*          close() {
            this.clear();
            this.$emit('close');
          },
          clear() {
            this.name = undefined;
            this.crm = undefined;
            this.cpf = undefined;
            this.specialties = undefined;
            this.clinic = undefined;
            this.$emit('clean')
          },*/
        }
    }
</script>
