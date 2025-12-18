import app from './app/server'

const port = Number(process.env.PORT) || 3000

console.log(`Starting server on port ${port}...`)

export default {
  port,
  fetch: app.fetch,
}
