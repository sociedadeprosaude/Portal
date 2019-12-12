import firebase from "firebase";
import functions from "../../utils/functions";
import moment from "moment";

const state = {};

const mutations = {};

const actions = {
    async addBudget(context, payload) {
        let originalPayload = Object.assign({}, payload)
        functions.removeUndefineds(payload)
        // console.log(payload)
        // return
        let specialties = payload.specialties ? Object.assign({}, payload.specialties) : undefined
        let exams = payload.exams ? Object.assign({}, payload.exams) : undefined
        // let user = payload.user ? Object.assign({}, payload.user) : undefined
        delete payload.specialties
        delete payload.exams
        // delete payload.user

        functions.removeUndefineds(specialties)
        functions.removeUndefineds(exams)


        await firebase.firestore().collection('budgets').doc(payload.id.toString()).set(payload)
        if (specialties) {
            let spec = await firebase.firestore().collection('budgets').doc(payload.id.toString()).collection('specialties').get()
            spec.forEach((s) => {
                firebase.firestore().collection('budgets').doc(payload.id.toString()).collection('specialties').doc(s.id).delete()
            })
            for (let spec in specialties) {
                await firebase.firestore().collection('budgets').doc(payload.id.toString()).collection('specialties').add(specialties[spec])
            }
        }
        if (exams) {
            let spec = await firebase.firestore().collection('budgets').doc(payload.id.toString()).collection('exams').get()
            spec.forEach((s) => {
                firebase.firestore().collection('budgets').doc(payload.id.toString()).collection('exams').doc(s.id).delete()
            })
            for (let exam in exams) {
                await firebase.firestore().collection('budgets').doc(payload.id.toString()).collection('specialties').add(exams[exam])
            }
        }
        if (payload.user) {
            // await firebase.firestore().collection('budgets').doc(payload.id.toString()).collection('user').doc(user.cpf).set(user)
            context.dispatch('addBudgetToUser', originalPayload)
        }
        payload = Object.assign({}, originalPayload)
    },
    async getBudget({}, budgetId) {
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

    async addBudgetToUser({}, payload) {
        functions.removeUndefineds(payload)
        // console.log(payload)
        // return
        let specialties = payload.specialties ? Object.assign({}, payload.specialties) : undefined
        let exams = payload.exams ? Object.assign({}, payload.exams) : undefined
        let user = payload.user ? Object.assign({}, payload.user) : undefined
        delete payload.specialties
        delete payload.exams
        delete payload.user

        functions.removeUndefineds(specialties)
        functions.removeUndefineds(exams)

        let userRef = firebase.firestore().collection('users').doc(user.cpf)
        await userRef.collection('budgets').doc(payload.id.toString()).set(payload)

        if (specialties) {
            let spec = await userRef.collection('budgets').doc(payload.id.toString()).collection('specialties').get()
            spec.forEach((s) => {
                userRef.collection('budgets').doc(payload.id.toString()).collection('specialties').doc(s.id).delete()
            })
            for (let spec in specialties) {
                await userRef.collection('budgets').doc(payload.id.toString()).collection('specialties').add(specialties[spec])
            }
        }
        if (exams) {
            let spec = await userRef.collection('budgets').doc(payload.id.toString()).collection('exams').get()
            spec.forEach((s) => {
                userRef.collection('budgets').doc(payload.id.toString()).collection('exams').doc(s.id).delete()
            })
            for (let exam in exams) {
                await userRef.collection('budgets').doc(payload.id.toString()).collection('specialties').add(exams[exam])
            }
        }
    },
    async addIntake(context, payload) {
        let originalPayload = Object.assign({}, payload);
        console.log('payload total', payload);
        functions.removeUndefineds(payload);
        // console.log(payload)
        // return
        let specialties = payload.specialties ? Object.assign({}, payload.specialties) : undefined;
        let exams = payload.exams ? Object.assign({}, payload.exams) : undefined;
        // let user = payload.user ? Object.assign({}, payload.user) : undefined
        delete payload.specialties;
        delete payload.exams;
        // delete payload.user

        functions.removeUndefineds(specialties);
        functions.removeUndefineds(exams);


        await firebase.firestore().collection('intakes').doc(payload.id.toString()).set(payload);
        if (specialties) {
            let spec = await firebase.firestore().collection('intakes').doc(payload.id.toString()).collection('specialties').get()
            spec.forEach((s) => {
                firebase.firestore().collection('intakes').doc(payload.id.toString()).collection('specialties').doc(s.id).delete()
            })
            for (let spec in specialties) {
                if (specialties[spec].doctor.rules === null) {
                    delete specialties[spec].doctor.rules
                }
                await firebase.firestore().collection('intakes').doc(payload.id.toString()).collection('specialties').add(specialties[spec])
            }
        }
        if (exams) {
            let spec = await firebase.firestore().collection('intakes').doc(payload.id.toString()).collection('exams').get()
            spec.forEach((s) => {
                firebase.firestore().collection('intakes').doc(payload.id.toString()).collection('exams').doc(s.id).delete()
            })
            for (let exam in exams) {
                if (exams[exam].rules === undefined) {
                    delete exams[exam].rules;
                }
                await firebase.firestore().collection('intakes').doc(payload.id.toString()).collection('exams').add(exams[exam])
            }
        }
        if (payload.user) {
            console.log('adicionar no usuario')
            // await firebase.firestore().collection('budgets').doc(payload.id.toString()).collection('user').doc(user.cpf).set(user)
            context.dispatch('addIntakeToUser', originalPayload)
        }
        payload = Object.assign({}, originalPayload)

    },
    async addIntakeToUser({}, payload) {
        functions.removeUndefineds(payload)
        // console.log(payload)
        // return
        let specialties = payload.specialties ? Object.assign({}, payload.specialties) : undefined
        let exams = payload.exams ? Object.assign({}, payload.exams) : undefined
        let user = payload.user ? Object.assign({}, payload.user) : undefined
        delete payload.specialties
        delete payload.exams
        delete payload.user

        functions.removeUndefineds(specialties)
        functions.removeUndefineds(exams)

        let userRef = firebase.firestore().collection('users').doc(user.cpf)
        await userRef.collection('intakes').doc(payload.id.toString()).set(payload)
        if (specialties) {
            let spec = await userRef.collection('intakes').doc(payload.id.toString()).collection('specialties').get()
            spec.forEach((s) => {
                userRef.collection('intakes').doc(payload.id.toString()).collection('specialties').doc(s.id).delete()
            })
            
            for (let spec in specialties) {
                var used = false
                let consultations = await userRef.collection('consultations').where('specialty.name','==',specialties[spec].name).where('status','==','Aguardando pagamento')
                .get()
                
                consultations.forEach((c)=>{
                    console.log('kj')
                    used = true
                    userRef.collection('consultations').doc(c.id).update({status: 'Pago',payment_number:payload.id.toString()})
                    firebase.firestore().collection('consultations').doc(c.id).update({status: 'Pago',payment_number:payload.id.toString()})
                })

                console.log('pagando')
                await userRef.collection('intakes').doc(payload.id.toString()).collection('specialties').add({
                    ...specialties[spec],
                    used: used
                })
            }
        }
        if (exams) {
            let spec = await userRef.collection('intakes').doc(payload.id.toString()).collection('exams').get()
            spec.forEach((s) => {
                userRef.collection('intakes').doc(payload.id.toString()).collection('exams').doc(s.id).delete()
            })
            for (let exam in exams) {
                await userRef.collection('intakes').doc(payload.id.toString()).collection('exams').add({
                    ...exams[exam],
                    used: false
                })
            }
        }
    },
    async getUserIntakes(context, user) {
        let userRef = firebase.firestore().collection('users').doc(user.cpf)
        let intakesSnap = await userRef.collection('intakes').get()
        let intakes = []
        intakesSnap.forEach((doc) => {
            intakes.push(doc.data())
        })
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

    thereIsIntakes({commit}, payload) {
        console.log(payload.specialty.name)
        return new Promise((resolve, reject) => {
            firebase.firestore().collection('users').doc(payload.user.cpf).collection('intakes')/* .
            where('type', '==','specialty').where('used','==',false).where('name','==',payload.specialty.name)
            .where('doctor.cpf','==',payload.doctor.cpf) */
                .get()
                .then((intakes) => {
                    /* if(!snap.empty){
                        snap.forEach((doc)=>{
                            resolve({id: doc.id,...doc.data()})
                        })
                    }else{
                        reject('Invoice not found!')
                    } */
                    var found = false
                    intakes.forEach((intake) => {
                        let data = intake.data()
                        let payment_number = intake.id
                        firebase.firestore().collection('users').doc(payload.user.cpf).collection('intakes')
                            .doc(payment_number).collection('specialties').where('name', '==', payload.specialty.name)
                            .where('used', '==', false)
                            .where('doctor.cpf', '==', payload.doctor.cpf).get().then((specialties) => {
                            if (!specialties.empty) {
                                specialties.forEach((doc) => {
                                    console.log('encontrou aqui')
                                    resolve({uid: doc.id, ...doc.data(), payment_number: payment_number})
                                })

                            }
                        })
                    })
                    /*  if(!found)
                         reject('Payment Number not found') */

                }).catch(() => {
                reject('Error!')
            })
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
