import firebase from "firebase";
import functions from "../../utils/functions";
import moment from "moment";
import constants from "../../utils/constants";
import { Promise } from "core-js";

const state = {};

const mutations = {};

const actions = {

    async addBudget(context, payload) {
        let copyPayload = Object.assign({}, payload);
        functions.removeUndefineds(copyPayload);

        let specialties = copyPayload.specialties ? Object.assign({}, copyPayload.specialties) : undefined;
        let exams = copyPayload.exams ? Object.assign({}, copyPayload.exams) : undefined;
        delete copyPayload.specialties;
        delete copyPayload.exams;
        delete copyPayload.user.telephones;

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
        if (copyPayload.user) {
            context.dispatch('addBudgetToUser', payload)
        }
    },

    async addIntake(context, payload) {
        let copyPayload = Object.assign({}, payload);
        functions.removeUndefineds(copyPayload);

        delete copyPayload.user.budgets;
        delete copyPayload.user.consultations;
        delete copyPayload.user.intakes;

        let specialties = copyPayload.specialties ? Object.assign({}, copyPayload.specialties) : undefined;
        let exams = copyPayload.exams ? Object.assign({}, copyPayload.exams) : undefined;

        if (copyPayload.specialties) {
            copyPayload.specialties = Object.values(copyPayload.specialties)
        }
        if (copyPayload.exams) {
            copyPayload.exams = Object.values(copyPayload.exams)
        }
        if (copyPayload.specialties) {
            for (let specialty of copyPayload.specialties) {
                if (specialty.doctor.clinics) delete specialty.doctor.clinics;

                if (specialty.doctor.clinic && specialty.doctor.clinic.exams) {
                    delete specialty.doctor.clinic.exams
                }
                if (specialty.doctor.clinic && specialty.doctor.clinic.specialties) {
                    delete specialty.doctor.clinic.specialties
                }
            }
        }

        functions.removeUndefineds(copyPayload);
        functions.removeUndefineds(specialties);
        functions.removeUndefineds(exams);


        await firebase.firestore().collection('intakes').doc(copyPayload.id.toString()).set(copyPayload);
        if (specialties) {

            let spec = await firebase.firestore().collection('intakes').doc(copyPayload.id.toString()).collection('specialties').get();
            for (let doc in spec.docs) {
                await firebase.firestore().collection('intakes').doc(copyPayload.id.toString()).collection('specialties').doc(spec.docs[doc].id).delete()
            }
            for (let spec in specialties) {
                if (specialties[spec].doctor.rules === null) {
                    delete specialties[spec].doctor.rules
                }
                await firebase.firestore().collection('intakes').doc(copyPayload.id.toString()).collection('specialties').doc(specialties[spec].name).set(specialties[spec])


            }
        }
        if (exams) {

            let spec = await firebase.firestore().collection('intakes').doc(copyPayload.id.toString()).collection('exams').get();
            for (let doc in spec.docs) {
                await firebase.firestore().collection('intakes').doc(copyPayload.id.toString()).collection('exams').doc(spec.docs[doc].id).delete()
            }
            for (let exam in exams) {
                functions.removeUndefineds(exams[exam]);
                await firebase.firestore().collection('intakes').doc(copyPayload.id.toString()).collection('exams').doc(exams[exam].name).set(exams[exam])
            }
        }
        if (copyPayload.user) {
            await context.dispatch('addIntakeToUser', payload)
        }
    },

    async getBudget({ }, budgetId) {
        let budget = (await firebase.firestore().collection('budgets').doc(budgetId).get()).data();
        let specialtiesCol = await firebase.firestore().collection('budgets').doc(budgetId).collection('specialties').get()
        let examsCol = await firebase.firestore().collection('budgets').doc(budgetId).collection('exams').get();
        let specialties = [];
        let exams = [];
        specialtiesCol.forEach((s) => {
            specialties.push(s.data())
        });
        examsCol.forEach((e) => {
            exams.push(e.data())
        });
        budget['specialties'] = specialties;
        budget['exams'] = exams;

        return budget
    },

    async deleteBudget ({}, data) {
        let  userId = data.user.cpf.toString();
        let budgetId = data.budgetId.toString();
        await firebase.firestore().collection('budgets').doc(budgetId.toString()).delete();
        await firebase.firestore().collection('users').doc(userId.toString()).collection('budgets').doc(budgetId.toString()).delete();
    },

    async addBudgetToUser({ }, payload) {
        let copyPayload = Object.assign({}, payload);
        functions.removeUndefineds(copyPayload);
        let specialties = copyPayload.specialties ? Object.assign({}, copyPayload.specialties) : undefined;
        let exams = copyPayload.exams ? Object.assign({}, copyPayload.exams) : undefined;
        let user = copyPayload.user ? Object.assign({}, copyPayload.user) : undefined;
        delete copyPayload.specialties;
        delete copyPayload.exams;
        delete copyPayload.user;

        functions.removeUndefineds(specialties);
        functions.removeUndefineds(exams);

        let userRef = firebase.firestore().collection('users').doc(user.cpf);
        await userRef.collection('budgets').doc(copyPayload.id.toString()).set(copyPayload);

        if (specialties) {
            let spec = await userRef.collection('budgets').doc(copyPayload.id.toString()).collection('specialties').get();
            spec.forEach((s) => {
                userRef.collection('budgets').doc(copyPayload.id.toString()).collection('specialties').doc(s.id).delete()
            });
            for (let spec in specialties) {
                await userRef.collection('budgets').doc(copyPayload.id.toString()).collection('specialties').add(specialties[spec])
            }
        }
        if (exams) {
            let spec = await userRef.collection('budgets').doc(copyPayload.id.toString()).collection('exams').get();
            spec.forEach((s) => {
                userRef.collection('budgets').doc(copyPayload.id.toString()).collection('exams').doc(s.id).delete()
            });
            for (let exam in exams) {
                functions.removeUndefineds(exams[exam]);
                await userRef.collection('budgets').doc(copyPayload.id.toString()).collection('specialties').add(exams[exam])
            }
        }
    },

    async verifyUnpaidConsultation(context, payload) {
        let consultationFound = undefined;
        let precoVendaZero = payload.isConsultation && payload.specialty.price === 0;
        if (!precoVendaZero) {
            let consultationRef =  payload.userRef.collection('consultations').where('specialty.name', '==', payload.specialty.name).where('status', '==', 'Aguardando pagamento')
                //.get()

            if(!payload.isConsultation)
                consultationRef.where('exam.name','==',payload.examObj.name);
            let consultations = await consultationRef.get();
            consultations.forEach(async (c) => {
                consultationFound = c;
                context.dispatch('updatePaymentNumberConsultation', { user: payload.user, consultation: c, payment_number: payload.payment_number })
            })
        }


        context.dispatch('createOrUpdateProcedure', { consultationFound: consultationFound, consultation:payload.consultation, precoVendaZero:precoVendaZero, userRef: payload.userRef, user: payload.user, isConsultation: payload.isConsultation, payment_number: payload.payment_number, specialty: payload.specialty, examObj: payload.examObj })
    },
    async createOrUpdateProcedure({ }, payload) {
        let consultationFound = payload.consultationFound;
        let user = payload.user;
        let statusName = payload.isConsultation ? 'Consulta Paga' : 'Exame Pago';
        let type = payload.isConsultation ? 'Consultation' : 'Exam';

        if (consultationFound || (payload.precoVendaZero && payload.isConsultation) ) {
            let consultation = payload.precoVendaZero && payload.isConsultation?  payload.consultation : consultationFound

            let procedures = await firebase.firestore().collection('users').doc(user.cpf).collection('procedures').where('consultation', '==', consultation.id)
                .get();

            if (!procedures.empty){
                procedures.forEach((snap) => {
                    let data = snap.data();
                    let obj = {
                        status: firebase.firestore.FieldValue.arrayUnion(statusName),
                        payment_number: payload.payment_number
                    };
                    if (!payload.isConsultation) {
                        Object.assign(obj, { exam: { ...payload.examObj} });
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

                Object.assign(obj, { exam: { ...payload.examObj} });
            }
            firebase.firestore().collection('users').doc(user.cpf).collection('procedures').add(
                { ...obj }
            )
        }

    },
    async addIntakeToUser(context, payload) {
        let copyPayload = Object.assign({}, payload);
        functions.removeUndefineds(copyPayload);
        let specialties = copyPayload.specialties ? Object.assign({}, copyPayload.specialties) : undefined;
        let exams = copyPayload.exams ? Object.assign({}, copyPayload.exams) : undefined;
        let user = copyPayload.user ? Object.assign({}, copyPayload.user) : undefined;
        delete copyPayload.specialties;
        delete copyPayload.exams;
        delete copyPayload.user;

        functions.removeUndefineds(specialties);
        functions.removeUndefineds(exams);

        let userRef = firebase.firestore().collection('users').doc(user.cpf);
        await userRef.collection('intakes').doc(copyPayload.id.toString()).set(copyPayload);
        if (specialties) {
            let spec = await userRef.collection('intakes').doc(copyPayload.id.toString()).collection('specialties').get();
            spec.forEach((s) => {
                userRef.collection('intakes').doc(copyPayload.id.toString()).collection('specialties').doc(s.id).delete()
            });

            for (let spec in specialties) {

                await userRef.collection('intakes').doc(copyPayload.id.toString()).collection('specialties').add({
                    ...specialties[spec]
                });

                context.dispatch('verifyUnpaidConsultation', { userRef: userRef, user: user, isConsultation: true,consultation:payload.consultation, payment_number: copyPayload.id.toString(), specialty: specialties[spec] })
            }
        }
        if (exams) {
            let spec = await userRef.collection('intakes').doc(copyPayload.id.toString()).collection('exams').get();
            spec.forEach((s) => {
                userRef.collection('intakes').doc(copyPayload.id.toString()).collection('exams').doc(s.id).delete()
            });
            for (let exam in exams) {

                functions.removeUndefineds(exams[exam]);
                await userRef.collection('intakes').doc(copyPayload.id.toString()).collection('exams').add({
                    ...exams[exam]
                });

                context.dispatch('verifyUnpaidConsultation', { userRef: userRef, user: user, isConsultation: false, payment_number: copyPayload.id.toString(), specialty: {name:exams[exam].type}, examObj: exams[exam] })
            }
        }
    },
    async updatePaymentNumberConsultation(context,payload){
        await firebase.firestore().collection('users').doc(payload.user.cpf).collection('consultations').doc(payload.consultation.id).update({
            status: 'Pago',
            payment_number: payload.payment_number.toString()
        });
        await firebase.firestore().collection('consultations').doc(payload.consultation.id).update({
            status: 'Pago',
            payment_number: payload.payment_number.toString()
        })
    },


    async getUserIntakes(context, user) {
        let userRef = firebase.firestore().collection('users').doc(user.cpf);
        let intakesSnap = (await userRef.collection('intakes').get()).docs;
        let intakes = [];
        for (let snap in intakesSnap) {
            let doc = intakesSnap[snap];
            intakes.push(doc.data())
        }
        return intakes
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
            let examesSpecialties = ['ULTRASSONOGRAFIA', 'ELETROCARDIOGRAMA', 'ELETROENCEFALOGRAMA', 'ECOCARDIOGRAMA', 'VIDEOLARIGONSCOPIA'];
            let procedures;
            let type = payload.exam ? 'Exam' : 'Consultation';
            let status = payload.exam ? 'Exame Pago' : 'Consulta Paga';
            let procedureRef;
            if(payload.status && payload.payment_number)
                procedureRef = firebase.firestore().collection('users').doc(payload.user.cpf).collection('procedures').where('type', '==', 'Consultation')
                .where('specialty', '==', payload.specialty.name).where('status', 'array-contains-any', payload.status).where('payment_number','==',payload.payment_number.toString());
            else{
                procedureRef = payload.exam ? procedureRef = firebase.firestore().collection('users').doc(payload.user.cpf).collection('procedures').where('type', '==', type)
                .where('specialty', '==', payload.specialty.name).where('status', '==', [status]).where('exam.name', '==', payload.exam.name)
                : procedureRef = firebase.firestore().collection('users').doc(payload.user.cpf).collection('procedures').where('type', '==', type)
                    .where('specialty', '==', payload.specialty.name).where('status', '==', [status])
            }


            let procedureRefOr = firebase.firestore().collection('users').doc(payload.user.cpf).collection('procedures').where('type', '==', 'Exam')
                .where('specialty', '==', payload.specialty.name).where('status', '==', ['Exame Pago'])

            procedures = await procedureRef.get();
            if (procedures.empty && type === 'Consultation' && examesSpecialties.indexOf(payload.specialty.name) !== -1)
                procedures = await procedureRefOr.get();

            if (!procedures.empty) {
                procedures.forEach((procedure) => {
                    resolve({ procedureId: procedure.id, ...procedure.data() })
                })
            } else {
                reject('Payment Number not found')
            }

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
