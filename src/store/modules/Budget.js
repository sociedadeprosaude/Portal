import firebase from "firebase";

const state = {

};

const mutations = {


};

const actions = {
    async AddSale({commit},payload){
        firebase.firestore().collection('intakes').doc(payload.invoice).set(payload)
        /* firebase.firestore().collection('users/' + payload.cpf + '/consultations').set(payload.consultations);
        firebase.firestore().collection('users/' + payload.cpf + '/exams').set(payload.exams);
 */
    }


};

const getters = {


};

export default {
    state,
    mutations,
    actions,
    getters
}
