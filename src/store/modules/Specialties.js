import functions from "../../utils/functions";
import firebase, {firestore} from "firebase";
import moment from 'moment'

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
    },
    editSpecialty(state,payload){
        let index = state.specialties.findIndex((specialty)=>specialty.name === payload.name)
        state.specialties[index] = payload
    },
    addSpecialty(state,payload){
        state.specialties.push(payload)
    }
};

const actions = {

    async updateSpecialty({}, specialty) {
        let copySpecialty = Object.assign({},specialty)
        functions.removeUndefineds(copySpecialty)
        let specialtyRef = await firebase.firestore().collection('specialties').doc(copySpecialty.name).update(copySpecialty);
    },

    async editSpecialty({commit}, specialty) {
        specialty = functions.removeUndefineds(specialty);
        await firebase.firestore().collection('specialties').doc(specialty.name).update(specialty)
        commit('editSpecialty',specialty)
    },
    async addSpecialty({commit}, specialty) {
        specialty = functions.removeUndefineds(specialty);
        await firebase.firestore().collection('specialties').doc(specialty.name).set(specialty)
        commit('addSpecialty',specialty)
    },
    async getDoctorSpecialty(context, consultation){
        let specialtieSelect = await firebase.firestore().collection('specialties').doc(consultation.specialty.name).get()
        let specialtie={
            name: consultation.specialty.name,
            cost: specialtieSelect.data().doctors.filter(item =>  item.name === consultation.doctor.name).cost,
            realized: moment().format('YYYY-MM-DD'),
            paid: false
        }
        return specialtie
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
