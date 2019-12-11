<template>
    <v-container class="white ma-0 pa-0">
        <v-layout row wrap class="fill-height">
            <v-card class="white pa-3" style="width: 100%">
                <v-layout row wrap>
                    <v-flex xs12 class="text-left">
                        <v-btn text @click="$emit('close')">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-flex>
                    <v-flex xs6 class="text-left">
                        <img src="@/assets/logo-pro-saude.png" height="124px">
                    </v-flex>
                    <v-flex xs6 class="text-right">
                        <v-layout column wrap>
                            <span>Rua Major Gabriel 915</span>
                            <span>Centro, Manaus-AM</span>
                            <span>(92)222222222</span>
                        </v-layout>
                    </v-flex>
                </v-layout>
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
