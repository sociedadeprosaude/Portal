
const state = {
    rooms: undefined,
    roomsLoaded: false,
    generalInfo: {},
};

const mutations = {
    setRooms(state, payload) {
        state.rooms = payload;
        state.roomsLoaded = true
    },
    setGeneralInfo(state, payload) {
        state.generalInfo = payload
    },

};

const getters = {
    rooms(state) {
        return state.rooms
    },
    roomsLoaded(state) {
        return state.roomsLoaded
    },
    ticketGeneralInfo(state) {
        return state.generalInfo
    },

};

export default {
    state,
    mutations,
    getters
}
