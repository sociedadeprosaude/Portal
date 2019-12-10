<template>
    <v-container class="white ma-0 pa-0">
            <v-layout row wrap class="fill-height">
                <v-card class="white fill-height">
                <v-flex xs1>
                    <v-btn text @click="$emit('close')">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-flex>
                <v-flex xs11>

                </v-flex>
                </v-card>
            </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "BudgetToPrint",
        props: ['budget']
    }
</script>

<style scoped>

</style>
