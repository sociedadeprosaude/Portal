<template>
    <v-container>
        <v-layout row wrap>
            <v-flex sm4 xs6>

                <v-tooltip top v-if="doctorsLoaded">
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" class="primary" rounded @click="skipNextTicket">Proxima senha:
                            {{ticketInfo.ticket_number}}
                        </v-btn>
                    </template>
                    <span>Pular próxima senha</span>
                </v-tooltip>
            </v-flex>
            <v-flex sm4 xs6 class="text-right">
                <v-fade-transition mode="out-in">
                    <v-card class="pa-4" v-if="createRoomController">
                        <v-layout row wrap>
                            <v-flex xs8 class="text-left">
                            <span class="my-headline">
                                Adicionar sala
                            </span>
                            </v-flex>
                            <v-flex xs4 class="text-right">
                                <v-btn small class="primary" fab @click="createRoomController = false">
                                    <v-icon>minimize</v-icon>
                                </v-btn>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field
                                        v-model="room.name"
                                        label="Nome da Sala"></v-text-field>
                            </v-flex>
                            <v-flex xs12 class="text-right">
                                <submit-button text="Criar Sala" :loading="loading" :success="success"
                                               @click="createRoom(room)"></submit-button>
                            </v-flex>
                        </v-layout>
                    </v-card>
                    <v-btn v-else rounded class="primary" @click="createRoomController = !createRoomController">
                        Adicionar Sala
                    </v-btn>
                </v-fade-transition>
            </v-flex>
            <v-flex xs12 class="mt-4">
                <v-layout row wrap>
                    <v-flex class="px-2" xs6 sm3 v-for="room in rooms" :key="room.name">
                        <v-card class="pa-4">
                            <v-layout row wrap class="justify-center">
                                <v-flex xs10 class="text-left">
                                    <span class="my-sub-headline">{{room.name}}</span>
                                </v-flex>
                                <v-flex xs12 class="my-2">
                                    <v-layout row wrap>
                                        <v-tooltip top v-if="doctorsLoaded">
                                            <template v-slot:activator="{ on }">
                                                <v-btn
                                                        v-on="on"
                                                        @click="selectedRoom = room, doctorsListDialog.active = true"
                                                        text fab
                                                        x-small class="primary my-2">
                                                    <v-icon>person</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Selecionar médico</span>
                                        </v-tooltip>
                                        <v-progress-circular indeterminate class="primary--text"
                                                             v-else></v-progress-circular>
                                        <v-tooltip top v-if="doctorsLoaded">
                                            <template v-slot:activator="{ on }">
                                                <v-btn v-on="on" @click="generateNextTicket(room)" text fab
                                                       x-small class="primary ml-2 my-2">
                                                    <v-icon>post_add</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Gerar senha</span>
                                        </v-tooltip>
                                        <v-tooltip top v-if="doctorsLoaded">
                                            <template v-slot:activator="{ on }">
                                                <v-btn v-on="on" @click="callNextTicket(room)" text fab
                                                       x-small class="primary ml-2 my-2">
                                                    <v-icon>add_alert</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Chamar próxima senha</span>
                                        </v-tooltip>
                                        <v-tooltip top v-if="doctorsLoaded">
                                            <template v-slot:activator="{ on }">
                                                <v-btn v-on="on" @click="callNextTicket(room)" text fab
                                                       x-small class="primary ml-2 my-2">
                                                    <v-icon>notification_important</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Alertar senha atual</span>
                                        </v-tooltip>
                                        <v-tooltip top v-if="doctorsLoaded">
                                            <template v-slot:activator="{ on }">
                                                <v-btn v-on="on" @click="openSingleView(room)" text fab
                                                       x-small class="primary ml-2 my-2">
                                                    <v-icon>personal_video</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Visualizador único</span>
                                        </v-tooltip>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 v-if="room.doctor">
                                    <span>{{room.doctor.name}}</span>
                                </v-flex>
                                <v-flex xs12 v-if="room.tickets">
                                    <v-layout row wrap>
                                        <v-flex xs5>
                                            <v-layout column wrap>
                                                <span style="font-size: 0.6em">Ultima senha gerada:</span>
                                                <span> {{room.tickets[room.tickets.length - 1].number}}</span>
                                            </v-layout>
                                        </v-flex>
                                        <v-flex xs1>
                                            <v-divider vertical></v-divider>
                                        </v-flex>
                                        <v-flex xs5>
                                            <v-layout column wrap v-if="getActualTicket(room.tickets)">
                                                <span style="font-size: 0.6em">Senha atual:</span>
                                                <span> {{getActualTicket(room.tickets).number}}</span>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-dialog max-width="720px" content-class="bottom-dialog" transition="dialog-bottom-transition"
                  v-model="doctorsListDialog.active">
            <v-card>
                <v-layout row wrap>
                    <v-flex xs12>
                        <span class="my-headline">{{selectedRoom.name}}</span>
                    </v-flex>
                    <v-flex xs12>
                        <v-text-field
                                prepend-icon="search"
                                label="Médico"
                                v-model="doctorsListDialog.search"></v-text-field>
                    </v-flex>
                    <v-flex xs12 class="mt-2" v-for="doctor in doctors" :key="doctor.crm">
                        <v-card flat @click="setDoctorToRoom(selectedRoom, doctor)">
                            <v-divider class="mb-2"></v-divider>
                            <span>{{doctor.name}}</span>
                        </v-card>
                    </v-flex>
                    <v-divider></v-divider>
                </v-layout>
            </v-card>
        </v-dialog>
        <v-dialog v-model="singleViewDialog.active" fullscreen transition="dialog-bottom-transition">
            <single-visualizer @close="singleViewDialog.active = false" :selectedRoom="singleViewDialog.room"></single-visualizer>
        </v-dialog>
    </v-container>
