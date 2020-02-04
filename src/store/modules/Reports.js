import axios from 'axios'
import * as firebase from 'firebase';

const instance = axios.create({
    baseURL: 'http://caixa.instituicaoprosaude.com:82'
})

instance.defaults.headers.common['Accept'] = 'application/json'

const state = {
    infos: [],
    relatorio: []

}

const mutations = {
    setRelatorio(state, payload) {
        //console.log('aqyu')
        state.relatorio = payload;
    }
}

const actions = {
    async getInfos({commit}, payload) {
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
        let intakesSnap = await firebase.firestore().collection('intakes').where('date', '>=', payload.initialDate)
            .where('date', '<=', payload.finalDate)
            // .where('colaborator', '>', '')
            .orderBy('date').get()
        let promises = []
        //console.log('cheguei aqui')
        for (let doc in intakesSnap.docs) {
            if (intakesSnap.docs[doc].data().colaborator) {
                promises.push(context.dispatch('getIntakeDetails', {
                    ...intakesSnap.docs[doc].data(),
                    id: intakesSnap.docs[doc].id
                }))
            }
        }
        let intakes = await Promise.all(promises)
        return intakes
    },

    async searchReports(context, payload) {
        payload.dataFinal = payload.dataFinal + ' 24:00:00';
        payload.dataInicio = payload.dataInicio + ' 00:00:00';
        //console.log('data inicial: ', payload.dataInicio);
        //console.log('data final: ', payload.dataFinal);

        let intakesSnap = await firebase.firestore().collection('intakes').where('date', '>=', payload.dataInicio)
            .where('date', '<=', payload.dataFinal).orderBy('date').get()
        let promises = []
        for (let doc in intakesSnap.docs) {
            promises.push(context.dispatch('getIntakeDetails', intakesSnap.docs[doc]))
        }

        let intakes = await Promise.all(promises)
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
        let totalCustoOuttakes = 0;
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
            if (intakes[intake].type === 'financial_support') {
                financialSupport.push(intakes[intake])
                continue
            }

            //for (let exam in intakes[intake].exams) {
            //  if (!exams[intakes[intake].exams[exam].name]) {
            //     exams[intakes[intake].exams[exam].name] = {
            //    quantidade: 0,
            //    name: intakes[intake].exams[exam].name,
            //    cost: 0,
            //    price: 0
            //  }
            // }
            //console.log('clinica',intakes[intake].exams[exam].clinic.name)
            //exams[intakes[intake].exams[exam].name].quantidade++,
            //    exams[intakes[intake].exams[exam].name].cost += parseFloat(intakes[intake].exams[exam].cost),
            //    exams[intakes[intake].exams[exam].name].price += parseFloat(intakes[intake].exams[exam].price)
            //  totalCustoExams += parseFloat(intakes[intake].exams[exam].cost)
            //  totalGanhoExams += parseFloat(intakes[intake].exams[exam].price)
            // }

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
                        // doctors: {}
                    }
                }
                // if (!specialties[intakes[intake].specialties[specialtie].name].doctors[intakes[intake].specialties[specialtie].doctor.name]) {
                //     specialties[intakes[intake].specialties[specialtie].name].doctors[intakes[intake].specialties[specialtie].doctor.name] = {
                //         quantity: 0,
                //         cost: 0,
                //         price: 0,
                //     }
                // }
                specialties[intakes[intake].specialties[specialtie].name].quantidade++
                // specialties[intakes[intake].specialties[specialtie].name].doctors[intakes[intake].specialties[specialtie].doctor.name].quantity++
                // specialties[intakes[intake].specialties[specialtie].name].doctors[intakes[intake].specialties[specialtie].doctor.name].cost += intakes[intake].specialties[specialtie].cost
                // specialties[intakes[intake].specialties[specialtie].name].doctors[intakes[intake].specialties[specialtie].doctor.name] += intakes[intake].specialties[specialtie].price
                specialties[intakes[intake].specialties[specialtie].name].cost += parseFloat(intakes[intake].specialties[specialtie].cost),
                    specialties[intakes[intake].specialties[specialtie].name].price += parseFloat(intakes[intake].specialties[specialtie].price)
                totalCustoEspecialts += parseFloat(intakes[intake].specialties[specialtie].cost),
                    totalGanhoEspecialts += parseFloat(intakes[intake].specialties[specialtie].price)
            }
            if (!intakes[intake].valor) {
                totalCusto += parseFloat(intakes[intake].cost);
            }
            totalBruto += parseFloat(intakes[intake].total);
            if(intakes[intake].payments){
                for(let i=0; i< intakes[intake].payments.length; i++){
                    if (intakes[intake].payments[i] === 'Dinheiro') {
                        totalCaixa += parseFloat(intakes[intake].valuesPayments[i])
                    }
                    if (intakes[intake].payments[i] === 'Débito') {
                        totalTaxaDebito += ((intakes[intake].total * 0.0299) / 100)
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
            else{
                if (intakes[intake].payment_method === 'Dinheiro') {
                    totalCaixa += intakes[intake].total
                }
                if (intakes[intake].payment_method === 'Débito') {
                    totalTaxaDebito += ((intakes[intake].total * 0.0299) / 100)
                    totalDebido += intakes[intake].total
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
                    totalCredito += intakes[intake].total
                }
            }


        }
        let outtakesSnap = await firebase.firestore().collection('outtakes').where('paid', '>=', payload.dataInicio)
            .where('paid', '<=', payload.dataFinal).orderBy('paid').get();
        outtakesSnap.forEach((e) => {
            for(let i=0; i< e.data().payments.length; i++){
                if (e.data(). e.data().payments[i] === 'Dinheiro') {
                    // if (!outtakes[e.data().category]) {
                    //     outtakes[e.data().category] = {
                    //         quantidade: 0,
                    //         cost: 0,
                    //     }
                    // }
                    // outtakes[e.data().category].quantidade++;
                    quantidadeOuttakes++;
                    // outtakes[e.data().category].cost += parseFloat(e.data().value);
                    totalCustoOuttakes += parseFloat(e.data().valuesPayments[i])
                    outtakes.push(e.data())
                }
            }
        })

        //console.log(exams);
        //console.log(specialties);
        //console.log(totalSaidas)
        //console.log('total custo',totalCusto)
        // console.log('total credito: ',totalCredito)
        // console.log('total debito: ',totalDebido)
        // console.log('total caixa:',totalCaixa)
        // console.log(totalBruto)

        console.log('total Custo', totalCusto)
        console.log('total bruto', totalBruto)
        relatorio = {
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
            totalCustoOuttakes: totalCustoOuttakes,
            outtakes: outtakes,
            totalGanhoEspecialts: totalGanhoEspecialts,
            intakes: intaker,
            dataInicio: payload.dataInicio,
            dataFinal: payload.dataFinal,
            financialSupportIntakes: financialSupport
        };
        context.commit('setRelatorio', relatorio)
        return relatorio
    }


}

const getters = {
    relatorio(state) {
        return state.relatorio;
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
