import express from 'express'
import morgan from 'morgan'
import {
  Service
} from './models/Service.js'
import verify from './utils/verify.js'
import { nanoid } from 'nanoid'
import createApi from './utils/create-api.js'

const {
  UPGRADE_SERVER_API_PREFIX
} = process.env

const app = express()
app.use(morgan('tiny'))
app.use(express.urlencoded({
  extended: false
}))
app.use(express.json({
  limit: '50mb'
}))

app.get(['/test', '/'], (req, res) => res.send('server running'))

app.post('/update-upgrade-info-' + UPGRADE_SERVER_API_PREFIX, async (req, res) => {
  let sig = req.get('X-Hub-Signature')
  if (!sig) {
    return res.status(401).send('require signature header')
  }
  const {
    body
  } = req
  sig = sig.replace(/^sha1=/, '')
  const result = verify(body, sig)
  if (!result) {
    return res.status(400).send('signature not match')
  }
  const {
    action,
    release: {
      tag_name: tagName,
      body: log
    },
    repository: {
      name
    }
  } = body
  const indb = await Service.findOne({
    where: {
      id: name
    }
  })
  if (action !== 'published') {
    return res.status(200).send('not a published event')
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

async function upgradeInfo (req, res) {
  const {
    name
  } = req.query
  if (!name) {
    return res.status(400).send('app name required')
  }
  const inst = await Service.findOne({
    where: {
      id: name
    }
  })
  if (!inst) {
    return res.status(404).send('app not find')
  }
  res.send(inst)
}

createApi(app, '/upgrade-info', upgradeInfo)

app.get('/upgrade-info', async (req, res) => {
  const {
    name
  } = req.query
  if (!name) {
    return res.status(400).send('app name required')
  }
  const inst = await Service.findOne({
    where: {
      id: name
    }
  })
  if (!inst) {
    return res.status(404).send('app not find')
  }
  res.send(inst)
})

app.post('/download', async (req, res) => {
  const {
    image,
    filename = 'rc.png'
  } = req.body
  if (!image) {
    return res.status(400).send('bad request')
  }
  const id = nanoid()
  await Service.sync()
  await Service.create({
    id,
    log: image,
    version: filename
  })
  res.send({
    id
  })
})

app.get('/download', async (req, res) => {
  const {
    id
  } = req.query
  if (!id) {
    return res.status(400).send('bad request')
  }
  const inst = await Service.findOne({
    where: {
      id
    }
  })
  if (!inst) {
    return res.status(400).send('bad request')
  }
  const base64Data = inst.log.replace(/^data:image\/png;base64,/, '')
  const img = Buffer.from(base64Data, 'base64')
  res.type('png')
  res.set('Content-Disposition', 'attachment; filename="rc.png"')
  res.set('Content-Length', img.length)
  res.end(img)
})

export default app
