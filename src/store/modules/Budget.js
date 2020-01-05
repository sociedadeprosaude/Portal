import firebase from "firebase";
import functions from "../../utils/functions";
import moment from "moment";
import constants from "../../utils/constants";

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
        functions.removeUndefineds(copyPayload);
        // console.log(copyPayload)
        // return
        let specialties = copyPayload.specialties ? Object.assign({}, copyPayload.specialties) : undefined;
        let exams = copyPayload.exams ? Object.assign({}, copyPayload.exams) : undefined;
        // let user = copyPayload.user ? Object.assign({}, copyPayload.user) : undefined
        delete copyPayload.specialties;
        delete copyPayload.exams;
        // delete copyPayload.user

        functions.removeUndefineds(specialties);
        functions.removeUndefineds(exams);


        await firebase.firestore().collection('intakes').doc(copyPayload.id.toString()).set(copyPayload);
        if (specialties) {
            let spec = await firebase.firestore().collection('intakes').doc(copyPayload.id.toString()).collection('specialties').get()
            for (let doc in spec.docs) {
                await firebase.firestore().collection('intakes').doc(copyPayload.id.toString()).collection('specialties').doc(spec.docs[doc].id).delete()
            }
            // spec.forEach((s) => {
            // })
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
            // spec.forEach((s) => {
            //     firebase.firestore().collection('intakes').doc(copyPayload.id.toString()).collection('exams').doc(s.id).delete()
            // })
            for (let exam in exams) {
                functions.removeUndefineds(exams[exam])
                // if (exams[exam].rules === undefined) {
                //     delete exams[exam].rules;
                // }
                await firebase.firestore().collection('intakes').doc(copyPayload.id.toString()).collection('exams').doc(exams[exam].name).set(exams[exam])
            }
        }
        if (copyPayload.user) {
            // await firebase.firestore().collection('budgets').doc(payload.id.toString()).collection('user').doc(user.cpf).set(user)
            context.dispatch('addIntakeToUser', payload)
        }
        // payload = Object.assign({}, payload)

    },
    async addIntakeToUser({ }, payload) {
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
        await userRef.collection('intakes').doc(copyPayload.id.toString()).set(copyPayload)
        if (specialties) {
            let spec = await userRef.collection('intakes').doc(copyPayload.id.toString()).collection('specialties').get()
            spec.forEach((s) => {
                userRef.collection('intakes').doc(copyPayload.id.toString()).collection('specialties').doc(s.id).delete()
            })

            for (let spec in specialties) {
                //var used = false
                var consultationFound = undefined //variável usada para a tabela de procedimentos
                let consultations = await userRef.collection('consultations').where('specialty.name', '==', specialties[spec].name).where('status', '==', 'Aguardando pagamento')
                    .get()

                consultations.forEach((c) => {
                    //used = true
                    consultationFound = c
                    userRef.collection('consultations').doc(c.id).update({
                        status: 'Pago',
                        payment_number: copyPayload.id.toString()
                    })
                    firebase.firestore().collection('consultations').doc(c.id).update({
                        status: 'Pago',
                        payment_number: copyPayload.id.toString()
                    })
                })

                await userRef.collection('intakes').doc(copyPayload.id.toString()).collection('specialties').add({
                    ...specialties[spec],
                    //used: used
                })

                if (consultationFound) {
                    let procedures = await firebase.firestore().collection('users').doc(user.cpf).collection('procedures').where('consultation', '==', consultationFound.id)
                        .get()

                    if (!procedures.empty) {
                        console.log("Atualizando procedure")
                        procedures.forEach((snap) => {
                            let data = snap.data()
                            firebase.firestore().collection('users').doc(user.cpf).collection('procedures').doc(snap.id).update(
                                { 
                                    status: firebase.firestore.FieldValue.arrayUnion('Consulta Paga'),
                                    payment_number: copyPayload.id.toString() 
                                }
                            )
                        })
                    }
                }else{
                    console.log("Criando procedure")
                    firebase.firestore().collection('users').doc(user.cpf).collection('procedures').add(
                        {
                            status:['Consulta Paga'],
                            payment_number:copyPayload.id.toString(),
                            startAt: moment().format('YYYY-MM-DD hh:ss'),
                            type:'Consultation',
                            specialty:specialties[spec].name
                        }
                    )
                }
            }
        }
        if (exams) {
            let spec = await userRef.collection('intakes').doc(copyPayload.id.toString()).collection('exams').get()
            spec.forEach((s) => {
                userRef.collection('intakes').doc(copyPayload.id.toString()).collection('exams').doc(s.id).delete()
            })
            for (let exam in exams) {
                functions.removeUndefineds(exams[exam])
                await userRef.collection('intakes').doc(copyPayload.id.toString()).collection('exams').add({
                    ...exams[exam],
                    used: false
                })
            }
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
        // let intakesSnap = (await firebase.firestore().collection('intakes').where('user.cpf', '==', user.cpf).get()).docs
        let intakes = []
        for (let snap in intakesSnap) {
            let doc = intakesSnap[snap]
            // let exams = []
            // let examSnap = await doc.ref.collection('exams').get()
            // examSnap.forEach((e) => {
            //     exams.push(e.data())
            // })
            // let consultationsSnap = await doc.ref.collection('consultations').get()
            // let consultations = []
            // consultationsSnap.forEach((e) => {
            //     consultations.push(e.data())
            // })
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
        intake = intake.data()
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
            let procedures
            procedures = await firebase.firestore().collection('users').doc(payload.user.cpf).collection('procedures').where('type','==','Consultation')
            .where('specialty','==',payload.specialty.name).where('status','==',['Consulta Paga']).get()
            if(!procedures.empty){
                procedures.forEach((procedure)=>{
                    console.log('Encontrou!')
                    resolve({ procedureId: procedure.id, ...procedure.data() })
                })
            }else{
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

        }).catch(() => {
            reject('Error!')
        })

    }

};

const getters = {};

export default {
    state,
    mutations,
    actions,
    getters
}
