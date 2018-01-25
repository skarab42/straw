import bus from '@/bus'

function createBoard (board) {
  return {
    name: board.address,
    selected: false,
    version: {},
    ...board
  }
}

export default {
  namespaced: true,

  state: {
    boardsCollection: [],
    selectedBoardAddress: null
  },

  getters: {
    boardsCollection: state => state.boardsCollection,
    boardsCount: state => state.boardsCollection.length,
    selectedBoardAddress: state => state.selectedBoardAddress,

    hasBoard: state => board => {
      return state.boardsCollection.some(b => b.address === board.address)
    },

    getBoard: state => address => {
      return state.boardsCollection.filter(b => b.address === address)[0] || {}
    }
  },

  mutations: {
    'ADD_BOARD' (state, board) {
      state.boardsCollection.push(board)
    },

    'UPDATE_BOARD' (state, board) {
      state.boardsCollection = state.boardsCollection.map(b => {
        if (b.address === board.address) {
          Object.assign(b, board)
        }

        return b
      })
    },

    'REMOVE_BOARD' (state, board) {
      state.boardsCollection = state.boardsCollection.filter(b => {
        return b.address !== board.address
      })
    },

    'SET_SELECTED_BOARD_ADDRESS' (state, address) {
      state.selectedBoardAddress = address
    }
  },

  actions: {
    addBoard ({ commit, getters }, board) {
      if (getters.hasBoard(board)) {
        commit('UPDATE_BOARD', { address: board.address, version: board.version })
      } else {
        let newBoard = createBoard(board)
        commit('ADD_BOARD', newBoard)
        bus.$emit('boards.addBoard', newBoard)
      }
    },

    removeBoard ({ state, commit }, board) {
      if (board.address === state.selectedBoardAddress) {
        commit('SET_SELECTED_BOARD_ADDRESS', null)
      }

      commit('REMOVE_BOARD', board)
      bus.$emit('boards.removeBoard', board)
    },

    selectBoard ({ state, commit }, board) {
      if (!board.selected) {
        if (state.selectedBoardAddress) {
          // unselect current board
          commit('UPDATE_BOARD', {
            address: state.selectedBoardAddress,
            selected: false
          })
        }

        commit('UPDATE_BOARD', { ...board, selected: true })
        commit('SET_SELECTED_BOARD_ADDRESS', board.address)
      }
    },

    setBoardName ({ commit }, { address, name }) {
      commit('UPDATE_BOARD', { address, name })
    }
  }
}
