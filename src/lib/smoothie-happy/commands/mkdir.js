export default function mkdir (response, path) {
  response = response.trim()

  if (response.startsWith('could not create directory')) {
    throw new Error(`Could not create directory "${path}"`)
  }

  if (response.startsWith('error:Unsupported command - mkdir')) {
    throw new Error(`Unsupported command - mkdir`)
  }

  if (!response.startsWith('created directory')) {
    throw new Error('Unknown response string')
  }

  let parts = path.split('/')
  let filename = parts.pop()
  let rootPath = parts.join('/')

  return {
    name: filename,
    extension: '',
    parent: rootPath.length ? rootPath : '/',
    path: rootPath + '/' + filename,
    type: 'folder',
    size: 0
  }
}
