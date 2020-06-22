<template>
    <v-container fluid>
        <v-layout v-if="clinics" row nowrap>
            <v-flex xs12 v-if="loading">
                <v-progress-circular class="primary--text" indeterminate/>
            </v-flex>
            <v-flex xs12 v-if="clinics.length === 0 && loading === false">
                <p>Não há resultado para a pesquisa realizada</p>
            </v-flex>
            <div v-if="clinics.length !== 0" style="width: 100%">
                <v-flex sm12 v-for="(clinic, i) in clinics" :key="i" class="mb-5">
                    <v-card>
                        <v-flex xs12 sm12>
                            <v-card color="primary">
                                <v-layout row wrap>
                                    <v-flex sm10>
                                        <p class="white--text text-left font-weight-bold pt-4 pb-3 pl-4">
                                            {{clinic.name}}
                                        </p>
                                    </v-flex>
                                    <v-flex sm2 class="text-right mt-2">
                                        <v-btn icon dark><v-icon small >edit</v-icon></v-btn>
                                        <v-btn icon dark><v-icon small >delete</v-icon></v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-card>
                        </v-flex>
                        <v-flex xs12 sm12 class="mt-4 mb-3">
                            <v-divider class="primary"/>
                        </v-flex>
                    </v-card>
                </v-flex>
            </div>
        </v-layout>
    </v-container>
</template>
<script>
    export default {
        props: ['clinics', 'loading']
    }
</script>