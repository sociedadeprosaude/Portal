import axios from 'axios'
import firebase, { firestore } from "firebase";
import moment from 'moment'
import functions from "../../utils/functions";
import admin from "firebase-admin";
import constants from '@/utils/constants'
admin.initializeApp(constants.FIREBASE_CONFIG);


function f(arg) {
    return 0
}

const state = {
    selectedPatient: undefined,
    selectedDependent: undefined,

};

const mutations = {
    async setSelectedPatient(state, payload) {
        var consultations;
        if (payload) {
            await firebase.firestore().collection('users').doc(payload.cpf).collection('consultations')
                .onSnapshot((querySnapshot) => {
                    consultations = [];
                    querySnapshot.forEach((consultation) => {
                        consultations.push({ ...consultation.data() })
                    });
                    payload = { ...payload, consultations: consultations }
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

};

const actions = {
    // async updateUsers() {
    //     let usersSnap = await firestore().collection('users').get()
    //     usersSnap.forEach((doc) => {
    //         let user = doc.data()
    //         firestore().collection('users').doc(user.cpf).update({type: user.type.toUpperCase()})
    //     })
    // },

    async getPatient({}, id) {
        let userDoc = await firestore().collection('users').doc(id.toString()).get()
        return userDoc.data()
    },
    async searchUser({}, searchFields) {
        let usersRef = firestore().collection('users');

        for (let field in searchFields) {
            if (!searchFields[field] || searchFields[field].length === 0) continue;
            usersRef = usersRef.where(field, field === 'name' ? '>=' : '==', searchFields[field].toUpperCase())
        }
        let querySnapshot = await usersRef.limit(30).get();
        let users = [];
        querySnapshot.forEach(function (doc) {
            // if (doc.data().association_number) {
            users.push({
                ...doc.data(),
                id: doc.id
            })
            // }
        });
        return users
    },
   /*  async gambiarra({ commit, getters }, searchFields) {
        let usersRef = firestore().collection('users').where('type','==','PATIENT');
        console.log('Vai buscar')
        //usersRef.where('type','==','PATIENT')
        let querySnapshot = await usersRef.get();
        let users = [];
        querySnapshot.forEach(function (doc) {
           let data = doc.data()
           if(data.dependents){

                data.dependents.forEach((dep)=>{
                        console.log('Nome do responsável:' + data.name + '-> Dependente' + dep.name)

                })
            }
        });
        console.log('Buscou')
        return users
    }, */
    thereIsUserCPF({commit},payload){
        return new Promise(async (resolve,reject)=>{
            try{
                let foundUser = await firebase.firestore().collection('users').doc(payload).get();
                resolve(foundUser.data())
            }catch(e){
                reject(e)
            }
        })

    },
    async addUser({ getters }, patient) {
        try {

            functions.removeUndefineds(patient);
            if (patient.type) {
                patient.type = patient.type.toUpperCase()
            }
            patient.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
            // if (patient.type === 'PATIENT') {
            //     patient.association_number = getters.associated.quantity
            // }

            let user;
            if (!patient.cpf) {
                patient.cpf = 'RG' + patient.rg
            }
            // let identifier = patient.cpf ? patient.cpf : 'RG' + patient.rg
            let foundUser = await firebase.firestore().collection('users').doc(patient.cpf).get();
            if (foundUser.exists) {
                // delete patient.type
                user = await firebase.firestore().collection('users').doc(patient.cpf).update(patient)
            } else {
                user = await firebase.firestore().collection('users').doc(patient.cpf).set(patient)
            }

            return user
        } catch (e) {
            throw e
        }
    },
    async updateUserField(context, payload) {
        let upd = {};
        console.log('payload: ', payload);
        if (payload.value === 'pay') {
            for(let advance in payload.user.advances){
                console.log('advance: ', payload.user.advances[advance]);
                payload.user.advances[advance].parcel -=1;
                for(let mes in payload.user.advances[advance].months){
                    if(payload.date === payload.user.advances[advance].months[mes]){
                        payload.user.advances[advance].months.splice(mes,1);
                    }
                }
            }
            upd= payload.user
            console.log('upd: ',upd)
            return await firebase.firestore().collection('users').doc(payload.user.cpf).set(upd)

        } else {
            console.log('entrei aqui')
            upd[payload.field] = payload.value
            console.log('upd: ', upd)
            return await firebase.firestore().collection('users').doc(payload.user.cpf).update(upd)
        }
    },
    async deleteUser({}, user) {
        try {
            console.log('user :',user);
            let adv= 0;
            for(let advance in user.user.advances) {
                console.log('advance: ', user.user.advances[advance]);
                for (let mes=0 ; mes< user.user.advances[advance].parcel; mes++) {
                    console.log('numero de parcelas');
                    adv += user.user.advances[advance].valueParcel
                }
            }
            console.log('adv:', adv);
            console.log('uid:', user.user.uid);
            await firebase.firestore().collection('users').doc(user.user.cpf).delete();
            admin.auth().deleteUser(user.user.uid).then(function() {
                console.log('Successfully deleted user');
            })
                .catch(function(error) {
                    console.log('Error deleting user:', error);
                });
            //var usuario =firebase.auth(user.user.uid)
            //console.log('usuario: ',usuario)

            //var user = firebase.auth().currentUser;
            //user.delete().then(function() {
                // User deleted.
            //}).catch(function(error) {
                // An error happened.
           // });
            return
        } catch (e) {
            throw e
        }
    },
    async setSelectedPatient({ commit }, payload) {
        commit('setSelectedPatient', payload)
        // if (payload.name) this.dispatch('getPatientProntuario', payload)
    },
    async searchUserFromOldDatabase(context, numAss) {

        let url = 'https://caixa.sociedadeprosaude.com/api/api/buscar/paciente?field=sequencia&query=' + numAss /*00060009*/
        let res = await axios.get(url);

        return res.data[0]
    },

    setSelectedDependent({ commit }, payload) {
        commit('setSelectedDependent', payload)
    }
};

const getters = {
    selectedPatient(state) {
        return state.selectedPatient
    },
    selectedDependent(state) {
        return state.selectedDependent
    },
};

export default {
    state,
    mutations,
    actions,
    getters
}
