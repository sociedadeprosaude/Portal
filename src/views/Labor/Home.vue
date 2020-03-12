<template>
    <v-container>
        <v-layout row wrap v-if="!loading">
            <v-flex xs12>
                <span class="my-headline">Colaboradores</span>
            </v-flex>
            <v-flex xs12 class="px-3 my-3">
                <v-expansion-panels inset>
                    <v-expansion-panel
                            v-for="(user,i) in colab"
                            :key="i"
                    >
                        <v-expansion-panel-header>
                            <v-flex xs4>
                        <span>
                        {{user.name}}
                            </span>
                            </v-flex>
                            <v-flex xs4>

                            <span>
                            {{user.email}}
                        </span>
                            </v-flex>
                            <v-flex xs2>

                            <span>
                            R$ {{user.salary}}
                        </span>
                            </v-flex>
                            <v-flex xs2>

                            <span>{{user.advances ? user.advances.length : 0}}
                        </span>
                            </v-flex>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <!--                            <v-layout row wrap>-->
                            <!--                                <v-flex xs12>-->
                            <!--                                    <span class="my-headline text-left">Permissões</span>-->
                            <!--                                </v-flex>-->
                            <!--                                <v-flex xs12 v-for="perm in permissions" :key="perm">-->
                            <!--                                    <v-btn-->
                            <!--                                            @click="setPermission(user, perm)"-->
                            <!--                                            rounded :color="user.permissions ? user.permissions.indexOf(perm) > -1 ? 'primary' : '' : ''">{{perm}}</v-btn>-->
                            <!--                                </v-flex>-->
                            <!--                            </v-layout>-->
                            <v-layout row wrap>
                                <v-flex xs12 class="text-left mb-2">
                                    <v-btn rounded class="primary mx-1" @click="setSalary(user)">Salario</v-btn>
                                    <v-btn rounded class="primary mx-1" @click="setAdvance(user)">Adiantamento</v-btn>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs12>
                                 <span class="mr-3">
                            CPF: {{user.cpf}}
                        </span>
                                    <span v-if="user.telephones">
                            Telefone: {{user.telephones[0]}}
                        </span>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs12>
                                    <span class="my-headline text-left">Unidade</span>
                                </v-flex>
                                <v-flex xs3 class="my-2" v-for="unit in units" :key="unit.name">
                                    <v-btn
                                            @click="setUserUnit(unit, user)"
                                            rounded
                                            :class="[user.clinic ? user.clinic.name === unit.name ? 'primary' : '' : '']">
                                        <img width="124px" :src="unit.logo">
                                    </v-btn>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs12 v-if="user.advances">
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <span class="my-headline text-left">Adiantamentos</span>
                                        </v-flex>
                                        <v-flex xs3 class="my-2" v-for="advance in user.advances" :key="advance.date">
                                            <v-card class="pa-3">
                                                <v-layout row wrap>
                                                    <v-flex xs12 class="mb-3">
                                                        <span>{{advance.date | dateFilter}}</span>
                                                    </v-flex>
                                                    <v-flex xs12 class="text-right">
                                                        <span class="font-weight-bold">R$ {{advance.value}}</span>
                                                        <span class="font-weight-bold"> |  Parcelas:{{advance.parcel}}</span>
                                                    </v-flex>
                                                </v-layout>
                                            </v-card>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <v-flex xs12>
                                    <span class="my-headline text-left">Grupos</span>
                                </v-flex>
                                <v-flex xs3 class="my-2" v-for="group in groups" :key="group">
                                    <v-btn
                                            @click="setGroup(user, group)"
                                            rounded :color="user.group ? user.group === group ? 'primary' : '' : ''">
                                        {{group}}
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-flex>

            <v-flex xs12>
                <span class="my-headline">Médicos</span>
            </v-flex>
            <v-flex xs12 class="px-3 my-3">
                <v-expansion-panels inset>
                    <v-expansion-panel
                            v-for="(doctor,i) in doctors"
                            :key="i"
                    >
                        <v-expansion-panel-header>
                            <v-flex xs4>
                        <span>
                        {{doctor.name}}
                            </span>
                            </v-flex>
                            <v-flex xs4>

                            <span>
                            {{doctor.email}}
                        </span>
                            </v-flex>
                            <!-- <v-flex xs2>

                            <span>
                            R$ {{user.salary}}
                        </span>
                            </v-flex>
                            <v-flex xs2>

                            <span>{{user.advances ? user.advances.length : 0}}
                        </span>
                            </v-flex> -->
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <!--                            <v-layout row wrap>-->
                            <!--                                <v-flex xs12>-->
                            <!--                                    <span class="my-headline text-left">Permissões</span>-->
                            <!--                                </v-flex>-->
                            <!--                                <v-flex xs12 v-for="perm in permissions" :key="perm">-->
                            <!--                                    <v-btn-->
                            <!--                                            @click="setPermission(user, perm)"-->
                            <!--                                            rounded :color="user.permissions ? user.permissions.indexOf(perm) > -1 ? 'primary' : '' : ''">{{perm}}</v-btn>-->
                            <!--                                </v-flex>-->
                            <!--                            </v-layout>-->
                            <v-layout row wrap>
                               <!--  <v-flex xs12 class="text-left mb-2">
                                    <v-btn rounded class="primary mx-1" @click="setSalary(user)">Salario</v-btn>
                                    <v-btn rounded class="primary mx-1" @click="setAdvance(user)">Adiantamento</v-btn>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex> -->
                                <v-flex xs12>
                                 <span class="mr-3">
                            CPF: {{doctor.cpf}}
                        </span>
                                    <span v-if="doctor.telephones">
                            Telefone: {{doctor.telephones[0]}}
                        </span>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
                                <!-- <v-flex xs12>
                                    <span class="my-headline text-left">Unidade</span>
                                </v-flex>
                                <v-flex xs3 class="my-2" v-for="unit in units" :key="unit.name">
                                    <v-btn
                                            @click="setUserUnit(unit, user)"
                                            rounded
                                            :class="[user.clinic ? user.clinic.name === unit.name ? 'primary' : '' : '']">
                                        <img width="124px" :src="unit.logo">
                                    </v-btn>
                                </v-flex>
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex> -->
                                <!-- <v-flex xs12 v-if="user.advances">
                                    <v-layout row wrap>
                                        <v-flex xs12>
                                            <span class="my-headline text-left">Adiantamentos</span>
                                        </v-flex>
                                        <v-flex xs3 class="my-2" v-for="advance in doctor.advances" :key="advance.date">
                                            <v-card class="pa-3">
                                                <v-layout row wrap>
                                                    <v-flex xs12 class="mb-3">
                                                        <span>{{advance.date | dateFilter}}</span>
                                                    </v-flex>
                                                    <v-flex xs12 class="text-right">
                                                        <span class="font-weight-bold">R$ {{advance.value}}</span>
                                                    </v-flex>
                                                </v-layout>
                                            </v-card>
                                        </v-flex>
                                    </v-layout>
                                </v-flex> -->
                                <v-flex xs12>
                                    <v-divider></v-divider>
                                </v-flex>
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

            <v-flex xs12 class="text-center">
                <paymeny-report :colaborators="colab"></paymeny-report>
            </v-flex>
        </v-layout>
        <v-layout row wrap v-else>
            <v-flex xs12 class="text-center">
                <v-progress-circular size="64" indeterminate color="primary"></v-progress-circular>
            </v-flex>
        </v-layout>
        <v-dialog v-model="salaryDialog" max-width="300px">
            <v-card>
                <v-card-title>
                    Salario
                </v-card-title>
                <v-card-text>
                    <v-currency-field
                            v-model="value"
                            label="valor"></v-currency-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn v-if="!loading" class="primary" @click="setSalary(selectedUser)">
                        Salvar
                    </v-btn>
                    <v-progress-circular indeterminate v-else class="primary--text"></v-progress-circular>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="advanceDialog" max-width="300px">
            <v-card>
                <v-card-title>
                    Adiantamento
                </v-card-title>
                <v-card-text>
                    <v-currency-field
                            v-model="value"
                            label="valor"></v-currency-field>
                    <v-flex>
                        <v-select :items="parcels" v-model="parcel"
                                  label="Parcelas"
                                  filled>
                        </v-select>
                    </v-flex>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn v-if="!loading" class="primary" @click="setAdvance(selectedUser)">
                        Adicionar
                    </v-btn>
                    <v-progress-circular indeterminate v-else class="primary--text"></v-progress-circular>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import PaymenyReport from "../../components/labor/PaymenyReport";

    export default {
        name: "Home",
        components: {
            PaymenyReport
        },
        data() {
            return {
                loading: true,
                salaryDialog: false,
                advanceDialog: false,
                value: undefined,
                selectedUser: undefined,
                parcels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                parcel:1,
                months:[],
                datenow: moment().format('YYYY-MM-DD'),
            }
        },
        computed: {
            units() {
                return this.$store.getters.units
            },
            colab() {
                return this.$store.getters.colaborators.filter(a => {
                    return a.status !== 'pending'
                })
            },
            doctors() {
                return this.$store.getters.colaboratorsDoctors.filter(a => {
                    return a.status !== 'pending' && a.uid
                })
            },
            pendingColab() {
                return this.$store.getters.colaborators.filter(a => {
                    return a.status === 'pending'
                })
            },
            permissions() {
                return this.$store.getters.permissionsList
            },
            groups() {
                return ['admin', 'colaborador', 'gerente', 'doctors']
            }
        },
        methods: {
            async getInitialInfo() {
                // await this.$store.dispatch('getPermissionList')
                await this.$store.dispatch('getColaborators')
                await this.$store.dispatch('getColaboratorsDoctors')
                this.loading = false
            },
            setGroup(user, group) {
                console.log(group)
                console.log(user)
                if (user.group === group) {
                    this.$store.dispatch('updateUserField', {user: user, field: 'group', value: 'delete'})
                } else {
                    this.$store.dispatch('updateUserField', {user: user, field: 'group', value: group})
                }
                this.$store.dispatch('getColaborators')
                this.$store.dispatch('getColaboratorsDoctors')
            },
            async setPermission(user, permission) {
                let permissions = user.permissions
                if (!user.permissions) {
                    permissions = [permission]
                } else {
                    if (permissions.indexOf(permission) > -1) {
                        permissions.splice(permissions.indexOf(permission), 1)
                    } else {
                        permissions.push(permission)
                    }
                }
                this.$store.dispatch('setUserPermissions', {
                    user: user,
                    permissions: permissions
                })
            },
            clearValuesForm() {
                this.salaryDialog = false
                this.advanceDialog = false
                this.value = undefined
                this.selectedUser = undefined
            },
            async setSalary(user) {
                if (user) {
                    this.selecteduser = user
                }
                if (!this.salaryDialog) {
                    this.value = user.salary
                    this.salaryDialog = true
                    return
                }
                this.loading = true
                await this.$store.dispatch('updateUserField', {
                    user: this.selecteduser,
                    field: 'salary',
                    value: this.value
                })
                await this.getInitialInfo()
                this.clearValuesForm()
                this.loading = false
            },
            async setAdvance(user) {
                if (user) {
                    this.selecteduser = user
                }
                if (!this.advanceDialog) {
                    this.advanceDialog = true
                    return
                }
                this.loading = true
                if (!this.selecteduser.advances) {
                    this.selecteduser.advances = []
                }
                for(let i=0; i<this.parcel;i++ ){
                    if(i+ parseInt(this.datenow.substring(5,7)) > 12 ){
                        if(parseInt(this.datenow.substring(8,10)) >19){
                            if(i + 1 + parseInt(this.datenow.substring(5,7)) < 10){
                                this.months[i]= (parseInt(this.datenow.substring(0,5)) + 1) + '0' + (i + 1 + parseInt(this.datenow.substring(5,7)))
                            }
                            else{
                                this.months[i]= (parseInt(this.datenow.substring(0,5)) + 1) + (i + 1 + parseInt(this.datenow.substring(5,7)))
                            }
                        }
                        else{
                            if(i+ parseInt(this.datenow.substring(5,7)) < 10){
                                this.months[i]= (parseInt(this.datenow.substring(0,5)) + 1) + '0' +(i+ parseInt(this.datenow.substring(5,7)))
                            }
                            else{
                                this.months[i]= (parseInt(this.datenow.substring(0,5)) + 1) + (i+ parseInt(this.datenow.substring(5,7)))

                            }
                        }
                    }
                    else{
                        if(parseInt(this.datenow.substring(8,10)) >19){
                            if(i + 1 + parseInt(this.datenow.substring(5,7)) <10){
                                this.months[i]= this.datenow.substring(0,5) + '0' +(i + 1 + parseInt(this.datenow.substring(5,7)))
                            }
                            else{
                                this.months[i]= this.datenow.substring(0,5) + (i + 1 + parseInt(this.datenow.substring(5,7)))
                            }
                        }
                        else{
                            if(i+ parseInt(this.datenow.substring(5,7)) <10 ){
                                this.months[i]= this.datenow.substring(0,5) + '0' +(i+ parseInt(this.datenow.substring(5,7)))

                            }
                            else{
                                this.months[i]= this.datenow.substring(0,5) + (i+ parseInt(this.datenow.substring(5,7)))

                            }
                        }
                    }
                }
                this.selecteduser.advances.push({
                    date: moment().format('YYYY-MM-DD hh:mm:ss'),
                    value: this.value,
                    valueParcel:  this.value/this.parcel,
                    parcel: this.parcel,
                    months: this.months
                })
                await this.$store.dispatch('updateUserField', {
                    user: this.selecteduser,
                    field: 'advances',
                    value: this.selecteduser.advances
                })
                await this.getInitialInfo()
                this.clearValuesForm()
                this.loading = false
            },
            async setUserUnit(unit, user) {
                await this.$store.dispatch('updateUserField', {
                    user: user,
                    field: 'clinic',
                    value: unit
                })
                await this.getInitialInfo()
            },
        },
        mounted() {
            this.getInitialInfo()
        }
    }
</script>

<style scoped>

</style>
