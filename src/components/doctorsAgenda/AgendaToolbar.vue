<template>
    <v-container class="ma-0 pa-0">
        <v-navigation-drawer class="hidden-print-only" temporary v-model="drawer" fixed app>
            <v-list>
                <v-list-item
                        v-for="item in menuItems"
                        :key="item.title"
                        :to="item.link">
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>{{ item.title }}</v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar color="blue" dark fixed class="hidden-print-only">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>
                <router-link class="hidden-xs-only" to="/" tag="span" style="cursor: pointer">
                    <v-img :src="require('@/assets/logo-pro-saude.png')"
                           aspect-radio="1"
                           width="180"
                           class="hidden-xl-only"
                    ></v-img>
                </router-link>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-flex class="mt-2">
                    <v-card class="transparent" flat v-if="selectedPatient">
                        <v-list-tile>
                            <v-icon left>person</v-icon>
                            <v-list-tile-content>
                                <v-list-tile-title>Nome: {{selectedPatient.nome}}</v-list-tile-title>
                                <v-list-tile-sub-title v-if="selectedPatient.cpf !== ''">CPF: {{selectedPatient.cpf}}
                                </v-list-tile-sub-title>
                                <v-list-tile-sub-title v-else>Número: {{selectedPatient.id}}</v-list-tile-sub-title>
                                <v-spacer></v-spacer>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-card>
                </v-flex>

                <v-dialog v-model="dialog" width="1000">
                    <template v-slot:activator="{ on }">
                        <v-btn color="transparent" v-on="on" class="elevation-0">
                            <v-icon left>search</v-icon>
                            associados
                            <v-icon right>person_add</v-icon>
                        </v-btn>
                    </template>
                    <pacientes></pacientes>
                </v-dialog>
            </v-toolbar-items>
        </v-app-bar>
    </v-container>
</template>

<script>
    export default {
        name: "AgendaToolbar",
        data() {
            return {
                drawer: false,
                dialog: false,
                menuItems: [
                    {icon: 'group_add', title: 'Busca de Médicos', link: '/agenda/Medicos'},
                    {icon: 'group_add', title: 'Busca de Pacientes', link: '/agenda/Pacientes'},
                    {
                        icon: 'calendar_today',
                        title: 'Cadastro de Plantões & Consultas',
                        link: '/agenda/CadastroConsultasPlantoes'
                    },
                    {icon: 'delete_forever', title: 'Apagar Consultas do dia', link: '/agenda/DeletarConsultas'},
                    {icon: 'event_note', title: 'Agendamento de Consultas', link: '/agenda/agendamento'},
                    {icon: 'event', title: 'Vizualizar Consultas de Médicos', link: '/agenda/ConsultasMedicos'},
                    {
                        icon: 'date_range',
                        title: 'Gerenciamento de Consultas do Médico',
                        link: '/agenda/GerenciamentoConsultas'
                    },
                    {icon: 'event', title: 'Gerenciamento de Consultas do Paciente', link: '/agenda/ConsultasPacientes'},
                    {
                        icon: 'event_busy',
                        title: 'Gerenc. de Consultas Canceladas de Todas as Especilidades',
                        link: '/agenda/ConsultasCanceladas'
                    },
                    {icon: 'translate', title: 'Pesquisa de CIDs', link: '/agenda/Cids'},
                    {icon: 'print', title: 'Declaração de Comparecimento', link: '/agenda/Declaration'},

                ]
            }
        },
        computed: {
            selectedPatient() {
                this.$store.getters.selectedPatient
            }
        }
    }
</script>

<style scoped>

</style>
