import axios from 'axios'
import firebase, { firestore } from "firebase";
import moment from 'moment'
import functions from "../../utils/functions";
import constants from '@/utils/constants'



function f(arg) {
    return 0
}
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
        let patientId = payload.uid ? payload.uid : payload.id
        if (payload) {
            localStorage.setItem('patient', patientId);
        }
        let consultations;
        if (payload) {
            await firebase.firestore().collection('users').doc(patientId).collection('consultations')
                .onSnapshot((querySnapshot) => {
                    consultations = [];
                    querySnapshot.forEach((consultation) => {
                        consultations.push({ ...consultation.data() })
                    });
                    payload = { ...payload, consultations: consultations };
                    state.selectedPatient = payload
                })
        } else {
            state.selectedPatient = payload
        }
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
            let selectedUnit = context.getters.selectedUnit;
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

    async userPermissions({ commit }, payload) {
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
            let selectedUnit = context.getters.selectedUnit;
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

    async getPatient({ }, cpf) {
        let userDoc = await firestore().collection('users')
            .where('cpf', '==', cpf)
            .get();
        let user;
        userDoc.forEach(doc => {
            user = doc.data()
        });
        console.log('user:', user)
        return user
    },

    async searchUser({ }, searchFields) {

        // let usersRef = firestore().collection('users');
        // for (let field in searchFields) {
        //     if (!searchFields[field] || searchFields[field].length === 0) continue;
        //
        //     if (field === 'name'){
        //         usersRef = usersRef.where('name', '>=', searchFields[field].toUpperCase())
        //             // .where('name', '<=', searchFields['name'].toUpperCase()+ '\uf8ff')
        //         break
        //     }
        //     else if (field === 'cpf'){
        //         searchFields[field] = searchFields[field].replaceAll('.','');
        //         searchFields[field] = searchFields[field].replace('-','');
        //         usersRef = usersRef.where(field, '==', searchFields[field]);
        //         break
        //     }
        //     else if (field === 'association_number' ){
        //         usersRef = usersRef.where('association_number' ,'==', searchFields[field]);
        //         break
        //         }
        //     else{
        //         if(field === 'type'){
        //             usersRef = usersRef.where('type' ,'==', searchFields[field]);
        //             break
        //         }
        //     }
        // }
        // let querySnapshot = await usersRef.limit(5).get();
        try {
            let users = (await axios.get('https://us-central1-prosaude-36f66.cloudfunctions.net/requests-searchUser', {
                //  let users = (await axios.get('https://us-central1-prosaudedev.cloudfunctions.net/requests-searchUser', {
                params: searchFields
            })).data
            return users
        } catch (e) {
            throw e
        }
    },

    thereIsUserCPF({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            try {
                let userDoc = await firestore().collection('users')
                    .where('cpf', '==', payload)
                    .get();
                userDoc.forEach(doc => {
                    resolve(doc.data())
                });
            } catch (e) {
                reject(e)
            }
        })
    },
    thereIsUserUID({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            try {
                let foundUser = await firebase.firestore().collection('users').doc(payload).get();
                resolve(foundUser.data())
            } catch (e) {
                reject(e)
            }
        })

    },
    async addClinicUser({ getters }, clinic) {
        try {

            functions.removeUndefineds(clinic);
            if (clinic.type) {
                clinic.type = clinic.type.toUpperCase()
            }
            clinic.created_at = moment().format('YYYY-MM-DD HH:mm:ss');

            let user;
            let foundUser = await firebase.firestore().collection('users').doc(clinic.uid).get();
            if (foundUser.exists) {
                user = await firebase.firestore().collection('users').doc(clinic.uid).update(clinic)
            } else {
                user = await firebase.firestore().collection('users').doc(clinic.uid).set(clinic)
            }

            return user
        } catch (e) {
            throw e
        }
    },

    async addUser({ getters }, patient) {
        console.log('patient:', patient)
        functions.removeUndefineds(patient);
        try {
            let user;
            let id;
            let type;
            let foundUser = await firebase.firestore().collection('users').where('cpf', '==', patient.cpf).get();
            foundUser.docs.forEach(doc => {
                id = doc.id,
                    type = doc.data().type
            });
            console.log('encontrado:', id)
            if (id) {
                //se já existir: collaborator / patient / doctor (passar a ter field uid !== de doc.id)
                if (type === 'COLABORATOR') {
                    patient.type = type
                    user = await firebase.firestore().collection('users').doc(id).update(patient)
                } else { user = await firebase.firestore().collection('users').doc(id).update(patient) }
            } else {
                //novo user : colaborator / patiente
                if (patient.type) {
                    patient.type = patient.type.toUpperCase()
                }
                patient.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
                user = await firebase.firestore().collection('users').add(patient)
            }
            return user
        } catch (e) {
            throw e
        }
    },
    async updateUserField(context, payload) {
        let upd = {};
        if (payload.value === 'pay') {
            for (let advance in payload.user.advances) {
                payload.user.advances[advance].parcel -= 1;
                for (let mes in payload.user.advances[advance].months) {
                    if (payload.date === payload.user.advances[advance].months[mes]) {
                        payload.user.advances[advance].months.splice(mes, 1);
                    }
                }
            }
            upd = payload.user;
            return await firebase.firestore().collection('users').doc(payload.user.uid).set(upd)

        } else {
            upd[payload.field] = payload.value;
            return await firebase.firestore().collection('users').doc(payload.user.uid).update(upd)
        }
    },
    async deleteUser({ }, user) {
        try {
            let adv = 0;
            for (let advance in user.user.advances) {
                for (let mes = 0; mes < user.user.advances[advance].parcel; mes++) {
                    adv += user.user.advances[advance].valueParcel
                }
            }
            await firebase.firestore().collection('users').doc(user.user.uid).delete();
            admin.auth().deleteUser(user.user.uid).then(function () {
            })
                .catch(function (error) {
                    console.log('Error deleting user:', error);
                });

            return
        } catch (e) {
            throw e
        }
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

    updateAccessedTo({ }, payload) {
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
