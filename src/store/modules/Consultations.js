import firebase, {firestore} from "firebase";
import moment from 'moment'
import axios from 'axios'
import Vue from 'vue'
import functions from "../../utils/functions";

let cloudFunctionInstance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? 'https://us-central1-prosaude-36f66.cloudfunctions.net/'
        : 'https://us-central1-prosaudedev.cloudfunctions.net/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
})

const state = {
    consultations: [],
    consultationsCanceled: [],
    consultationsByDate: {},
    consultationsCreationInfo: {
    },
    consultationsDeletionInfo: {
        // removed: 2,
        // total: 300,
        // day: '2020-03-23'
    },
    loaded: false,
    loading: false
};

const mutations = {
    setConsultations(state, payload) {
        state.consultations = payload
        state.loaded = true
    },
    setConsultationsCanceled(state, payload) {
        state.consultationsCanceled = payload
    },
    setConsultationsLoaded(state, payload) {
        state.loaded = payload
    },
    setConsultationCreationTotalDays(state, payload) {
        state.consultationsCreationInfo.total = payload
    },
    setConsultationCreationDaysCreated(state, payload) {
        Vue.set(state.consultationsCreationInfo, 'created', payload)
        // state.consultationsCreationInfo.created = payload
    },
    setConsultationCreationActualDay(state, payload) {
        Vue.set(state.consultationsCreationInfo, 'day', payload)
        // state.consultationsCreationInfo.day = payload
    },
    setConsultationDeletionInfo(state, payload) {
        state.consultationsDeletionInfo = payload
    },
    setConsultationLoading(state, payload) {
        state.loading = payload
    }
    // setConsultationsByDate(state, payload) {
    //     state.consultationsByDate = payload
    // },
};

