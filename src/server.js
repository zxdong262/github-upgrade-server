import app from './app'

const {
  PORT,
  HOST
} = process.env

app.listen(PORT, HOST, () => {
  console.log(`server running on http://${HOST}:${PORT}`)
})