</template>

<script>
    import SubmitButton from "../components/SubmitButton";
    import SingleVisualizer from "../components/tickets/SingleVisualizer";

    export default {
        name: "Tickets",
        components: {
            SubmitButton,
            SingleVisualizer
        },
        mounted() {
            this.$store.dispatch('getTicketsGeneralInfo')
            this.$store.dispatch('getRooms')
        },
        data() {
            return {
                doctorsListDialog: {
                    active: false,
                    search: ''
                },
                selectedRoom: {},
                room: {},
                createRoomController: false,
                loading: false,
                success: false,
                singleViewDialog: {
                    active: false,
                    room: {}
                }
            }
        },
        computed: {
            rooms() {
                return this.$store.getters.rooms
            },
            roomsLoaded() {
                return this.$store.getters.roomsLoaded
            },
            ticketInfo() {
                if (moment(this.$store.getters.ticketGeneralInfo.last_updated).dayOfYear !== moment().dayOfYear) {
                    this.reset()
                }
                return this.$store.getters.ticketGeneralInfo
            },
            doctors() {
                return Object.values(this.$store.getters.doctors).filter(doctor => {
                    return doctor.name.includes(this.doctorsListDialog.search.toUpperCase())
                })
            },
            doctorsLoaded() {
                return this.$store.getters.doctorsLoaded
            }
        },
        methods: {
            getActualTicket(tickets) {
                let calledTickets = tickets.filter(ticket => {
                    return ticket.called_at
                })
                if (calledTickets.length === 0) {
                    return undefined
                }
                return calledTickets[calledTickets.length - 1]
            },
            async createRoom(room) {
                this.loading = true
                await this.$store.dispatch('createRoom', room)
                this.loading = false
                this.success = true
                setTimeout(() => {
                    this.success = false
                }, 1000)
            },
            async setDoctorToRoom(room, doctor) {
                room.doctor = doctor
                this.loading = true
                await this.$store.dispatch('updateRoom', room)
                this.loading = false
            },
            async generateNextTicket(room) {
                let ticketInfo = this.ticketInfo
                if (!room.tickets) {
                    room.tickets = []
                }
                room.tickets.push({
                    number: this.ticketInfo.ticket_number,
                    created_at: moment().format('YYYY-MM-DD HH:mm:ss')
                })
                ticketInfo.ticket_number++
                ticketInfo.last_updated = moment().format('YYYY-MM-DD HH:mm:ss')
                await this.$store.dispatch('updateGeneralInfo', this.ticketInfo)
                await this.$store.dispatch('updateRoom', room)
            },
            async callNextTicket(room) {
                let ticketIndex = room.tickets.findIndex(ticket => {
                    return !ticket.called_at
                })
                if (ticketIndex < 0) {
                    return
                }
                room.tickets[ticketIndex].called_at = moment().format('YYYY-MM-DD HH:mm:ss')
                await this.$store.dispatch('updateRoom', room)
            },
            reset() {
                let ticketInfo = this.ticketInfo
                ticketInfo.ticket_number = 1
                ticketInfo.last_updated = moment().format('YYYY-MM-DD HH:mm:ss')
                this.$store.dispatch('updateGeneralInfo', ticketInfo)
            },
            skipNextTicket() {
                let ticketInfo = this.ticketInfo
                ticketInfo.ticket_number++
                this.$store.dispatch('updateGeneralInfo', ticketInfo)
            },
            openSingleView(room) {
                this.singleViewDialog.room = room
                this.singleViewDialog.active = true
            }
        }
    }
</script>

<style scoped>

</style>
