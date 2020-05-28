<template>
    <v-container>
        <v-row>
            <v-col cols="12" align="start">
                <v-btn fab @click="createSector">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-btn :color="creation.editing ? 'amber' : ''" fab @click="creation.editing = !creation.editing" class="ml-2">
                    <v-icon>edit</v-icon>
                </v-btn>
            </v-col>

            <v-row v-if="!loading" justify="center" align="center" align-content="center">
                <v-col align-self="center" cols="12" sm="4" v-for="sector in sectors" :key="sector.name">
                    <v-expand-transition>
                        <v-col cols="12" v-if="creation.editing" align="end">
                            <v-btn fab x-small class="red" @click="deleteSector(sector)">
                                <v-icon class="white--text">delete</v-icon>
                            </v-btn>
                        </v-col>
                    </v-expand-transition>
                    <v-card class="card mx-3" @click="choose(sector)">
                        <v-container>
                            <v-row align="center" justify="center">
                                <v-col cols="12">
                                    <span style="font-size: 2.0em" class="mt-10 font-weight-bold">{{sector.name.substring(0, 1)}}</span>
                                </v-col>
                                <v-col cols="12">
                                    <span class="text-center my-headline">{{sector.name}}</span>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card>
                </v-col>
            </v-row>
            <v-progress-circular indeterminate color="primary" v-else></v-progress-circular>

<!--            <v-row v-else align="center" justify="center">-->
<!--                <div>-->
<!--                    <span class="text-center my-headline">{{sector.title}}</span>-->
<!--                    <transition name="slide-fade" mode="out-in" appear>-->
<!--                        <tickets :sector="sector"/>-->
<!--                    </transition>-->
<!--                </div>-->
<!--            </v-row>-->
        </v-row>
        <v-dialog v-model="creation.creationDialog" max-width="500px">
            <v-card>
                <v-col cols="12" align="start">
                    <span class="my-headline">Criar setor</span>
                </v-col>
                <v-col cols="12">
                    <v-text-field
                            v-model="creation.sectorName"
                            label="Nome do setor"></v-text-field>
                </v-col>
                <v-col cols="12" align="end">
                    <v-btn @click="createSector(creation.sectorName)" color="primary" rounded v-if="!creation.creating">
                        Criar
                    </v-btn>
                    <v-progress-circular indeterminate color="primary" v-else></v-progress-circular>
                </v-col>
            </v-card>
        </v-dialog>
        <v-dialog v-model="creation.deletingDialog" max-width="500px">
            <v-card>
                <v-col cols="12" align="start">
                    <span class="my-headline">Deletar setor {{creation.choosed ? creation.choosed.name : ''}}?</span>
                </v-col>
                <v-col cols="12" align="end">
                    <v-btn @click="deleteSector(creation.choosed)" color="primary" rounded v-if="!creation.deleting">
                        Deletar
                    </v-btn>
                    <v-progress-circular indeterminate color="primary" v-else></v-progress-circular>
                </v-col>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import tickets from "@/components/tickets/Tickets";
    import constants from "../../../utils/constants";

    export default {
        name: "TicketsDashboard",
        components: {
            tickets
        },

        data() {
            return {
                creation: {
                    creationDialog: false,
                    deletingDialog: false,
                    sectorName: undefined,
                    creating: false,
                    editing: false,
                    choosed: undefined,
                    deleting: false
                },
                choosed: false,
                sector: null,
                production: null,
            };
        },
        mounted() {
            this.$store.dispatch("getTicketsGeneralInfo");
            this.$store.dispatch("listenTicketsSectors");

            this.production = constants.IN_PRODUCTION;
        },
        computed: {
            sectors() {
                return this.$store.getters.sectors
            },
            loading() {
                return !this.sectors
            }
        },
        methods: {
            async createSector(name) {
                if (!this.creation.creationDialog) {
                    this.creation.creationDialog = true
                    return
                }
                if (!name || name.lenght === 0) return
                this.creation.creating = true
                await this.$store.dispatch('createTicketsSector', name)
                this.resetCreation()
            },
            async deleteSector(sector) {
                this.creation.choosed = sector
                if (!this.creation.deletingDialog) {
                    this.creation.deletingDialog = true
                    return
                }
                this.creation.deleting = true
                await this.$store.dispatch('deleteSector', sector)
                this.creation.deleting = false
                this.creation.deletingDialog = false
            },
            async choose(sector) {
                console.log('sector', sector)
                this.$router.push('/senhas/' + sector.name)
            },
            resetCreation() {
                this.creation = {
                    creationDialog: false,
                    deletingDialog: false,
                    sectorName: undefined,
                    creating: false,
                    editing: false,
                    choosed: undefined,
                    deleting: false
                }
            }
        }
    };
</script>
