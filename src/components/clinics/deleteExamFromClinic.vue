<template>
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
            <span class="headline">Deletar o item Selecionado ?</span>
        </v-card-title>
        <v-divider/>
        <v-card-text>
            <strong>
                Exame: {{item.name}}
                <br/>
                Preço-Custo: R$ {{item.cost}}
                <br/>
                Preço-Venda: R$ {{item.price}}
            </strong>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
            <v-btn color="error" rounded @click="close()">NÃO</v-btn>
            <v-spacer/>
          <div>
            <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
            <v-btn v-else color="success" rounded @click="deleteItem">SIM</v-btn>
          </div>
        </v-card-actions>
    </v-card>
</template>
<script>
    export default {
        props: ['item', 'clinic'],
        data: () => ({
          loading: false,
        }),
        methods: {
            close() {
                this.$emit('close-dialog')
            },
            async deleteItem(){
              this.loading = true
              await this.$apollo.mutate({
                mutation: require('@/graphql/clinics/RemoveCostProductClinicWith_clinicAndProduct.gql'),
                variables: {
                  idClinic: this.clinic.id,
                  idCostProductClinic: this.item.idcpc,
                  idProduct: this.item.id,
                },
              });
              await this.$apollo.mutate({
                mutation: require('@/graphql/clinics/DeleteCostProductClinic.gql'),
                variables: {
                  id: this.item.idcpc,
                },
              });
              this.loading = false
              this.$router.push('/')
            },
        }
    }
</script>