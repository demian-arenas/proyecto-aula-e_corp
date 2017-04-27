'use strict'

const utils = require('./utils')
const config = require('../config')

class Db {
  saveUserData (user) {
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'INSERT INTO `e_corp`.`musuariodatos` (`nom_usr`, `app_usr`, `apm_usr`, `eml_usr`, `id_gen`, `id_org`)' +
      ' VALUES ("' + user.nombre + '","' + user.app + '","' + user.apm + '","' + user.email + '",' + user.idGenero + ',' + user.idOrigen + ');'
      conn.query(queryString, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  saveUserAut (user) {
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      let pass = user.pass
      user.pass = utils.encrypt(pass)
      conn.connect()
      let queryString = 'INSERT INTO `e_corp`.`musuarioaut` (`nck_usr`, `pass_usr`, `id_udt`, `id_tps`)' +
      'VALUES ("' + user.nickname + '", "' + user.pass + '", "' + user.idDatos + '", "' + user.idTipoUsuario + '");'
      conn.query(queryString, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  getUserAut (nickname, idTipoUsuario) {
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'SELECT * FROM `e_corp`.`musuarioaut` WHERE nck_usr = ? && id_tps = ?'
      let queryVar = [nickname, idTipoUsuario]
      conn.query(queryString, queryVar, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  getUserConsult (nickname) {
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'SELECT * FROM musuarioaut natural join musuariodatos natural join ctipousuario' +
      ' natural join cgenero natural join elugarorigen natural join dlugarorigen natural join cciudad' +
      ' natural join cpais WHERE nck_usr = ?'
      let queryVar = [nickname]
      conn.query(queryString, queryVar, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  authenticateUser (username, password) {
    let user = null
    this.getUserAut(username)
      .then(function (rows) {
        user.nck_usr = rows.nck_usr
        user.password = rows.pass_usr
      })
      .catch((err) => setImmediate(() => {
        throw err
      }))
    if (user.password === utils.encrypt(password)) {
      return Promise.resolve(true)
    }

    return Promise.resolve(false)
  }
}

module.exports = Db
