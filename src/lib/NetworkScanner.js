import Board from './smoothie-happy/Board'
import { validIP, validHostname } from './network-utils'

function parseInput (input) {
  // reset queue
  let queue = []

  // input array
  let inputArray = input

  // split input on comma if not an array
  if (typeof inputArray === 'string') {
    inputArray = inputArray.split(',')
  }

  // too short or not defined
  if (!inputArray || inputArray.length === 0) {
    throw new Error('Invalid input.')
  }

  // trim input parts
  inputArray = inputArray.map(function (part) {
    return part.trim()
  })

  // for each parts
  for (let y = 0, yl = inputArray.length; y < yl; y++) {
    // current part
    let currentInput = inputArray[y]

    if (/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.\*$/.test(currentInput)) {
      // Wildcard | ex.: [192.168.1.*]
      let currentInputParts = currentInput.split('.')
      currentInputParts.pop() // remove last part (*)
      let baseIp = currentInputParts.join('.')
      for (let i = 0; i <= 255; i++) {
        queue.push(baseIp + '.' + i)
      }
    } else if (validIP(currentInput)) {
      // Single ip | ex.: [192.168.1.55]
      queue.push(currentInput)
    } else if (/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}-[0-9]{1,3}$/.test(currentInput)) {
      // Ip's range | ex.: [192.168.1.50-100]
      let currentInputParts = currentInput.split('.')
      let currentInputRange = currentInputParts.pop().split('-') // last part (xxx-xxx)
      let baseIp = currentInputParts.join('.')
      for (let i = currentInputRange[0], il = currentInputRange[1]; i <= il; i++) {
        queue.push(baseIp + '.' + i)
      }
    } else if (validHostname(currentInput)) {
      // Hostname | ex.: [www.host.name]
      queue.push(currentInput)
    } else {
      // Invalid...
      throw new Error('Invalid input.')
    }
  }

  // return
  return queue
}

export default class NetworkScanner {
  constructor () {
    this.reset()
  }

  reset () {
    this.input = ''
    this.queue = []
    this.timeout = 2000
    this.scanning = false
    this.aborted = false
    this.total = 0
    this.scanned = 0
    this.found = 0
    this.boards = []
    this.onProgress = (progress) => {}
    this.onBoard = (board) => {}
    this.onDone = (boards) => {}
  }

  setInput (input) {
    this.reset()
    this.input = input
    this.queue = parseInput(input)
  }

  setTimeout (timeout) {
    this.timeout = timeout
  }

  processQueue () {
    if (!this.scanning) {
      return false
    }

    this.onProgress({
      scanned: this.scanned,
      total: this.total,
      percent: 100 / this.total * this.scanned,
      found: this.found
    })

    // shift first address from the queue
    var address = this.queue.shift()

    // end of queue
    if (!address) {
      this.scanning = false
      this.onDone(this.boards)
      return true
    }

    // increment scanned counter
    this.scanned++

    let board = new Board(address, {
      timeout: this.timeout
    })

    board.version()
      .then(data => {
        this.boards.push(board)
        this.onBoard(board)
        this.found++
      })
      .catch(error => {
        // skip error
        return error
      })
      .then(any => {
        // in any cases...
        this.processQueue()
      })
  }

  start () {
    this.scanning = true
    this.aborted = false
    this.total = this.queue.length
    this.scanned = 0
    this.found = 0
    this.boards = []
    this.processQueue()
  }

  stop () {
    if (this.scanning || this.aborted) {
      this.scanning = false
      this.aborted = false
    }
  }

  pause () {
    if (this.scanning) {
      this.scanning = false
      this.aborted = true
    }
  }

  resume () {
    if (this.aborted) {
      this.scanning = true
      this.aborted = false
      this.processQueue()
    }
  }
}
