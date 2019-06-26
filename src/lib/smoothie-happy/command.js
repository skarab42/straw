import axios from 'axios'

export default function command (address, data, timeout = 0) {
  return axios({
    method: 'post',
    url: `http://${address}/command`,
    data: `${data}\n`,
    timeout: timeout
  })
}
