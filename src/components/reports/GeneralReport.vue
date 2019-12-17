<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card class="pa-4">
                    <v-layout row wrap>
                        <v-flex xs6 class="text-left">
                            <span class="my-sub-headline">Relatório Geral</span>
                        </v-flex>
                        <v-flex xs6 class="text-right">
                            <span>{{now | dateFilter}}</span>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "GeneralReport",
        props: ['report', 'loading'],
        data() {
            return {
                now: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        }
    }
</script>

<style scoped>

</style>
