
import axios from "axios";

var xml2js = require('xml2js');
const qs = require('query-string');

const credentials = "email=andrebluee96@gmail.com&token=A97F0051D0A3452C939DCE51C37B1872";

const state = {
    sessionId: null,
    senderHash: null,
    loaded: false,
    lastBudget: null
};

const mutations = {
    setSessionId: (state, payload) => state.sessionId = payload,
    setSenderHash: (state, payload) => {
        state.loaded = true;
        state.senderHash = payload
    },
    pagSeguroLoaded: (state, payload) => state.loaded = payload,
    setLastBudget: (state, payload) => state.lastBudget = payload

};

// 1 gerar secao
// 2 setar secao
// 3 setar hash
// 4 gerar token
//
const actions = {
    //TODO: testar depois em production por causa do cors
    setSessionId({ commit, dispatch }, payload) {
        commit('pagSeguroLoaded', false);
        axios
            .post(
                "https://ws.sandbox.pagseguro.uol.com.br/v2/sessions?" + credentials,
            )
            .then(response => {
                xml2js.parseString(response.data, function (err, result) {
                    if (!err) {
                        const sessionId = result.session.id[0];
                        console.log(result);
                        PagSeguroDirectPayment.setSessionId(sessionId);
                        commit('setSessionId', sessionId);
                        dispatch('setSenderHash', sessionId);
                    }
                });
            })
            .catch(e => {
                console.log(e);
            });
    },

    setSenderHash({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            PagSeguroDirectPayment.onSenderHashReady((response) => {
                if (response.status == 'error') {
                    console.log(response.message);
                    reject(response);
                } else {
                    var hash = response.senderHash;
                    console.log('hash: ' + hash);
                    commit('setSenderHash', hash);
                    resolve(hash);
                }
            });
        });
    },

    getPaymentMethods(context, payload) {
        return new Promise(async (resolve, reject) => {
            PagSeguroDirectPayment.getPaymentMethods({
                amount: payload,
                success: (response) => resolve(response),
                error: (response) => reject(response),
                complete: function (response) {
                    console.log("complete")
                    console.log(response)
                }
            });
        });
    },

    createCardToken(context, payload) {
        return new Promise(async (resolve, reject) => {
            PagSeguroDirectPayment.createCardToken({
                cardNumber: payload.cardNumber,
                brand: payload.brand,
                cvv: payload.cvv,
                expirationMonth: payload.expirationMonth,
                expirationYear: payload.expirationYear, // Ano da expiração do cartão, é necessário os 4 dígitos.
                success: (response) => resolve(response),
                error: (response) => reject(response),
                complete: function (response) { }
            });
        });
    },
    //boleto
    checkoutBill({ }, payload) {
        return new Promise(async (resolve, reject) => {
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            axios.post('https://ws.sandbox.pagseguro.uol.com.br/v2/transactions?' + credentials, qs.stringify(payload), config)
                .then(response => {
                    console.log(response);
                    xml2js.parseString(response.data, function (err, result) {
                        if (!err)
                            resolve(result);
                        else
                            resolve(response);
                    });
                })
                .catch(e => xml2js.parseString(e.response.data, (err, result) => reject(result)));
        });
    },
    checkoutCard({ }, payload) {
        return new Promise(async (resolve, reject) => {
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            axios.post('https://ws.sandbox.pagseguro.uol.com.br/v2/transactions?' + credentials, qs.stringify(payload), config)
                .then(response => {
                    xml2js.parseString(response.data, function (err, result) {
                        if (!err)
                            resolve(result);
                        else
                            resolve(response);
                    });
                })
                .catch(e => xml2js.parseString(e.response.data, (err, result) => reject(result)));
        });

    },
    

    //===================================== Mocks ==========================================

    mockSetSessionId(context, payload) {
        context.commit('setSessionId', payload);
        PagSeguroDirectPayment.setSessionId(payload);
        context.dispatch('setSenderHash', payload);
    },

    setLastBudget: ({ commit }, payload) => commit('setLastBudget', payload),

    mockCreateCardToken(context, payload) {
        return new Promise(async (resolve, reject) => {
            PagSeguroDirectPayment.createCardToken({
                cardNumber: '4111111111111111',
                brand: 'visa',
                cvv: '013',
                expirationMonth: '12',
                expirationYear: '2026', // Ano da expiração do cartão, é necessário os 4 dígitos.
                success: (response) => {
                    console.log("card token: " + response);
                    resolve(response)
                },
                error: (response) => reject(response),
                complete: function (response) {
                    console.log("complete")
                    console.log(response)
                }
            });
        });
    },

    mockCheckoutCard({ }, payload) {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        var obj = {
            paymentMode: "default",
            paymentMethod: "creditCard",
            receiverEmail: "andrebluee96@gmail.com",
            currency: "BRL",
            extraAmount: "0.00",
            itemId1: "0001",
            itemDescription1: "Noteboata",
            itemAmount1: "10.00",
            itemQuantity1: "1",
            notificationURL: "https://asdcacao.html",
            reference: "REF1234",
            senderName: "Jose silva",
            senderCPF: "22111944785",
            senderAreaCode: "11",
            senderPhone: "56273440",
            senderEmail: "comprador@sandbox.pagseguro.com.br",
            senderHash: "74af41832b8bfab892001f17947c63f757142c240c233a07f52328650c3f7668", //hash
            shippingAddressStreet: "Ava",
            shippingAddressNumber: "1384",
            shippingAddressComplement: "5dar",
            shippingAddressDistrict: "Jardulistano",
            shippingAddressPostalCode: "01452002",
            shippingAddressCity: "Saulo",
            shippingAddressState: "SP",
            shippingAddressCountry: "BRA",
            shippingType: "1",
            shippingCost: "0.00",
            creditCardToken: "edd7ecf383684befa0d9c5613972c43c", //tokenCartao
            installmentQuantity: "1",
            installmentValue: "10.00",
            noInterestInstallmentQuantity: "5",
            creditCardHolderName: "Jose silva",
            creditCardHolderCPF: "22111944785",
            creditCardHolderBirthDate: "10/10/1995",
            creditCardHolderAreaCode: "11",
            creditCardHolderPhone: "56273440",
            billingAddressStreet: "Ava",
            billingAddressNumber: "1384",
            billingAddressComplement: "5dar",
            billingAddressDistrict: "Jardiaulistano",
            billingAddressPostalCode: "01452002",
            billingAddressCity: "Saulo",
            billingAddressState: "SP",
            billingAddressCountry: "BRA"
        };

        axios.post('https://ws.sandbox.pagseguro.uol.com.br/v2/transactions?' + credentials, qs.stringify(obj), config)
            .then(response => {
                console.log(response);
                xml2js.parseString(response.data, function (err, result) {
                    console.log(result);
                });
            })
            .catch(e => {
                console.log(xml2js.parseString(e.response.data, function (err, result) {
                    console.log(result);
                }));
            });

    },

    mockCheckoutBill({ }, payload) {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        var obj = {
            paymentMethod: "boleto",
            paymentMode: "default",
            currency: "BRL",
            extraAmount: "0.00",
            itemId1: "0001",
            itemDescription1: "Notebata",
            itemAmount1: "24300.00",
            itemQuantity1: "1",
            notificationURL: "http://localhost:8080",
            reference: "REF1234",
            senderName: "vue teste",
            senderCPF: "22111944785",
            senderAreaCode: "11",
            senderPhone: "56273440",
            senderEmail: "vueteste@sandbox.pagseguro.com.br",
            senderHash: "a8ee350a9cd6b5002f065efc838aa13f197486bc9269db3d23655d757edb5984",
            shippingAddressStreet: "Ama",
            shippingAddressNumber: "1384",
            shippingAddressComplement: "5dar",
            shippingAddressDistrict: "Jardistano",
            shippingAddressPostalCode: "01452002",
            shippingAddressCity: "Saulo",
            shippingAddressState: "SP",
            shippingAddressCountry: "BRA"
        };

        var builder = new xml2js.Builder();
        var xml = builder.buildObject(obj);
        console.log(xml)

        axios.post('https://ws.sandbox.pagseguro.uol.com.br/v2/transactions?' + credentials, qs.stringify(obj), config)
            .then(response => {
                console.log(response);
                xml2js.parseString(response.data, function (err, result) {
                    console.log(err);
                    console.log(result);
                });
            })
            .catch(e => console.log(e));

    },
};

const getters = {
    sessionId: (state) => state.sessionId,
    senderHash: (state) => state.senderHash,
    pagSeguroLoaded: (state) => state.loaded,

    lastBudget: (state) => state.lastBudget,



};

export default {
    state,
    mutations,
    actions,
    getters
}
