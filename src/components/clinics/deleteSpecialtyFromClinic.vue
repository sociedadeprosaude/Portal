<template>
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
            <span class="headline">Deletar o item Selecionado ?</span>
        </v-card-title>
        <v-divider/>
        <v-card-text>
            <strong>
                Medico: {{item.doctor}}
                <br/>
                Especialidade: {{item.specialtie}}
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
            <v-btn color="success" rounded @click="deleteItem">SIM</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
    export default {
        props: ['item', 'clinic'],
        methods: {
            close() {
                this.$emit('close-dialog')
            },
            deleteItem(){
                this.$store.dispatch("deleteAppointment", {
                    cpf: this.cpf,
                    clinic: this.selectedClinic,
                    specialtie: this.specialtie
                });
                this.$store.dispatch("loadClinics");
                this.close();
            },
        }
    }
</script>