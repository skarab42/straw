export default function version (response) {
  // expected : Build version: edge-94de12c, Build date: Oct 28 2014 13:24:47, MCU: LPC1769, System Clock: 120MHz
  let data = response.match(/Build version: (.*), Build date: (.*), MCU: (.*), System Clock: (.*)/)

  if (data) {
    // split branch-hash on dash
    let branch = data[1].split('-')

    // update board info
    return {
      branch: branch[0].trim(),
      hash: branch[1].trim(),
      date: data[2].trim(),
      mcu: data[3].trim(),
      clock: data[4].trim()
    }
  }

  throw new Error('Unknown response string')
}
