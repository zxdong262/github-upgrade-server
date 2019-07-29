# upgrade server

[![Build Status](https://travis-ci.org/zxdong262/github-upgrade-server.svg?branch=release)](https://travis-ci.org/zxdong262/github-upgrade-server)

Upgrade server will receive github new release webhook request, and update version, log and assets list in database, and provide version upgrade info query.

It is designed to work with AWS lambda, Dynamodb or SQL db.

## Run in local

```bash
# get the code
git clone git@github.com:zxdong262/github-upgrade-server.git

# install dependencies
cd github-upgrade-server
npm i

# create configs
cp env-sample.env .env

# then edit .env, fill all required at least

## run local server
npm start

## test
npm run test

## start local dynamodb server
npm run dynamo
```

## Use

```js
let data = GITGUB_RELEASE_WEBHOOK_PAYLOAD
// update version info
let url1 = `${serverUrl}/update-upgrade-info-${UPGRADE_SERVER_API_PREFIX}`
let res1 = await axios.post(url1, data, {
  headers: {
    'X-Hub-Signature': enc(data)
  }
}).then(r => r.data)
console.log('res1', res1)
expect(res1.toString()).toEqual('ok')

// get version info
let url3 = `${serverUrl}/upgrade-info?name=${data.repository.name}`
let res2 = await axios.get(url3).then(r => r.data)
console.log('res2', res2)
expect(res2.id).toEqual(data.repository.name)
```

- So you can set webhook in github repo setting, set secret same as `UPGRADE_SECRET` in `.env`, when new release published, the server will update version info.
- Then you can get version info from server to check if should upgrade.

## Deploy to AWS Lambda

```bash
npm run build
npm run deploy
```

## License

MIT
