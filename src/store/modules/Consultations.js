import firebase, { firestore } from "firebase";
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
});

const state = {
    consultations: [],
    schedules:[],
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
        state.consultations = payload;
        state.loaded = true
    },
    setSchedules(state, payload) {
        state.schedules = payload;
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

    async listenConsultations({ commit }, payload) {
        try {
            commit('setConsultationsLoaded', false);
            let consultations = [];
            let query = firebase.firestore().collection('consultations')
                .where('date', '>=', payload.start_date);
            if (payload.final_date) {
                query = query.where('date', '<=', payload.final_date)
            }
            if (payload.doctor) {
                query = query.where('doctor.cpf', '==', payload.doctor.cpf)
            }
            if (payload.specialty) {
                query = query.where('specialty.name', '==', payload.specialty.name)
            }

            if (payload.clinic) {
                query = query.where('clinic.name', '==', payload.clinic.name)
            }
            commit('setConsultationLoading', true);
            return query.onSnapshot((querySnapshot) => {
                consultations = [];
                querySnapshot.forEach((document) => {
                    consultations.push({
                        ...document.data(),
                        id: document.id
                    })
                });
                commit('setConsultations', consultations);
                commit('setConsultationLoading', false)
            })
        } catch (e) {
            throw e
        }
    },

    async getSchedules({ commit }, payload) {
        try {
            commit('setConsultationsLoaded', false);
            let consultations = [];
            let query = firebase.firestore().collection('schedules')
                .where('date', '>=', payload.start_date);
            if (payload.final_date) {
                query = query.where('date', '<=', payload.final_date)
            }
            if (payload.doctor) {
                query = query.where('doctor.cpf', '==', payload.doctor.cpf)
            }
            if (payload.specialty) {
                query = query.where('specialty.name', '==', payload.specialty.name)
            }

            if (payload.clinic) {
                query = query.where('clinic.name', '==', payload.clinic.name)
            }
            commit('setConsultationLoading', true);
            return query.onSnapshot((querySnapshot) => {
                consultations = [];
                querySnapshot.forEach((document) => {
                    consultations.push({
                        ...document.data(),
                        id: document.id
                    })
                });
                commit('setSchedules', consultations);
                commit('setConsultationLoading', false)
            })
        } catch (e) {
            throw e
        }
    },

    async getConsultationsCanceled({ commit }) {//pegar todas as consultas deletadas pela clinica
        try {
            let canceledSnap = await firebase.firestore().collection('canceled').orderBy('date', 'asc')
                .onSnapshot((querySnapshot) => {
                    let consultationsCanceled = [];
                    querySnapshot.forEach((document) => {
                        consultationsCanceled.push({
                            ...document.data(),
                            id: document.id
                        })
                    });
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

        consultation = functions.removeUndefineds(consultation);
        let startDate = moment(consultation.start_date, 'YYYY-MM-DD');
        let finalDate = moment(consultation.final_date, 'YYYY-MM-DD');
        let daysDiff = finalDate.diff(startDate, 'days');
        let routineId = moment().valueOf();
        functions.removeUndefineds(consultation);
        commit('setConsultationCreationTotalDays', daysDiff);
        for (let i = 0; i <= daysDiff; i++) {
            let day = moment(consultation.start_date, 'YYYY-MM-DD').add(i, 'days');
            commit('setConsultationCreationActualDay', day.format('YYYY-MM-DD'));
            commit('setConsultationCreationDaysCreated', i);
            if (consultation.weekDays.indexOf(day.weekday()) > -1) {
                delete consultation.doctor.clinics;
                delete consultation.doctor.specialties;
                delete consultation.specialty.doctors;

                var scheduleFound = await firebase.firestore().collection('schedules')
                .where('clinic.name','==',consultation.clinic.name)
                .where('doctor.cpf','==',consultation.doctor.cpf)
                .where('date','==',day.format('YYYY-MM-DD') + ' ' + consultation.hour) 
                .where('specialty.name','==',consultation.specialty.name) 
                .get()
                let consultObject
                if(scheduleFound.empty){
                    consultObject = {
                        specialty: consultation.specialty,
                        date: day.format('YYYY-MM-DD') + ' ' + consultation.hour,
                        routine_id: routineId,
                        clinic: consultation.clinic,
                        doctor: consultation.doctor,
                        vacancy: Number(consultation.vacancy),
                        qtdConsultations: 0,
                        qtdReturns:0
                    };
                    await firebase.firestore().collection('schedules').add(consultObject)
                }else{
                    scheduleFound.forEach(async(doc)=>{
                        consultObject = {
                            vacancy: Number(consultation.vacancy) + Number(doc.data().vacancy)
                        }
                        await firebase.firestore().collection('schedules').doc(doc.id).update(consultObject)
                    })
                    
                }               
            }
        }
    },

    async addConsultationAppointmentToUser({ commit }, payload) {
        try {
            let copyPayload = Object.assign({}, payload);
            functions.removeUndefineds(copyPayload);
            await firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('consultations').doc(copyPayload.consultation.id).set(copyPayload.consultation);
            if (copyPayload.consultation.type === "Retorno") {
                await firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('consultations').doc(copyPayload.consultation.previousConsultation).update({ regress: copyPayload.consultation.id })
            }

            if (copyPayload.payment_numberFound) {
                firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('procedures').doc(copyPayload.payment_numberFound.procedureId)
                    .update({
                        status: firebase.firestore.FieldValue.arrayUnion('Agendado'),
                        consultation: copyPayload.consultation.id,
                    })
            } else {
                //Não havendo encontrado um recibo, há a necessidade adicionar uma nova procedure para quando pagar, criar um intake e atualizar o procedure adicionando Consulta paga no array do status
                console.log("Criando procedure");
                //let status = payload.consultation.exam ? 'Consulta Paga' : 'Exame Pago'

                let obj = {
                    status: ['Agendado'],
                    startAt: moment().format('YYYY-MM-DD hh:ss'),
                    consultation: copyPayload.consultation.id,
                    specialty: copyPayload.consultation.specialty.name
                };
                if (copyPayload.consultation.exam) {
                    obj.type = 'Exam';
                    obj.exam = copyPayload.consultation.exam
                }
                else
                    obj.type = 'Consultation';

                firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('procedures').add(obj)
            }
        } catch (e) {
            throw e
        }
    },

    async addUserToConsultation(context, payload) {

        try {
            let copyPayload = Object.assign({}, payload);
            functions.removeUndefineds(copyPayload);
            let idSchedule = copyPayload.consultation.id
            let vacancy = copyPayload.consultation.vacancy
            let qtdReturns = copyPayload.consultation.qtdReturns ? copyPayload.consultation.qtdReturns : 0
            let qtdConsultations = copyPayload.consultation.qtdConsultations ? copyPayload.consultation.qtdConsultations : 0
            delete copyPayload.consultation.id
            delete copyPayload.consultation.vacancy
            copyPayload.consultation.idSchedule = idSchedule
            let obj = {
                ...copyPayload.consultation,
                user: copyPayload.user
            }
            let objUpdateSchedule = copyPayload.consultation.type == "Retorno" ? {qtdReturns: Number(qtdReturns) + 1} : {qtdConsultations: Number(qtdConsultations) + 1}
            objUpdateSchedule.vacancy =  Number(vacancy - 1)
            await firebase.firestore().collection('schedules').doc(idSchedule).update(objUpdateSchedule);
            let resp = await firebase.firestore().collection('consultations').add(obj);
            if (copyPayload.consultation.type == "Retorno") {
                await firebase.firestore().collection('consultations').doc(copyPayload.consultation.previousConsultation).update({ regress: resp.id })
            }
            copyPayload.consultation.id = resp.id
            await context.dispatch('addConsultationAppointmentToUser',{...copyPayload})

            return (await firebase.firestore().collection('consultations').doc(resp.id).get()).data()
        } catch (e) {
            throw e
        }
    },

    async addUserToConsultationReschedule(context, payload) {
        try {
            let copyPayload = Object.assign({}, payload);
            console.log('reschedule',copyPayload)
            functions.removeUndefineds(copyPayload);
            let idSchedule = copyPayload.consultation.id
            let vacancy = copyPayload.consultation.vacancy
            let qtdReturns = copyPayload.consultation.qtdReturns ? copyPayload.consultation.qtdReturns : 0
            let qtdConsultations = copyPayload.consultation.qtdConsultations ? copyPayload.consultation.qtdConsultations : 0
            let idConsultationCanceled = copyPayload.consultation.idConsultationCanceled
            delete copyPayload.consultation.id
            delete copyPayload.consultation.vacancy
            delete copyPayload.idConsultationCanceled
            copyPayload.consultation.idSchedule = idSchedule
            let obj = {
                ...copyPayload.consultation,
                user: copyPayload.user
            }

            let objUpdateSchedule = copyPayload.consultation.type == "Retorno" ? {qtdReturns: Number(qtdReturns) + 1} : {qtdConsultations: Number(qtdConsultations) + 1}
            objUpdateSchedule.vacancy =  Number(vacancy - 1)
            await firebase.firestore().collection('schedules').doc(idSchedule).update(objUpdateSchedule);

            if (copyPayload.consultation.type == "Retorno")
                obj.previousConsultation = copyPayload.consultation.previousConsultation;
            let resp = await firebase.firestore().collection('consultations').add(obj);
            await firebase.firestore().collection('canceled').doc(idConsultationCanceled).delete();

            if (copyPayload.consultation.type == "Retorno") {
                await firebase.firestore().collection('consultations').doc(copyPayload.consultation.previousConsultation).update({ regress: resp.id })
            }
            copyPayload.consultation.id = resp.id
            await context.dispatch('addConsultationAppointmentToUserReschedule',{...copyPayload})

            return (await firebase.firestore().collection('consultations').doc(resp.id).get()).data()
            
        } catch (e) {
            throw e
        }
    },

    async addConsultationAppointmentToUserReschedule({ commit }, payload) {
        try {
            let copyPayload = Object.assign({}, payload);
            console.log('reschedule2',copyPayload)
            functions.removeUndefineds(copyPayload);
            await firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('consultations').doc(copyPayload.consultation.id).set(copyPayload.consultation);
            if (copyPayload.consultation.type === "Retorno") {
                await firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('consultations').doc(copyPayload.consultation.previousConsultation).update({ regress: copyPayload.consultation.id })
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
            };
            await firebase.firestore().collection('consultations').doc(payload.idConsultation).update(obj);
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
        try {
            console.log(payload.consultation);
            functions.removeUndefineds(payload);
            let FieldValue = firebase.firestore.FieldValue;
            await firebase.firestore().collection('consultations').doc(payload.idConsultation).update({
                user: FieldValue.delete()
            });
            await firebase.firestore().collection('users').doc(payload.idPatient).collection('consultations').doc(payload.idConsultation).update({ status: 'Cancelado' })

            //Para consultas que são do tipo Retorno
            if (payload.type === 'Retorno') {
                //console.log('É um retorno')
                await firebase.firestore().collection('consultations').doc(payload.previousConsultation).update({
                    regress: FieldValue.delete()
                });
                await firebase.firestore().collection('users').doc(payload.idPatient).collection('consultations').doc(payload.previousConsultation).update({
                    regress: FieldValue.delete()
                })
            }

            firebase.firestore().collection('users').doc(payload.idPatient).collection('procedures')
                .where('consultation', '==', payload.idConsultation).get()
                .then((procedure) => {
                    procedure.forEach((doc) => {
                        let data = doc.data();

                        if (payload.type === "Consulta" && payload.payment_number !== "") {
                            let thereIsExam = payload.consultation.exam ? payload.consultation.exam : payload.consultation.user && payload.consultation.user.exam ? payload.consultation.user.exam : undefined
                            let status = thereIsExam ? 'Exame Pago' : 'Consulta Paga';
                            let type = thereIsExam ? 'Exam' : 'Consultation';
                            let obj = {
                                status: [status],
                                payment_number: data.payment_number,
                                startAt: data.startAt,
                                type: type,
                                specialty: data.specialty
                            };

                            if (thereIsExam)
                                obj = { ...obj, exam: thereIsExam };
                            firebase.firestore().collection('users').doc(payload.idPatient).collection('procedures').add(
                                { ...obj }
                            )
                        }

                        firebase.firestore().collection('users').doc(payload.idPatient).collection('procedures').doc(doc.id).delete()
                        data.status.push('Cancelado');
                        firebase.firestore().collection('users').doc(payload.idPatient).collection('proceduresFinished').doc(doc.id)
                            .set(data);
                        return;
                    })
                });



            //Para consultas do tipo Consulta e possuem um retorno associado. É necessário remover o agendamento do retorno associado
            if (payload.regress != undefined) {

                //console.log('É uma consulta e possui um retorno')

                await firebase.firestore().collection('consultations').doc(payload.regress).update({
                    user: FieldValue.delete(),
                    previousConsultation: FieldValue.delete()
                });
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

    async addArrayCallsToConsultation({ commit }, payload) {
        /*console.log("vector:", payload)*/
        try {
            firebase.firestore().collection('canceled').doc(payload.idConsultation).update({ calls: payload.calls })
        } catch (e) {
            throw e
        }
    },

    async removeAppointments({ commit }, consultations) {
        for (let consultation in consultations) {
            commit('setConsultationDeletionInfo', {
                total: consultations.length,
                day: consultations[consultation].date,
                removed: consultation
            });
            await firebase.firestore().collection('consultations').doc(consultations[consultation].id).delete();
            if (consultations[consultation].user) {
                await firebase.firestore().collection('users').doc(consultations[consultation].user.cpf).collection('consultations').doc(consultations[consultation].id).delete();
                await firebase.firestore().collection('canceled').doc(consultations[consultation].id).set(consultations[consultation])
            }
        }
        commit('setConsultationDeletionInfo', {})
    },

    async removeAppointmentByDay({ commit }, payload) { // ApagarTodasAsConsultasDoDiaDoMedico

        let start = moment(payload.start_date, 'YYYY-MM-DD').format('YYYY-MM-DD 00:00');
        let end = moment(payload.final_date, 'YYYY-MM-DD').format('YYYY-MM-DD 23:59');
        //console.log(payload.date)
        payload = functions.removeUndefineds(payload);
        try {
            let snapshot = await firebase.firestore().collection('consultations')
                .where('doctor.cpf', "==", payload.doctor.cpf)
                .where('date', ">=", start)
                .where('date', "<=", end)
                .get();


            snapshot.forEach(async doc => {

                let dateConsultation = moment(doc.data().date);
                let filterHour = payload.hour ? doc.data().date.split(' ')[1] === payload.hour ? true : false : true
                let filterDayWeek = payload.weekDays ? payload.weekDays.indexOf(dateConsultation.weekday()) > -1 ? true : false : true

                console.log(doc.data().date.split(' ')[1]);

                if (filterHour && filterDayWeek)
                    firebase.firestore().collection('consultations').doc(doc.id).delete();

                if (filterHour && filterDayWeek && doc.data().user) {
                    firebase.firestore().collection('users').doc(doc.data().user.cpf).collection('consultations').doc(doc.id).delete();
                    firebase.firestore().collection('canceled').doc(doc.id).set(doc.data())
                }

                let schedule = await firebase.firestore().collection('schedules').doc(doc.data().idSchedule).get()
                if(schedule.exists)
                    firebase.firestore().collection('schedules').doc(doc.data().idSchedule).delete()
            })
        } catch (e) {
            throw e
        }
        return
    }
    ,
    setConsultationHour({ commit }, payload) {
        return new Promise((resolve, reject) => {
            firebase.firestore().collection('consultations').doc(payload.consultation).get()
                .then((doc) => {
                    if (!doc.data().consultationHour) {
                        firebase.firestore().collection('consultations').doc(payload.consultation).update({ consultationHour: payload });
                        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({ consultationHour: payload });
                        reject('Não tem!')
                        //console.log('Não tem!')
                    } else {
                        //console.log('Tem sim!',doc.data())
                        resolve(doc.data().consultationHour)
                    }
                })
        })

    },

    async addProntuarioToConsultation({ commit }, payload) {
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({ prontuario: payload.prontuario })
    },

    async addTimesToConsultation({ commit }, payload) {
        firebase.firestore().collection('consultations').doc(payload.consultation).update({ start_at: payload.start });
        firebase.firestore().collection('consultations').doc(payload.consultation).update({ end_at: payload.end });
        firebase.firestore().collection('consultations').doc(payload.consultation).update({ duration: payload.durantion });
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({ start_at: payload.start });
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({ end_at: payload.end });
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({ duration: payload.durantion })
    }
};

const getters = {
    consultations(state) {
        return state.consultations
    },
    schedules(state) {
        return state.schedules
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
