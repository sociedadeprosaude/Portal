import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://caixa.instituicaoprosaude.com:82'
})

instance.defaults.headers.common['Accept'] = 'application/json'

const state = {
  infos: []
}

const mutations = {
  resetInfo(state) {
    state.infos = []
  },
  addInfo(state, payload) {
    state.infos.push(payload)
  },
}

const actions = {
  resetInfo({commit}) {
    commit('resetInfo')
    return
  },
  async getInfos({commit}, payload) {
      instance.get('/api/profits', {
        params: {
          from: payload.start_date.format('YYYY-MM-DD'),
          to: payload.start_date.add(30, 'days').format('YYYY-MM-DD')
        }
      })
        .then(response => {
          commit('addInfo', {
            ...response.data,
            data: payload.start_date
          })
          // payload.start_date.add(30, 'days')
          if (payload.final_date.diff(payload.start_date, 'days') > 1) {
            this.dispatch('getInfos', {
              start_date: payload.start_date,
              final_date: payload.final_date
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
  },
}

const getters = {
  reportInfo(state) {
    return state.infos
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}
