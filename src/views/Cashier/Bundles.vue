<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 class="my-4">
                <v-card class="round-card">
                    <v-flex xs12 class="text-right pa-2" v-if="searchPackage">
                        <v-layout row wrap>
                            <v-btn rounded color="primary" dark class="mb-2"
                                   @click="$router.back()">
                                <v-icon>close</v-icon>
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn rounded color="primary" dark class="mb-2"
                                   @click="registerPackage =! registerPackage, searchPackage =! searchPackage">
                                ADICIONAR PACOTE
                                <v-icon right>add</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-flex>
                    <v-card-text>
                        <v-flex xs12 v-if="searchPackage">
                            <v-layout>
                                <v-flex xs12>
                                    <v-combobox v-model="searchData" :items="listPackage" item-text="name"
                                                hide-selected hide-no-data :clearable="true" :loading="isLoading"
                                                :search-input.sync="searchData" filled single-line full-width
                                                return-object @click:clear = "clearSearch" outlined
                                                style="justify-content: center">
                                        <template v-slot:no-data>
                                            <v-list-item>
                                                <v-list-item-content>
                                                    <v-list-item-title>
                                                        Sem resultado para "<strong>{{ searchData }}</strong>"
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </template>
                                    </v-combobox>
                                </v-flex>
                            </v-layout>

                            <v-card v-if="selectedPackage" class="round-card">
                                <v-card-title>
                                    <h4 class="font-italic font-weight-bold primary--text">
                                        {{editedPackage.name}}
                                    </h4>
                                </v-card-title>
                                <v-card-text class="mt-3">
                                    
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    export default {
        data: () => ({
            searchPackage: true, registerPackage: false,
            searchData: null,
            isLoading: false,

            editedPackage: {
                name: '', exams: [], specialties: [],
            },

            defaultPackage: {
                name: '', exams: [], specialties: [],
            },

        }),

        computed: {
            listPackage (){
                return this.$store.getters.bundles;
            },


            selectedPackage () {
                return this.$store.getters.selectedBundle;
            }
        },

        mounted () {
            this.$store.dispatch('loadBundle');
        },

        methods: {

            clearSearch () {
                this.isLoading = false;
                this.searchData = null;
                this.editedPackage= Object.assign({}, this.defaultPackage);
                this.$store.dispatch('selectedBundle', null);
            }
        },

        watch: {

            searchData () { //pesquisa por filtro de status e por delimitação de nome
                if (this.searchData){
                    this.isLoading = true;
                    const data = this.searchData.toUpperCase();
                    if (this.listPackage.length > 0){
                        for (let key in this.listPackage) {
                            if (data === this.listPackage[key].nome) {
                                this.searchPackage = true;
                                this.registerPackage= false;
                                this.$store.dispatch('selectedBundle', {...this.$store.getters.bundles[key]});
                                this.editedPackage = Object.assign({}, this.selectedBundle);
                                this.editedPackage.name = data;
                            }
                        }
                    }

                } else {
                    this.$store.dispatch('selectedBundle', null);
                }
            },
        },
    }
</script>

<style scoped>
    .round-card {
        border-radius: 20px;
    }

    .title {
        color: #757575;
        font-size: 20px;
    }

    .center-card {
        height: 100%;
        justify-content: center;
        align-content: center;
        align-items: center;

    }
</style>