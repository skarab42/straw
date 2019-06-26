import { Notify } from 'quasar'

export function notifyError (message, options = {}) {
  if (!message) {
    return
  }
  if (typeof message === 'object') {
    options = message
    message = null
  }
  Notify.create({
    position: 'top',
    color: 'negative',
    icon: 'thumb_down',
    message,
    ...options
  })
}

export function notifySuccess (message, options = {}) {
  if (!message) {
    return
  }
  if (typeof message === 'object') {
    options = message
    message = null
  }
  Notify.create({
    position: 'top',
    color: 'positive',
    icon: 'thumb_up',
    message,
    ...options
  })
}
