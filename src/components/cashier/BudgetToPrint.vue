<template>
    <v-container class="white ma-0 pa-0">
        <v-layout row wrap class="fill-height">
            <v-card class="white fill-height">
                <v-flex xs12 class="text-left">
                    <v-btn text @click="$emit('close')">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-flex>
                <v-flex xs6 class="text-left red">
                    <img src="@/assets/logo-pro-saude.png" height="124px">
                </v-flex>
                <v-flex xs6 class="text-right">
                    <v-layout column wrap>
                        <span>Rua Major Gabriel 915</span>
                    </v-layout>
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
