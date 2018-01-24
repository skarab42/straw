import { getFirmwareCommits } from '@/libs/smoothie-happy'

const HOUR = 3600
const UPDATE_INTERVAL = HOUR * 24

export default {
  namespaced: true,

  state: {
    firmwareCommitsTime: 0,
    firmwareCommits: {}
  },

  getters: {
    firmwareCommitsTime: state => state.firmwareCommitsTime,
    firmwareCommits: state => state.firmwareCommits,
    getFirmwareCommit: state => hash => state.firmwareCommits[hash] || null,

    getFirmwareCommitIndex: (state, getters) => hash => {
      let commit = getters.getFirmwareCommit(hash)

      if (!commit) {
        return Infinity
      }

      return commit.index
    }
  },

  mutations: {
    'SET_COMMITS_TIME' (state, time) {
      state.firmwareCommitsTime = time
    },

    'SET_COMMITS' (state, commits) {
      state.firmwareCommits = commits
    }
  },

  actions: {
    updateFirmwareCommits ({ state, commit }) {
      let time = Date.now()
      let interval = time - state.firmwareCommitsTime

      if (interval < UPDATE_INTERVAL) {
        return
      }

      getFirmwareCommits().then(commits => {
        commit('SET_COMMITS_TIME', time)
        commit('SET_COMMITS', commits)
      })
      .catch(e => {
        this.dispatch('logs/pushMessage', {
          type: 'error',
          text: 'Get firmware commits : ' + e.message
        })
      })
    }
  }
}