const actions = {

    async listenConsultations({commit}, payload) {
        try {
            commit('setConsultationsLoaded', false)
            let consultations = []
            let query = firebase.firestore().collection('consultations')
                .where('date', '>=', payload.start_date)
            if (payload.final_date) {
                query = query.where('date', '<=', payload.final_date)
            }
            if (payload.doctor) {
                query = query.where('doctor.cpf', '==', payload.doctor.cpf)
            }
            commit('setConsultationLoading', true)
            return query.onSnapshot((querySnapshot) => {
                consultations = []
                querySnapshot.forEach((document) => {
                    consultations.push({
                        ...document.data(),
                        id: document.id
                    })
                })
                commit('setConsultations', consultations)
                commit('setConsultationLoading', false)
            })
        } catch (e) {
            throw e
        }
    },

    async getConsultations({commit}, payload) {
        try {
            let consultations = []
            let query = firebase.firestore().collection('consultations')
                .where('date', '>=', payload.start_date)
            if (payload.final_date) {
                query = query.where('date', '<=', payload.final_date)
            }
            if (payload.doctor) {
                query = query.where('doctor.cpf', '==', payload.doctor.cpf)
            }
            let querySnapshot = await query.get()
            consultations = []
            querySnapshot.forEach((document) => {
                consultations.push({
                    ...document.data(),
                    id: document.id
                })
            })
            return consultations
        } catch (e) {
            throw e
        }
    },

    async getConsultationsCanceled({commit}) {//pegar todas as consultas deletadas pela clinica
        try {
            let canceledSnap = await firebase.firestore().collection('canceled').orderBy('date', 'asc')
                .onSnapshot((querySnapshot) => {
                    let consultationsCanceled = []
                    querySnapshot.forEach((document) => {
                        consultationsCanceled.push({
                            ...document.data(),
                            id: document.id
                        })
                    })
                    commit('setConsultationsCanceled', consultationsCanceled)
                })
            /*.get()
        let consultationsCanceled = []
        canceledSnap.forEach(function (document) {
            //console.log(document.data())
            consultationsCanceled.push({
                ...document.data(),
                id: document.id
            })
        })
        console.log(consultationsCanceled)
        commit('setConsultationsCanceled', consultationsCanceled)
        return consultationsCanceled
             */
        } catch (e) {
            throw e
        }
    },

    async createConsultation({commit}, consultation) {
        let startDate = moment(consultation.start_date, 'YYYY-MM-DD')
        let finalDate = moment(consultation.final_date, 'YYYY-MM-DD')
        let daysDiff = finalDate.diff(startDate, 'days')
        let routineId = moment().valueOf()
        functions.removeUndefineds(consultation)
        commit('setConsultationCreationTotalDays', daysDiff)
        for (let i = 0; i <= daysDiff; i++) {
            let day = moment(consultation.start_date, 'YYYY-MM-DD').add(i, 'days')
            commit('setConsultationCreationActualDay', day.format('YYYY-MM-DD'))
            commit('setConsultationCreationDaysCreated', i)
            if (consultation.weekDays.indexOf(day.weekday()) > -1) {
                for (let j = 0; j < consultation.vacancy; j++) {
                    delete consultation.doctor.clinics
                    delete consultation.doctor.specialties
                    delete consultation.specialty.doctors
                    let consultObject = {
                        specialty: consultation.specialty,
                        date: day.format('YYYY-MM-DD') + ' ' + consultation.hour,
                        routine_id: routineId,
                        clinic: consultation.clinic,
                        doctor: consultation.doctor,
                    }
                    await firebase.firestore().collection('consultations').add(consultObject)
                }
            }
        }


        // try {
        //     await cloudFunctionInstance.post('createConsultations', consultation)
        // } catch (e) {
        //     console.log('error', e)
        // }
        // return


        // let startDate = moment(consultation.start_date, 'YYYY-MM-DD')
        // let finalDate = moment(consultation.final_date, 'YYYY-MM-DD')
        // let daysDiff = finalDate.diff(startDate, 'days')
        // let routineId = moment().valueOf()
        // commit('setConsultationCreationTotalDays', daysDiff)
        // for (let i = 0; i <= daysDiff; i++) {
        //     let day = moment(consultation.start_date, 'YYYY-MM-DD').add(i, 'days')
        //     commit('setConsultationCreationActualDay', day.format('YYYY-MM-DD'))
        //     commit('setConsultationCreationDaysCreated', i)
        //     if (consultation.weekDays.indexOf(day.weekday()) > -1) {
        //         for (let j = 0; j < consultation.vacancy; j++) {
        //             delete consultation.doctor.clinics
        //             delete consultation.doctor.specialties
        //             delete consultation.specialty.doctors
        //             let consultObject = {
        //                 specialty: consultation.specialty,
        //                 date: day.format('YYYY-MM-DD') + ' ' + consultation.hour,
        //                 routine_id: routineId,
        //                 clinic: consultation.clinic,
        //                 doctor: consultation.doctor,
        //             }
        //             await firebase.firestore().collection('consultations').add(consultObject)
        //         }
        //     }
        // }
    }
    ,


    async addConsultationAppointmentToUser({commit}, payload) {
        try {
            await firebase.firestore().collection('users').doc(payload.user.cpf).collection('consultations').doc(payload.consultation.id).set(payload.consultation)
            if (payload.consultation.type == "Retorno") {
                await firebase.firestore().collection('users').doc(payload.user.cpf).collection('consultations').doc(payload.consultation.previousConsultation).update({regress: payload.consultation.id})
            }

            if (payload.payment_numberFound) {
                //console.log('Tem que altera intake')
                //Há a necessidade realmente de alterar no intake?
                /* firebase.firestore().collection('users').doc(payload.user.cpf).collection('intakes').doc(payload.payment_numberFound.payment_number)
                .collection('specialties').doc(payload.payment_numberFound.specialty).update({used:true}) */

                firebase.firestore().collection('users').doc(payload.user.cpf).collection('procedures').doc(payload.payment_numberFound.procedureId)
                    .update({
                        status: firebase.firestore.FieldValue.arrayUnion('Agendado'),
                        consultation: payload.consultation.id,
                    })
            } else {
                //Não havendo encontrado um recibo, há a necessidade adicionar uma nova procedure para quando pagar, criar um intake e atualizar o procedure adicionando Consulta paga no array do status
                console.log("Criando procedure")
                firebase.firestore().collection('users').doc(payload.user.cpf).collection('procedures').add(
                    {
                        status: ['Agendado'],
                        startAt: moment().format('YYYY-MM-DD hh:ss'),
                        type: 'Consultation',
                        consultation: payload.consultation.id,
                        specialty: payload.consultation.specialty.name
                    }
                )
            }
        } catch (e) {
            throw e
        }
    }
    ,
    async addUserToConsultation({commit}, payload) {
        try {
            //console.log(payload)
            let obj = payload.consultation.type == "Retorno" ? {
                    user: payload.user,
                    type: payload.consultation.type,
                    status: payload.consultation.status,
                    payment_number: payload.consultation.payment_number,
                    previousConsultation: payload.consultation.previousConsultation
                }
                : {
                    user: payload.user,
                    type: payload.consultation.type,
                    status: payload.consultation.status,
                    payment_number: payload.consultation.payment_number
                }


            await firebase.firestore().collection('consultations').doc(payload.consultation.id).update(obj)
            if (payload.consultation.type == "Retorno") {
                await firebase.firestore().collection('consultations').doc(payload.consultation.previousConsultation).update({regress: payload.consultation.id})
            }
            return (await firebase.firestore().collection('consultations').doc(payload.consultation.id).get()).data()
        } catch (e) {
            throw e
        }
    }
    ,

    async addUserToConsultationReschedule({commit}, payload) {
        try {
            let obj = {
                user: payload.user,
                type: payload.consultation.type,
                status: payload.consultation.status,
                payment_number: payload.consultation.payment_number
            }

            if (payload.consultation.type == "Retorno")
                obj.previousConsultation = payload.consultation.previousConsultation

            await firebase.firestore().collection('consultations').doc(payload.consultation.id).update(obj)
            await firebase.firestore().collection('canceled').doc(payload.consultation.idConsultationCanceled).delete()
            if (payload.consultation.type == "Retorno") {
                await firebase.firestore().collection('consultations').doc(payload.consultation.previousConsultation).update({regress: payload.consultation.id})
            }
        } catch (e) {
            throw e
        }
    }
    ,

    async addConsultationAppointmentToUserReschedule({commit}, payload) {
        try {
            await firebase.firestore().collection('users').doc(payload.user.cpf).collection('consultations').doc(payload.consultation.id).set(payload.consultation)

            if (payload.consultation.type == "Retorno") {
                await firebase.firestore().collection('users').doc(payload.user.cpf).collection('consultations').doc(payload.consultation.previousConsultation).update({regress: payload.consultation.id})
            }


        } catch (e) {
            throw e
        }
    }
    ,

    async updateAppointment({commit}, payload) { //atualizarConsulta
        //console.log(payload)
        try {
            let obj = {
                payment_number: payload.payment_number,
                status: payload.status
            }
            await firebase.firestore().collection('consultations').doc(payload.idConsultation).update(obj)
            await firebase.firestore().collection('users').doc(payload.idPatient).collection('consultations').doc(payload.idConsultation)
                .update(obj)
        } catch (e) {
            throw e
        }
    }
    ,
    async SearchCosultation({commit}) {
        try {
            firebase.firestore().collection('consultations').doc()
        } catch (e) {
            throw e
        }
    }
    ,

    async eraseAppointment({commit}, payload) { // apagarConsulta
        console.log(payload)
        try {
            let FieldValue = firebase.firestore.FieldValue
            await firebase.firestore().collection('consultations').doc(payload.idConsultation).update({
                user: FieldValue.delete()
            })
            await firebase.firestore().collection('users').doc(payload.idPatient).collection('consultations').doc(payload.idConsultation).update({status: 'Cancelado'})

            //Para consultas que são do tipo Retorno
            if (payload.type === 'Retorno') {
                //console.log('É um retorno')
                await firebase.firestore().collection('consultations').doc(payload.previousConsultation).update({
                    regress: FieldValue.delete()
                })
                await firebase.firestore().collection('users').doc(payload.idPatient).collection('consultations').doc(payload.previousConsultation).update({
                    regress: FieldValue.delete()
                })
            } else if (payload.type === "Consulta" && payload.payment_number !== "") {
                /* firebase.firestore().collection('users').doc(payload.idPatient).collection('intakes').doc(payload.payment_number).collection('specialties')
                    .where('name', '==', payload.specialty).get()
                    .then((intake) => {
                        intake.forEach((element) => {
                            firebase.firestore().collection('users').doc(payload.idPatient).collection('intakes').doc(payload.payment_number)
                                .collection('specialties').doc(element.id).update({ used: false })
                            return
                        })
                    }) */


                firebase.firestore().collection('users').doc(payload.idPatient).collection('procedures')
                    .where('consultation', '==', payload.idConsultation).get()
                    .then((procedure) => {
                        procedure.forEach((doc) => {
                            let data = doc.data()
                            console.log(data)
                            console.log('Criando outra procedure', {
                                status: ['Consulta Paga'],
                                payment_number: data.payment_number,
                                startAt: data.startAt,
                                type: 'Consultation',
                                specialty: data.specialty
                            })
                            //Criando outra procedure
                            firebase.firestore().collection('users').doc(payload.idPatient).collection('procedures').add(
                                {
                                    status: ['Consulta Paga'],
                                    payment_number: data.payment_number,
                                    startAt: data.startAt,
                                    type: 'Consultation',
                                    specialty: data.specialty
                                }
                            )

                            firebase.firestore().collection('users').doc(payload.idPatient).collection('procedures').doc(doc.id)
                                .update({status: firebase.firestore.FieldValue.arrayUnion('Consulta Cancelada')})

                            return
                        })
                    })


            }

            //Para consultas do tipo Consulta e possuem um retorno associado. É necessário remover o agendamento do retorno associado
            if (payload.regress != undefined) {

                //console.log('É uma consulta e possui um retorno')

                await firebase.firestore().collection('consultations').doc(payload.regress).update({
                    user: FieldValue.delete(),
                    previousConsultation: FieldValue.delete()
                })
                await firebase.firestore().collection('users').doc(payload.idPatient).collection('consultations').doc(payload.regress).update({status: 'Cancelado'})

            }

        } catch (e) {
            throw e
        }
    }
    ,

    async removeAppointmentForever({commit}, payload) {//apagar consulta de cancelados para semopre.
        //console.log(payload.idConsultation)
        try {
            firebase.firestore().collection('canceled').doc(payload.idConsultation).delete()
        } catch (e) {
            throw e
        }
    }
    ,

    async removeAppointments({commit}, consultations) {
        for (let consultation in consultations) {
            commit('setConsultationDeletionInfo', {
                total: consultations.length,
                day: consultations[consultation].date,
                removed: consultation
            })
            await firebase.firestore().collection('consultations').doc(consultations[consultation].id).delete()
            if (consultations[consultation].user) {
                await firebase.firestore().collection('users').doc(consultations[consultation].user.cpf).collection('consultations').doc(consultations[consultation].id).delete()
                await firebase.firestore().collection('canceled').doc(consultations[consultation].id).set(consultations[consultation])
            }
        }
        commit('setConsultationDeletionInfo', {})
    },

    async removeAppointmentByDay({commit}, payload) { // ApagarTodasAsConsultasDoDiaDoMedico

        let start = moment(payload.start_date, 'YYYY-MM-DD').format('YYYY-MM-DD 00:00');
        let end = moment(payload.final_date, 'YYYY-MM-DD').format('YYYY-MM-DD 23:59');
        //console.log(payload.date)
        console.log("ANTES:", payload)
        payload = functions.removeUndefineds(payload);
        console.log("DEPOIS:", payload)
       try {
            let snapshot = await firebase.firestore().collection('consultations')
                .where('doctor.cpf', "==", payload.doctor.cpf)
                .where('date', ">=", start)
                .where('date', "<=", end)
                .get()


            snapshot.forEach(doc => {

                let dateConsultation = moment(doc.data().date)
                let filterHour = payload.hour ? dateConsultation.format('hh:ss') === payload.hour ? true : false : true
                let filterDayWeek = payload.weekDays ? payload.weekDays.indexOf(dateConsultation.weekday()) > -1 ? true : false : true

                if(filterHour && filterDayWeek)
                    firebase.firestore().collection('consultations').doc(doc.id).delete()

                if (filterHour && filterDayWeek && doc.data().user) {
                    firebase.firestore().collection('users').doc(doc.data().user.cpf).collection('consultations').doc(doc.id).delete()
                    firebase.firestore().collection('canceled').doc(doc.id).set(doc.data())
                }
            })
        } catch (e) {
            throw e
        }
        return
    }
    ,
    setConsultationHour({commit}, payload) {
        return new Promise((resolve, reject) => {
            firebase.firestore().collection('consultations').doc(payload.consultation).get()
                .then((doc) => {
                    if (!doc.data().consultationHour) {
                        firebase.firestore().collection('consultations').doc(payload.consultation).update({consultationHour: payload})
                        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({consultationHour: payload})
                        reject('Não tem!')
                        //console.log('Não tem!')
                    } else {
                        //console.log('Tem sim!',doc.data())
                        resolve(doc.data().consultationHour)
                    }
                })
        })

    }
    ,

    async addProntuarioToConsultation({commit}, payload) {
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({prontuario: payload.prontuario})
    }
    ,

    async addTimesToConsultation({commit}, payload) {
        firebase.firestore().collection('consultations').doc(payload.consultation).update({start_at: payload.start})
        firebase.firestore().collection('consultations').doc(payload.consultation).update({end_at: payload.end})
        firebase.firestore().collection('consultations').doc(payload.consultation).update({duration: payload.durantion})
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({start_at: payload.start})
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({end_at: payload.end})
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({duration: payload.durantion})
    }
};

const getters = {
    consultations(state) {
        return state.consultations
    },
    consultationsCanceled(state) {
        return state.consultationsCanceled
    },
    consultationsLoaded(state) {
        return state.loaded
    },
    consultationsCreationInfo(state) {
        return state.consultationsCreationInfo
    },
    consultationsDeletionInfo(state) {
        return state.consultationsDeletionInfo
    },
    consultationsLoading(state) {
        return state.loading
    }
    // consultationsByDate(state) {
    //     return state.consultationsByDate
    // },
};

export default {
    state,
    mutations,
    actions,
    getters
}
