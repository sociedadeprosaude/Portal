
import axios from 'axios'
import * as firebase from 'firebase';

const instance = axios.create({
    baseURL: 'http://caixa.instituicaoprosaude.com:82'
});

instance.defaults.headers.common['Accept'] = 'application/json'

const state = {
    infos: [],
    relatorio: [],
    intakesReport: [],

};

const mutations = {
    setRelatorio: (state, payload) => state.relatorio = payload,
    setIntakesReport: (state, payload) => state.intakesReport = payload,

};

const actions = {
    async getInfos({ commit }, payload) {
        instance.get('/api/profits', {
            params: {
                from: payload.start_date.format('YYYY-MM-DD'),
                to: payload.start_date.add(30, 'days').format('YYYY-MM-DD')
            }
        })
            .then(response => {
                commit('addInfo', {
                    ...response.data,
                    data: payload.start_date
                });
                // payload.start_date.add(30, 'days')
                if (payload.final_date.diff(payload.start_date, 'days') > 1) {
                    this.dispatch('getInfos', {
                        start_date: payload.start_date,
                        final_date: payload.final_date
                    })
                }
            })
            .catch(error => {
                console.log(error)
            })
    },
    async getIntakes(context, payload) {
        let selectedUnit = context.getters.selectedUnit;
        let intakesSnap = await firebase.firestore().collection('intakes').where('date', '>=', payload.initialDate)
            .where('date', '<=', payload.finalDate)
            .where('unit.name', '==', selectedUnit.name)
            // .where('colaborator', '>', '')
            .orderBy('date').get();
        let intakes = [];
        for (let doc of intakesSnap.docs) {
            if (doc.data().colaborator) {
                if(payload.colaborator){
                    if(payload.colaborator.name === doc.data().colaborator.name){
                        intakes.push(doc.data())
                    }
                }
                else{
                    intakes.push(doc.data())
                }
            }
        }
        context.commit("setIntakesReport", intakes);
        return intakes
    },



    async searchReports(context, payload) {
        payload.dataFinal = payload.dataFinal + ' 24:00:00';
        payload.dataInicio = payload.dataInicio + ' 00:00:00';
        let selectedUnit = context.getters.selectedUnit;

        let intakesSnap = await firebase.firestore().collection('intakes').where('date', '>=', payload.dataInicio)
            .where('unit.name', '==', selectedUnit.name)
            .where('date', '<=', payload.dataFinal).orderBy('date').get();
        let intakes = [];
        for (let doc of intakesSnap.docs) {
            if (doc.data().colaborator) {
                if(payload.colaborator){

                    if(payload.colaborator === doc.data().colaborator.name){
                        intakes.push(doc.data())
                    }
                }
                else{
                    intakes.push(doc.data())
                }
            }
        }

        let exams = {};
        let clinics = {};
        let specialties = {};
        let intaker = {};
        let outtakes = [];
        let financialSupport = [];
        let quantidadeOuttakes = 0;
        let relatorio = {};
        let doctors = {};
        let consultations= {};

        for (let intake in intakes) {
            if (!intakes[intake].cancelled_by) {
                if (intakes[intake].type === 'financial_support') {
                    financialSupport.push(intakes[intake]);
                    continue
                }
                if (intakes[intake]) {
                    let id = (intakes[intake].id).toString();
                    intaker[intakes[intake].id] = {
                        exams: intakes[intake].exams,
                        specialties: intakes[intake].specialties,
                        id: id,
                        cost: intakes[intake].cost,
                        price: intakes[intake].subTotal
                    }
                }
                for (let exam in intakes[intake].exams) {
                    if (!intakes[intake].exams[exam].clinic) {
                        intakes[intake].exams[exam].clinic = context.getters.selectedUnit;
                        continue
                    }
                    if (!clinics[intakes[intake].exams[exam].clinic.name]) {
                        clinics[intakes[intake].exams[exam].clinic.name] = {
                            quantidade: 0,
                            name: intakes[intake].exams[exam].clinic.name,
                            cost: 0,
                            price: 0,
                            exams: {}
                        }
                    }
                    if (!clinics[intakes[intake].exams[exam].clinic.name].exams[intakes[intake].exams[exam].name]) {
                        clinics[intakes[intake].exams[exam].clinic.name].exams[intakes[intake].exams[exam].name] = {
                            quantity: 0,
                            cost: 0,
                            price: 0
                        }
                    }
                    clinics[intakes[intake].exams[exam].clinic.name].quantidade++
                    clinics[intakes[intake].exams[exam].clinic.name].exams[intakes[intake].exams[exam].name].quantity++
                    clinics[intakes[intake].exams[exam].clinic.name].exams[intakes[intake].exams[exam].name].cost += intakes[intake].exams[exam].cost
                    clinics[intakes[intake].exams[exam].clinic.name].exams[intakes[intake].exams[exam].name].price += intakes[intake].exams[exam].price
                    clinics[intakes[intake].exams[exam].clinic.name].cost += parseFloat(intakes[intake].exams[exam].cost)
                    clinics[intakes[intake].exams[exam].clinic.name].price += parseFloat(intakes[intake].exams[exam].price)
                }

                for (let specialtie in intakes[intake].specialties) {
                    if (!specialties[intakes[intake].specialties[specialtie].name]) {
                        specialties[intakes[intake].specialties[specialtie].name] = {
                            quantidade: 0,
                            cost: 0,
                            price: 0,
                        }
                    }
                    specialties[intakes[intake].specialties[specialtie].name].quantidade++
                    specialties[intakes[intake].specialties[specialtie].name].cost += parseFloat(intakes[intake].specialties[specialtie].cost), specialties[intakes[intake].specialties[specialtie].name].price += parseFloat(intakes[intake].specialties[specialtie].price)
                }
            }
        }
        let outtakesSnap = await firebase.firestore().collection('outtakes').where('paid', '>=', payload.dataInicio)
            .where('paid', '<=', payload.dataFinal)
            .where('unit.name', '==', selectedUnit.name)
            .orderBy('paid').get();
        outtakesSnap.forEach((e) => {
            if (e.data().payments) {
                for (let i = 0; i < e.data().payments.length; i++) {
                    if (e.data().payments[i] === 'Dinheiro') {
                        quantidadeOuttakes++;
                        outtakes.push({
                            ...e.data(),
                            id: e.id
                        })
                    }
                }
            }
            else {
                quantidadeOuttakes++;
                outtakes.push({
                    ...e.data(),
                    id: e.id
                })
            }
        });
        let consultationsSnap= await firebase.firestore().collection('consultations').where('date', '>=', payload.dataInicio)
            .where('date', '<=', payload.dataFinal).orderBy('date').get();
        consultationsSnap.forEach((e) => {
            if(!consultations[e.data().specialty.name]){
                consultations[e.data().specialty.name]= {
                    name: e.data().specialty.name,
                    quantity:0,
                    executed:0,
                    scheduled:0
                }
            }
            if(e.data().consultationHour){
                consultations[e.data().specialty.name].quantity +=1
                consultations[e.data().specialty.name].scheduled +=1
                consultations[e.data().specialty.name].executed +=1

                if (!doctors[e.data().doctor.name]) {
                    doctors[e.data().doctor.name] = {
                        doctor: e.data().doctor,
                        specialties: {},
                        payment: 0,
                        quantityTotal: 0
                    }
                }
                if (!doctors[e.data().doctor.name].specialties[e.data().specialty.name]) {
                    doctors[e.data().doctor.name].specialties[e.data().specialty.name] = {
                        quantity: 0,
                        cost: 0,
                        costOne: 0
                    }
                }
                doctors[e.data().doctor.name].quantityTotal++
                doctors[e.data().doctor.name].specialties[e.data().specialty.name].quantity++
                firebase.firestore().collection('specialties').doc(e.data().specialty.name).
                collection('doctors').doc(e.data().doctor.cpf).get().then( (snap) => {
                    doctors[e.data().doctor.name].specialties[e.data().specialty.name].cost += parseFloat(snap.data().cost.toFixed(2))
                    doctors[e.data().doctor.name].specialties[e.data().specialty.name].costOne = parseFloat(snap.data().cost.toFixed(2))
                    doctors[e.data().doctor.name].payment += parseFloat(snap.data().cost.toFixed(2))
                })
            }
            else{
                consultations[e.data().specialty.name].quantity +=1;
                consultations[e.data().specialty.name].scheduled +=1

            }
        });
        relatorio = {
            unit: selectedUnit,
            specialties: specialties,
            exams: exams,
            clinics: clinics,
            quantidadeOuttakes: quantidadeOuttakes,  //
            outtakes: outtakes,
            intakes: intaker,
            doctors: doctors,
            dataInicio: payload.dataInicio,
            dataFinal: payload.dataFinal,
            consultations: consultations,
            financialSupportIntakes: financialSupport,
            intakesArray: Object.values(intakes).filter((intake) => {
                return intake.status !== 'cancelled'
            })
        };
        context.commit('setRelatorio', relatorio);
        return relatorio
    }


};

const getters = {
    relatorio(state) {
        return state.relatorio;
    },
    intakesReport: (state) => state.intakesReport,
    intakesWithExam: (state) => state.intakesReport.filter(intake => intake.exams),
    intakesWithConsultation: (state) => state.intakesReport.filter(intake => intake.specialties),
};

export default {
    state,
    mutations,
    actions,
    getters
}
