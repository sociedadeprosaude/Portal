import firebase from "firebase";
import functions from "../../utils/functions";

const state = {
};

const mutations = {

};

const actions = {
    async newDaySchedule(context,payload){
        await firebase.firestore().collection('schedules').doc(payload.idSchedule)
                .update({days:payload.days})
    },
    async updateScheduleDays(context,payload){
        await firebase.firestore().collection('schedules').doc(payload.idSchedule)
                .update({days:payload.days})
    },
    async updateSchedulePeriods(context,payload){
        await firebase.firestore().collection('schedules').doc(payload.idSchedule)
                .update({cancelations_schedules:payload.cancelations_schedules})
    },

    async newShedule(context,payload){
        let copy = Object.assign({},payload)
        if(copy.specialty)
            delete copy.specialty.doctors
        delete copy.doctor.specialties
        delete copy.doctor.clinics
        let newDoc = await firebase.firestore().collection('schedules').add(payload)
        console.log(newDoc.id)
    },

    async updateExpirationDate(context,payload){
        await firebase.firestore().collection('schedules').doc(payload.idSchedule)
                .update({expiration_date:payload.expiration_date})
    },

    async deleteSchedule(context,payload){
        await firebase.firestore().collection('schedules').doc(payload).delete()
    }
};

const getters = {


};

export default {
    state,
    mutations,
    actions,
    getters,
}
