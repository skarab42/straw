export function relativeHumanTime (time) {
  let diff = Date.now() - time
  let rest = diff

  if (diff < 1000) {
    return 'now'
  }

  let d = Math.floor(rest / 1000 / 60 / 60 / 24)
  rest -= d * 1000 * 60 * 60 * 24

  let h = Math.floor(rest / 1000 / 60 / 60)
  rest -= h * 1000 * 60 * 60

  let m = Math.floor(rest / 1000 / 60)
  rest -= m * 1000 * 60

  let s = Math.floor(rest / 1000) || 0

  let out = []

  d > 0 && out.push(d + 'd')
  h > 0 && out.push(h + 'h')
  m > 0 && out.push(m + 'm')
  s > 0 && out.push(s + 's')

  return out.join(' ')
}

// https://stackoverflow.com/a/14919494
export function humanFileSize (bytes, si) {
  let thresh = si ? 1000 : 1024

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B'
  }

  let units = si
  ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  let u = -1

  do {
    bytes /= thresh
    ++u
  } while (Math.abs(bytes) >= thresh && u < units.length - 1)

  return bytes.toFixed(1) + ' ' + units[u]
}
