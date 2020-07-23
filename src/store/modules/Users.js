import axios from 'axios'
import firebase, { firestore } from "firebase";
import moment from 'moment'
import functions from "../../utils/functions";
import constants from '@/utils/constants'



function f(arg) {
    return 0
}
String.prototype.replaceAll = String.prototype.replaceAll || function(needle, replacement) {
    return this.split(needle).join(replacement);
};

const state = {
    selectedPatient: undefined,
    selectedDependent: undefined,
    users: [],

};

const mutations = {
    async setSelectedPatient(state, payload) {

        if (payload) {
            localStorage.setItem('patient', payload.cpf);
        }

        let consultations;
        if (payload) {
            await firebase.firestore().collection('users').doc(payload.cpf).collection('consultations')
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

    async userPermissions({commit}, payload) {
        try {
            let updateUserPermissions;
            updateUserPermissions = await firebase.firestore().collection('users').doc(payload.user).update({permissions: payload.permissions})
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

    async getPatient({ }, id) {
        let userDoc = await firestore().collection('users').doc(id.toString()).get();
        return userDoc.data()
    },
    async searchUser({ }, searchFields) {
        let usersRef = firestore().collection('users');
        for (let field in searchFields) {
            if (!searchFields[field] || searchFields[field].length === 0) continue;

            if (field === 'name'){
                usersRef = usersRef.where(field, field === 'name' ? '>=' : '==', searchFields[field].toUpperCase());
                break
            }
            else if (field === 'cpf'){
                searchFields[field] = searchFields[field].replaceAll('.','');
                searchFields[field] = searchFields[field].replace('-','');
                usersRef = usersRef.where(field, field === 'cpf' ? '>=' : '==', searchFields[field]);
                break
            }
            else if (field === 'association_number' ){
                usersRef = usersRef.where('association_number' ,'>=', searchFields[field]);
                break
                }
            else{
                if(field === 'type'){
                    usersRef = usersRef.where('type' ,'==', searchFields[field]);
                    break
                }
            }


        }
        let querySnapshot = await usersRef.limit(30).get();
        let users = [];
        querySnapshot.forEach(function (doc) {
            users.push({
                ...doc.data(),
                id: doc.id
            })
        });
        return users
    },

    thereIsUserCPF({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            try {
                let foundUser = await firebase.firestore().collection('users').doc(payload).get();
                resolve(foundUser.data())
            }catch(e){
                reject(e)
            }
        })

    },
    thereIsUserUID({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            try {
                let foundUser = await firebase.firestore().collection('users').doc(payload).get();
                resolve(foundUser.data())
            }catch(e){
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
        try {

            functions.removeUndefineds(patient);

            let user;
            if (!patient.cpf) {
                patient.cpf = 'RG' + patient.rg
            }
            let foundUser = await firebase.firestore().collection('users').doc(patient.cpf).get();
            if (foundUser.exists) {
                user = await firebase.firestore().collection('users').doc(patient.cpf).update(patient);
                if (foundUser.data().type !== 'PATIENT'){
                    let type = foundUser.data().type.toUpperCase();
                    user = await firebase.firestore().collection('users').doc(patient.cpf).update({
                        type: type
                    })
                }
                
            } else {
                if (patient.type) {
                    patient.type = patient.type.toUpperCase()
                }
                patient.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
                user = await firebase.firestore().collection('users').doc(patient.cpf).set(patient)
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
            return await firebase.firestore().collection('users').doc(payload.user.cpf).set(upd)

        } else {
            upd[payload.field] = payload.value;
            return await firebase.firestore().collection('users').doc(payload.user.cpf).update(upd)
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
            await firebase.firestore().collection('users').doc(user.user.cpf).delete();
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

    updateAccessedTo ({}, payload){
        firebase.firestore().collection('users').doc(payload.id).update({
            accessed_to: payload.accessed_to
        })
        if (payload.addresses && payload.addresses[0] && payload.addresses[0].cep) {
            let newCEP = payload.addresses[0].cep.replace(/[.,-]/g,"").substring(0,5)
            firebase.firestore().collection('statistics').doc('geopoints').collection('users_by_neighborhood')
            .doc(newCEP).collection('monthly_report').doc(moment().format('YYYY-MM'))
            .get().then(doc=>{
                if(doc.exists){
                    doc.ref.update({accessed:firebase.firestore.FieldValue.increment(1)})
                }else{
                    doc.ref.set({accessed:1})
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
