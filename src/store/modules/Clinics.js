import firebase, {firestore} from "firebase";
import moment from "moment";
import functions from "../../utils/functions";

const state = {
    clinics: [],
    allClinics: [],
    selectedClinic: null,
    indexClinic : null,
    units: [],
    loaded: false,
    unitsLoaded: false,
    covenants: [],
    accontClinics: [],
    contestValue:[],
    IntakesExamsClinics: [],
    PaidOuttakesExamsClinics: []


};

const mutations = {
    setClinics(state, payload) {
        state.clinics = payload;
        state.loaded = true
    },
    setAccontClinics(state,payload){
        state.accontClinics = payload
    },
    setIntakesExamsClinics(state, payload){
        state.IntakesExamsClinics= payload
    },
    setPaidOuttakesExamsClinics(state, payload){
        state.PaidOuttakesExamsClinics= payload
    },
    setAllClinics(state, payload) {
        state.allClinics = payload;
    },
    setSelectedClinic(state, payload) {
        state.selectedClinic = payload;
    },
    setIndexClinic (state, payload){
        state.indexClinic = payload;
    },
    setUnits(state, payload) {
        state.units = payload;
        state.unitsLoaded = true
    },
    setCovenants: (state, payload) => state.covenants = payload,
    setContestValue: (state, payload) => state.contestValue = payload,


};

