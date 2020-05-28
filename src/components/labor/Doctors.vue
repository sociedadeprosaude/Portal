<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 class="px-3 my-3">
                <v-expansion-panels inset>
                    <v-expansion-panel v-for="(doctor,i) in doctors" :key="i">
                        <v-expansion-panel-header>
                            <v-flex xs4>
                                <span>{{doctor.name.toUpperCase()}}</span>
                            </v-flex>
                            <v-flex xs4>
                                <span>{{doctor.email}}</span>
                            </v-flex>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-layout row wrap>
                                <v-flex xs12><v-divider/></v-flex>
                                <v-flex xs12 class="mt-2 mb-2">
                                    <span class="mr-3">CPF: {{doctor.cpf}}</span>
                                    <span v-if="doctor.telephones">Telefone: {{doctor.telephones[0]}}</span>
                                </v-flex>
                                <v-flex xs12><v-divider/></v-flex>
                                <v-flex xs12>
                                    <span class="my-headline text-left">Grupos</span>
                                </v-flex>
                                <v-flex xs3 class="my-2" v-for="group in groups" :key="group">
                                    <v-btn
                                            @click="setGroup(doctor, group)"
                                            rounded :color="doctor.group ? doctor.group === group ? 'primary' : '' : ''">
                                        {{group}}
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>

    export default {

        name: "Doctors",

        data: () => ({

        }),

        mounted() {
            this.getInitialInfo()
        },

        computed: {

            doctors() {
                return this.$store.getters.colaboratorsDoctors.filter(a => {
                    return a.status !== 'pending' && a.uid
                })
            },

            groups() {
                return ['admin', 'colaborador', 'gerente', 'doctor']
            }

        },

        methods: {

            async getInitialInfo() {
                await this.$store.dispatch('getColaboratorsDoctors');
            },

            setGroup(user, group) {
                if (user.group === group) {
                    this.$store.dispatch('updateUserField', {user: user, field: 'group', value: 'delete'})
                } else {
                    this.$store.dispatch('updateUserField', {user: user, field: 'group', value: group})
                }
                this.$store.dispatch('getColaboratorsDoctors')
            },

        }
    }
</script>