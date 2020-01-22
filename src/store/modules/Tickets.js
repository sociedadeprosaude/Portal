import firebase, {firestore} from "firebase";
import moment from "moment";

const state = {
    rooms: undefined,
    roomsLoaded: false,
    generalInfo: {}
}

const mutations = {
    setRooms(state, payload) {
        state.rooms = payload
        state.roomsLoaded = true
    },
    setGeneralInfo(state, payload) {
        state.generalInfo = payload
    },
}

const actions = {

    async createRoom(context, room) {
        let selectedClinic = context.getters.selectedUnit
        await firebase.firestore().collection('tickets').doc(selectedClinic.name).collection('rooms').doc(room.name).set(room)
    },
    async updateRoom(context, room) {
        let selectedClinic = context.getters.selectedUnit
        await firebase.firestore().collection('tickets').doc(selectedClinic.name).collection('rooms').doc(room.name).update(room)
    },
    async getRooms(context) {
        let selectedClinic = context.getters.selectedUnit
        firebase.firestore().collection('tickets').doc(selectedClinic.name).collection('rooms').onSnapshot((docs) => {
            let rooms = []
            for(let doc in docs.docs) {
                rooms.push(docs.docs[doc].data())
            }
            context.commit('setRooms', rooms)
        })
    },
    async getTicketsGeneralInfo(context) {
        let selectedClinic = context.getters.selectedUnit
        firebase.firestore().collection('tickets').doc(selectedClinic.name).onSnapshot((doc) => {
            context.commit('setGeneralInfo', doc.data())
            let info = doc.data()
            if (!info || !info.ticket_number) {
                info = {
                    ticket_number: 1,
                    last_updated: moment().format('YYYY-MM-DD HH:mm:ss')
                }
                // info.date = moment().format('YYYY-MM-DD HH:mm:ss')
            }
            context.dispatch('updateGeneralInfo', info)
        })
    },
    async updateGeneralInfo(context, info) {
        let selectedClinic = context.getters.selectedUnit
        try {
            await firebase.firestore().collection('tickets').doc(selectedClinic.name).update(info)
        } catch (e) {
            if (e.code === 'not-found') {
                await firebase.firestore().collection('tickets').doc(selectedClinic.name).set(info)
            }
        }
    },
}

const getters = {
    rooms (state) {
        return state.rooms
    },
    roomsLoaded(state) {
        return state.roomsLoaded
    },
    ticketGeneralInfo(state) {
        return state.generalInfo
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
