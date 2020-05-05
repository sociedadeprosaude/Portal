import firebase from "firebase";

const state = {
    notification : [],
};

const mutations = {

    setNotification (state, payload){
        state.notification = payload;
    },

};

const actions = {

    async addNotifications ({commit}, data){
        console.log('data: ', data)
        try {
            for (let item in data){
                if (!data[item]) {
                    delete data[item]
                }
            }
            return await firebase.firestore().collection('alerts').doc(data.name).set(data);

        } catch (e) {
            throw e;
        }

    },

    async loadNotifications ({commit}) {

        return new Promise((resolve, reject) => {
            firebase.firestore().collection('alerts').get().then((data) => {

                let notifications = [];
                data.forEach((doc) => {

                   notifications.push({
                       name: doc.data().name,
                       info: doc.data().info,
                       link: doc.data().link,
                       icon: doc.data().icon,
                   });
                });

                commit('setNotification', notifications);

                if (data) resolve (data);
                else reject();
            });
        });
    },

    async deleteNotification ({}, notification) {
        try {
            await firebase.firestore().collection('alerts').doc(notification).delete();
            return
        } catch (e) {
            throw e
        }
    },

};

const getters = {

    notification (state) {
        return state.notification;
    },

};

export default {
    state,
    mutations,
    actions,
    getters
}
