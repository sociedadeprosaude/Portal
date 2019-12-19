<template>
    <v-container>
        <v-layout row wrap v-if="!loading">
            <v-flex xs12>
                <span class="my-headline white--text">Pendentes</span>
            </v-flex>
            <v-flex xs12 class="px-3 my-3">
                <v-expansion-panels inset>
                    <v-expansion-panel
                            v-for="(user,i) in pendingColab"
                            :key="i"
                    >
                        <v-expansion-panel-header>
                        <span>
                        {{user.name}}
                            </span>
                            <span>
                            {{user.telephone}}
                        </span>
                            <span>
                            {{user.email}}
                        </span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <!--                            <v-layout row wrap>-->
                            <!--                                <v-flex xs12>-->
                            <!--                                    <span class="my-headline text-left">Permissões</span>-->
                            <!--                                </v-flex>-->
                            <!--                                <v-flex xs3 class="my-2" v-for="perm in permissions" :key="perm">-->
                            <!--                                    <v-btn-->
                            <!--                                            @click="setPermission(user, perm)"-->
                            <!--                                            rounded :color="user.permissions ? user.permissions.indexOf(perm) > -1 ? 'primary' : '' : ''">{{perm}}</v-btn>-->
                            <!--                                </v-flex>-->
                            <!--                            </v-layout>-->
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <span class="my-headline text-left">Grupos</span>
                                </v-flex>
                                <v-flex xs3 class="my-2" v-for="group in groups" :key="group">
                                    <v-btn
                                            @click="setGroup(user, group)"
                                            rounded :color="user.group ? user.group = group ? 'primary' : '' : ''">
                                        {{group}}
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-flex>
            <v-flex xs12>
                <span class="my-headline white--text">Colaboradores</span>
            </v-flex>
            <v-flex xs12 class="px-3 my-3">
                <v-expansion-panels inset>
                    <v-expansion-panel
                            v-for="(user,i) in colab"
                            :key="i"
                    >
                        <v-expansion-panel-header>
                        <span>
                        {{user.name}}
                            </span>
                            <span>
                            {{user.cpf}}
                        </span>
                            <span v-if="user.telephones">
                            {{user.telephones[0]}}
                        </span>
                            <span>
                            {{user.email}}
                        </span>
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
        </v-layout>
        <v-layout row wrap v-else>
            <v-flex xs12 class="text-center">
                <v-progress-circular size="64" indeterminate color="white"></v-progress-circular>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                loading: true
            }
        },
        computed: {
            colab() {
                return this.$store.getters.colaborators.filter(a => {
                    return a.status !== 'pending'
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
                return ['admin']
            }
        },
        methods: {
            async getInitialInfo() {
                // await this.$store.dispatch('getPermissionList')
                await this.$store.dispatch('getColaborators')
                this.loading = false
            },
            setGroup(user, group) {
                if (user.group === group) {
                    this.$store.dispatch('updateUserField', {user: user, field: 'group', value: 'delete'})
                } else {
                    this.$store.dispatch('updateUserField', {user: user, field: 'group', value: group})
                }
                this.$store.dispatch('getColaborators')
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
            }
        },
        mounted() {
            this.getInitialInfo()
        }
    }
</script>

<style scoped>

</style>
