import Vue from 'vue'

const state = {
    items: [],
    bundle: undefined,
};

const mutations = {
    setSelectedBundle(state, payload) {
        //console.log('SetSelectedBudget',payload)
        state.bundle = payload
    },

    setItemsPackage (state, payload) {
        state.items = payload
    },

    addItemsPackage (state, payload) {

        console.log('payload', payload);

        for (let item in state.items) {
            if (state.items[item].name === payload.name) {
                state.items[item] = payload;
                Vue.set(state.items, item, payload);
                return
            }
        }

        state.items.push(payload)
    },

    removeItemsPackage (state, payload) {
        state.items.splice(state.items.indexOf(payload), 1)
    },

    clearItemsPackage (state) {
        state.items = []
    }
};

const actions = {

};


const getters = {

    selectedBundle (state) {
        return state.bundle
    },

    getItemsPackage (state) {
        return state.items
    },

    getItemsPackageByCategory(state) {

        let exams = state.items.filter((a) => {
            return a.clinic
        });

        /*
        let consultations = state.items.filter((a) => {
            return a.doctor
        });
        let packages = state.items.filter((a) => {
            return !a.doctor && !a.clinic
        });
        */

        return {
            exams: exams,
            //consultations: consultations,
            //packages: packages
        }
    }

};

export default {
    state,
    mutations,
    actions,
    getters
}
