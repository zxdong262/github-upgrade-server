import app from './app.js'

const {
  PORT,
  HOST
} = process.env

app.listen(PORT, HOST, () => {
  console.log(`server running on http://${HOST}:${PORT}`)
})
