<template>
    <v-row class="mt-0 pa-0 mb-0">
        <v-col cols="12" xs="4" v-for="room in rooms" :key="room.name">
            <v-card class="pa-1 mb-n12" v-if="room.doctor" v-show="room.doctor.name === user.name">
                <v-row class="justify-center">
                    <v-col cols="12" class="text-left">
                        <span class="font-weight-black">{{room.name}}: Senhas</span>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-tooltip top v-if="doctorsLoaded">
                            <template v-slot:activator="{ on }">
                                <v-btn
                                        v-on="on"
                                        :disabled="loading"
                                        @click="callNextTicket(room)"
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
                    </v-col>
                </v-row>
                <v-row>
                    <v-col v-if="room.doctor">{{room.doctor.name}}</v-col>
                </v-row>
                <v-row>
                    <v-container class="pa-0">
                        <v-row>
                            <v-col class="pa-0">
                                <span style="font-size: 0.8em">Ultima senha:</span>
                                <br/>
                                <span
                                        v-if="room.tickets.length != 0"
                                >{{room.tickets[room.tickets.length - 1].number}}</span>
                                <span v-else>*</span>
                            </v-col>
                            <v-divider vertical></v-divider>
                            <v-col class="pa-0">
                                <div>
                                    <span style="font-size: 0.8em">Senha atual:</span>
                                    <br/>
                                    <span
                                            v-if="room.tickets.length != 0 && getActualTicket(room.tickets)"
                                    >{{getActualTicket(room.tickets).number}}</span>
                                    <span v-else>*</span>
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        name: "DoctorTicketRoom",
        mounted() {
            // this.$store.dispatch("getTicketsGeneralInfo");
            this.initialInfo();
        },
        data() {
            return {
                doctorsListDialog: {
                    active: false,
                    search: ""
                },
                selectedRoom: {},
                room: {},
                createRoomController: false,
                loading: false,
                success: false,
            };
        },
        computed: {
            rooms() {
                return this.sector ? this.sector.rooms : [];
            },
            roomsLoaded() {
                return this.$store.getters.roomsLoaded;
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
            user(){
                return this.$store.getters.user
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
            sectorName() {
                /*return this.$route.params['sector_name']*/
                return 'Consultorios'
            },
            sector() {
                return this.$store.getters.sectors ? this.$store.getters.sectors.find((sector) => sector.name == this.sectorName) : undefined
            }
        },
        methods: {
            async initialInfo() {
                if (!this.sector) {
                    this.$store.dispatch("getTicketsGeneralInfo");
                    this.$store.dispatch('listenTicketsSectors')
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
            async createRoom(room) {
                this.loading = true;
                const sector = this.sector;
                await this.$store.dispatch("createSectorRoom", {sector, room});
                this.loading = false;
                this.success = true;
                setTimeout(() => {
                    this.success = false;
                }, 1000);
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
                await this.upgradeTicketNumber()
                const sector = this.sector;
                await this.$store.dispatch("updateSectorRoom", {sector, room});
            },
            async generateSectorTicket() {
                let sector = this.sector
                if (!sector.tickets) {
                    sector.tickets = []
                }
                sector.tickets.push({
                    number: this.ticketInfo.ticket_number,
                    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                })
                await this.upgradeTicketNumber()
                await this.$store.dispatch('updateSector', sector)
            },
            async upgradeTicketNumber() {
                let ticketInfo = this.ticketInfo;
                ticketInfo.ticket_number++;
                ticketInfo.last_updated = moment().format("YYYY-MM-DD HH:mm:ss");
                await this.$store.dispatch("updateGeneralInfo", this.ticketInfo);
            },
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

                room.tickets[ticketIndex].called_at = moment().format("YYYY-MM-DD HH:mm:ss");
                const sector = this.sector;
                await this.$store.dispatch("updateSectorRoom", {sector, room});
                this.loading = false
            },
            async callSectorTicket(room) {
                let ticketIndex = this.sector.tickets.findIndex(ticket => {
                    return !ticket.called_at;
                })
                if (ticketIndex < 0) {
                    return
                }
                this.sector.tickets[ticketIndex].called_at = moment().format(
                    "YYYY-MM-DD HH:mm:ss"
                );
                room.tickets.push(this.sector.tickets[ticketIndex])
                const sector = this.sector;
                await this.$store.dispatch("updateSectorRoom", {sector, room});
                this.sector.tickets.splice(ticketIndex, 1)
                await this.$store.dispatch("updateSector", this.sector);

            },
            alertActualTicket(room) {

            },
            openSingleView(room) {
                this.singleViewDialog.room = room;
                this.singleViewDialog.active = true;
            }
        }
    };
</script>

<style scoped>
</style>