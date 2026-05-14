module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
  JWT_EXPIRES_IN: '24h',
  PORT: process.env.PORT || 3001,
  DB_PATH: process.env.DB_PATH || './fundraising.db'
}
