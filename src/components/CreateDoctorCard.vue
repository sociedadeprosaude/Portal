<template>
    <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
            <span>{{ formTitle }}</span>
            <v-spacer></v-spacer>
            <v-btn text rounded @click="close">
                <v-icon>clear</v-icon>
            </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-container grid-list-md>
                <v-layout wrap>
                    <v-flex xs12>
                        <v-text-field
                                clearable
                                :rules="rulesform"
                                prepend-icon="person"
                                v-model="name"
                                label="Nome do Médico(a)"
                                outlined
                                rounded
                                filled
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                :disabled="doctor !== undefined"
                                clearable
                                v-mask="maskCPF"
                                :rules="rulesform"
                                prepend-icon="credit_card"
                                v-model="cpf"
                                label="CPF"
                                outlined
                                rounded
                                filled
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                clearable
                                v-mask="maskCRM"
                                :rules="rulesform"
                                prepend-icon="credit_card"
                                v-model="crm"
                                label="CRM"
                                outlined
                                rounded
                                filled
                        ></v-text-field>
                    </v-flex>
                    <v-flex>
                        <v-select
                                :rules="rulesform"
                                prepend-icon="school"
                                :items="options"
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
                                        :selected="data.selected"
                                        :disabled="data.disabled"
                                        class="v-chip--select-multi"
                                        @click.stop="data.parent.selectedIndex = data.index"
                                        @input="data.parent.selectItem(data.item)"
                                        text-color="white"
                                        color="info"
                                >{{ data.item.name }}</v-chip>
                            </template>
                        </v-select>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-flex xs4 v-if="!doctor">
                <submit-button
                        :disabled="!formIsValid"
                        text="Salvar"
                        :success="success"
                        :loading="loading" @click="save"></submit-button>
            </v-flex>
            <v-flex xs12 v-else>
                <submit-button
                        v-if="!doctor"
                        :disabled="!formIsValid"
                        text="Apagar"
                        @reset="success = false"
                        :success="success"
                        :loading="loading" @click="erase"></submit-button>
                <submit-button
                        :disabled="!formIsValid"
                        text="Editar"
                        @reset="success = false"
                        :success="success"
                        :loading="loading" @click="save"></submit-button>
            </v-flex>
        </v-card-actions>
    </v-card>
</template>

<script>
    import {mask} from 'vue-the-mask'
    import SubmitButton from "./SubmitButton";

    export default {
        name: "CreateDoctorCard",
        props: ['doctor'],
        directives: {
            mask,
        },
        components: {
            SubmitButton
        },
        beforeDestroy() {
          this.doctor = undefined
        },
        mounted() {
            this.$store.dispatch('getSpecialties')
            if (this.doctor) {
                this.name = this.doctor.name
                this.cpf = this.doctor.cpf
                this.crm = this.doctor.crm
                this.specialties = this.doctor.specialites
            }
        },
        data() {
            return {
                maskCRM: '######',
                maskCPF: '###.###.###-##',
                rulesform: [
                    aux => !!aux || 'Preencher o Campo é Obrigatório.'
                ],
                name: undefined,
                crm: undefined,
                cpf: undefined,
                specialties: undefined,
                formTitle: 'Cadastro de Médicos',
                loading: false,
                success: false,
            }
        },
        computed: {
            options() {
              let specialties = this.$store.getters.specialties
                return specialties
            },
            formIsValid() {
                return this.name && this.crm && this.specialties && this.cpf
                    && this.name.length > 0 && this.crm.length > 0  && this.specialties.length > 0  && this.cpf.length > 0
            },
        },
        methods: {
            close() {
                this.$emit('close')
            },
            erase() {
            },
            edit() {
            },
            async save() {
                this.loading = true
                let doctor = {
                    name: this.name.toUpperCase(),
                    cpf: this.cpf.replace(/\./g, '').replace('-', ''),
                    email: this.email,
                    crm: this.crm,
                    specialties: this.specialties,
                    // birth_date: this.birthDate,
                    // sex: this.sex,
                    // telephones: this.telephones,
                    // addresses: this.addresses,
                    //type: 'DOCTOR'
                }
                await this.$store.dispatch('addDoctor', doctor)
                await this.$store.dispatch('getDoctors')
                this.success = true
                this.loading = false
                setTimeout(() => {
                    this.close()
                }, 800)
            }
        }
    }
</script>

<style scoped>
</style>
