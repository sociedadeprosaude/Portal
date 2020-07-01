import firebase from "firebase";
import functions from "../../utils/functions";
import moment from "moment";
import constants from "../../utils/constants";
import { Promise } from "core-js";

const state = {};

const mutations = {};

const actions = {

    async addDataBudget({ getters }, payload) {
        const cpf = payload.cpf;
        delete payload.cpf;
        firebase.firestore().collection('budgets').doc(`${payload.id}`).update(payload);
        firebase.firestore().collection('users').doc(cpf)
            .collection('budgets').doc(`${payload.id}`).update(payload);
    },

    async addBudget(context, payload) {
        let copyPayload = Object.assign({}, payload);

        functions.removeUndefineds(copyPayload);

        let specialties = copyPayload.specialties ? Object.assign({}, copyPayload.specialties) : undefined;
        let exams = copyPayload.exams ? Object.assign({}, copyPayload.exams) : undefined;
        delete copyPayload.specialties;
        delete copyPayload.exams;
        delete copyPayload.user.telephones;
        copyPayload.user.budget = [];
        delete copyPayload.user.budgets;
        copyPayload.user.intakes = [];
        delete copyPayload.user.intakes;
        delete copyPayload.user.consultations;
        delete copyPayload.user.specialties;
        if (copyPayload.doctor) {
            delete copyPayload.doctor.clinics;
            delete copyPayload.doctor.specialties;
        }

        functions.removeUndefineds(specialties);
        functions.removeUndefineds(exams);

        await firebase.firestore().collection('budgets').doc(copyPayload.id.toString()).set({ ...copyPayload });
        if (specialties) {
            let spec = await firebase.firestore().collection('budgets').doc(copyPayload.id.toString()).collection('specialties').get();
            spec.forEach((s) => {
                firebase.firestore().collection('budgets').doc(copyPayload.id.toString()).collection('specialties').doc(s.id).delete()
            });
            for (let spec in specialties) {
                await firebase.firestore().collection('budgets').doc(copyPayload.id.toString()).collection('specialties').add(specialties[spec])
            }
        }
        if (exams) {
            let spec = await firebase.firestore().collection('budgets').doc(copyPayload.id.toString()).collection('exams').get();
            spec.forEach((s) => {
                firebase.firestore().collection('budgets').doc(copyPayload.id.toString()).collection('exams').doc(s.id).delete()
            });
            for (let exam in exams) {
                functions.removeUndefineds(exams[exam]);
                await firebase.firestore().collection('budgets').doc(copyPayload.id.toString()).collection('exams').add(exams[exam])
            }
        }
        //Talvez aqui
        if (copyPayload.user) {
            await firebase.firestore().collection('users').doc(copyPayload.user.cpf).collection('budgets').doc(copyPayload.id.toString()).set({ ...copyPayload })
        }
    },

    async getBudget({ }, budgetId) {
        const budgetRef = firebase.firestore().collection('budgets').doc(budgetId)
        let budget = (await budgetRef.get()).data();
        let specialtiesCol = await budgetRef.collection('specialties').get()
        let examsCol = await budgetRef.collection('exams').get();
        let specialties = [];
        let exams = [];
        if (budget) {
            specialtiesCol.forEach((s) => {
                specialties.push(s.data())
            });
            examsCol.forEach((e) => {
                exams.push(e.data())
            });
            budget['specialties'] = specialties;
            budget['exams'] = exams;
        }


        return budget
    },

    async deleteBudget({ }, data) {
        let userId = data.user.cpf.toString();
        let budgetId = data.budgetId.toString();
        await firebase.firestore().collection('budgets').doc(budgetId.toString()).delete();
        await firebase.firestore().collection('users').doc(userId.toString()).collection('budgets').doc(budgetId.toString()).delete();
    },

    async verifyUnpaidConsultation(context, payload) {
        let consultationFound = undefined;
        let precoVendaZero = payload.isConsultation && payload.specialty.price === 0;
        if (!precoVendaZero) {
            let consultationRef = payload.userRef.collection('consultations').where('specialty.name', '==', payload.specialty.name).where('status', '==', 'Aguardando pagamento')
            //.get()

            if (!payload.isConsultation)
                consultationRef.where('exam.name', '==', payload.examObj.name);
            let consultations = await consultationRef.get();
            consultations.forEach(async (c) => {
                consultationFound = c;
                context.dispatch('updatePaymentNumberConsultation', { user: payload.user, consultation: c, payment_number: payload.payment_number })
            })
        }


        context.dispatch('createOrUpdateProcedure', { consultationFound: consultationFound, consultation: payload.consultation, precoVendaZero: precoVendaZero, userRef: payload.userRef, user: payload.user, isConsultation: payload.isConsultation, payment_number: payload.payment_number, specialty: payload.specialty, examObj: payload.examObj })
    },

    async createOrUpdateProcedure({ }, payload) {
        let consultationFound = payload.consultationFound;
        let user = payload.user;
        let statusName = payload.isConsultation ? 'Consulta Paga' : 'Exame Pago';
        let type = payload.isConsultation ? 'Consultation' : 'Exam';

        if (consultationFound || (payload.precoVendaZero && payload.isConsultation)) {
            let consultation = payload.precoVendaZero && payload.isConsultation ? payload.consultation : consultationFound

            let procedures = await firebase.firestore().collection('users').doc(user.cpf).collection('procedures').where('consultation', '==', consultation.id)
                .get();

            if (!procedures.empty) {
                procedures.forEach((snap) => {
                    let data = snap.data();
                    let obj = {
                        status: firebase.firestore.FieldValue.arrayUnion(statusName),
                        payment_number: payload.payment_number
                    };
                    if (!payload.isConsultation) {
                        Object.assign(obj, { exam: { ...payload.examObj } });
                    }

                    firebase.firestore().collection('users').doc(user.cpf).collection('procedures').doc(snap.id).update(
                        { ...obj }
                    )
                })
            }
        } else {
            let obj = {
                status: [statusName],
                payment_number: payload.payment_number,
                startAt: moment().format('YYYY-MM-DD hh:ss'),
                type: type,
                specialty: payload.specialty.name
            };

            if (!payload.isConsultation) {

                Object.assign(obj, { exam: { ...payload.examObj } });
            }
            firebase.firestore().collection('users').doc(user.cpf).collection('procedures').add(
                { ...obj }
            )
        }

    },

    async updatePaymentNumberConsultation(context, payload) {
        await firebase.firestore().collection('users').doc(payload.user.cpf).collection('consultations').doc(payload.consultation.id).update({
            status: 'Pago',
            payment_number: payload.payment_number.toString()
        });
        await firebase.firestore().collection('consultations').doc(payload.consultation.id).update({
            status: 'Pago',
            payment_number: payload.payment_number.toString()
        })
    },

    async getUserBudgets(context, user) {
        let userRef = firebase.firestore().collection('users').doc(user.cpf);
        let budgetsSnap = await userRef.collection('budgets').get();
        let budgets = [];
        budgetsSnap.forEach((doc) => {
            budgets.push(doc.data())
        });
        return budgets
    },

    async getIntakeDetails(context, intake) {
        intake = await firebase.firestore().collection('intakes').doc(intake.id.toString()).get();
        intake = {
            ...intake.data(),
            id: intake.id
        };
        let examsSnap = await firebase.firestore().collection('intakes').doc(intake.id.toString()).collection('exams').get();
        let specialtiesSnap = await firebase.firestore().collection('intakes').doc(intake.id.toString()).collection('specialties').get();
        let exams = [];
        let specialties = [];
        examsSnap.forEach((e) => {
            exams.push(e.data())
        });
        specialtiesSnap.forEach((c) => {
            specialties.push(c.data())
        });
        intake.exams = exams;
        intake.specialties = specialties;
        return intake
    },

    async cancelIntake(context, intake) {
        await firebase.firestore().collection('intakes').doc(intake.id.toString()).update(
            {
                status: constants.INTAKE_STATUS.CANCELLED,
                cancelled_by: context.getters.user
            });
        await firebase.firestore().collection('users').doc(intake.user.cpf).collection('intakes').doc(intake.id.toString()).update(
            {
                status: constants.INTAKE_STATUS.CANCELLED,
                cancelled_by: context.getters.user
            });
        return
    },

    async thereIsIntakes(context, payload) {
        return new Promise(async (resolve, reject) => {
            let findPaymentNumber = firebase.functions().httpsCallable('thereIsPaymentNumber');
            findPaymentNumber({ payload: payload }).then((result) => {
                if (result.data.Found)
                    resolve({ ...result.data.Found });
                else
                    reject({ cost: { ...result.data.NotFound } })
            }).catch(function (error) {
                reject('Error')
            });
        })
    },


};

const getters = {};

export default {
    state,
    mutations,
    actions,
    getters
}
