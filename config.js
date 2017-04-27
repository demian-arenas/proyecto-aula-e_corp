'use strict'

let pass = process.env.PASS_CLIENT_MYSQL
const port = process.env.PORT_NOSQLDB
const mysql = require('mysql')
const utils = require('./lib/utils')
const r = require('rethinkdb')

pass = utils.cleanVar(pass)

const getConnectionNOSQL = function () {
  let connNosql = r.connect({
    host: 'localhost',
    port: port,
    db: 'e_corp'
  })
  return connNosql
}

const getConnectionSQL = function () {
  let connSQL = mysql.createConnection({
    host: 'localhost',
    user: 'client',
    password: pass[0],
    database: 'e_corp'
  })
  return connSQL
}

const config = {
  getConnectionSQL: getConnectionSQL,
  getConnectionNOSQL: getConnectionNOSQL
}

module.exports = config
