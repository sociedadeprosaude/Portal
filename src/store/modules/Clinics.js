import firebase, {firestore} from "firebase";
import moment from "moment";

const state = {
    clinics: [],
    allClinics: [],
    selectedClinic: null,
    units: [],
    loaded: false,
    unitsLoaded: false,
    covenants: [],
    accontClinics: []

};

const mutations = {
    setClinics(state, payload) {
        state.clinics = payload
        state.loaded = true
    },
    setAccontClinics(state,payload){
        state.accontClinics = payload
    },
    setAllClinics(state, payload) {
        state.allClinics = payload;
    },
    setSelectedClinic(state, payload) {
        state.selectedClinic = payload;
    },
    setUnits(state, payload) {
        state.units = payload
        state.unitsLoaded = true
    },
    setCovenants: (state, payload) => state.covenants = payload,

};

const actions = {

    async getClinics({commit}) {
        firebase.firestore().collection('clinics').onSnapshot(async function (clinicsSnap) {
            let clinics = [];
            clinicsSnap.forEach(function (document) {
                clinics.push({
                    id: document.id,
                    ...document.data()
                });
            });
            commit('setClinics', clinics);
        })
    },

    async addClinic({commit}, clinic) {

        try {
            for (let data in clinic) {
                if (!clinic[data]) {
                    delete clinic[data]
                }
            }
            let clinicRef;
            if (clinic.name) {
                clinicRef = await firebase.firestore().collection('clinics').doc(clinic.name).set(clinic)
            } else {
                clinicRef = await firebase.firestore().collection('clinics').add(clinic)
            }
            return clinicRef
        } catch (e) {
            throw e
        }
    },

    async deleteClinic({}, clinic) {
        try {
            await firebase.firestore().collection('clinics').doc(clinic.name).delete();
            return
        } catch (e) {
            throw e
        }
    },

    async removeExamFromClinic({commit}, payload) {//apagar exames da clinica e clinica do exames
        delete payload.clinic.id
        try {
            firebase.firestore().collection('clinics/' + payload.clinic.name + '/exams').doc(payload.product).delete();
        } catch (e) {
            throw e
        }
    },

    async updateOrSet(context,payload){
        let documentReference = payload.documentReference
        let data = payload.data

        console.log(documentReference)

        let snapshot = await documentReference.get()
        if(snapshot.exists)
            documentReference.update(data)
        else
            documentReference.set(data) 
    },

    async addAppointment(context, payload) {

        let data = {
            name: payload.doctor,
            specialtie: payload.specialtie,
            rules: payload.obs,
            cost: payload.cost,
            price: payload.price,
            payment_method: payload.payment,
            crm: payload.crm,
            cpf: payload.cpf

        };

        let info = {
            name: payload.specialtie,
        };

        let details = {
            id: payload.specialtie,
            name: payload.specialtie,
            cost: payload.cost,
            price: payload.price,
            payment_method: payload.payment,
        };
        delete payload.clinic.id
        let consultation = await firebase.firestore().collection('clinics/' + payload.clinic.name + '/specialties/' + payload.specialtie
            + '/doctors').doc(payload.cpf).get()

        context.dispatch('updateOrSet',{
            documentReference:firebase.firestore().collection('clinics/' + payload.clinic.name + '/specialties/' + payload.specialtie + '/doctors').doc(payload.cpf),
            data: data })

        context.dispatch('updateOrSet',{
                documentReference:firebase.firestore().collection('clinics/' + payload.clinic.name + '/specialties').doc(payload.specialtie),
                data: info })

        context.dispatch('updateOrSet',{
                    documentReference:firebase.firestore().collection('users/' + payload.cpf + '/specialties').doc(payload.specialtie),
                    data: details })

        context.dispatch('updateOrSet',{
                        documentReference: firebase.firestore().collection('users/' + payload.cpf + '/specialties').doc(payload.specialtie).collection('clinics/').doc(payload.clinic.name),
                        data: payload.clinic })
        
        context.dispatch('updateOrSet',{
                    documentReference: firebase.firestore().collection('specialties/' + payload.specialtie + '/doctors').doc(payload.cpf),
                    data: data})

        context.dispatch('updateOrSet',{
                        documentReference: firebase.firestore().collection('specialties/' + payload.specialtie + '/doctors').doc(payload.cpf).collection('clinics/').doc(payload.clinic.name),
                        data: payload.clinic})
    },

    addAppointmentFromDoctors({commit}, payload) {

        //console.log('antes:', payload);

        let data = {
            name: payload.doctor,
            specialtie: payload.specialtie,
            rules: payload.obs,
            cost: payload.cost,
            price: payload.price,
            payment_method: payload.paymentMethod,
            crm: payload.crm,
            cpf: payload.cpf
        };

        //console.log("me mostra formatado:", data)

        let info = {
            name: payload.specialtie,
        };

        firebase.firestore().collection('clinics/' + payload.clinic.name + '/specialties').doc(payload.specialtie)
            .set(info);

        firebase.firestore().collection('clinics/' + payload.clinic.name + '/specialties/' + payload.specialtie + '/doctors')
            .doc(payload.cpf).set(data);

        firebase.firestore().collection('users/' + payload.cpf + '/specialties').doc(payload.specialtie).collection('clinics/')
            .doc(payload.clinic.name).set(payload.clinic);

        //firebase.firestore().collection('specialties/' + payload.specialtie + '/doctors').doc(payload.cpf).set(data);

        firebase.firestore().collection('specialties/' + payload.specialtie + '/doctors').doc(payload.cpf).collection('clinics/')
            .doc(payload.clinic.name).set(payload.clinic);
    },

    deleteAppointment({commit}, payload) {
        //console.log('payload', payload);
        delete payload.clinic.id
        firebase.firestore().collection('clinics/' + payload.clinic.name + '/specialties/' + payload.specialtie + '/doctors').doc(payload.cpf)
            .delete();

        firebase.firestore().collection('specialties/' + payload.specialtie + '/doctors').doc(payload.cpf).collection('clinics/').doc(payload.clinic.name)
            .delete();

        firebase.firestore().collection('users/' + payload.cpf + '/specialties').doc(payload.specialtie).collection('clinics/').doc(payload.clinic.name)
            .delete();
        //firebase.firestore().collection('users/' + payload.cpf + '/specialties').doc(payload.specialtie).delete();
    },

    selectClinic({commit}, payload) {
        commit('setSelectedClinic', payload);

    },
    async CalculedValuePaymentClinic(context, payload) {
        var DataInit=''
        if(!payload.payments){
            DataInit = moment(payload.paymentDay).subtract(1, "months").format("YYYY-MM-DD 00:00:00")
        }
        else{
            DataInit = moment(payload.payments[parseInt(payload.payments.length) - 1].paymentDay).format("YYYY-MM-DD 00:00:00")
        }
        payload.paymentDay = moment(payload.paymentDay).format("YYYY-MM-DD 23:59:59")
        let cost = 0;
        await firebase.firestore().collection('intakes').where('date', '>=', DataInit)
            .where('date', '<=', payload.paymentDay).orderBy('date').get().then((querySnapshot) =>{
                querySnapshot.forEach((doc) =>{
                    if(!doc.data().cancelled_by && doc.data().exams){
                        for(let exam in doc.data().exams){
                            if(doc.data().exams[exam].clinic){
                                if (doc.data().exams[exam].clinic.name === payload.name) {
                                    cost += parseFloat(doc.data().exams[exam].cost)
                                }
                            }
                        }
                    }
                })
        });
        context.commit('setCovenants', cost);
        return cost
    },
    async PayClinic(context, payload){
        var DataInit=''
        if(!payload.payments){
            DataInit = moment(payload.paymentDay).subtract(1, "months").format("YYYY-MM-DD 00:00:00")
        }
        else{
            DataInit = moment(payload.payments[parseInt(payload.payments.length) - 1].paymentDay).format("YYYY-MM-DD 00:00:00")
        }
        payload.paymentDay = moment(payload.paymentDay).format("YYYY-MM-DD 23:59:59")
        let cost = 0;
        await firebase.firestore().collection('intakes').where('date', '>=', DataInit)
            .where('date', '<=', payload.paymentDay).orderBy('date').get().then((querySnapshot) =>{
                querySnapshot.forEach((doc) =>{
                    if(!doc.data().cancelled_by && doc.data().exams){
                        for(let exam in doc.data().exams){
                            if(doc.data().exams[exam].clinic){
                                if (doc.data().exams[exam].clinic.name === payload.name) {
                                    cost += parseFloat(doc.data().exams[exam].cost)
                                }
                            }
                        }
                    }
                })
            });
        await firebase.firestore().collection('clinics').get().then((querySnapsho) =>{
            querySnapsho.forEach((doc) =>{
                if(doc.data().name === payload.name) {
                    var payment= {
                        value: cost,
                        paymentDay: moment().format("YYYY-MM-DD")
                    }
                    var paymentDay= moment(doc.data().paymentDay).add(1,"months").format('YYYY-MM-DD')
                    var paymentDayFormat = moment(paymentDay).format('DD/MM/YYYY')
                    if (!doc.data().payments) {
                        firebase.firestore().collection('clinics').doc(doc.data().name).update({payments: [payment], paymentDay:paymentDay, paymentDayFormat: paymentDayFormat})
                    }
                    else {
                        var payments = doc.data().payments
                        payments.push(payment)
                        var clinic= firebase.firestore().collection('clinics').doc(doc.data().name);
                        var setMerge= clinic.set({
                            payments: payments,
                            paymentDay: paymentDay,
                            paymentDayFormat: paymentDayFormat
                        },{merge:true})
                    }

                }
            })
        })
    },
    async AddPaymentDay(context,payload){
        var clinic= firebase.firestore().collection('clinics').doc(payload.clinic.name);
        var setMerge= clinic.set({
            paymentDay: payload.paymentDay,
            paymentDayFormat: payload.paymentDayFormat
        },{merge:true})
    },
    async loadClinics({commit}) {
        return new Promise((resolve, reject) => {
            let clinics = [];
            firebase.firestore().collection('clinics')
                .onSnapshot((doc) => {
                doc.forEach((doc) => {

                    let specialties = [];
                    let nameClinic = doc.data().name;

                    firebase.firestore().collection('clinics').doc(nameClinic).collection('specialties')
                        .onSnapshot((querySnapshot) => {
                            querySnapshot.forEach((doc) => {

                            let doctors = [];
                            let nameSpecialtie = doc.data().name;

                            firebase.firestore().collection('clinics').doc(nameClinic).collection('specialties').doc(nameSpecialtie).collection('doctors')
                                .onSnapshot((doc) => {
                                    doc.forEach((doc) => {
                                    doctors.push({
                                        cost: doc.data().cost,
                                        cpf: doc.data().cpf,
                                        crm: doc.data().crm,
                                        name: doc.data().name,
                                        payment_method: doc.data().payment_method,
                                        price: doc.data().price,
                                        rules: doc.data().rules,
                                        specialtie: doc.data().specialtie,
                                    });
                                });
                            });

                            specialties.push({
                                name: doc.data().name,
                                doctors: doctors,
                            });

                        });
                    });

                    let exams = [];
                    firebase.firestore().collection('clinics').doc(nameClinic).collection('exams')
                        .onSnapshot((doc) => {
                            doc.forEach((doc) => {
                            exams.push({
                                name: doc.data().name,
                                cost: doc.data().cost,
                                price: doc.data().price,
                                rules: doc.data().rules,
                                obs: doc.data().obs,
                            });
                        });
                    });

                    clinics.push({

                        id: doc.data().id,
                        ...doc.data(),
                        exams: exams,
                        specialties: specialties,
                    });
                });

                commit('setClinics', clinics);

                if (doc) {
                    resolve(doc)
                } else {
                    reject(console.log('erro ao carregar dados das clinicas', doc))
                }
            })
        })
    },
    async getPaymentClinics({commit}){
        let accountsClinics = [];
       firebase.firestore().collection('clinics').get().then((querySnapshot) =>{
           querySnapshot.forEach((doc) => {
               if(!accountsClinics[doc.data().name]){
                   if(!doc.data().payments){
                       accountsClinics[doc.data().name] = {
                           name: doc.data().name,
                           paymentDay: doc.data().paymentDay,
                           paymentDayFormat: doc.data().paymentDayFormat,
                           lastPayment: moment(doc.data().paymentDay).subtract(1, "months")
                       }
                   }
                   else{
                       accountsClinics[doc.data().name] = {
                           name: doc.data().name,
                           paymentDay: doc.data().paymentDay,
                           paymentDayFormat: doc.data().paymentDayFormat,
                           lastPayment: doc.data().payments[parseInt(doc.data().payments.length) - 1].paymentDay

                       }
                   }
               }
           })
           console.log('accontsClinics', accountsClinics)
           commit("setAccontClinics",accountsClinics)
       })
    },
    async getClinicExams(context, clinic) {
        let examSnap = await firebase.firestore().collection('clinics').doc(clinic.id).collection('exams').get()
        let exams = []
        examSnap.forEach((doc) => {
            exams.push(doc.data())
        })
        return exams
    },
    async getClinicSpecialties(context, clinic) {
        let specSnap = await firebase.firestore().collection('clinics').doc(clinic.id).collection('specialties').get()
        let spec = []
        specSnap.forEach((doc) => {
            spec.push(doc.data())
        })
        return spec
    },
    async getProSaudeUnits(context) {
        firebase.firestore().collection('clinics').where('property', '==', true).onSnapshot(clinCollection => {
            let pros = []
            clinCollection.forEach(doc => {
                pros.push(doc.data())
            });
            context.commit('setUnits', pros);
            if (!this.getters.selectedUnit) {
                context.commit('setSelectedUnit', pros[0])
            }
        })
    },
    async setClinProperty(context, clin) {
        if (clin.property) {
            firebase.firestore().collection('clinics').doc(clin.name).update({property: firebase.firestore.FieldValue.delete()})
            return
        }
        firebase.firestore().collection('clinics').doc(clin.name).update({property: true})
    },

};

const getters = {
    clinics(state) {
        return state.clinics
    },
    accontClinics(state){
        return state.accontClinics
    },

    allClinics(state) {
        return state.allClinics;
    },

    selectedClinic(state) {
        return state.selectedClinic;
    },
    units(state) {
        return state.units
    },

    unitsLoaded(state) {
        return state.unitsLoaded
    },

    clinicsLoaded(state) {
        return state.loaded
    },

    covenants(state) {
        return state.covenants;
    },
};

export default {
    state,
    mutations,
    actions,
    getters
}
