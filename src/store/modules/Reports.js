
import axios from 'axios'
import * as firebase from 'firebase';

const instance = axios.create({
    baseURL: 'http://caixa.instituicaoprosaude.com:82'
})

instance.defaults.headers.common['Accept'] = 'application/json'

const state = {
    infos: [],
    relatorio: [],
    intakesReport: [],
    
}

const mutations = {
    setRelatorio: (state, payload) => state.relatorio = payload,
    setIntakesReport: (state, payload) => state.intakesReport = payload,
   
}

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
                })
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
        let selectedUnit = context.getters.selectedUnit
        let intakesSnap = await firebase.firestore().collection('intakes').where('date', '>=', payload.initialDate)
            .where('date', '<=', payload.finalDate)
            .where('unit.name', '==', selectedUnit.name)
            // .where('colaborator', '>', '')
            .orderBy('date').get()
        let intakes = []
        for (let doc of intakesSnap.docs) {
            if (doc.data().colaborator) {
                intakes.push(doc.data())
            }
        }
        context.commit("setIntakesReport", intakes)
        return intakes
    },

    

    async searchReports(context, payload) {
        payload.dataFinal = payload.dataFinal + ' 24:00:00';
        payload.dataInicio = payload.dataInicio + ' 00:00:00';
        let selectedUnit = context.getters.selectedUnit
        //console.log('data inicial: ', payload.dataInicio);
        //console.log('data final: ', payload.dataFinal);

        let intakesSnap = await firebase.firestore().collection('intakes').where('date', '>=', payload.dataInicio)
            .where('unit.name', '==', selectedUnit.name)
            .where('date', '<=', payload.dataFinal).orderBy('date').get()
        let intakes = []
        for (let doc of intakesSnap.docs) {
            // promises.push(context.dispatch('getIntakeDetails', intakesSnap.docs[doc]))
            intakes.push(doc.data())
        }

        // let intakes = await Promise.all(promises)
        let exams = {};
        let clinics = {};
        let specialties = {};
        let intaker = {};
        let outtakes = [];
        let financialSupport = [];
        let totalCaixa = 0;
        let totalDebido = 0;
        let totalBruto = 0;
        let totalCusto = 0;
        let totalCustoExams = 0;
        let totalCustoEspecialts = 0;
        let totalGanhoExams = 0;
        let totalGanhoEspecialts = 0;
        let totalCredito = 0;
        let totalSaidas = 0;
        let totalTaxaDebito = 0;
        let totalTaxaCredito = 0;
        let quantidadeOuttakes = 0;
        let relatorio = {};

        for (let intake in intakes) {
            if (!intakes[intake].cancelled_by) {
                if (intakes[intake].type === 'financial_support') {
                    financialSupport.push(intakes[intake])
                    continue
                }
                if (intakes[intake]) {
                    let id = (intakes[intake].id).toString()
                    intaker[intakes[intake].id] = {
                        exams: intakes[intake].exams,
                        specialties: intakes[intake].specialties,
                        id: id,
                        cost: intakes[intake].cost,
                        price: intakes[intake].subTotal
                    }
                }
                for (let exam in intakes[intake].exams) {
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
                    totalCustoExams += parseFloat(intakes[intake].exams[exam].cost)
                    totalGanhoExams += parseFloat(intakes[intake].exams[exam].price)
                }


                //ESPECIALIDADES
                for (let specialtie in intakes[intake].specialties) {
                    if (!specialties[intakes[intake].specialties[specialtie].name]) {
                        specialties[intakes[intake].specialties[specialtie].name] = {
                            quantidade: 0,
                            cost: 0,
                            price: 0,
                        }
                    }
                    specialties[intakes[intake].specialties[specialtie].name].quantidade++
                    specialties[intakes[intake].specialties[specialtie].name].cost += parseFloat(intakes[intake].specialties[specialtie].cost),
                        specialties[intakes[intake].specialties[specialtie].name].price += parseFloat(intakes[intake].specialties[specialtie].price)
                    totalCustoEspecialts += parseFloat(intakes[intake].specialties[specialtie].cost),
                        totalGanhoEspecialts += parseFloat(intakes[intake].specialties[specialtie].price)
                }
                if (!intakes[intake].valor) {
                    totalCusto += parseFloat(intakes[intake].cost);
                }
                totalBruto += parseFloat(intakes[intake].total);
                if (intakes[intake].payments) {
                    for (let i = 0; i < intakes[intake].payments.length; i++) {
                        if (intakes[intake].valuesPayments[i] !== '') {

                            if (intakes[intake].payments[i] === 'Dinheiro') {
                                totalCaixa += parseFloat(intakes[intake].valuesPayments[i])
                            }
                            if (intakes[intake].payments[i] === 'Débito') {
                                totalTaxaDebito += ((parseFloat(intakes[intake].total) * 0.0299) / 100)
                                totalDebido += parseFloat(intakes[intake].valuesPayments[i])
                            }
                            if (intakes[intake].payments[i] === 'Crédito') {
                                if (intakes[intake].parcel === 1) {
                                    totalTaxaCredito += ((intakes[intake].valuesPayments[i] * 0.026) / 100)
                                } else if (intakes[intake].parcel === 2) {
                                    totalTaxaCredito += (((intakes[intake].valuesPayments[i] * 0.026) / 100) + ((intakes[intake].valuesPayments[i] * 0.0191) / 100))
                                } else if (intakes[intake].parcel === 3) {
                                    totalTaxaCredito += (((intakes[intake].valuesPayments[i] * 0.026) / 100) + ((intakes[intake].valuesPayments[i] * 0.0254) / 100))
                                } else if (intakes[intake].parcel === 4) {
                                    totalTaxaCredito += (((intakes[intake].valuesPayments[i] * 0.026) / 100) + ((intakes[intake].valuesPayments[i] * 0.0317) / 100))
                                } else if (intakes[intake].parcel === 5) {
                                    totalTaxaCredito += (((intakes[intake].valuesPayments[i] * 0.026) / 100) + ((intakes[intake].valuesPayments[i] * 0.0378) / 100))
                                }
                                totalCredito += parseFloat(intakes[intake].valuesPayments[i])
                            }
                        }
                    }
                }
                else {
                    if (intakes[intake].payment_method === 'Dinheiro') {
                        totalCaixa += parseFloat(intakes[intake].total)
                    }
                    if (intakes[intake].payment_method === 'Débito') {
                        totalTaxaDebito += ((intakes[intake].total * 0.0299) / 100)
                        totalDebido += parseFloat(intakes[intake].total)
                    }
                    if (intakes[intake].payment_method === 'Crédito') {
                        if (intakes[intake].parcel === 1) {
                            totalTaxaCredito += ((intakes[intake].total * 0.026) / 100)
                        } else if (intakes[intake].parcel === 2) {
                            totalTaxaCredito += (((intakes[intake].total * 0.026) / 100) + ((intakes[intake].total * 0.0191) / 100))
                        } else if (intakes[intake].parcel === 3) {
                            totalTaxaCredito += (((intakes[intake].total * 0.026) / 100) + ((intakes[intake].total * 0.0254) / 100))
                        } else if (intakes[intake].parcel === 4) {
                            totalTaxaCredito += (((intakes[intake].total * 0.026) / 100) + ((intakes[intake].total * 0.0317) / 100))
                        } else if (intakes[intake].parcel === 5) {
                            totalTaxaCredito += (((intakes[intake].total * 0.026) / 100) + ((intakes[intake].total * 0.0378) / 100))
                        }
                        totalCredito += parseFloat(intakes[intake].total)
                    }
                }
            }
        }
        let outtakesSnap = await firebase.firestore().collection('outtakes').where('paid', '>=', payload.dataInicio)
            .where('paid', '<=', payload.dataFinal).orderBy('paid').get();
        outtakesSnap.forEach((e) => {
            if (e.data().payments) {
                for (let i = 0; i < e.data().payments.length; i++) {
                    if (e.data().payments[i] === 'Dinheiro') {
                        // if (!outtakes[e.data().category]) {
                        //     outtakes[e.data().category] = {
                        //         quantidade: 0,
                        //         cost: 0,
                        //     }
                        // }
                        // outtakes[e.data().category].quantidade++;
                        quantidadeOuttakes++;
                        // outtakes[e.data().category].cost += parseFloat(e.data().value);
                        outtakes.push({
                            ...e.data(),
                            id: e.id
                        }
                        )
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
        })


        relatorio = {
            unit: selectedUnit,
            specialties: specialties,
            exams: exams,
            clinics: clinics,
            credito: totalCredito,
            debito: totalDebido,
            dinheiro: totalCaixa,
            totalBruto: totalBruto,
            quantidadeOuttakes: quantidadeOuttakes,
            totalCusto: totalCusto,
            totalSaidas: totalSaidas,
            totalTaxaCredito: totalTaxaCredito.toFixed(5),
            totalTaxaDebito: totalTaxaDebito.toFixed(5),
            totalCustoExams: totalCustoExams,
            totalGanhoExams: totalGanhoExams,
            totalCustoEspecialts: totalCustoEspecialts,
            outtakes: outtakes,
            totalGanhoEspecialts: totalGanhoEspecialts,
            intakes: intaker,
            dataInicio: payload.dataInicio,
            dataFinal: payload.dataFinal,
            financialSupportIntakes: financialSupport,
            intakesArray: Object.values(intakes).filter((intake) => {
                return intake.status !== 'cancelled'
            })
        };
        context.commit('setRelatorio', relatorio)
        return relatorio
    }


}

const getters = {
    relatorio(state) {
        return state.relatorio;
    },
    intakesReport: (state) => state.intakesReport,
    intakesWithExam: (state) => state.intakesReport.filter(intake => intake.exams),
}

export default {
    state,
    mutations,
    actions,
    getters
}
