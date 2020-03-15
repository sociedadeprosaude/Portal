import firebase from "firebase";
import functions from "../../utils/functions";
import moment from "moment";
import constants from "../../utils/constants";
import { Promise } from "core-js";

const state = {};

const mutations = {};

const actions = {
    async addBudget(context, payload) {
        let copyPayload = Object.assign({}, payload)
        functions.removeUndefineds(copyPayload)

        // return
        let specialties = copyPayload.specialties ? Object.assign({}, copyPayload.specialties) : undefined
        let exams = copyPayload.exams ? Object.assign({}, copyPayload.exams) : undefined
        // let user = copyPayload.user ? Object.assign({}, copyPayload.user) : undefined
        delete copyPayload.specialties
        delete copyPayload.exams
        //let user = copyPayload.user
        delete copyPayload.user.telephones

        functions.removeUndefineds(specialties)
        functions.removeUndefineds(exams)
        await firebase.firestore().collection('budgets').doc(copyPayload.id.toString()).set({ ...copyPayload })
        if (specialties) {
            let spec = await firebase.firestore().collection('budgets').doc(copyPayload.id.toString()).collection('specialties').get()
            spec.forEach((s) => {
                firebase.firestore().collection('budgets').doc(copyPayload.id.toString()).collection('specialties').doc(s.id).delete()
            })
            for (let spec in specialties) {
                await firebase.firestore().collection('budgets').doc(copyPayload.id.toString()).collection('specialties').add(specialties[spec])
            }
        }
        if (exams) {
            let spec = await firebase.firestore().collection('budgets').doc(copyPayload.id.toString()).collection('exams').get()
            spec.forEach((s) => {
                firebase.firestore().collection('budgets').doc(copyPayload.id.toString()).collection('exams').doc(s.id).delete()
            })
            for (let exam in exams) {
                functions.removeUndefineds(exams[exam])
                await firebase.firestore().collection('budgets').doc(copyPayload.id.toString()).collection('specialties').add(exams[exam])
            }
        }
        if (copyPayload.user) {
            // await firebase.firestore().collection('budgets').doc(payload.id.toString()).collection('user').doc(user.cpf).set(user)
            context.dispatch('addBudgetToUser', payload)
        }
        // copyPayload = Object.assign({}, payload)
    },
    async getBudget({ }, budgetId) {
        let budget = (await firebase.firestore().collection('budgets').doc(budgetId).get()).data();
        let specialtiesCol = await firebase.firestore().collection('budgets').doc(budgetId).collection('specialties').get()
        let examsCol = await firebase.firestore().collection('budgets').doc(budgetId).collection('exams').get()
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

    async addBudgetToUser({ }, payload) {
        let copyPayload = Object.assign({}, payload);
        functions.removeUndefineds(copyPayload)
        // console.log(copyPayload)
        // return
        let specialties = copyPayload.specialties ? Object.assign({}, copyPayload.specialties) : undefined
        let exams = copyPayload.exams ? Object.assign({}, copyPayload.exams) : undefined
        let user = copyPayload.user ? Object.assign({}, copyPayload.user) : undefined
        delete copyPayload.specialties
        delete copyPayload.exams
        delete copyPayload.user

        functions.removeUndefineds(specialties)
        functions.removeUndefineds(exams)



        let userRef = firebase.firestore().collection('users').doc(user.cpf)
        await userRef.collection('budgets').doc(copyPayload.id.toString()).set(copyPayload)

        if (specialties) {
            let spec = await userRef.collection('budgets').doc(copyPayload.id.toString()).collection('specialties').get()
            spec.forEach((s) => {
                userRef.collection('budgets').doc(copyPayload.id.toString()).collection('specialties').doc(s.id).delete()
            })
            for (let spec in specialties) {
                await userRef.collection('budgets').doc(copyPayload.id.toString()).collection('specialties').add(specialties[spec])
            }
        }
        if (exams) {
            let spec = await userRef.collection('budgets').doc(copyPayload.id.toString()).collection('exams').get()
            spec.forEach((s) => {
                userRef.collection('budgets').doc(copyPayload.id.toString()).collection('exams').doc(s.id).delete()
            })
            for (let exam in exams) {
                functions.removeUndefineds(exams[exam])
                await userRef.collection('budgets').doc(copyPayload.id.toString()).collection('specialties').add(exams[exam])
            }
        }
    },
    async addIntake(context, payload) {
        let copyPayload = Object.assign({}, payload);
        delete copyPayload.user.budgets
        delete copyPayload.user.consultations
        delete copyPayload.user.intakes

        let specialties = copyPayload.specialties ? Object.assign(copyPayload.specialties) : undefined;
        let exams = copyPayload.exams ? Object.assign({}, copyPayload.exams) : undefined;
        if (copyPayload.specialties) {
            copyPayload.specialties = Object.values(copyPayload.specialties)
        }
        if (copyPayload.exams) {
            copyPayload.exams = Object.values(copyPayload.exams)
        }
        // delete copyPayload.specialties;
        // delete copyPayload.exams;
        if (copyPayload.specialties) {
            for (let specialty of copyPayload.specialties) {
                console.log(specialty)
                if (specialty.doctor.clinics) {
                    delete specialty.doctor.clinics
                }
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
            let spec = await firebase.firestore().collection('intakes').doc(copyPayload.id.toString()).collection('specialties').get()
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
            let spec = await firebase.firestore().collection('intakes').doc(copyPayload.id.toString()).collection('exams').get()
            for (let doc in spec.docs) {
                await firebase.firestore().collection('intakes').doc(copyPayload.id.toString()).collection('exams').doc(spec.docs[doc].id).delete()
            }
            for (let exam in exams) {
                functions.removeUndefineds(exams[exam])
                await firebase.firestore().collection('intakes').doc(copyPayload.id.toString()).collection('exams').doc(exams[exam].name).set(exams[exam])
            }
        }
        if (copyPayload.user) {
            await context.dispatch('addIntakeToUser', payload)
        }

    },
    async verifyUnpaidConsultation(context, payload) {
        var consultationFound = undefined //variável usada para a tabela de procedimentos
        var precoVendaZero = payload.isConsultation && payload.specialty.price == 0
        if (!precoVendaZero) {
            let consultationRef =  payload.userRef.collection('consultations').where('specialty.name', '==', payload.specialty.name).where('status', '==', 'Aguardando pagamento')
                //.get()

            if(!payload.isConsultation)
                consultationRef.where('exam.name','==',payload.examObj.name)
            let consultations = await consultationRef.get()
            consultations.forEach(async (c) => {
                consultationFound = c
                context.dispatch('updatePaymentNumberConsultation', { user: payload.user, consultation: c, payment_number: payload.payment_number })
            })  
        }

        context.dispatch('createOrUpdateProcedure', { consultationFound: consultationFound, consultation:payload.consultation, precoVendaZero:precoVendaZero, userRef: payload.userRef, user: payload.user, isConsultation: payload.isConsultation, payment_number: payload.payment_number, specialty: payload.specialty, examObj: payload.examObj })
    },
    async createOrUpdateProcedure({ }, payload) {
        let consultationFound = payload.consultationFound
        let user = payload.user
        let statusName = payload.isConsultation ? 'Consulta Paga' : 'Exame Pago'
        let type = payload.isConsultation ? 'Consultation' : 'Exam'
        let clinic
        /* 
        console.log('-<>',payload)
        if (!payload.isConsultation) {
            clinic = { cnpj: payload.examObj.clinic.cnpj, name: payload.examObj.clinic.name }
        } */

        if (consultationFound || (payload.precoVendaZero && payload.isConsultation) ) {
            let consultation = payload.precoVendaZero && payload.isConsultation?  payload.consultation : consultationFound
            console.log('>>',payload.consultation)
            let procedures = await firebase.firestore().collection('users').doc(user.cpf).collection('procedures').where('consultation', '==', consultation.id)
                .get()

            if (!procedures.empty){
                console.log("Atualizando procedure")
                procedures.forEach((snap) => {
                    let data = snap.data()
                    let obj = {
                        status: firebase.firestore.FieldValue.arrayUnion(statusName),
                        payment_number: payload.payment_number
                    }
                    if (!payload.isConsultation) {
                        if(payload.examObj.clinic)
                            delete payload.examObj.clinic
                        //clinic = { cnpj: payload.examObj.clinic.cnpj, name: payload.examObj.clinic.name }
                        Object.assign(obj, { exam: { ...payload.examObj} });
                    }

                    firebase.firestore().collection('users').doc(user.cpf).collection('procedures').doc(snap.id).update(
                        { ...obj }
                    )
                })
            }
        } else {
            console.log("Criando procedure")
            let obj = {
                status: [statusName],
                payment_number: payload.payment_number,
                startAt: moment().format('YYYY-MM-DD hh:ss'),
                type: type,
                specialty: payload.specialty.name
            }

            if (!payload.isConsultation) {
                if(payload.examObj.clinic)
                    delete payload.examObj.clinic
                Object.assign(obj, { exam: { ...payload.examObj} });
            }
            firebase.firestore().collection('users').doc(user.cpf).collection('procedures').add(
                { ...obj }
            )
        }

    },
    async addIntakeToUser(context, payload) {
        let copyPayload = Object.assign({}, payload);
        functions.removeUndefineds(copyPayload)
        // return
        let specialties = copyPayload.specialties ? Object.assign({}, copyPayload.specialties) : undefined
        let exams = copyPayload.exams ? Object.assign({}, copyPayload.exams) : undefined
        let user = copyPayload.user ? Object.assign({}, copyPayload.user) : undefined
        delete copyPayload.specialties
        delete copyPayload.exams
        delete copyPayload.user

        functions.removeUndefineds(specialties)
        functions.removeUndefineds(exams)

        let userRef = firebase.firestore().collection('users').doc(user.cpf)
        await userRef.collection('intakes').doc(copyPayload.id.toString()).set(copyPayload)
        if (specialties) {
            let spec = await userRef.collection('intakes').doc(copyPayload.id.toString()).collection('specialties').get()
            spec.forEach((s) => {
                userRef.collection('intakes').doc(copyPayload.id.toString()).collection('specialties').doc(s.id).delete()
            })
            console.log('Vendo', specialties)
            for (let spec in specialties) {

                await userRef.collection('intakes').doc(copyPayload.id.toString()).collection('specialties').add({
                    ...specialties[spec]
                })

                context.dispatch('verifyUnpaidConsultation', { userRef: userRef, user: user, isConsultation: true,consultation:payload.consultation, payment_number: copyPayload.id.toString(), specialty: specialties[spec] })
            }
        }
        if (exams) {
            let spec = await userRef.collection('intakes').doc(copyPayload.id.toString()).collection('exams').get()
            spec.forEach((s) => {
                userRef.collection('intakes').doc(copyPayload.id.toString()).collection('exams').doc(s.id).delete()
            })
            for (let exam in exams) {
                console.log('->>',exams[exam])
                functions.removeUndefineds(exams[exam])
                await userRef.collection('intakes').doc(copyPayload.id.toString()).collection('exams').add({
                    ...exams[exam]
                })

                context.dispatch('verifyUnpaidConsultation', { userRef: userRef, user: user, isConsultation: false, payment_number: copyPayload.id.toString(), specialty: {name:exams[exam].type}, examObj: exams[exam] })
            }
        }
    },

    async updatePaymentNumberConsultation(context, payload) {
        await firebase.firestore().collection('users').doc(payload.user.cpf).collection('consultations').doc(payload.consultation.id).update({
            status: 'Pago',
            payment_number: payload.payment_number.toString()
        })
        await firebase.firestore().collection('consultations').doc(payload.consultation.id).update({
            status: 'Pago',
            payment_number: payload.payment_number.toString()
        })
    },

    async createProcedure(context, payload) {
        await firebase.firestore().collection('users').doc(payload.user.cpf).collection('procedures').add(
            {
                status: [payload.status],
                payment_number: payload.payment_number.toString(),
                startAt: moment().format('YYYY-MM-DD hh:ss'),
                type: 'Consultation',
                specialty: payload.specialty.name
            }
        )
    },

    async updateProcedure(context, payload) {
        let procedures = await firebase.firestore().collection('users').doc(payload.user.cpf).collection('procedures').where('consultation', '==', payload.consultation.id)
            .get()

        if (!procedures.empty) {
            console.log("Atualizando procedure")
            procedures.forEach(async (snap) => {
                await firebase.firestore().collection('users').doc(payload.user.cpf).collection('procedures').doc(snap.id).update(
                    {
                        status: firebase.firestore.FieldValue.arrayUnion(payload.status),
                        payment_number: payload.payment_number.toString()
                    }
                )
            })
        }
    },

    // async getColaboratorIntakes(context, colaborator) {
    //     let intakesSnap = (await firebase.firestore().collection('intakes').where('colaborator.name', '==', colaborator.name).get())
    //     let intakes = []
    //     let promises = []
    //     for (let snap in intakesSnap) {
    //         let doc = intakesSnap[snap]
    //         // let exams = []
    //         // let examSnap = await doc.ref.collection('exams').get()
    //         // examSnap.forEach((e) => {
    //         //     exams.push(e.data())
    //         // })
    //         // let consultationsSnap = await doc.ref.collection('consultations').get()
    //         // let consultations = []
    //         // consultationsSnap.forEach((e) => {
    //         //     consultations.push(e.data())
    //         // })
    //         intakes.push(doc.data())
    //     }
    //     for (let intake in intakes) {
    //         promises.push(context.dispatch('getIntakeDetails', intakes[intake]))
    //     }
    //     await Promise.all(promises)
    //     return intakes
    // },
    async getUserIntakes(context, user) {
        let userRef = firebase.firestore().collection('users').doc(user.cpf)
        let intakesSnap = (await userRef.collection('intakes').get()).docs
        let intakes = []
        for (let snap in intakesSnap) {
            let doc = intakesSnap[snap]
            intakes.push(doc.data())
        }
        return intakes
    },
    async getUserBudgets(context, user) {
        let userRef = firebase.firestore().collection('users').doc(user.cpf)
        let budgetsSnap = await userRef.collection('budgets').get()
        let budgets = []
        budgetsSnap.forEach((doc) => {
            budgets.push(doc.data())
        })
        return budgets
    },
    async getIntakeDetails(context, intake) {
        intake = await firebase.firestore().collection('intakes').doc(intake.id.toString()).get()
        intake = {
            ...intake.data(),
            id: intake.id
        }
        let examsSnap = await firebase.firestore().collection('intakes').doc(intake.id.toString()).collection('exams').get()
        let specialtiesSnap = await firebase.firestore().collection('intakes').doc(intake.id.toString()).collection('specialties').get()
        let exams = []
        let specialties = []
        examsSnap.forEach((e) => {
            exams.push(e.data())
        })
        specialtiesSnap.forEach((c) => {
            specialties.push(c.data())
        })
        intake.exams = exams
        intake.specialties = specialties
        return intake
    },

    async cancelIntake(context, intake) {
        await firebase.firestore().collection('intakes').doc(intake.id.toString()).update(
            {
                status: constants.INTAKE_STATUS.CANCELLED,
                cancelled_by: context.getters.user
            })
        await firebase.firestore().collection('users').doc(intake.user.cpf).collection('intakes').doc(intake.id.toString()).update(
            {
                status: constants.INTAKE_STATUS.CANCELLED,
                cancelled_by: context.getters.user
            })
        return
    },

    async thereIsIntakes({ commit }, payload) {
        var found = false
        let intakes
        return new Promise(async (resolve, reject) => {
            let examesSpecialties = ['ULTRASSONOGRAFIA', 'ELETROCARDIOGRAMA', 'ELETROENCEFALOGRAMA', 'ECOCARDIOGRAMA', 'VIDEOLARIGONSCOPIA']
            let procedures
            let type = payload.exam ? 'Exam' : 'Consultation'
            let status = payload.exam ? 'Exame Pago' : 'Consulta Paga'
            let procedureRef
            if(payload.status && payload.payment_number)
                procedureRef = firebase.firestore().collection('users').doc(payload.user.cpf).collection('procedures').where('type', '==', 'Consultation')
                .where('specialty', '==', payload.specialty.name).where('status', 'array-contains-any', payload.status).where('payment_number','==',payload.payment_number.toString())
            else{
                procedureRef = payload.exam ? procedureRef = firebase.firestore().collection('users').doc(payload.user.cpf).collection('procedures').where('type', '==', type)
                .where('specialty', '==', payload.specialty.name).where('status', '==', [status]).where('exam.name', '==', payload.exam.name)
                : procedureRef = firebase.firestore().collection('users').doc(payload.user.cpf).collection('procedures').where('type', '==', type)
                    .where('specialty', '==', payload.specialty.name).where('status', '==', [status])
            }    
            

            let procedureRefOr = firebase.firestore().collection('users').doc(payload.user.cpf).collection('procedures').where('type', '==', 'Exam')
                .where('specialty', '==', payload.specialty.name).where('status', '==', ['Exame Pago'])

            procedures = await procedureRef.get()
            if (procedures.empty && type == 'Consultation' && examesSpecialties.indexOf(payload.specialty.name) != -1)
                procedures = await procedureRefOr.get()

            if (!procedures.empty) {
                procedures.forEach((procedure) => {
                    resolve({ procedureId: procedure.id, ...procedure.data() })
                })
            } else {
                reject('Payment Number not found')
            }


            /* intakes = await firebase.firestore().collection('users').doc(payload.user.cpf).collection('intakes')/* .
            where('type', '==','specialty').where('used','==',false).where('name','==',payload.specialty.name)
            .where('doctor.cpf','==',payload.doctor.cpf) //
                .get()
            for (const key in intakes.docs) {

                let payment_number = intakes.docs[key].id
                let specialties
                specialties = await firebase.firestore().collection('users').doc(payload.user.cpf).collection('intakes')
                    .doc(payment_number).collection('specialties').where('name', '==', payload.specialty.name)
                    .where('used', '==', false)
                    .where('doctor.cpf', '==', payload.doctor.cpf).get()
                specialties.forEach((doc) => {
                    found = true
                    resolve({ uid: doc.id, ...doc.data(), payment_number: payment_number })
                })
            }

            if (!found) {
                reject('Payment Number not found')
            } */

        })
    },
    async findProcedureId({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            console.log('FindProcedureId', payload)
            let procedure = await firebase.firestore().collection('users').doc(payload.user.cpf).collection('procedures').where('payment_number', '==', payload.payment_number.toString()).get()
            procedure.forEach((proc) => {
                console.log('kjkjhk')
                if (proc.exists)
                    resolve(proc.id)
                else
                    reject()
            })
        });
    }
};

const getters = {};

export default {
    state,
    mutations,
    actions,
    getters
}
