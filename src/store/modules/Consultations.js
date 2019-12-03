import firebase, { firestore } from "firebase";
import moment from 'moment'

const state = {
    consultations: [],
    consultationsByDate: {},
};

const mutations = {
    setConsultations(state, payload) {
        state.consultations = payload
    },
    // setConsultationsByDate(state, payload) {
    //     state.consultationsByDate = payload
    // },
};

const actions = {

    async getConsultations({ commit }) {
        try {
            let consultationsSnap = await firebase.firestore().collection('consultations')
                .where('date', '>=', moment().format('YYYY-MM-DD HH:mm:ss'))
                .where('date', '<=', moment().add(10, 'days').format('YYYY-MM-DD 23:59:59'))
                .get()
            let consultations = []
            let consultationsByDate = {}
            consultationsSnap.forEach(function (document) {
                consultations.push({
                    ...document.data(),
                    id: document.id
                })
                // consultations[document.id] = document.data()
                // let date = document.data().date.split(' ')[0]
                // if (!consultationsByDate[date])
                //     consultationsByDate[date] = {}
                // if (!consultationsByDate[date][document.data().doctor.cpf])
                //     consultationsByDate[date][document.data().doctor.cpf] = []
                // consultationsByDate[date][document.data().doctor.cpf].push({
                //     ...document.data(),
                //     id: document.id
                // })
            })
            // commit('setConsultationsByDate', consultationsByDate)
            commit('setConsultations', consultations)
            return consultations
        } catch (e) {
            throw e
        }
    },
    async getScheduledConsultations({ commit }) {
        try {
            let consultationsSnap = await firebase.firestore().collection('consultations')
                .where('date', '>=', moment().format('YYYY-MM-DD HH:mm:ss'))
                .where('date', '<=', moment().add(10, 'days').format('YYYY-MM-DD 23:59:59'))
                .get()
            let consultations = []
            let consultationsByDate = {}
            consultationsSnap.forEach(function (document) {
                consultations.push({
                    ...document.data(),
                    id: document.id
                })
                // consultations[document.id] = document.data()
                // let date = document.data().date.split(' ')[0]
                // if (!consultationsByDate[date])
                //     consultationsByDate[date] = {}
                // if (!consultationsByDate[date][document.data().doctor.cpf])
                //     consultationsByDate[date][document.data().doctor.cpf] = []
                // consultationsByDate[date][document.data().doctor.cpf].push({
                //     ...document.data(),
                //     id: document.id
                // })
            })
            // commit('setConsultationsByDate', consultationsByDate)
            commit('setConsultations', consultations)
            return consultations
        } catch (e) {
            throw e
        }
    },
    async createConsultation({ commit }, consultation) {
        let startDate = moment(consultation.start_date, 'YYYY-MM-DD')
        let finalDate = moment(consultation.final_date, 'YYYY-MM-DD')
        let daysDiff = finalDate.diff(startDate, 'days')
        let routineId = moment().valueOf()
        for (let i = 0; i <= daysDiff; i++) {
            let day = moment(consultation.start_date, 'YYYY-MM-DD').add(i, 'days')
            if (consultation.weekDays.indexOf(day.weekday()) > -1) {
                for (let j = 0; j < consultation.vacancy; j++) {
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
        return
    },


    async addConsultationAppointmentToUser({ commit }, payload) {
        try {
            await firebase.firestore().collection('users').doc(payload.user.cpf).collection('consultations').doc(payload.consultation.id).set(payload.consultation)
            if (payload.consultation.type == "Retorno") {
                await firebase.firestore().collection('users').doc(payload.user.cpf).collection('consultations').doc(payload.consultation.previousConsultation).update({ regress: payload.consultation.id })
            }
        } catch (e) {
            throw e
        }
    },
    async addUserToConsultation({ commit }, payload) {
        try {

            let obj = payload.consultation.type == "Retorno" ? { 
                user: payload.user, 
                type:payload.consultation.type,
                status:payload.consultation.status,
                previousConsultation: payload.consultation.previousConsultation 
            }
            :{user: payload.user,type:payload.consultation.type,status:payload.consultation.status,}


            await firebase.firestore().collection('consultations').doc(payload.consultation.id).update(obj)
            if (payload.consultation.type == "Retorno") {
                await firebase.firestore().collection('consultations').doc(payload.consultation.previousConsultation).update({ regress: payload.consultation.id })
            }
        } catch (e) {
            throw e
        }
    },
    async updateAppointment({ commit }, payload) { //atualizarConsulta
        console.log(payload)
        try {
            let obj = {
                invoice: payload.invoice,
                status: payload.status
            }
            await firebase.firestore().collection('consultations').doc(payload.idConsultation).update(obj)
            await firebase.firestore().collection('users').doc(payload.idPatient).collection('consultations').doc(payload.idConsultation)
                .update(obj)
        } catch (e) {
            throw e
        }
    },
    async SearchCosultation({ commit }) {
        try {
            firebase.firestore().collection('consultations').doc()
        }
        catch (e) {
            throw e
        }
    },

    async eraseAppointment({ commit }, payload) { // apagarConsulta

        console.log(payload)

        try {
            let FieldValue = firebase.firestore.FieldValue
            await firebase.firestore().collection('consultations').doc(payload.idConsultation).update({
                user: FieldValue.delete()
            })
            await firebase.firestore().collection('users').doc(payload.idPatient).collection('consultations').doc(payload.idConsultation).update({ status: 'Cancelado' })

            //Para consultas que são do tipo Retorno
            if(payload.type === 'Retorno'){
                console.log('É um retorno')
                await firebase.firestore().collection('consultations').doc(payload.previousConsultation).update({
                    regress: FieldValue.delete()
                })
                await firebase.firestore().collection('users').doc(payload.idPatient).collection('consultations').doc(payload.previousConsultation).update({
                    regress: FieldValue.delete()
                })
            }

            //Para consultas do tipo Consulta e possuem um retorno associado. É necessário remover o agendamento do retorno associado
            if(payload.regress != undefined){

                console.log('É uma consulta e possui um retorno')

                await firebase.firestore().collection('consultations').doc(payload.regress).update({
                    user: FieldValue.delete(),
                    previousConsultation:FieldValue.delete()
                })
                await firebase.firestore().collection('users').doc(payload.idPatient).collection('consultations').doc(payload.regress).update({ status: 'Cancelado' })
    
            }

        } catch (e) {
            throw e
        }
    },

};

const getters = {
    consultations(state) {
        return state.consultations
    },
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
