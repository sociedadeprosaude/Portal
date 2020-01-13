import firebase, { firestore } from "firebase";
import moment from 'moment'

const state = {
    consultations: [],
    consultationsCanceled: [],
    consultationsByDate: {},
};

const mutations = {
    setConsultations(state, payload) {
        state.consultations = payload
    },
    setConsultationsCanceled(state, payload) {
        state.consultationsCanceled = payload
    },
    // setConsultationsByDate(state, payload) {
    //     state.consultationsByDate = payload
    // },
};

const actions = {

    async getConsultations({ commit }, payload) {
        try {
            let consultations = []
            let query = firebase.firestore().collection('consultations')
                .where('date', '>=', payload.start_date)
                .where('date', '<=', payload.final_date)
            if(payload.doctor) {
                query.where('doctor.cpf', '==', payload.doctor.cpf)
            }
            await query.onSnapshot((querySnapshot) => {
                    consultations = []
                    querySnapshot.forEach((document) => {
                        consultations.push({
                            ...document.data(),
                            id: document.id
                        })
                    })
                    commit('setConsultations', consultations)
                })
            return consultations
        } catch (e) {
            throw e
        }
    },

    async getConsultationsCanceled({ commit }) {//pegar todas as consultas deletadas pela clinica
        try {
            let canceledSnap = await firebase.firestore().collection('canceled').orderBy('date','asc')
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

    async createConsultation({ commit }, consultation) {
        let startDate = moment(consultation.start_date, 'YYYY-MM-DD')
        let finalDate = moment(consultation.final_date, 'YYYY-MM-DD')
        let daysDiff = finalDate.diff(startDate, 'days')
        let routineId = moment().valueOf()
        for (let i = 0; i <= daysDiff; i++) {
            let day = moment(consultation.start_date, 'YYYY-MM-DD').add(i, 'days')
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
        return
    },


    async addConsultationAppointmentToUser({ commit }, payload) {
        try {
            await firebase.firestore().collection('users').doc(payload.user.cpf).collection('consultations').doc(payload.consultation.id).set(payload.consultation)
            if (payload.consultation.type == "Retorno") {
                await firebase.firestore().collection('users').doc(payload.user.cpf).collection('consultations').doc(payload.consultation.previousConsultation).update({ regress: payload.consultation.id })
            }

            if (payload.payment_numberFound) {
                //console.log('Tem que altera intake')
                //Há a necessidade realmente de alterar no intake?
                /* firebase.firestore().collection('users').doc(payload.user.cpf).collection('intakes').doc(payload.payment_numberFound.payment_number)
                .collection('specialties').doc(payload.payment_numberFound.specialty).update({used:true}) */

                firebase.firestore().collection('users').doc(payload.user.cpf).collection('procedures').doc(payload.payment_numberFound.procedureId)
                    .update({ status: firebase.firestore.FieldValue.arrayUnion('Consulta Agendada'), consultation: payload.consultation.id,})
            } else {
                //Não havendo encontrado um recibo, há a necessidade adicionar uma nova procedure para quando pagar, criar um intake e atualizar o procedure adicionando Consulta paga no array do status
                console.log("Criando procedure")
                firebase.firestore().collection('users').doc(payload.user.cpf).collection('procedures').add(
                    {
                        status: ['Consulta Agendada'],
                        startAt: moment().format('YYYY-MM-DD hh:ss'),
                        type: 'Consultation',
                        consultation: payload.consultation.id,
                    }
                )
            }
        } catch (e) {
            throw e
        }
    },
    async addUserToConsultation({ commit }, payload) {
        try {
            //console.log(payload)
            let obj = payload.consultation.type == "Retorno" ? {
                user: payload.user,
                type: payload.consultation.type,
                status: payload.consultation.status,
                payment_number: payload.consultation.payment_number,
                previousConsultation: payload.consultation.previousConsultation
            }
                : { user: payload.user, type: payload.consultation.type, status: payload.consultation.status, payment_number: payload.consultation.payment_number }


            await firebase.firestore().collection('consultations').doc(payload.consultation.id).update(obj)
            if (payload.consultation.type == "Retorno") {
                await firebase.firestore().collection('consultations').doc(payload.consultation.previousConsultation).update({ regress: payload.consultation.id })
            }
        } catch (e) {
            throw e
        }
    },

    async addUserToConsultationReschedule({ commit }, payload) {
        try {
            let obj = { user: payload.user, type: payload.consultation.type, status: payload.consultation.status, payment_number: payload.consultation.payment_number }

            if (payload.consultation.type == "Retorno")
                obj.previousConsultation = payload.consultation.previousConsultation

            await firebase.firestore().collection('consultations').doc(payload.consultation.id).update(obj)
            await firebase.firestore().collection('canceled').doc(payload.consultation.idConsultationCanceled).delete()
            if (payload.consultation.type == "Retorno") {
                await firebase.firestore().collection('consultations').doc(payload.consultation.previousConsultation).update({ regress: payload.consultation.id })
            }
        } catch (e) {
            throw e
        }
    },

    async addConsultationAppointmentToUserReschedule({ commit }, payload) {
        try {
            await firebase.firestore().collection('users').doc(payload.user.cpf).collection('consultations').doc(payload.consultation.id).set(payload.consultation)

            if (payload.consultation.type == "Retorno") {
                await firebase.firestore().collection('users').doc(payload.user.cpf).collection('consultations').doc(payload.consultation.previousConsultation).update({ regress: payload.consultation.id })
            }


        } catch (e) {
            throw e
        }
    },

    async updateAppointment({ commit }, payload) { //atualizarConsulta
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
    },
    async SearchCosultation({ commit }) {
        try {
            firebase.firestore().collection('consultations').doc()
        } catch (e) {
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
                .where('consultation','==',payload.idConsultation).get()
                .then((procedure)=>{
                    procedure.forEach((doc)=>{
                        let data = doc.data()
                        console.log('Criando outra procedure')
                        //Criando outra procedure
                        firebase.firestore().collection('users').doc(payload.idPatient).collection('procedures').add(
                            {
                                status:['Consulta Paga'],
                                payment_number:data.payment_number,
                                startAt: data.startAt,
                                type:'Consultation',
                                specialty:data.specialty
                            }
                        )

                        firebase.firestore().collection('users').doc(payload.idPatient).collection('procedures').doc(doc.id)
                        .update({ status: firebase.firestore.FieldValue.arrayUnion('Consulta Cancelada')})

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
                await firebase.firestore().collection('users').doc(payload.idPatient).collection('consultations').doc(payload.regress).update({ status: 'Cancelado' })

            }

        } catch (e) {
            throw e
        }
    },

    async removeAppointmentForever({ commit }, payload) {//apagar consulta de cancelados para semopre.
        //console.log(payload.idConsultation)
        try {
            firebase.firestore().collection('canceled').doc(payload.idConsultation).delete()
        } catch (e) {
            throw e
        }
    },

    async removeAppointmentByDay({ commit }, payload) { // ApagarTodasAsConsultasDoDiaDoMedico

        let start = moment(payload.start_date, 'YYYY-MM-DD').format('YYYY-MM-DD 00:00');
        let end = moment(payload.final_date, 'YYYY-MM-DD').format('YYYY-MM-DD 23:59');
        //console.log(payload.date)
        try {
            let snapshot = await firebase.firestore().collection('consultations')
                .where('doctor.cpf', "==", payload.doctor.cpf)
                //.orderByChild('date')
                //.startAt(start)
                //.endAt(end)
                .where('date', ">=", start)
                .where('date', "<=", end)
                .get()
            //console.log(snapshot.size)

            snapshot.forEach(doc => {
                //console.log(doc.data())
                //console.log(doc.id)

                firebase.firestore().collection('consultations').doc(doc.id).delete()
                if (doc.data().user) {
                    firebase.firestore().collection('users').doc(doc.data().user.cpf).collection('consultations').doc(doc.id).delete()
                    firebase.firestore().collection('canceled').doc(doc.id).set(doc.data())
                }
            })
        } catch (e) {
            throw e
        }
        return
    },
    setConsultationHour({ commit }, payload) {
        return new Promise((resolve, reject) => {
            firebase.firestore().collection('consultations').doc(payload.consultation).get()
                .then((doc) => {
                    if (!doc.data().consultationHour) {
                        firebase.firestore().collection('consultations').doc(payload.consultation).update({ consultationHour: payload })
                        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({ consultationHour: payload })
                        reject('Não tem!')
                        //console.log('Não tem!')
                    } else {
                        //console.log('Tem sim!',doc.data())
                        resolve(doc.data().consultationHour)
                    }
                })
        })

    }
};

const getters = {
    consultations(state) {
        return state.consultations
    },
    consultationsCanceled(state) {
        return state.consultationsCanceled
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
