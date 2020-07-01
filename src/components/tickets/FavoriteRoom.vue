<template>
    <v-container fluid class="ma-0 pa-0">
        <v-card class="background">
            <v-flex xs12 class="text-left mr-2 ml-2 pt-2">
                <span class="my-sub-headline">{{room.name}}</span>
            </v-flex>
            <v-row>
                <v-col>
                    <v-tooltip top v-if="doctorsLoaded">
                        <template v-slot:activator="{ on }">
                            <v-btn
                                    v-on="on"
                                    :disabled="loading"
                                    @click="callNextTicket()"
                                    text
                                    fab
                                    small
                                    class="primary my-2"
                            >
                                <v-icon>add_alert</v-icon>
                            </v-btn>
                        </template>
                        <span>Chamar próxima senha</span>
                    </v-tooltip>
                    <v-tooltip top v-if="doctorsLoaded">
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
                    <v-tooltip top v-if="doctorsLoaded">
                        <template v-slot:activator="{ on }">
                            <v-btn
                                    v-on="on"
                                    :disabled="loading"
                                    @click="generateNextTicket()"
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
                    <!--
                    <v-tooltip top v-if="doctorsLoaded">
                        <template v-slot:activator="{ on }">
                            <v-btn
                                    v-on="on"
                                    :disabled="loading"
                                    @click="openSingleView()"
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
                    -->
                </v-col>
            </v-row>
            <v-flex xs12 v-if="room.doctor">
                <v-divider/>
                <v-col class="font-italic">{{room.doctor.name}}</v-col>
                <v-divider/>
            </v-flex>
            <v-row>
                <v-container class="pa-0">
                    <v-row>
                        <v-col class="pa-2">
                            <span v-if="room.tickets.length !== 0" class="font-weight-black">{{room.tickets[room.tickets.length - 1].number}}</span>
                            <span v-else>*</span>
                            <br/>
                            <span style="font-size: 0.8em">Última senha</span>
                        </v-col>
                        <v-divider vertical/>
                        <v-col class="pa-2">
                            <div>
                                <span v-if="room.tickets.length !== 0 && getActualTicket(room.tickets)"
                                      class="font-weight-black">{{getActualTicket(room.tickets).number}}</span>
                                <span v-else>*</span>
                                <br/>
                                <span style="font-size: 0.8em">Senha atual</span>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </v-row>
        </v-card>

        <v-dialog
                max-width="720px"
                content-class="bottom-dialog"
                transition="dialog-bottom-transition"
                v-model="doctorsListDialog.active"
        >
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
    </v-container>
</template>
<script>
    let moment = require('moment');

    export default {

        data: () => ({
            doctorsListDialog: {
                active: false,
                search: ""
            },
            selectedRoom: {},
            createRoomController: false,
            loading: false,
            success: false,
            singleViewDialog: {
                active: false,
                room: {}
            },
        }),
        mounted() {
            // this.$store.dispatch("getTicketsGeneralInfo");
            this.initialInfo();
        },
        computed: {
            room() {
                return this.$store.getters.favoriteRoom ? this.$store.getters.favoriteRoom : undefined
            },

            sectorName() {
                return this.$store.getters.favoriteRoomSection ? this.$store.getters.favoriteRoomSection : undefined
            },

            sector() {
                return this.$store.getters.sectors ? this.$store.getters.sectors.find((sector) => sector.name == this.sectorName) : undefined
            },

            ticketInfo() {
                if (moment(this.$store.getters.ticketGeneralInfo.last_updated).dayOfYear !== moment().dayOfYear) {
                    this.reset();
                }
                return this.$store.getters.ticketGeneralInfo;
            },
            doctors() {
                return Object.values(this.$store.getters.doctors).filter(doctor => {
                    return doctor.name.includes(
                        this.doctorsListDialog.search.toUpperCase()
                    );
                });
            },
            doctorsLoaded() {
                return this.$store.getters.doctorsLoaded;
            },

        },
        methods: {

            async initialInfo() {
                if (!this.sector) {
                    await this.$store.dispatch("getTicketsGeneralInfo");
                    await this.$store.dispatch('listenTicketsSectors')
                }
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
            async generateNextTicket() {
                let room = this.room;
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
            async generateSectorTicket() {
                let sector = this.sector;
                if (!sector.tickets) {
                    sector.tickets = []
                }
                sector.tickets.push({
                    number: this.ticketInfo.ticket_number,
                    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                });
                await this.upgradeTicketNumber();
                await this.$store.dispatch('updateSector', sector)
            },
            async upgradeTicketNumber() {
                let ticketInfo = this.ticketInfo;
                ticketInfo.ticket_number++;
                ticketInfo.last_updated = moment().format("YYYY-MM-DD HH:mm:ss");
                await this.$store.dispatch("updateGeneralInfo", this.ticketInfo);
            },
            async callNextTicket() {
                let room = this.room;
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
                await this.upgradeTicketNumber();
                await this.$store.dispatch('updateSector', sector)
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

            openSingleView() {
                let room = this.room;
                this.singleViewDialog.room = room;
                this.singleViewDialog.active = true;
            }
        }
    }
</script>