import firebase from "firebase";
import functions from "../../utils/functions";
import moment from "moment";

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
        await firebase.firestore().collection('budgets').doc(copyPayload.id.toString()).set({...copyPayload})
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
        let budget = (await firebase.firestore().collection('budgets').doc(budgetId).get()).data()
        let specialtiesCol = await firebase.firestore().collection('budgets').doc(budgetId).collection('specialties').get()
        let examsCol = await firebase.firestore().collection('budgets').doc(budgetId).collection('exams').get()
        let specialties = []
        let exams = []
        specialtiesCol.forEach((s) => {
            specialties.push(s.data())
        })
        examsCol.forEach((e) => {
            exams.push(e.data())
        })
        budget['specialties'] = specialties
        budget['exams'] = exams

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
                var used = false
                let consultations = await userRef.collection('consultations').where('specialty.name', '==', specialties[spec].name).where('status', '==', 'Aguardando pagamento')
                    .get()

                consultations.forEach((c) => {
                    console.log('kj')
                    used = true
                    userRef.collection('consultations').doc(c.id).update({
                        status: 'Pago',
                        payment_number: copyPayload.id.toString()
                    })
                    firebase.firestore().collection('consultations').doc(c.id).update({
                        status: 'Pago',
                        payment_number: copyPayload.id.toString()
                    })
                })

                console.log('pagando')
                await userRef.collection('intakes').doc(copyPayload.id.toString()).collection('specialties').add({
                    ...specialties[spec],
                    used: used
                })
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
    //    async addSale({commit},payload){
    //
    //        firebase.firestore().collection('intakes').doc(payload.invoice).set({
    //            package_id: payload.package_id,
    //            invoice: payload.invoice,
    //            price: payload.price,
    //            form_payment: payload.form_payment,
    //            percentageDiscount: payload.percentageDiscount,
    //            moneyDiscount: payload.moneyDiscount,
    //            date: payload.date,
    //            cost: payload.cost,
    //            /* medicoDia: this.medicoDia */
    //            user:payload.user
    //        }).then(()=>{
    //            payload.consultations.forEach((obj)=>{
    //                firebase.firestore().collection('intakes').doc(payload.invoice).collection('specialties')
    //                .doc(obj.name).set(obj)
    //            })
    //        })
    //
    //        payload.consultations.forEach((obj)=>{
    //            firebase.firestore().collection('users').doc(payload.user.cpf).collection('intakes').add({
    //                type:"specialty",
    //                price:obj.price,
    //                doctor:obj.doctor,
    //                invoice:payload.invoice,
    //                used:false,
    //                name:obj.name,
    //                cost:obj.cost
    //            })
    //        })
    //
    //
    //        /* firebase.firestore().collection('users').doc(payload.user.cpf).collection('intakes').add({
    //            package_id: payload.package_id,
    //            invoice: payload.invoice,
    //            price: payload.price,
    //            form_payment: payload.form_payment,
    //            percentageDiscount: payload.percentageDiscount,
    //            moneyDiscount: payload.moneyDiscount,
    //            date: payload.date,
    //            cost: payload.cost,
    //            /* medicoDia: this.medicoDia
    //        }).then(()=>{
    //
    //        }) */
    //        /* firebase.firestore().collection('users/' + payload.cpf + '/consultations').set(payload.consultations);
    //        firebase.firestore().collection('users/' + payload.cpf + '/exams').set(payload.exams);
    // */
    //    },

    async thereIsIntakes({ commit }, payload) {
        var found = false
        let intakes
        return new Promise(async (resolve, reject) => {
            intakes = await firebase.firestore().collection('users').doc(payload.user.cpf).collection('intakes')/* .
            where('type', '==','specialty').where('used','==',false).where('name','==',payload.specialty.name)
            .where('doctor.cpf','==',payload.doctor.cpf) */
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
            }

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
