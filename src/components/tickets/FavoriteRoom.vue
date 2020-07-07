<template>
    <v-container fluid class="ma-0 pa-0">
        <v-row class="mt-4">
            <v-col cols="12" xs="4" v-for="room in rooms" :key="room.name">
                <v-card class="pa-4" v-if="room === favoritedRoom">
                    <v-flex class="justify-center">
                        <span class="my-sub-headline">{{room.name}}</span>
                    </v-flex>
                    <v-flex>
                        <v-col>
                            <v-tooltip bottom v-if="doctorsLoaded">
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                            @click="callNextTicket(room)"
                                            v-on="on"
                                            :disabled="loading"
                                            text
                                            fab
                                            x-small
                                            class="primary my-2"
                                    >
                                        <v-icon>add_alert</v-icon>
                                    </v-btn>
                                </template>
                                <span>Chamar próxima senha</span>
                            </v-tooltip>
                            <v-tooltip bottom v-if="doctorsLoaded">
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                            v-on="on"
                                            :disabled="loading"
                                            @click="selectedRoom = room, doctorsListDialog.active = true"
                                            text
                                            fab
                                            x-small
                                            class="primary ml-2 my-2"
                                    >
                                        <v-icon>person</v-icon>
                                    </v-btn>
                                </template>
                                <span>Selecionar médico</span>
                            </v-tooltip>
                            <v-progress-circular indeterminate class="primary--text" v-else/>
                            <v-tooltip bottom v-if="doctorsLoaded">
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                            @click="generateNextTicket(room)"
                                            v-on="on"
                                            :disabled="loading"
                                            text
                                            fab
                                            x-small
                                            class="primary ml-2 my-2"
                                    >
                                        <v-icon>post_add</v-icon>
                                    </v-btn>
                                </template>
                                <span>Gerar senha</span>
                            </v-tooltip>
                            <v-tooltip bottom v-if="doctorsLoaded">
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                            @click="openSingleView(room)"
                                            v-on="on"
                                            :disabled="loading"
                                            text
                                            fab
                                            x-small
                                            class="primary ml-2 my-2"
                                    >
                                        <v-icon>personal_video</v-icon>
                                    </v-btn>
                                </template>
                                <span>Visualizador único</span>
                            </v-tooltip>
                        </v-col>
                    </v-flex>
                    <v-flex>
                        <v-divider/>
                        <v-col v-if="room.doctor" class="font-italic">{{room.doctor.name}}</v-col>
                        <v-divider/>
                    </v-flex>
                    <v-flex>
                        <v-container class="pt-2">
                            <v-row>
                                <v-col class="pa-0">
                                    <span v-if="room.tickets.length !== 0" class="font-weight-black">{{room.tickets[room.tickets.length - 1].number}}</span>
                                    <span v-else>*</span>
                                    <br/>
                                    <span style="font-size: 0.8em" class="font-italic">Última senha</span>
                                </v-col>
                                <v-divider vertical/>
                                <v-col class="pa-0">
                                    <div>
                                <span v-if="room.tickets.length !== 0 && getActualTicket(room.tickets)" class="font-weight-black">
                                    {{getActualTicket(room.tickets).number}}
                                </span>
                                        <span v-else>*</span>
                                        <br/>
                                        <span style="font-size: 0.8em" class="font-italic">Senha atual</span>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-flex>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog max-width="720px" content-class="bottom-dialog" transition="dialog-bottom-transition"
                  v-model="doctorsListDialog.active">
            <v-card>
                <v-layout row wrap>
                    <v-flex xs12>
                        <span class="my-headline">{{selectedRoom.name}}</span>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field prepend-icon="search" label="Médico" v-model="doctorsListDialog.search"/>
                    </v-flex>
                    <v-flex xs12 class="mt-2" v-for="doctor in doctors" :key="doctor.crm">
                        <v-card flat @click="setDoctorToRoom(selectedRoom, doctor)">
                            <v-divider class="mb-2"/>
                            <span>{{doctor.name}}</span>
                        </v-card>
                    </v-flex>
                    <v-divider/>
                </v-layout>
            </v-card>
        </v-dialog>
        <v-dialog v-model="singleViewDialog.active" fullscreen transition="dialog-bottom-transition">
            <singleVisualizer
                    :sector="sector"
                    @close="singleViewDialog.active = false"
                    :selectedRoom="singleViewDialog.room"
            />
        </v-dialog>
    </v-container>
