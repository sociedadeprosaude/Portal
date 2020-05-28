import firebase  from "firebase";
import functions from "../../utils/functions";
import moment from "moment";

const state = {};

const mutations = {};

const actions = {

    async addUserToConsultationReschedule(context, payload) {
        try {
            let copyPayload = Object.assign({}, payload);
            functions.removeUndefineds(copyPayload);
            let id_schedule = copyPayload.consultation.id_schedule;
            let idConsultationCanceled = copyPayload.consultation.idConsultationCanceled
            delete copyPayload.consultation.id;
            delete copyPayload.consultation.vacancy;
            delete copyPayload.idConsultationCanceled;
            delete copyPayload.consultation.qtd_consultations;
            delete copyPayload.consultation.qtd_returns;
            copyPayload.consultation.id_schedule = id_schedule;
            let obj = {
                ...copyPayload.consultation,
                user: copyPayload.user
            }

            /* let objUpdateSchedule = copyPayload.consultation.type == "Retorno" ? { qtd_returns: Number(qtd_returns) + 1 } : { qtd_consultations: Number(qtd_consultations) + 1 }
            objUpdateSchedule.vacancy = Number(vacancy - 1)
            await firebase.firestore().collection('schedules').doc(idSchedule).update(objUpdateSchedule); */

            if (copyPayload.consultation.type == "Retorno")
                obj.previousConsultation = copyPayload.consultation.previousConsultation;
            let resp = await firebase.firestore().collection('consultations').add(obj);
            await firebase.firestore().collection('canceled').doc(idConsultationCanceled).delete();

            if (copyPayload.consultation.type == "Retorno") {
                await firebase.firestore().collection('consultations').doc(copyPayload.consultation.previousConsultation).update({regress: resp.id})
            }
            copyPayload.consultation.id = resp.id
            await context.dispatch('addConsultationAppointmentToUserReschedule', {...copyPayload})

            return (await firebase.firestore().collection('consultations').doc(resp.id).get()).data()

        } catch (e) {
            throw e
        }
    },

    async addConsultationAppointmentToUserReschedule({commit}, payload) {
        try {
            let copyPayload = Object.assign({}, payload);
            functions.removeUndefineds(copyPayload);
            await firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('consultations').doc(copyPayload.consultation.id).set(copyPayload.consultation);
            if (copyPayload.consultation.type === "Retorno") {
                await firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('consultations').doc(copyPayload.consultation.previousConsultation).update({regress: copyPayload.consultation.id})
            }

        } catch (e) {
            throw e
        }
    },

    async addUserToConsultation(context, payload) {

        try {
            let copyPayload = Object.assign({}, payload);
            functions.removeUndefineds(copyPayload);
            let id_schedule = copyPayload.consultation.id_schedule
            delete copyPayload.consultation.id
            delete copyPayload.consultation.vacancy
            delete copyPayload.consultation.qtd_consultations
            delete copyPayload.consultation.qtd_returns
            copyPayload.consultation.id_schedule = id_schedule
            var appointmentFunction = firebase.functions().httpsCallable('addUserToConsultation');
            var response = await appointmentFunction({payload: {...copyPayload}})
            
            
        } catch (e) {
            throw e
        }
    },

    async addArrayCallsToConsultation({commit}, payload) {
        try {
            firebase.firestore().collection('canceled').doc(payload.idConsultation).update({calls: payload.calls})
        } catch (e) {
            throw e
        }
    },

    async addMedicalRecordsToConsultation({commit}, payload) {
        firebase.firestore().collection('consultations').doc(payload.consultation).update({MedicalRecords: payload.MedicalRecords});
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({MedicalRecords: payload.MedicalRecords})
    },

    async addPrescriptionToConsultation({commit}, payload) {
        firebase.firestore().collection('consultations').doc(payload.consultation).update({Prescription: payload.Prescription});
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({Prescription: payload.Prescription})
    },

    async addSolicitationsToConsultation({commit}, payload) {
        payload = functions.removeUndefineds(payload);
        firebase.firestore().collection('consultations').doc(payload.consultation).update({Solicitations: payload.Solicitations});
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({Solicitations: payload.Solicitations})
    },

    async addReportToConsultation({commit}, payload) {
        firebase.firestore().collection('consultations').doc(payload.consultation).update({Report: payload.Report});
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({Report: payload.Report})
    },

    async addAttestationsToConsultation({commit}, payload) {
        firebase.firestore().collection('consultations').doc(payload.consultation).update({Attestations: payload.Attestations});
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({Attestations: payload.Attestations})
    },

    async addOrientationsToConsultation({commit}, payload) {
        firebase.firestore().collection('consultations').doc(payload.consultation).update({Orientations: payload.Orientations});
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({Orientations: payload.Orientations})
    },

    async addTimesToConsultation({commit}, payload) {
        firebase.firestore().collection('consultations').doc(payload.consultation).update({
            start_at: payload.start,
            end_at: payload.end,
            duration: payload.durantion
        });
        firebase.firestore().collection('users').doc(payload.patient).collection('consultations').doc(payload.consultation).update({
            start_at: payload.start,
            end_at: payload.end,
            duration: payload.durantion
        });
    },
};

export default {
    state,
    mutations,
    actions
}