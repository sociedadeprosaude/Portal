const state = {
    items: [],
};

const mutations = {
    setShoppingCartItems(state, payload) {
        state.items = payload
    },
    addShoppingCartItem(state, payload) {
        state.items.push(payload)
    },
    removeShoppingCartItem(state, payload) {
        state.items.splice(state.items.indexOf(payload), 1)
    },
    clearShoppingCartItens(state) {
        state.items = []
    }
};

const actions = {

};

const getters = {
    getShoppingCartItems(state) {
        return state.items
    },
    getShoppingCartItemsByCategory(state) {
        let consultations = state.items.filter((a) => {
            return a.doctor
        })
        let exams = state.items.filter((a) => {
            return a.clinic
        })
        let packages = state.items.filter((a) => {
            return !a.doctor && !a.clinic
        })
        return {
            consultations: consultations,
            exams: exams,
            packages: packages
        }
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
