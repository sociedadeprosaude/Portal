const state = {
    favoriteRoom: '',
    favoriteRoomSection: '',
};

const mutations = {
    setFavoriteRoom: (state, payload) => state.favoriteRoom = payload,

    setFavoriteRoomSection: (state, payload) => state.favoriteRoomSection = payload,
};

const getters = {
    favoriteRoom (state) {
        return state.favoriteRoom
    },
    favoriteRoomSection (state) {
        return state.favoriteRoomSection
    }
};

export default {
    state,
    mutations,
    getters
}