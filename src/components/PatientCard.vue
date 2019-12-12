<template>
    <v-container class="ma-0 pa-0">
        <v-layout row wrap class="ma-0 pa-0">
            <v-flex xs6>
                <v-card>
                    <v-img :src="require('../assets/card_background.jpg')">
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-btn
                                @click="window.print">
                                    <v-icon>print</v-icon>
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-img>
                </v-card>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs6 class="text-right">
                <v-card>
                    <v-img :src="require('../assets/card_background.jpg')"></v-img>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "PatientCard",
        props: ['user']
    }
</script>

<style scoped>

</style>
