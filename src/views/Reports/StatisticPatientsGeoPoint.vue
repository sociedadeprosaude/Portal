<template>
  <v-container fluid v-if="skipPatient && Bairros">
    <statistics-budget
      :NumPatientsNotAddress="NumPatientsNotAddress"
      :NumPatientsAddress="NumPatientsAddress"
      :Patient="Patients"
      :Bairros="Bairros"
    />
  </v-container>
  <v-container v-else >
    <p v-if="skipPatient">Carregando Pacientes</p>
    <p v-else>Carregando Bairros, isso pode demorar um pouco</p>
    <v-progress-circular indeterminate size="64">
    </v-progress-circular>
  </v-container>
 
</template>

<script>
import statisticsBudget from "@/components/Reports/statsPatientsGeopoint";
import axios from "axios";
export default {
  components: { statisticsBudget },
  data: () => ({
    PatientFixed: '',
    skipPatient: false,
  }),

  computed: {

    Patients(){
      return this.PatientFixed
    },
    PatientsAdrress(){
      return this.Patients.filter(e => e.addresses[0])
    },
    // eslint-disable-next-line vue/no-async-in-computed-properties
    async Bairros() {
      let ObjectBairros = []
      let bairros = []
      this.PatientsAdrress.filter(e => {
        if(e.addresses[0].city && e.addresses[0].neighboor){
          if(ObjectBairros[e.addresses[0].city + '-' + e.addresses[0].neighboor]){
            ObjectBairros[e.addresses[0].city + '-' + e.addresses[0].neighboor].patients += 1
          }
          else{
            ObjectBairros[e.addresses[0].city + '-' + e.addresses[0].neighboor] = {
              name: e.addresses[0].city + '-' + e.addresses[0].neighboor,
              patients: 1
            }
          }
        }
        else if (!e.addresses[0].cep){
          if (bairros['sem cep']){
            bairros['sem cep'].name = 'sem cep'
            bairros['sem cep'].patients += 1
          } else {
            bairros['sem cep'] = {
              name: 'sem cep',
              patients: 1
            }
          }
        } else if (e.addresses[0].cep.length === 0 || e.addresses[0].cep.length < 8) {
          if (bairros['sem cep']) {
            bairros['sem cep'].name = 'sem cep'
            bairros['sem cep'].patients += 1
          } else {
            bairros['sem cep'] = {
              name: 'sem cep',
              patients: 1
            }
          }
        } else {
          e.addresses[0].cep = e.addresses[0].cep.replace('-', '')
          e.addresses[0].cep = e.addresses[0].cep.replace('.', '')
          if (bairros[e.addresses[0].cep.substring(0, 5)]) {
            if (bairros[e.addresses[0].cep.substring(0, 5)].name.length !== 8) {
              bairros[e.addresses[0].cep.substring(0, 5)].name = e.addresses[0].cep
            }
            bairros[e.addresses[0].cep.substring(0, 5)].patients += 1
            bairros[e.addresses[0].cep.substring(0, 5)].idAddresses.push(e.addresses[0].id)
          } else {
            bairros[e.addresses[0].cep.substring(0, 5)] = {
              name: e.addresses[0].cep,
              patients: 1,
              idAddresses: []
            }
            bairros[e.addresses[0].cep.substring(0, 5)].idAddresses.push(e.addresses[0].id)
          }
        }
      })
      for (let bairro in bairros) {
        if (bairro !== 'sem cep') {
          if (bairros[bairro].name.length === 8) {
            // eslint-disable-next-line vue/no-async-in-computed-properties
            let endereço = await axios.get('https://viacep.com.br/ws/' + bairros[bairro].name + '/json/')
            if (!endereço.data.erro) {
              for(let id in bairros[bairro].idAddresses){
                console.log('bairro: ', bairro)
                this.$apollo.mutate({
                  mutation: require('@/graphql/patients/UpdateAddress-City-Neighborhood-Patient.gql'),
                  variables: {
                    idAddress: bairros[bairro].idAddresses[id],
                    city: endereço.data.localidade,
                    neighboor: endereço.data.bairro
                  }
                })
              }
              bairros[bairro].name = endereço.data.localidade + '-' + endereço.data.bairro
              if (ObjectBairros[bairros[bairro].name]) {
                ObjectBairros[bairros[bairro].name].patients += bairros[bairro].patients
              } else {
                ObjectBairros[bairros[bairro].name] = {
                  name: bairros[bairro].name,
                  patients: bairros[bairro].patients,
                }
              }
            } else {
              bairros[bairro].name = 'cep invalido'
              if (ObjectBairros['cep invalido']) {
                ObjectBairros['cep invalido'].patients += bairros[bairro].patients
              } else {
                ObjectBairros['cep invalido'] = {
                  name: bairros[bairro].name,
                  patients: bairros[bairro].patients
                }
              }
            }
          } else {
            bairros[bairro].name = 'cep invalido'
            if (ObjectBairros['cep invalido']) {
              ObjectBairros['cep invalido'].patients += bairros[bairro].patients
            } else {
              ObjectBairros['cep invalido'] = {
                name: bairros[bairro].name,
                patients: bairros[bairro].patients
              }
            }
          }
        } else {
          bairros[bairro].name = 'sem cep'
          if (ObjectBairros['sem cep']) {
            ObjectBairros['sem cep'].patients += bairros[bairro].patients
          } else {
            ObjectBairros['sem cep'] = {
              name: bairros[bairro].name,
              patients: bairros[bairro].patients
            }
          }
        }
      }
      console.log('bairros: ', ObjectBairros)
      if(ObjectBairros){
        return ObjectBairros
      }
    },
    NumPatientsNotAddress(){
      return this.Patients.filter(e => !e.addresses[0]).length
    },
    NumPatientsAddress(){
      return this.Patients.filter(e => e.addresses[0]).length
    },
    
    selectedUnit() {
      return this.$store.getters.selectedUnit
    }
  },
  apollo: {
    loadTransactions: {
      query: require("@/graphql/patients/GetPatientsAddresses.gql"),
      update(data) {
        console.log('data: ', data.Patient)
        this.PatientFixed= data.Patient
        this.skipPatient = true
      },
      skip() {
        return this.skipPatient
      }
    },
  }
};
</script>