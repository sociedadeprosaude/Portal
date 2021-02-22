
import axios from 'axios'
import * as firebase from 'firebase';

const instance = axios.create({
    baseURL: 'http://caixa.instituicaoprosaude.com:82'
});

instance.defaults.headers.common['Accept'] = 'application/json'

function outtakeCategoryListDivider(outtake) {
    if ((typeof (outtake.category)) === "object") {
        const valueDivided = outtake.value / outtake.category.length;
        return outtake.category.map((category) => {
            //Tem que ser {...outtake}
            var outtakeDivided = { ...outtake };
            outtakeDivided.value = valueDivided;
            outtakeDivided.category = category;
            return outtakeDivided
        })
    } else if (outtake.specialties || outtake.exams) {
        const exams = Array.isArray(outtake.exams) ? outtake.exams.map((exam) => {
            //Tem que ser {...outtake}
            var outtakeDivided = { ...outtake };
            outtakeDivided.value = exam.cost;
            outtakeDivided.category = exam.name;
            return outtakeDivided
        }) : []
        const specialties = Array.isArray(outtake.specialties) ? outtake.specialties.map((specialty) => {
            //Tem que ser {...outtake}
            var outtakeDivided = { ...outtake };
            outtakeDivided.value = specialty.cost;
            outtakeDivided.category = specialty.name;
            return outtakeDivided
        }) : []
        return [...exams, ...specialties]
    }


    else {
        return [outtake]
    }
}


const state = {
    relatorio: [],
};

const mutations = {
    setRelatorio: (state, payload) => state.relatorio = payload,

};

const actions = {
    async searchReports(context, payload) {
        let intakes = payload.intake
        payload.dataFinal = payload.dataFinal + ' 24:00:00';
        payload.dataInicio = payload.dataInicio + ' 00:00:00';
        intakes = intakes.filter(intake => intake.date >= payload.dataInicio);
        intakes = intakes.filter(intake => intake.date <= payload.dataFinal);
        intakes = intakes.filter(intake => intake.status !== 'cancelled');
        intakes = intakes.filter(intake => intake.clinic[0].name === context.getters.selectedUnit.name)
        let exams = {};
        let clinics = {};
        let specialties = {};
        let intaker = {};
        let outtakes = [];
        let financialSupport = [];
        let quantidadeOuttakes = 0;
        let relatorio = {};
        let doctors = {};
        let consultations = {};
        for (let intake in intakes) {
            intakes[intake].exams= intakes[intake].produts.filter(product => {
                product.name = product.with_product ? product.with_product.name : undefined
                return product.with_product ? product.with_product.type : 'erro'  === 'EXAM'})
            if (!intakes[intake].cancelled_by || intakes[intake].cancelled_by !== null ){
                console.log('entrei')
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
                            exams: {},
                            property: false
                        }
                    }
                    if (intakes[intake].exams[exam].clinic.property === true) {
                        clinics[intakes[intake].exams[exam].clinic.name].property = true
                    }
                    else {
                        clinics[intakes[intake].exams[exam].clinic.name].property = false
                    }
                    if (!clinics[intakes[intake].exams[exam].clinic.name].exams[intakes[intake].exams[exam].name]) {
                        clinics[intakes[intake].exams[exam].clinic.name].exams[intakes[intake].exams[exam].name] = {
                            quantity: 0,
                            cost: 0,
                            price: 0,
                            name: intakes[intake].exams[exam].name,
                            type: ''
                        }
                    }
                    if (intakes[intake].exams[exam].type) {
                        clinics[intakes[intake].exams[exam].clinic.name].exams[intakes[intake].exams[exam].name].type = intakes[intake].exams[exam].type
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
                            quantity: 0,
                            cost: 0,
                            price: 0,
                        }
                    }
                    if (intakes[intake].specialties[specialtie].name == 'CLINICO GERAL' &&
                        intakes[intake].specialties[specialtie].price != 0) {
                        intakes[intake].specialties[specialtie].price = 0;
                        firebase.firestore().collection('intakes').doc((intakes[intake].id).toString()).set(intakes[intake])
                    }
                    specialties[intakes[intake].specialties[specialtie].name].quantity++
                    specialties[intakes[intake].specialties[specialtie].name].cost += parseFloat(intakes[intake].specialties[specialtie].cost);
                    specialties[intakes[intake].specialties[specialtie].name].price += parseFloat(intakes[intake].specialties[specialtie].price)
                }
            }
        }

        relatorio = {
            specialties: specialties,
            exams: exams,
            clinics: clinics,
            quantidadeOuttakes: quantidadeOuttakes,
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
    },

};

const getters = {
    relatorio(state) {
        return state.relatorio;
    },
};

export default {
    state,
    mutations,
    actions,
    getters
}
