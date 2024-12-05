const isDev = process.env.NODE_ENV === 'dev'
const isProd = process.env.NODE_ENV === 'prod'

module.exports = {
  isDev,
  isProd
}
