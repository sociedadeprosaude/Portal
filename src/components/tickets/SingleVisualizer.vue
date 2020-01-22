<template>
    <v-card class="pa-4" @click="$emit('close')" style="overflow: hidden !important;">
        <v-layout row wrap>
            <v-flex xs4 class="my-4">
                <v-layout row wrap class="fill-height align-start justify-center" style="margin-top: calc(50vh - 124px)">
                    <v-card flat>
                        <v-flex xs12>
                            <img :src="constants.ASSETS.logo" height="124px">
                        </v-flex>
                        <v-flex xs12 class="font-weight-bold" style="font-size: 4em;">
                            Dr. {{doctorName}}
                        </v-flex>
                        <v-flex xs12 class="font-weight-bold" style="font-size: 2em;">
                            {{hour}}
                        </v-flex>
                    </v-card>
                </v-layout>
            </v-flex>
            <v-flex xs8>
                <v-card :style="cardStyleByIndex(index)" :class="['my-4 mx-12 primary white--text', index === 0 ? 'ml-n3' : '']" v-for="(ticket, index) in calledTicketsInOrder"
                        :key="ticket.number">
                    <v-layout row wrap class="align-center justify-center fill-height" :style="cardStyleByIndex(index)">
                        <v-flex xs5 class="font-weight-bold" style="font-size: 4em">
                            <span>{{room.name}}</span>
                        </v-flex>
                        <v-flex xs1 class="text-center">
                            <v-divider vertical></v-divider>
                        </v-flex>
                        <v-flex xs5 class="font-weight-bold" style="font-size: 4em">Senha {{ticket.number}}</v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-card>
</template>

<script>
    import constants from "../../utils/constants";

    export default {
        name: "SingleVisualizer",
        props: ['selectedRoom'],
        mounted() {
            this.clockInterval = setInterval(() => {
                this.$nextTick(() => {
                    this.hour = moment().format('HH:mm')
                })
            }, 1000)
            window.addEventListener('beforeunload', () => {
                clearInterval(this.clockInterval)
            })
        },
        data() {
            return {
                hour: moment().format('HH:mm'),
                clockInterval: undefined,
                constants: constants
            }
        },
        computed: {
            room() {
                return this.$store.getters.rooms.find(room => {
                    return room.name === this.selectedRoom.name
                })
            },
            doctorName() {
                let names = this.room.doctor.name.split(' ')
                let finalName = ''
                for (let name in names) {
                    finalName = finalName + names[name].substring(0, 1) + names[name].substring(1, names[name].length).toLowerCase() + ' '
                }
                return finalName
            },
            calledTicketsInOrder() {
                return this.room.tickets.filter(ticket => {
                    return ticket.called_at
                }).sort((ticketA, ticketB) => {
                    return moment(ticketB.called_at).diff(moment(ticketA.called_at), 'seconds')
                })
            }
        },
        methods: {
            cardStyleByIndex(index) {
                return index === 0 ? 'height: 160px; width: 100%' : 'height: 100px'
            }
        }
    }
</script>

<style scoped>

</style>
