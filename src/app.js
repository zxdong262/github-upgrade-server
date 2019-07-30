
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import { Service } from './models/Service'
import verify from './utils/verify'

const app = express()
const {
  UPGRADE_SERVER_API_PREFIX
} = process.env

app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get(['/test', '/'], (req, res) => res.send('server running'))
app.post('/update-upgrade-info-' + UPGRADE_SERVER_API_PREFIX, async (req, res) => {
  let sig = req.get('X-Hub-Signature')
  if (!sig) {
    return res.status(401).send('require signature header')
  }
  let { body } = req
  sig = sig.replace(/^sha1=/, '')
  let result = verify(body, sig)
  if (!result) {
    return res.status(400).send('signature not match')
  }
  let {
    action,
    release: {
      tag_name: tagName,
      body: log
    },
    repository: {
      name
    }
  } = body
  let indb = await Service.findOne({
    where: {
      id: name
    }
  })
  if (action !== 'published') {
    return res.status(400).send('not a published event')
  }
  if (!indb) {
    await Service.create({
      id: name,
      version: tagName,
      log,
      data: body
    })
  } else {
    await Service.update({
      version: tagName,
      log,
      data: body
    }, {
      where: {
        id: name
      }
    })
  }
  res.send('ok')
})

app.get('/upgrade-info', async (req, res) => {
  let { name } = req.query
  if (!name) {
    return res.status(400).send('app name required')
  }
  let inst = await Service.findOne({
    where: {
      id: name
    }
  })
  if (!inst) {
    return res.status(404).send('app not find')
  }
  res.send(inst)
})

export default app
