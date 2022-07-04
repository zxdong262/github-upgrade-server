/**
 * provide sidebar card in HubSpot contact or company page
 * https://legacydocs.hubspot.com/docs/methods/crm-extensions/crm-extensions-overview
 */

import cors from 'cors'

export default (app, path, handler) => {
  function checkAllow (origin) {
    return true
  }
  const corsOpts = {
    methods: ['POST'],
    allowedHeaders: ['Content-Type', 'Referer', 'Accept', 'User-Agent'],
    credentials: true,
    origin: function (origin, callback) {
      if (checkAllow(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }
  const opts = cors(corsOpts)
  app.options(path, opts)
  app.get(path, opts, handler)
}
