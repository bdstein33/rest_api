module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: 'mealenders_db',
      user:  'root',
      password: ''
    },
    pool: {
      min: 1,
      max: 10
    },
    migrations: {
      directory: './server/config/db/migrations'
    }
  },

  // staging: {
  //   client: 'mysql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // },

  production: {
    client: 'mysql',
    connection: {
      database: process.env.DB_NAME,
      user:  process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 1,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './server/config/db/migrations'
    }
  }

};
