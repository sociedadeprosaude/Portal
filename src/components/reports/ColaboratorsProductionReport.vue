<template>
    <v-container>
        <v-layout row wrap class="justify-center">
            <!--            <v-flex xs12>-->
            <!--                <v-select-->
            <!--                        v-if="colaborators"-->
            <!--                        v-model="selectedColaborator"-->
            <!--                        :items="colaborators"-->
            <!--                        item-text="name"-->
            <!--                        return-object-->
            <!--                >-->
            <!--                </v-select>-->
            <!--            </v-flex>-->
            <!--            <v-flex v-if="selectedColaborator" xs12 class="my-sub-headline">-->
            <!--                <span>{{selectedColaborator.name}}</span>-->
            <!--            </v-flex>-->
            <v-flex xs12 class="text-center" v-if="!loading">
                <v-layout column wrap>
                    <v-card class="pa-3" width="300px" v-for="(object, name) in intakesResume" :key="name">
                        <v-layout row wrap>
                            <v-flex xs12>
                                <span class="my-sub-headline">
                                    {{name}}
                                </span>
                            </v-flex>
                            <v-flex xs12 v-for="(value, field) in object" :key="field">
                                <span>{{field}}: {{value}}</span>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-layout>
            </v-flex>
            <v-flex xs12 class="text-center" v-else>
                <v-progress-circular indeterminate class="primary--text"></v-progress-circular>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import constants from "../../utils/constants";

    export default {
        name: "ColabboratorsProductionReport",
        props: ['intakes', 'loading'],
        data() {
            return {
                colaborators: undefined,
                selectedColaborator: undefined,
            }
        },
        computed: {
            intakesResume() {
                let resumes = {
                    // Dinheiro: 0.0,
                    // Crédito: 0.0,
                    // Débito: 0.0,
                    // Exames: 0,
                    // Consultas: 0
                }

                for (let intake in this.intakes) {
                    if (!resumes[this.intakes[intake].colaborator.name]) {
                        resumes[this.intakes[intake].colaborator.name] = {}
                    }
                    if (!resumes[this.intakes[intake].colaborator.name][this.intakes[intake].payment_method]) {
                        resumes[this.intakes[intake].colaborator.name][this.intakes[intake].payment_method] = 0.0
                    }
                    resumes[this.intakes[intake].colaborator.name][this.intakes[intake].payment_method] = this.intakes[intake].total
                    resumes[this.intakes[intake].colaborator.name].Exames = resumes[this.intakes[intake].colaborator.name].Exames ? this.intakes[intake].exams.length + resumes[this.intakes[intake].colaborator.name].Exames : this.intakes[intake].exams.length
                    resumes[this.intakes[intake].colaborator.name].Consultas = resumes[this.intakes[intake].colaborator.name].Consultas ? this.intakes[intake].specialties.length + resumes[this.intakes[intake].colaborator.name].Consultas : this.intakes[intake].specialties.length
                }
                return resumes
            }
        },
        // watch: {
        //     selectedColaborator(val) {
        //         if (val) {
        //             this.getIntakes(val)
        //         }
        //     }
        // },
        methods: {
            // async getIntakes(colab) {
            //     this.intakes = await this.$store.dispatch('getColaboratorIntakes', colab)
            // },
            // async getColaborators() {
            //     this.colaborators = await this.$store.dispatch('searchUser', {
            //         type: 'colaborator'
            //     })
            //     console.log(this.colaborators)
            // }
        },
        // mounted() {
        //     this.getColaborators()
        // }
    }
</script>

<style scoped>

</style>
