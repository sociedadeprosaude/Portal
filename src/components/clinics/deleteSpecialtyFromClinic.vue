<template>
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
            <span class="headline">Deletar o item Selecionado ?</span>
        </v-card-title>
        <v-divider/>
        <v-card-text>
            <strong>
                Medico: {{doctor.name}}
                <br/>
                Especialidade: {{specialty.name}}
                <br/>
                Preço-Custo: R$ {{doctor.cost}}
                <br/>
                Preço-Venda: R$ {{doctor.price}}
            </strong>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
            <v-btn color="error" rounded @click="close()">NÃO</v-btn>
            <v-spacer/>
            <v-btn color="success" rounded @click="deleteItem()">SIM</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
    export default {
        props: ['specialty', 'clinic', 'doctor'],
        methods: {
            close() {
                this.$emit('close-dialog')
            },
            deleteItem(){
                this.$store.dispatch("deleteAppointment", {
                    cpf: this.doctor.cpf,
                    clinic: this.clinic,
                    specialtie: this.specialty.name
                });
                this.$store.dispatch("loadClinics");
                this.close();
            },
        }
    }
</script>