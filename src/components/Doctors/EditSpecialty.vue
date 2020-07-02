<template>
    <v-card>
        <v-card-title>
            Editar Especialidade Médica
            <v-spacer/>
            <v-btn text @click="close()">
                <v-icon>close</v-icon>
            </v-btn>
        </v-card-title>
        <v-divider/>
        <v-card-text>
            <v-layout row wrap class="align-center justify-center">
                <v-flex xs12 class="my-4 mx-2">
                    <v-select
                            label="Especialidade Selecionda para Edição"
                            v-model="name"
                            :items="specialties"
                            outlined
                            rounded
                            filled
                            return-object
                            item-text="name"
                            chips
                            readonly
                            color="primary"
                            hide-details
                            dense
                    >
                        <template v-slot:selection="data">
                            <v-chip
                                    :key="JSON.stringify(data.item)"
                                    :input-value="data.selected"
                                    :disabled="data.disabled"
                                    class="v-chip--select-multi"
                                    @click.stop="data.parent.selectedIndex = data.index"
                                    @input="data.parent.selectItem(data.item)"
                                    text-color="white"
                                    color="primary"
                                    dense
                            >
                                {{ data.item.name }}
                            </v-chip>
                        </template>
                    </v-select>
                </v-flex>

                <v-flex xs12>
                    <v-currency-field
                    outlined
                    rounded
                    filled
                    clearable
                    prefix="R$"
                    v-model="price"
                    label="Preço de Venda"
                    />
                </v-flex>
            </v-layout>
        </v-card-text>
        <v-card-actions>
            <v-spacer/>
            <submit-button text="Editar" :loading="loading" :success="success" @reset="success = false"
                           @click="editSpecialty">
            </submit-button>
        </v-card-actions>
    </v-card>
</template>
<script>
    import SubmitButton from "../SubmitButton";

    export default {
        props: ['specialty'],
        components: {SubmitButton},

        data: () => ({
            loading: false,
            success: false,
            exam: undefined,
            name:undefined,
            price:0,
            typeOptions:[
                { text:'sim', value: true },
                { text:'não', value: false }
            ],
        }),

        computed: {
            specialties() {
                return this.$store.getters.specialties
            },
        },
        mounted(){
            this.initialize()
        },
        methods: {
            close() {
                this.$emit('close');
            },
            async editSpecialty() {
                this.loading = true;
                await this.$store.dispatch('editSpecialty', {
                    name: this.name.toUpperCase(),
                    price:Number(this.price)
                });
                this.success = true;
                this.loading = false;
                setTimeout(() => {
                    this.close();
                }, 1000)
            },
            initialize(){
                if(this.specialty){
                    this.name = this.specialty.name
                    this.price = this.specialty.price
                }
            }
        },
        watch:{
            specialty(value){
                if(value)
                    this.initialize()
            }
        }
    }
</script>