import functions from "../../utils/functions";
import firebase, {firestore} from "firebase";
import moment from 'moment'

const state = {
    selectedSpecialty: null,
};

const mutations = {
    setSelectedSpecialty (state, payload){
        state.selectedSpecialty = payload;
    },

};

const actions = {
    async selectSpecialty ({commit}, specialty) {
        commit('setSelectedSpecialty', specialty)
    }
};

const getters = {
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
