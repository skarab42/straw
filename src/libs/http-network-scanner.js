import { version } from './smoothie-happy'

// Wildcard | ex.: [192.168.1.*]
const wildcardExp = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.\*$/
// Single ip | ex.: [192.168.1.55]
const singleIpExp = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/
// Ip's range | ex.: [192.168.1.50-100]
const ipRangeExp = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}-[0-9]{1,3}$/
// Hostname | ex.: [www.host.name]
const hostnameExp = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/

export default class HTTPNetworkScanner {
  // Allowed inputs :
  // - Wildcard  : '192.168.1.//'
  // - Single IP : '192.168.1.100'
  // - IP Range  : '192.168.1.100-120'
  // - Hostname  : 'my.smoothie.board'
  // - Mixed     : '192.168.1.100, my.smoothie.board'
  // - Array     : ['192.168.1.100-120', 'my.smoothie.board']
  static parseInput (input) {
    // address queue
    let queue = []

    // input array
    let inputArray = input

    // split input on comma if not an array
    if (typeof inputArray === 'string') {
      inputArray = inputArray.split(',')
    }

    // too short or not defined
    if (inputArray.length === 0) {
      throw new Error('Invalid input.')
    }

    // trim input parts
    inputArray = inputArray.map((v) => v.trim())

    // for each parts
    inputArray.forEach(currentInput => {
      if (wildcardExp.test(currentInput)) {
        let currentInputParts = currentInput.split('.')
        currentInputParts.pop() // remove last part (*)
        let baseIp = currentInputParts.join('.')
        for (let i = 0; i <= 255; i++) {
          queue.push(baseIp + '.' + i)
        }
      } else if (singleIpExp.test(currentInput)) {
        queue.push(currentInput)
      } else if (ipRangeExp.test(currentInput)) {
        let currentInputParts = currentInput.split('.')
        let currentInputRange = currentInputParts.pop().split('-') // last part (xxx-xxx)
        let baseIp = currentInputParts.join('.')
        for (let i = currentInputRange[0], il = currentInputRange[1]; i <= il; i++) {
          queue.push(baseIp + '.' + i)
        }
      } else if (currentInput.length < 5) {
        throw new Error('Too short (min: 6).')
      } else if (hostnameExp.test(currentInput)) {
        queue.push(currentInput)
      } else {
        throw new Error('Invalid input.')
      }
    })

    return queue
  }

  constructor (callbacks = {}) {
    this.input = ''
    this.queue = []
    this.paused = false
    this.scanning = false
    this.done = false
    this.progress = {
      percent: 0,
      scanned: 0,
      found: 0,
      total: 0
    }
    this.callbacks = callbacks
  }

  setInput (input) {
    this.input = input
    this.queue = HTTPNetworkScanner.parseInput(input)
    this.paused = false
    this.scanning = false
    this.done = false
    this.progress = {
      percent: 0,
      scanned: 0,
      online: 0,
      total: this.queue.length
    }
  }

  getState () {
    return {
      done: this.done,
      paused: this.paused,
      scanning: this.scanning,
      progress: this.progress
    }
  }

  on (eventName, callback) {
    this.callbacks[eventName] = callback
  }

  emit (eventName, payload = null) {
    let cb = this.callbacks[eventName] || null

    cb && cb.call(cb, payload)
  }

  processQueue () {
    if (!this.scanning || this.paused) {
      return
    }

    // shift first ip from the queue
    let address = this.queue.shift()

    // end of queue
    if (!address) {
      this.done = true
      this.scanning = false
      this.emit('done', this.getState())
      return
    }

    version({ address }).then(board => {
      this.progress.online++
      this.progress.scanned++
      this.emit('board', board)
    })
    .catch(error => {
      this.progress.scanned++
      this.emit('error', error)
    })
    .then(() => {
      this.progress.percent = (this.progress.scanned / this.progress.total) * 100
      this.emit('progress', this.getState())
      this.processQueue()
    })
  }

  start (input) {
    this.setInput(input)

    if (this.scanning) {
      throw new Error('Already scanning.')
    }

    if (!this.progress.total) {
      throw new Error('Empty queue.')
    }

    this.scanning = true

    this.emit('start', this.getState())
    this.processQueue()

    return this.queue
  }

  pause () {
    if (!this.scanning) {
      throw new Error('Not scanning.')
    }

    if (this.paused) {
      throw new Error('Already paused.')
    }

    this.paused = true

    this.emit('pause', this.getState())
  }

  resume () {
    if (!this.scanning) {
      throw new Error('Not scanning.')
    }

    if (!this.paused) {
      throw new Error('Not paused.')
    }

    this.paused = false

    this.emit('resume', this.getState())

    this.processQueue()
  }

  stop () {
    if (!this.scanning) {
      throw new Error('Not scanning.')
    }

    this.paused = false
    this.scanning = false

    this.emit('stop', this.getState())
  }
}
