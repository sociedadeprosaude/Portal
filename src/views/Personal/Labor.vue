<template>
    <v-container class="primary mt-n6 fill-height align-center" fluid >
        <v-layout row wrap v-if="!loading">
            <v-flex xs12>
                <span class="my-headline background--text ">Colaboradores</span>
            </v-flex>

            <v-flex class="hidden-md-and-up">
                <collaborators-mobile :loading="loading" :collaborators="colaborators" />
            </v-flex>
           <v-flex class="hidden-sm-and-down">
               <Collaborators :loading="loading" :collaborators="colaborators" />
           </v-flex>
        </v-layout>

        <v-layout row wrap v-if="loading" class="align-center">
            <v-flex xs12 class="text-center">
                <v-progress-circular size="124" indeterminate color="white"/>
            </v-flex>
        </v-layout>

    </v-container>
</template>

<script>
    import PaymenyReport from "../../components/labor/PaymenyReport";
    import Collaborators from "../../components/labor/Collaborators";
    import Doctors from "../../components/labor/Doctors";
    import CollaboratorsMobile from "../../components/labor/Collaborators-mobile"


    export default {
        name: "Home",
        components: {
            PaymenyReport,
            Collaborators,
            Doctors,
            CollaboratorsMobile
        },
        data: () => ({
            loading: true,
            colaborators: []
        }),
        async mounted() {
            //await this.$store.dispatch('getColaborators');
        },
        computed: {
            user() {
                return this.$store.getters.user
            },
            unit() {
                return this.$store.getters.selectedUnit;
            },
            /* collaborators() {
              if (this.user.group === 'admin') return this.$store.getters.colaborators
              return this.$store.getters.colaborators.filter(c => {
                return !c.clinic || c.clinic.name === this.unit.name
              })
            }, */

        },
        apollo: {
            loadColaborators: {
                query: require("@/graphql/colaborators/LoadColaborators.gql"),
                update(data) {
                    this.colaborators = data.Colaborator;

                    if (this.user.group === 'admin') {
                        this.colaborators = data.Colaborator
                    }
                    else{
                        this.colaborators = this.colaborators.filter(c => {
                            if(c.clinic){
                                return c.clinic.id === this.unit.id
                            }
                            else{
                                return c
                            }
                        })
                    }
                    this.loading = false
                }
            }
        }

    }
</script>
