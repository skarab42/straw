export function request (url, settings = {}) {
  return new Promise((resolve, reject) => {
    let type = settings.type || 'GET'
    let data = settings.data || null
    let headers = settings.headers || {}
    let timeout = settings.timeout || 0
    let progress = settings.progress || null
    let charset = settings.charset || 'UTF-8'
    let uploadProgress = settings.uploadProgress || null

    // force type to uppercase
    type = type.toUpperCase()

    // http request object
    let xhr = new XMLHttpRequest()

    // append data to url on GET request
    if (type === 'GET' && data) {
      url += '?' + data
      data = null
    }

    // download events
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        let response = xhr.response

        try {
          // fix encoding
          response = decodeURIComponent(escape(response))
        } catch (e) {}

        resolve(response)
      } else {
        reject(new Error(this.status + ' ' + xhr.statusText))
      }
    }

    xhr.onerror = function () {
      reject(new Error('Connexion error'))
    }

    xhr.ontimeout = function () {
      reject(new Error('Connexion timeout'))
    }

    xhr.onabort = function () {
      reject(new Error('Connexion aborted'))
    }

    xhr.onprogress = function ({ total, loaded }) {
      progress && progress({
        loaded,
        total,
        percent: Math.round(loaded / total * 100)
      })
    }

    // upload events
    xhr.upload.onerror = function () {
      reject(new Error('Upload error'))
    }

    xhr.upload.ontimeout = function () {
      reject(new Error('Upload timeout'))
    }

    xhr.upload.onabort = function () {
      reject(new Error('Upload aborted'))
    }

    xhr.upload.onprogress = function ({ total, loaded }) {
      uploadProgress && uploadProgress({
        loaded,
        total,
        percent: Math.round(loaded / total * 100)
      })
    }

    // open the request
    xhr.open(type, url, true)

    // set request timeout
    xhr.timeout = timeout

    // force encoding
    xhr.overrideMimeType('text/plain; charset=' + charset)

    // set custom headers
    for (let key in headers) {
      xhr.setRequestHeader(key, headers[key])
    }

    // send the request
    xhr.send(type === 'POST' ? data : null)
  })
}

export function get (url, settings = {}) {
  return request(url, { ...settings, type: 'GET' })
}

export function post (url, settings = {}) {
  return request(url, { ...settings, type: 'POST' })
}
