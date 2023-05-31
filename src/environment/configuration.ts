export default () => ({
  api_port: process.env.API_PORT,
  db: {
    scheme: process.env.DB_SCHEME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});
