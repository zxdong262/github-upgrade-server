/* eslint-env jest */

import pack from '../package.json'
import axios from 'axios'
import crypto from 'crypto'

require('dotenv').config()

const {
  UPGRADE_SECRET, PORT, UPGRADE_SERVER_API_PREFIX
} = process.env

const hmac = crypto.createHmac('sha1', UPGRADE_SECRET)

function enc (body) {
  hmac.update(JSON.stringify(body))
  return hmac.digest('hex')
}

const data = require('./data.json')

const url = `http://localhost:${PORT}`

jest.setTimeout(9999)

describe(pack.name, function () {
  test('server runs and verify api works', async () => {
    let url1 = `${url}/update-upgrade-info-${UPGRADE_SERVER_API_PREFIX}`
    let res1 = await axios.post(url1, data, {
      headers: {
        'X-Hub-Signature': enc(data)
      }
    }).then(r => r.data)
    console.log('res1', res1)
    expect(res1.toString()).toEqual('ok')
    let url3 = `${url}/upgrade-info?name=${data.repository.name}`
    let res2 = await axios.get(url3).then(r => r.data)
    console.log('res2', res2)
    expect(res2.id).toEqual(data.repository.name)
    expect(res2.version).toEqual(data.release.tag_name)
  })
})