</template>
<script>
    /* eslint-disable no-undef */
    import SingleVisualizer from "../tickets/SingleVisualizer"
    let moment = require('moment');

    export default {

        components: {
            SingleVisualizer
        },

        data: () => ({
            loading: false,
            selectedRoom: {},
            doctorsListDialog: {
                active: false,
                search: ""
            },
            singleViewDialog: {
                active: false,
                room: {}
            },

        }),
        mounted() {

        },
        computed: {
            favoritedRoom () {
                return this.$store.getters.favoriteRoom
            },
            rooms() {
                return this.sector ? this.sector.rooms : [];
            },
            sector(){
                return this.$store.getters.favoriteRoomSection ? this.$store.getters.favoriteRoomSection : undefined
            },
            doctorsLoaded() {
                return this.$store.getters.doctorsLoaded;
            },
            doctors() {
                return Object.values(this.$store.getters.doctors).filter(doctor => {
                    return doctor.name.includes(
                        this.doctorsListDialog.search.toUpperCase()
                    );
                });
            },
            ticketInfo() {
                if (
                    moment(this.$store.getters.ticketGeneralInfo.last_updated).dayOfYear !==
                    moment().dayOfYear
                ) {
                    this.reset();
                }
                return this.$store.getters.ticketGeneralInfo;
            },
        },
        methods: {
            async callNextTicket(room) {
                this.loading = true;
                let ticketIndex = room.tickets.findIndex(ticket => {
                    return !ticket.called_at;
                });
                if (ticketIndex < 0) {
                    await this.callSectorTicket(room);
                    this.loading = false;
                    return
                }

                room.tickets[ticketIndex].called_at = moment().format(
                    "YYYY-MM-DD HH:mm:ss"
                );
                const sector = this.sector;
                await this.$store.dispatch("updateSectorRoom", {sector, room});
                this.loading = false
            },
            async callSectorTicket(room) {
                let ticketIndex = this.sector.tickets.findIndex(ticket => {
                    return !ticket.called_at;
                });
                if (ticketIndex < 0) {
                    return
                }
                this.sector.tickets[ticketIndex].called_at = moment().format(
                    "YYYY-MM-DD HH:mm:ss"
                );
                room.tickets.push(this.sector.tickets[ticketIndex]);
                const sector = this.sector;
                await this.$store.dispatch("updateSectorRoom", {sector, room});
                this.sector.tickets.splice(ticketIndex, 1);
                await this.$store.dispatch("updateSector", this.sector);

            },
            getActualTicket(tickets) {
                let calledTickets = tickets.filter(ticket => {
                    return ticket.called_at;
                });
                if (calledTickets.length === 0) {
                    return undefined;
                }
                return calledTickets[calledTickets.length - 1];
            },
            async setDoctorToRoom(room, doctor) {
                room.doctor = doctor;
                this.loading = true;
                const sector = this.sector;
                await this.$store.dispatch("updateSectorRoom", {sector, room});
                this.loading = false;
            },
            async generateNextTicket(room) {
                if (!room.tickets) {
                    room.tickets = [];
                }
                room.tickets.push({
                    number: this.ticketInfo.ticket_number,
                    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                    doctor: room.doctor
                });
                await this.upgradeTicketNumber();
                const sector = this.sector;
                await this.$store.dispatch("updateSectorRoom", {sector, room});
            },
            async upgradeTicketNumber() {
                let ticketInfo = this.ticketInfo;
                ticketInfo.ticket_number++;
                ticketInfo.last_updated = moment().format("YYYY-MM-DD HH:mm:ss");
                await this.$store.dispatch("updateGeneralInfo", this.ticketInfo);
            },
            openSingleView(room) {
                this.singleViewDialog.room = room;
                this.singleViewDialog.active = true;
            }
        }
    }
</script>