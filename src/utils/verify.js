
import crypto from 'crypto'

const {
  UPGRADE_SECRET
} = process.env

export default (body, key) => {
  const hmac = crypto.createHmac('sha1', UPGRADE_SECRET)
  hmac.update(JSON.stringify(body))
  return hmac.digest('hex') === key
}
