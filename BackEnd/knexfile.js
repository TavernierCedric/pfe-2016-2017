// Update with your config settings.

module.exports = {

  developement: {
    client: 'postgresql',
    connection: {
      database: '127.0.0.1:5432/pfe',
      user:     'poluchon',
      password: '12lersoubo'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }


};