const actions = {

    async updateContestValue ({commit}, item) {
        let newListExams = item.exams;
        if (newListExams.length !== 0){
            await firebase.firestore().collection('contestValues').doc(item.intake.id).update({
                "exams": newListExams
            });
        } else {
            await firebase.firestore().collection('contestValues').doc(item.intake.id.toString()).delete();
        }

    },

    async updateNewValueExam ({commit}, item){
        let value = item.newValue.toString();
        await firebase.firestore().collection('intakes').doc(item.intakeId)
            .collection('exams').doc(item.exam.name).update({
                "cost": value,
            });
        await firebase.firestore().collection('clinics').doc(item.clinic)
            .collection('exams').doc(item.exam.name).update({
                "cost": value,
            })
    },

    async getClinics({commit}) {
        firebase.firestore().collection('clinics').onSnapshot(async function (clinicsSnap) {
            let clinics = [];
            clinicsSnap.forEach(function (document) {
                clinics.push({
                    ...document.data()
                });
            });
            functions.removeUndefineds(clinics)
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

    async editClinic({commit}, clinic) {
        try {
            for (let data in clinic) {
                if (!clinic[data]) {
                    delete clinic[data]
                }
            }
            let clinicRef;
            clinicRef = await firebase.firestore().collection('clinics').doc(clinic.name).update(clinic)
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

    async removeExamFromClinic({commit}, payload) {
        delete payload.clinic.id;
        try {
            firebase.firestore().collection('clinics/' + payload.clinic.name + '/exams').doc(payload.product).delete();
        } catch (e) {
            throw e
        }
    },

    async updateOrSet(context,payload){
        let documentReference = payload.documentReference;
        let data = payload.data;

        let snapshot = await documentReference.get();
        if(snapshot.exists)
            documentReference.update(data);
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
        delete payload.clinic.id;
        let consultation = await firebase.firestore().collection('clinics/' + payload.clinic.name + '/specialties/' + payload.specialtie
            + '/doctors').doc(payload.cpf).get();

        context.dispatch('updateOrSet',{
            documentReference:firebase.firestore().collection('clinics/' + payload.clinic.name + '/specialties/' + payload.specialtie + '/doctors').doc(payload.cpf),
            data: data });

        context.dispatch('updateOrSet',{
                documentReference:firebase.firestore().collection('clinics/' + payload.clinic.name + '/specialties').doc(payload.specialtie),
                data: info });

        context.dispatch('updateOrSet',{
                    documentReference:firebase.firestore().collection('users/' + payload.cpf + '/specialties').doc(payload.specialtie),
                    data: details });

        context.dispatch('updateOrSet',{
                        documentReference: firebase.firestore().collection('users/' + payload.cpf + '/specialties').doc(payload.specialtie).collection('clinics/').doc(payload.clinic.name),
                        data: payload.clinic });

        context.dispatch('updateOrSet',{
                    documentReference: firebase.firestore().collection('specialties/' + payload.specialtie + '/doctors').doc(payload.cpf),
                    data: data});

        context.dispatch('updateOrSet',{
                        documentReference: firebase.firestore().collection('specialties/' + payload.specialtie + '/doctors').doc(payload.cpf).collection('clinics/').doc(payload.clinic.name),
                        data: payload.clinic})
    },

    addAppointmentFromDoctors({commit}, payload) {

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

        let info = {
            name: payload.specialtie,
        };

        firebase.firestore().collection('clinics/' + payload.clinic.name + '/specialties').doc(payload.specialtie)
            .set(info);

        firebase.firestore().collection('clinics/' + payload.clinic.name + '/specialties/' + payload.specialtie + '/doctors')
            .doc(payload.cpf).set(data);

        firebase.firestore().collection('users/' + payload.cpf + '/specialties').doc(payload.specialtie).collection('clinics/')
            .doc(payload.clinic.name).set(payload.clinic);


        firebase.firestore().collection('specialties/' + payload.specialtie + '/doctors').doc(payload.cpf).collection('clinics/')
            .doc(payload.clinic.name).set(payload.clinic);
    },

    deleteAppointment({commit}, payload) {
        delete payload.clinic.id;
        firebase.firestore().collection('clinics/' + payload.clinic.name + '/specialties/' + payload.specialtie + '/doctors').doc(payload.cpf)
            .delete();

        firebase.firestore().collection('specialties/' + payload.specialtie + '/doctors').doc(payload.cpf).collection('clinics/').doc(payload.clinic.name)
            .delete();

        firebase.firestore().collection('users/' + payload.cpf + '/specialties').doc(payload.specialtie).collection('clinics/').doc(payload.clinic.name)
            .delete();
    },

    selectClinic({commit}, payload) {
        commit('setSelectedClinic', payload);

    },


    putIndex ({commit}, payload) {
        commit('setIndexClinic', payload);
    },

    async GetReceiptsClinic(context, payload) {
        await firebase.firestore().collection('outtakes').where('cnpj','==',payload.cnpj)
            .where('paid','==',false).where('root','==',false).get().then((querySnapshot) =>{
                let intakes= []
                querySnapshot.forEach((doc) =>{
                    if(!doc.data().cancelled_by && doc.data().exams){
                        let exams= []
                        let patient= doc.data().user.name
                        let intakeNumber= doc.data().intake_id
                        let intakeClinic = {}
                        for(let exam in doc.data().exams) {
                            if (doc.data().exams[exam].clinic.name === payload.name) {
                                if (doc.data().exams[exam].realized === true) {
                                    exams.push({
                                        name: doc.data().exams[exam].name,
                                        price: doc.data().exams[exam].cost,
                                        rules: doc.data().exams[exam].rules,
                                        realized: doc.data().exams[exam].realized,
                                    });
                                }
                            }
                        }
                        if(exams.length !== 0){
                            intakeClinic = {
                                exams: exams,
                                patient: patient,
                                intakeNumber: intakeNumber
                            }
                            intakes.push(intakeClinic)
                        }
                    }
                })
                context.commit('setIntakesExamsClinics',intakes)
                return intakes
            });
    },
    async GetLastReceiptsClinic(context, payload) {
        await firebase.firestore().collection('outtakes').where('cnpj','==',payload.cnpj)
            .where('paid','==',payload.last_payment).where('root','==',false).get().then((querySnapshot) =>{
                let intakes= []
                querySnapshot.forEach((doc) =>{
                    console.log('doc :', doc.data())
                    if(!doc.data().cancelled_by && doc.data().exams){
                        let exams= []
                        let patient= doc.data().user.name
                        let intakeNumber= doc.data().intake_id
                        let intakeClinic = {}
                        for(let exam in doc.data().exams) {
                            if (doc.data().exams[exam].clinic.name === payload.name) {
                                if (doc.data().exams[exam].realized === true) {
                                    exams.push({
                                        name: doc.data().exams[exam].name,
                                        price: doc.data().exams[exam].cost,
                                        rules: doc.data().exams[exam].rules,
                                        realized: doc.data().exams[exam].realized,
                                    });
                                }
                            }
                        }
                        if(exams.length !== 0){
                            intakeClinic = {
                                exams: exams,
                                patient: patient,
                                intakeNumber: intakeNumber
                            }
                            intakes.push(intakeClinic)
                        }
                    }
                })
                return intakes
            });
    },
    async GetAllReceiptsPaidClinic(context, payload) {
        let day = moment().format('YYYY-MM-DD')
        day = moment(day).add(1, 'days').format('YYYY-MM-DD')
        await firebase.firestore().collection('outtakes').where('cnpj','==',payload.cnpj)
            .where('paid','<=',day).where('root','==',false).get().then((querySnapshot) =>{
                let intakes= {}
                querySnapshot.forEach((doc) =>{
                    if(!doc.data().cancelled_by && doc.data().exams){
                        let exams= []
                        let patient= doc.data().user.name
                        let intakeNumber= doc.data().intake_id
                        let intakeClinic = {}
                        for(let exam in doc.data().exams) {
                            if (doc.data().exams[exam].clinic.name === payload.name) {
                                if (doc.data().exams[exam].realized === true) {
                                    exams.push({
                                        name: doc.data().exams[exam].name,
                                        price: doc.data().exams[exam].cost,
                                        rules: doc.data().exams[exam].rules,
                                        realized: doc.data().exams[exam].realized,
                                    });
                                }
                            }
                        }
                        if(exams.length !== 0){
                            intakeClinic = {
                                exams: exams,
                                patient: patient,
                                intakeNumber: intakeNumber,
                                paid: doc.data().paid
                            }
                            if(!intakes[intakeClinic.paid]){
                                intakes[intakeClinic.paid] ={
                                    outtakes: []
                                }
                            }
                            intakes[intakeClinic.paid].outtakes.push(intakeClinic)

                        }
                    }
                })
                context.commit('setPaidOuttakesExamsClinics',intakes)
            });
    },
    async CalculedValuePaymentClinic(context, payload) {
        let cost=0
        let NumberExams=0
        await firebase.firestore().collection('outtakes').where('cnpj','==',payload.cnpj)
            .where('paid','==',false).where('root','==',false).get().then((querySnapshot) =>{
                querySnapshot.forEach((doc) =>{
                    console.log('doc :', doc.data())
                    if(!doc.data().cancelled_by && doc.data().exams){
                        for(let exam in doc.data().exams){
                            if(doc.data().exams[exam].clinic){
                                if ((doc.data().exams[exam].clinic.name === payload.name) && doc.data().exams[exam].realized === true ) {
                                    NumberExams += 1;
                                    cost += parseFloat(doc.data().exams[exam].cost)
                                }
                            }
                        }
                    }
                })
            });
        let clinic = {
            cost: cost,
            NumberExams: NumberExams
        }
        context.commit('setCovenants', cost);
        return clinic
    },

    async PayClinic(context, payload){
        if(!payload.period){
            payload.period = 30
        }
        if(!payload.last_payment){
            await firebase.firestore().collection('clinics').doc(payload.name).update({last_payment: moment().format('YYYY-MM-DD'), period: payload.period})
        }
        else{
            await firebase.firestore().collection('clinics').doc(payload.name).update({last_payment: moment().format('YYYY-MM-DD'), period: payload.period})
        }
        await firebase.firestore().collection('outtakes').where('cnpj','==',payload.cnpj)
            .where('paid','==',false).where('root','==',false).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let outtake= firebase.firestore().collection('outtakes').doc(doc.id);
                    outtake.update({
                        paid: moment().format('YYYY-MM-DD')})
                })
            })
    },

    async AddPaymentDay(context,payload){
        let clinic= firebase.firestore().collection('clinics').doc(payload.clinic.name);
        let setMerge= clinic.set({
            period: payload.period
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

    async getClinicExams(context, clinic) {
        let examSnap = await firebase.firestore().collection('clinics').doc(clinic.id).collection('exams').get()
        let exams = [];
        examSnap.forEach((doc) => {
            exams.push(doc.data())
        });
        return exams
    },

    async getProSaudeUnits(context) {
        firebase.firestore().collection('clinics').where('property', '==', true).onSnapshot(clinCollection => {
            let pros = [];
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
    async addNewContestValue ({commit}, payload){
        console.log('payload: ', payload)
        let clinic = await firebase.firestore().collection('contestValues').doc(payload.numberIntake).get();
        let exams= [];
        if(clinic.data()){
            console.log('clinic.data()', clinic.data())
            for(let exam in clinic.data().exams){
                exams.push(clinic.data().exams[exam])
            }
            exams.push(payload.exams)
            await firebase.firestore().collection('contestValues').doc(payload.numberIntake).update({exams:exams})
        }
        else{
            exams.push(payload.exams)
            await firebase.firestore().collection('contestValues').doc(payload.numberIntake).set(payload)
            await firebase.firestore().collection('contestValues').doc(payload.numberIntake).update({exams:exams})
        }
    },
    async getClinic({commit}, payload){
        let clinicSelected = []
            let clinic = await firebase.firestore().collection('clinics').where("cnpj" ,"==", payload).get()
                clinic.forEach((doc) => {
                    clinicSelected=  doc.data()
            })
        return clinicSelected
    },
    async getIdClinic({commit}, payload){
        let clinicSelected = []
        let clinic = await firebase.firestore().collection('clinics').where("cnpj" ,"==", payload).get()
        clinic.forEach((doc) => {
            clinicSelected= doc.id
        })
        return clinicSelected
    },
    async getContestValue ({commit}){
        await firebase.firestore().collection('contestValues').onSnapshot((querySnapshot) => {
            let ContestValues = [];
            querySnapshot.forEach((document) => {
                ContestValues.push({
                    ...document.data(),
                    id: document.id
                })
            });
            commit('setContestValue', ContestValues)
        })
    }

};

const getters = {
    clinics(state) {
        return state.clinics
    },

    indexClinic (state) {
        return state.indexClinic
    },
    contestValue(state){
        return state.contestValue
    },

    accontClinics(state){
        return state.accontClinics
    },

    allClinics(state) {
        return state.allClinics;
    },
    PaidOuttakesExamsClinics(state) {
        return state.PaidOuttakesExamsClinics;
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
    IntakesExamsClinics(state){
        return state.IntakesExamsClinics
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
