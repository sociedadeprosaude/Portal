import axios from 'axios'
import firebase, { firestore } from "firebase";
import moment from 'moment'

String.prototype.replaceAll = String.prototype.replaceAll || function (needle, replacement) {
    return this.split(needle).join(replacement);
};

const state = {
    selectedPatient: undefined,
    selectedDependent: undefined,
    users: [],

};

const mutations = {
    async setSelectedPatient(state, payload) {
        if (payload)
            localStorage.setItem('patient', payload.id)
        state.selectedPatient = payload
    },
    setSelectedDependent(state, payload) {
        state.selectedDependent = payload
    },

    clearSelectedDependent(state) {

        state.selectedDependent = undefined
    },
    setUsers: (state, payload) => state.users = payload,

};

const actions = {
    async getUsers(context, payload) {
        try {
            let query = firebase.firestore().collection('users');
            let usersSnap = [];
            if (payload) {
                if (payload.initialDate) {
                    query = query.where('created_at', '>=', payload.initialDate)
                }
                if (payload.finalDate) {
                    query = query.where('created_at', '<=', payload.finalDate)
                }
                if (payload.type) {
                    query = query.where('type', '==', payload.type)
                }
                query = query.orderBy('created_at');
            }
            usersSnap = await query.get();
            let users = [];
            usersSnap.forEach(doc => {
                users.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            context.commit("setUsers", users);
        } catch (e) {
            console.log(e)
        }
    },

    async userPermissions(payload) {
        try {
            let updateUserPermissions;
            updateUserPermissions = await firebase.firestore().collection('users').doc(payload.user).update({ permissions: payload.permissions })
            return updateUserPermissions
        } catch (e) {
            throw e
        }
    },

    async getTodayUsers(context, payload) {
        try {
            let query = firebase.firestore().collection('users');
            let usersSnap = [];
            if (payload) {
                if (payload.initialDate) {
                    query = query.where('created_at', '>=', payload.initialDate)
                }
                if (payload.finalDate) {
                    query = query.where('created_at', '<=', payload.finalDate)
                }
                if (payload.type) {
                    query = query.where('type', '==', payload.type)
                }
                query = query.orderBy('created_at');
            }
            usersSnap = await query.get();
            let users = [];
            usersSnap.forEach(doc => {
                users.push({
                    id: doc.id,
                    ...doc.data()
                })
            });
            return users;
        } catch (e) {
            console.log(e)
        }
    },

    async getPatient(cpf) {
        let userDoc = await firestore().collection('users')
            .where('cpf', '==', cpf)
            .get();
        let user;
        userDoc.forEach(doc => {
            user = {
                ... doc.data(),
                id:doc.id
            }

        });
        return user
    },
    async getPatients( payload) {
        firebase.firestore().collection('users').doc(payload.cpf).update({
            "neo4j_id": payload.id
        })
            .then(function() {
                console.log("Atualizando neo4j_id");
            }).catch(() => {
                console.log('erro na atualizacao')
        })

    },

    async searchUser(searchFields) {
        try {
            let users = (await axios.get('https://us-central1-prosaude-36f66.cloudfunctions.net/requests-searchUser', {
                params: searchFields
            })).data
            return users
        } catch (e) {
            throw e
        }
    },
    thereIsUserUID(payload) {
        return new Promise(async (resolve, reject) => {
            try {
                let foundUser = await firebase.firestore().collection('users').doc(payload).get();
                resolve(foundUser.data())
            } catch (e) {
                reject(e)
            }
        })

    },
    async setSelectedPatient({ commit }, payload) {
        commit('setSelectedPatient', payload);
    },
    async searchUserFromOldDatabase(context, numAss) {

        let url = 'https://caixa.sociedadeprosaude.com/api/api/buscar/paciente?field=sequencia&query=' + numAss /*00060009*/
        let res = await axios.get(url);

        return res.data[0]
    },

    setSelectedDependent({ commit }, payload) {
        commit('setSelectedDependent', payload)
    },

    updateAccessedTo( payload) {
        firebase.firestore().collection('users').doc(payload.id).update({
            accessed_to: payload.accessed_to
        })
        if (payload.addresses && payload.addresses[0] && payload.addresses[0].cep) {
            let newCEP = payload.addresses[0].cep.replace(/[.,-]/g, "").substring(0, 5)
            firebase.firestore().collection('statistics').doc('geopoints').collection('users_by_neighborhood')
                .doc(newCEP).collection('monthly_report').doc(moment().format('YYYY-MM'))
                .get().then(doc => {
                    if (doc.exists) {
                        doc.ref.update({ accessed: firebase.firestore.FieldValue.increment(1) })
                    } else {
                        doc.ref.set({ accessed: 1 })
                    }
                })

        }
    },
};

const getters = {
    selectedPatient(state) {
        return state.selectedPatient
    },
    selectedDependent(state) {
        return state.selectedDependent
    },
    users(state) {
        return state.users;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
