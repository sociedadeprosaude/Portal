import firebase, { firestore } from "firebase";
import moment from "moment";

const state = {
    rooms: undefined,
    roomsLoaded: false,
    generalInfo: {},
    sectors: [],
};

const mutations = {
    setRooms(state, payload) {
        state.rooms = payload;
        state.roomsLoaded = true
    },
    setGeneralInfo(state, payload) {
        state.generalInfo = payload
    },
    setSectors(state, payload) {
        state.sectors = payload;
    }
};

var subscribeRooms = null;

function queryBuilder(clinicName, sectorName, roomName) {
    var query = firebase.firestore().collection('tickets').doc(clinicName);
    if (sectorName) query = query.collection('sectors').doc(sectorName);
    if (roomName) query = query.collection('rooms').doc(roomName);
    return query;
}

const actions = {

    // usados

    async updateRoom(context, room) {
        let selectedClinic = context.getters.selectedUnit;
        await queryBuilder(selectedClinic.name, null, null).doc(room.name).update(room);
    },
    async createSectorRoom(context, payload) {
        let selectedClinic = context.getters.selectedUnit;
        await queryBuilder(selectedClinic.name, payload.sector.sectorName, payload.room.name)
            .set({ name: payload.room.name, tickets: [], doctor: null })
    },
    async listenRooms(context, payload) {
        // adicionado promise pra so mostrar quando tiver carregado as salas
        return new Promise((resolve, reject) => {
            let selectedClinic = context.getters.selectedUnit;
            // parando de ouvir se já tiver ouvindo
            if (subscribeRooms) subscribeRooms();
            subscribeRooms = queryBuilder(selectedClinic.name, payload.sectorName).collection('rooms').onSnapshot((docs) => {
                let rooms = [];
                for (let doc in docs.docs) rooms.push(docs.docs[doc].data())
                context.commit('setRooms', rooms);
                resolve();
            });
        });
    },
    // Configurando os tickets pra atualizarem realTime.
    async getTicketsGeneralInfo(context) {
        let selectedClinic = context.getters.selectedUnit;
        queryBuilder(selectedClinic.name, null).onSnapshot((doc) => {
            context.commit('setGeneralInfo', doc.data());
            let info = doc.data();
            if (!info || !info.ticket_number)
                // Caso pra quando o banco ta vazio.
                context.dispatch('updateGeneralInfo', {
                    ticket_number: 1,
                    last_updated: moment().format('YYYY-MM-DD HH:mm:ss')
                });
        });
    },
    async updateGeneralInfo(context, info) {
        let selectedClinic = context.getters.selectedUnit;
        try {
            await queryBuilder(selectedClinic.name, null).update(info)
        } catch (e) {
            if (e.code === 'not-found') {
                await queryBuilder(selectedClinic.name, null).set(info)
            }
        }
    },

    // desusados

    async createRoom(context, room) {
        let selectedClinic = context.getters.selectedUnit;
        await queryBuilder(selectedClinic.name, null, null).doc(room.name).set(room);
    },
    async updateSectorRoom({ getters }, payload) {
        let selectedClinic = getters.selectedUnit;
        await queryBuilder(selectedClinic.name, payload.sector.sectorName, payload.room.name)
            .update(payload.room);
    },
    async getRooms(context) {
        let selectedClinic = context.getters.selectedUnit;
        queryBuilder(selectedClinic.name, null).collection('rooms').onSnapshot((docs) => {
            let rooms = [];
            for (let doc in docs.docs) rooms.push(docs.docs[doc].data())
            context.commit('setRooms', rooms)
        })
    },








};

const getters = {
    rooms(state) {
        return state.rooms
    },
    getSectors(state) {
        return state.sectors
    },
    roomsLoaded(state) {
        return state.roomsLoaded
    },
    ticketGeneralInfo(state) {
        return state.generalInfo
    },
    getSector(state) {
        return sectorName => state.sectors.find(sector => sector.name == sectorName);
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
