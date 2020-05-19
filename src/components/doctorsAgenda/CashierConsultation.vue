<template>
    <v-container class="ma-0 pa-0" fluid>
        <v-layout row wrap >
            <v-flex xs12>
                <v-btn rounded small class="mx-1"  @click="selectCategory('exam')">
                    Exames
                </v-btn>
                <v-btn rounded small class="mx-1">
                    Consultas
                </v-btn>
                <v-btn rounded small class="mx-1">
                    Pacotes
                </v-btn>
                <v-btn small text icon dark>
                    <v-icon>more_vert</v-icon>
                </v-btn>
            </v-flex>
            <v-flex xs12 class="mt-4 mx-3">
                <v-card>
                    <v-card-title>
                        <v-text-field placeholder="Pesquisa"
                                      v-model="search"
                                      :loading="loading"
                                      id="search"
                                      single-line
                                      :disabled="!categorySelect"
                        />
                        <v-spacer/>
                        <v-btn icon>
                            <v-icon>local_grocery_store</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <CartShopping/>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import CartShopping from "../doctorsAgenda/CartShopping"
    export default {
        components: {CartShopping},
        data (){
            return {
                categorySelect: 'appointment',
                search: '',
                loading: undefined
            }
        },
        methods: {
            selectCategory(category) {
                this.categorySelect = category
            },
        }
    }

</script>