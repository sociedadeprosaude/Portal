import firebase from "firebase";
import functions from "../../utils/functions";
import constants from "../../utils/constants";
import {Promise} from "core-js";

const state = {
    intakes: [],
    categories: [],
    intakesClinic: [],
};

const mutations = {

    setIntakesCategories(state, payload) {
        state.categories = payload
    },
    setIntakesClinic(state, payload) {
        state.intakesClinic = payload
    },
};

const actions = {

    async addIntake(context, payload) {
        let copyPayload = Object.assign({}, payload);
        functions.removeUndefineds(copyPayload);

        delete copyPayload.user.budgets;
        delete copyPayload.user.consultations;
        delete copyPayload.user.intakes;

        let specialties = copyPayload.specialties ? Object.assign( copyPayload.specialties) : undefined;
        let exams = copyPayload.exams ? Object.assign( copyPayload.exams) : undefined;

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

            let exam = await firebase.firestore().collection('intakes').doc(copyPayload.id.toString()).collection('exams').get();
            for (let doc in exam.docs) {
                await firebase.firestore().collection('intakes').doc(copyPayload.id.toString()).collection('exams').doc(exam.docs[doc].id).delete()
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

    async verifyUnpaidConsultation(context, payload) {
        let consultationFound = undefined;
        let precoVendaZero = payload.isConsultation && payload.specialty.price === 0;
        if (!precoVendaZero) {
            let consultationRef = payload.userRef.collection('consultations').where('specialty.name', '==', payload.specialty.name).where('status', '==', 'Aguardando pagamento')

            if (!payload.isConsultation)
                consultationRef.where('exam.name', '==', payload.examObj.name);
            // let consultationRef =  payload.userRef.collection('consultations').where('status', '==', 'Aguardando pagamento')

            // if(payload.isConsultation)
                // consultationRef = consultationRef.where('specialty.name', '==', payload.specialty.name)
            // else
                // consultationRef = consultationRef.where('exam.name','==',payload.examObj.name);

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
// <<<<<<< HEAD
//                         Object.assign(obj, { exam: { ...payload.examObj } });
// =======
                        Object.assign(obj, { exam: { ...payload.examObj} });
                    }else{
                        obj.specialty = payload.specialty.name
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
// =======
//                 Object.assign(obj, { exam: { ...payload.examObj} });
//             }else{
//                 obj.specialty = payload.specialty.name
// >>>>>>> master
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

    async getIntakeDetails(context, intake) {
        intake = await firebase.firestore().collection('intakes').doc(intake.id.toString()).get();
        intake = {
            ...intake.data(),
            id: intake.id
        };
        //console.log('intake puxando: ', intake.user)
        //console.log('user.dependents tamanho: ', intake.user.dependents.length)
        if(intake.user.dependents && intake.user.dependents.length === 0){
           delete intake.user.dependents
        }
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
        functions.removeUndefineds(intake.user);
        functions.removeUndefineds(intake);
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
    async getIntakesCategories({commit}) {
        firebase.firestore().collection('operational/').doc('intakes').onSnapshot((outtakesDoc) => {
            let categories = [];
            if (!outtakesDoc.exists) {
                firebase.firestore().collection('operational/').doc('intakes').set({
                    categories: []
                })
            } else {
                categories = outtakesDoc.data().categories
            }
            commit('setIntakesCategories', categories)
        })
    },

    async addIntakesCategory(context, category) {
        await context.dispatch('getIntakesCategories');
        let categories = context.getters.intakesCategories;
        if (categories.indexOf(category) > -1) {
            return
        }
        categories.push(category);
        try {
            await firebase.firestore().collection('operational/').doc('intakes').update({
                categories: categories
            })
        } catch (e) {
            console.log(e)
        }
    },

    async addFinancialSupportIntake(context, intake) {
        intake = functions.removeUndefineds(intake);
        await context.dispatch('addIntakesCategory', intake.category);
        await firebase.firestore().collection('intakes/').add(intake)
    },

    async getSpecificIntake({commit}, intake) {
        let SpecificIntake = await firebase.firestore().collection('intakes').doc(intake.number).get();
        let exams = [];
        let patient = SpecificIntake.data().user.name;
        let intakeNumber = intake.number;
        let intakeClinic = {};
        for (let exam in SpecificIntake.data().exams) {
            if (SpecificIntake.data().exams[exam].clinic.cnpj === intake.cnpj) {
                if (SpecificIntake.data().exams[exam].realized) {
                    exams.push({
                        name: SpecificIntake.data().exams[exam].name,
                        price: SpecificIntake.data().exams[exam].cost,
                        rules: SpecificIntake.data().exams[exam].rules,
                        realized: SpecificIntake.data().exams[exam].realized,
                    });
                } else {
                    exams.push({
                        name: SpecificIntake.data().exams[exam].name,
                        price: SpecificIntake.data().exams[exam].cost,
                        rules: SpecificIntake.data().exams[exam].rules,
                        realized: false,
                    });
                }
            }
            intakeClinic = {
                exams: exams,
                patient: patient,
                intakeNumber: intakeNumber
            }
        }
        commit('setIntakesClinic', intakeClinic)
    },

    async updatingSpecificIntake({commit}, intake) {
        let SpecificIntake = await firebase.firestore().collection('intakes').doc(intake.number).get();
        let Exams = SpecificIntake.data().exams;
        for (let exam in Exams) {
            for (let UpdateExam in intake.exams) {
                if (Exams[exam].name === intake.exams[UpdateExam].name) {
                    Exams[exam].realized = intake.exams[UpdateExam].realized
                }
            }
        }
        await firebase.firestore().collection('intakes').doc(intake.number).update({exams: Exams})
    }
};

const getters = {

    intakesCategories(state) {
        return state.categories
    },
    intakesClinic(state) {
        return state.intakesClinic
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
