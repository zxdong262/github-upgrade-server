# CRM extension upgrade server

CRM extension upgrade server will receive github new release webhook request, and update version, log and assets list in database, and provide version upgrade info query for CRM extension.

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

## Deploy to AWS Lambda

```bash
npm run build
npm run deploy
```

## License

MIT
