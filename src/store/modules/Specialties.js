import firebase from "firebase";
import functions from "../../utils/functions";

const state = {
    specialties: [],
    loaded: false,
    selectedSpecialty: null,
};

const mutations = {

    setSpecialties(state, payload) {
        state.specialties = payload;
    },
    setSpecialtiesLoaded(state, payload) {
        state.loaded = payload
    },
    setSelectedSpecialty (state, payload){
        state.selectedSpecialty = payload;
    }

};

const actions = {

    async updateSpecialty({ commit }, specialty) {

        try {
            for (let data in specialty) {
                if (!specialty[data]) {
                    delete specialty[data]
                }
            }
            let specialtyRef;
            specialtyRef = await firebase.firestore().collection('specialties').doc(specialty.name).update(specialty);
            return specialtyRef
        } catch (e) {
            throw e
        }
    },

    async searchSpecialty(context, search) {

        let specialties = [];
        if (search) {
            specialties = functions.search(search, context.getters.specialties).slice(0, 100)
        }
        return specialties
    },

    async loadSpecialties({ commit }) {
        firebase.firestore().collection('specialties').onSnapshot(async function (data) {
            let allSpecialties = [];
            for (let specDoc in data.docs) {
                let specialty = data.docs[specDoc].data();
                allSpecialties.push({
                    ...specialty,
                    id: specDoc.id,
                });


                commit('setSpecialties', allSpecialties);
            }
            commit('setSpecialtiesLoaded', true);

        })

    },

    async selectSpecialty ({commit}, specialty) {
        commit('setSelectedSpecialty', specialty)
    }


};

const getters = {

    specialties(state) {
        return state.specialties;
    },
    specialtiesLoaded(state) {
        return state.loaded
    },
    selectedSpecialty (state){
        return state.selectedSpecialty
    }

};

export default {
    state,
    mutations,
    actions,
    getters,
}
