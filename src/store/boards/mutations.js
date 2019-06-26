import { getBoardByAddress } from './getters'

export function update (state, payload) {
  state.collection = state.collection.map(board => {
    if (board.address === payload.address) {
      return { ...board, ...payload }
    }
    return board
  })
}

export function set (state, payload) {
  // add new board
  let newBoard = {
    selected: false,
    loading: false,
    path: '/sd',
    files: [],
    ...payload
  }
  if (!getBoardByAddress(state)(newBoard.address)) {
    state.collection.push(newBoard)
    return
  }
  // replace board
  state.collection = state.collection.map(oldBoard => {
    if (oldBoard.address === newBoard.address) {
      return newBoard
    }
    return oldBoard
  })
}

export function remove (state, payload) {
  state.collection = state.collection.filter(board => board.address !== payload.address)
}

export function select (state, payload) {
  state.collection = state.collection.map(board => {
    board.selected = board.address === payload.address
    return board
  })
}

export function unselect (state, payload) {
  state.collection = state.collection.map(board => {
    board.selected = false
    return board
  })
}
