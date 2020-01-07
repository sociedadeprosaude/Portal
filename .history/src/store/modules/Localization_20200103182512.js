import axios from 'axios'

const state = {
    user: {},
    permissions: []
}

const mutations = {}

const actions = {
    async getAddressByCep({}, cep) {
        try {
            let resp = await axios.get('https://viacep.com.br/ws/' + cep + '/json/')
            return resp.data
        } catch (e) {
            throw e
        }
    },
}

const getters = {}

export default {
    state,
    mutations,
    actions,
    getters
}
