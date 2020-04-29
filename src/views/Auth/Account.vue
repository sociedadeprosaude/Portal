<template>
    <v-container fluid>
        <v-layout row wrap class="align-center justify-center">
            <v-flex xs8 sm4>
                <v-card>
                    <v-card-title><h2>Minha Conta</h2></v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-text-field v-model="user.name" label="Nome Completo"/>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field readonly v-model="user.email" label="Email"/>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field readonly v-model="user.cpf" v-mask="'###.###.###-##'"
                                              label="CPF"/>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field
                                        v-model="user.telephones[0]"
                                        v-mask="'(##)#####-####'"
                                        label="Telefone"
                                />
                            </v-flex>
                            <v-flex xs5>
                                <v-layout row wrap class="align-center">
                                    <v-text-field
                                            style="width:60px"
                                            label="CEP"
                                            v-model="address.cep"
                                            v-mask="mask.cep"
                                    />
                                    <v-btn @click="getAddressByCep(address)" class="transparent" text>
                                        <v-icon>search</v-icon>
                                    </v-btn>
                                </v-layout>
                            </v-flex>
                            <v-flex xs2>
                                <v-select
                                        class="ml-2"
                                        label="UF"
                                        hide-details
                                        single-line
                                        v-model="address.uf"
                                        :items="states"
                                        menu-props="auto"
                                />
                            </v-flex>
                            <v-spacer/>
                            <v-flex xs4>
                                <v-select
                                        label="Cidade"
                                        class="mr-2"
                                        single-line
                                        v-model="address.city"
                                        :items="cities[address.uf]"
                                        menu-props="auto"
                                        hide-details
                                />
                            </v-flex>

                            <v-flex xs10 class="pr-1">
                                <v-text-field label="Logradouro" v-model="address.street"/>
                            </v-flex>
                            <v-flex xs2 class="pl-1">
                                <v-text-field label="Número" v-model="address.number"/>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field label="Complemento" v-model="address.complement"/>
                            </v-flex>
                        </v-layout>
                    </v-card-text>

                    <v-card-actions class="text-right">
                        <v-spacer/>
                        <submit-button
                                color="success"
                                rounded
                                @reset="reset"
                                :success="success"
                                :loading="loading"
                                @click="updateAccount"
                                text="Salvar"
                        />
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>

        <v-dialog v-model="dialog" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">Adicionar Usuário</v-card-title>
                <v-card-text>
                    <v-text-field slot="activator" v-model="name" persistent-hint label="Nome"/>

                    <v-text-field slot="activator" v-model="username" persistent-hint
                                  label="Nome de Usuário"/>

                    <v-text-field slot="activator" v-model="email" persistent-hint label="Email"/>

                    <v-text-field
                            slot="activator"
                            v-model="password"
                            persistent-hint
                            type="password"
                            label="Senha"
                    />

                    <v-layout row wrap>
                        <v-flex xs12>
                            <span>Permissões</span>
                        </v-flex>
                        <v-btn
                                @click="selectedPermissions.indexOf(permission) > -1 ? selectedPermissions.splice(selectedPermissions.indexOf(permission), 1) :
selectedPermissions.push(permission)"
                                :class="[selectedPermissions.indexOf(permission) > -1 ? 'primary' : 'white']"
                                v-for="permission in permissions"
                                :key="permission"
                        >{{permission}}
                        </v-btn>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary_dark darken-1" flat @click.native="dialog = false">Cancelar</v-btn>
                    <v-btn color="primary_dark darken-1" flat @click.native="addUser">Adicionar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import {mask} from "vue-the-mask";
    import SubmitButton from "../../components/SubmitButton";

    export default {
        name: "Register",
        directives: {
            mask
        },
        components: {
            SubmitButton
        },
        data() {
            return {
                dialog: false,
                name: "",
                username: "",
                email: "",
                password: "",
                permissions: ["caixa", "prontuario"],
                selectedPermissions: [],
                userAccount: undefined,
                mask: {
                    cpf: "###.###.###-##",
                    telephone: "(##) #####-####",
                    cep: "##.###-###"
                },
                states: ["AC", "AL", "AM"],
                cities: {
                    AC: [],
                    AL: [],
                    AM: ["Iranduba", "Manaus", "Parintins", "AUTAZES"]
                },
                addressObj: {},
                loading: false,
                success: false
            };
        },

        computed: {
            address: {
                set(val) {
                    this.addressObj = val;
                },
                get() {
                    return this.addressObj;
                }
            },
            user() {
                let user = this.$store.getters.user;
                if (!user.address) {
                    this.address = {
                        cep: "",
                        uf: "",
                        city: "",
                        street: "",
                        number: "",
                        complement: ""
                    };
                } else {
                  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.address = user.address;
                }
                return user;
            }
        },
        methods: {
            async initialConfig() {
                this.user = await this.$store.getters.user;
                if (!this.user.address) {
                    this.user.address = {
                        cep: "",
                        uf: "",
                        city: "",
                        street: "",
                        number: "",
                        complement: ""
                    };
                }
            },
            reset() {
                this.success = false;
            },
            updateAccount() {
                this.loading = true;
                this.$store.dispatch("updateAccount", {
                    ...this.user,
                    address: this.address
                });
                this.loading = false;
                this.success = true
            },
            addUser() {
                let payload = {
                    name: this.name,
                    email: this.email,
                    username: this.username,
                    password: this.password,
                    permissions: this.selectedPermissions
                };
                this.$store.dispatch("addUser", payload).then(response => {
                    this.name = "";
                    this.username = "";
                    this.email = "";
                    this.password = "";
                    this.selectedPermissions = [];
                    this.dialog = false;
                });
            },
            async getAddressByCep(address) {
                let resp;
                let foundAddress = undefined;
                try {
                    resp = await this.$store.dispatch(
                        "getAddressByCep",
                        address.cep.replace(".", "").replace("-", "")
                    );
                    if (resp.erro) {
                        return;
                    }
                } catch (e) {
                    return;
                }
                foundAddress = {
                    cep: resp.cep,
                    street: resp.logradouro,
                    complement: resp.complemento,
                    city: resp.localidade,
                    uf: resp.uf
                };
                this.address = foundAddress;
            }

        }
    };
</script>

<style scoped>
</style>
