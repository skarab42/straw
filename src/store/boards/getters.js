export function getBoardByAddress (state) {
  return function (address) {
    return state.collection.filter(board => board.address === address).shift()
  }
}

export function getBoardByName (state) {
  return function (name) {
    return state.collection.filter(board => board.name === name).shift()
  }
}

export function selectedBoard (state) {
  let ret = null
  state.collection.some(board => {
    if (board.selected) {
      ret = board
      return true
    }
    return false
  })
  return ret
}

export function getSortedCollectionByName (state) {
  let c = [ ...state.collection ]
  return c.sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })
}
