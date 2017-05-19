'use strict'

const utils = require('./utils')
const r = require('rethinkdb')
const config = require('../config')

class Db {
  getCountry () {
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'SELECT * FROM e_corp.cpais;'
      conn.query(queryString, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  getCityByCountry (clvPais) {
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'SELECT * FROM e_corp.dlugarorigen natural join e_corp.cciudad where clv_pai = ?;'
      let queryVar = [clvPais]
      conn.query(queryString, queryVar, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  saveUserData (user) {
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'INSERT INTO `e_corp`.`musuariodatos` (`nom_usr`, `app_usr`, `apm_usr`, `eml_usr`, `id_gen`, `id_org`) VALUES (?,?,?,?,?,?);'
      let queryVar = [user.nombre, user.app, user.apm, user.email, user.idGenero, user.idOrigen]
      conn.query(queryString, queryVar, function (error, results, fields) {
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
      console.log(pass)
      console.log(user.pass)
      conn.connect()
      let queryString = 'INSERT INTO `e_corp`.`musuarioaut` (`nck_usr`, `pass_usr`, `id_udt`, `id_tps`) VALUES (?,?,?,?);'
      let queryVar = [user.nickname, user.pass, user.idDatos, user.idTipoUsuario]
      conn.query(queryString, queryVar, function (error, results, fields) {
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
  getCountrywithCity (idOrigen) {
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'SELECT * FROM dlugarorigen natural join cciudad natural join cpais where id_org = ?;'
      let queryVar = [idOrigen]
      conn.query(queryString, queryVar, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  async authenticateUser (nickname, password, idTipoUsuario) {
    let user = {}
    await this.getUserAut(nickname, idTipoUsuario)
      .then(function (rows) {
        user = rows[0]
      })
      .catch((err) => Promise.reject(err)
      )
    let pass = user.pass_usr
    if (pass === utils.encrypt(password)) {
      return Promise.resolve(true)
    }
    return Promise.resolve(false)
  }
  updateUserData (nombre, app, apm, idGen, idOrg, idDatosUsuario) {
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'UPDATE musuariodatos SET nom_usr = ?, app_usr = ?, apm_usr = ?,  id_gen = ?, id_org = ? WHERE id_udt=?;'
      let queryVar = [nombre, app, apm, idGen, idOrg, idDatosUsuario]
      conn.query(queryString, queryVar, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  async updateUserPass (nickname, newPass, oldPass, idTipoUsuario) {
    let bol = await this.authenticateUser(nickname, oldPass, idTipoUsuario)
    if (!bol) return Promise.resolve(false)
    return new Promise(function (resolve, reject) {
      let newPassEncrypt = utils.encrypt(newPass)
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'UPDATE musuarioaut SET pass_usr = ? WHERE nck_usr = ?;'
      let queryVar = [newPassEncrypt, nickname]
      conn.query(queryString, queryVar, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  async deleteUser (nickname, idTipoUsuario) {
    let user = {}
    await this.getUserAut(nickname, idTipoUsuario)
      .then(function (rows) {
        user = rows[0]
      })
      .catch((err) => Promise.reject(err)
      )
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'DELETE FROM musuariodatos WHERE id_udt = ?;'
      let queryVar = [user.id_udt]
      conn.query(queryString, queryVar, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  getHeroes () {
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'SELECT * FROM cheroe natural join mestadisticaspersonaje natural join ctipopersonaje natural join dheroepartida natural join cataqueespecial;'
      conn.query(queryString, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  getObjects () {
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'SELECT * FROM ctipoobjeto natural join cobjetotienda natural join dobjetopartida;'
      conn.query(queryString, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  getGender () {
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'SELECT * FROM cgenero;'
      conn.query(queryString, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  getEnemies () {
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'SELECT * FROM cenemigo natural join mestadisticaspersonaje natural join ctipopersonaje natural join denemigopartida;'
      conn.query(queryString, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  updateHeroes (salud, defensa, velocidad, ataque, idHeroe) {
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'UPDATE mestadisticaspersonaje SET sal_stat = ?, def_stat = ?, vel_stat = ?, atk_stat = ? where id_hro = ?;'
      let queryVar = [salud, defensa, velocidad, ataque, idHeroe]
      conn.query(queryString, queryVar, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  updateEnemies (salud, defensa, velocidad, ataque, idEnemigo) {
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'UPDATE mestadisticaspersonaje SET sal_stat = ?, def_stat = ?, vel_stat = ?, atk_stat = ? where id_ene = ?;'
      let queryVar = [salud, defensa, velocidad, ataque, idEnemigo]
      conn.query(queryString, queryVar, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  updateObjects (desObj, idObj) {
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'UPDATE cobjetotienda SET des_obj = ? where id_obj = ?;'
      let queryVar = [desObj, idObj]
      conn.query(queryString, queryVar, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  async updateUserDataAdmin (nombre, app, apm, idGen, idOrg, idDatosUsuario, idTps) {
    await this.updateUserData(nombre, app, apm, idGen, idOrg, idDatosUsuario)
      .then(function (rows) {
      })
      .catch((err) => Promise.reject(err)
      )
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'UPDATE musuarioaut SET id_tps = ? WHERE id_udt=?;'
      let queryVar = [idTps, idDatosUsuario]
      conn.query(queryString, queryVar, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  crearPartida (nombrePartida, nickname) {
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'INSERT INTO `e_corp`.`epartida` SET nom_par = ?, nck_usr = ?, id_niv = 1;'
      let queryVar = [nombrePartida, nickname]
      conn.query(queryString, queryVar, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  getPartida (nickname) {
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'SELECT * FROM `e_corp`.`epartida` natural join `e_corp`.`dobjetopartida` natural join `e_corp`.`dheroepartida`  where nck_usr=?;'
      let queryVar = [nickname]
      conn.query(queryString, queryVar, function (error, results, fields) {
        if (error) return reject(error)
        console.log(results)
        resolve(results)
      })
      conn.end()
    })
  }
  crearHeroePartida (insertId, nickname) {
    let idHeroe = 1
    let idTpr = 1
    let idEsp = 1
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'INSERT INTO `e_corp`.`dheroepartida` SET id_par = ?, id_tpr = ?, id_hro = ?, id_esp =?, xp_hro = 0, liv_die = 1;'
      let queryVar
      while (idHeroe <= 8) {
        if (idHeroe === 6) idTpr = 2
        if (idHeroe === 7) idTpr = 7
        if (idHeroe === 8) idTpr = 6
        queryVar = [insertId, idTpr, idHeroe, idEsp]
        conn.query(queryString, queryVar, function (error, results, fields) {
          if (error) reject(error)
          resolve(results)
        })
        idHeroe++
        idTpr++
        idEsp++
      }
      conn.end()
    })
  }
  guardarPartida (nombrePartida, nickname, idNivel) {
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'UPDATE `e_corp`.`epartida` SET nom_par = ?, id_niv = ? where nck_usr = ?;'
      let queryVar = [nombrePartida, idNivel, nickname]
      conn.query(queryString, queryVar, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  async guardarHeroe (idEsp, xpHeroe, estado, nickname) {
    let idPartida
    await this.getPartida(nickname)
    .then(function (rows) {
      idPartida = rows[0].id_par
    })
     .catch((err) => Promise.reject(err)
    )
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'UPDATE `e_corp`.`dheroepartida` SET id_esp =?, xp_hro = ?, liv_die = ? where id_par = ?;'
      let queryVar = [idEsp, xpHeroe, estado, idPartida]
      conn.query(queryString, queryVar, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  async guardarObjetoPartida (idTipoObjeto, idObjeto, nickname, cantidadObjeto) {
    let idPartida
    await this.getPartida(nickname)
    .then(function (rows) {
      idPartida = rows[0].id_par
    })
     .catch((err) => Promise.reject(err)
    )
    return new Promise(function (resolve, reject) {
      let conn = config.getConnectionSQL()
      conn.connect()
      let queryString = 'INSERT `e_corp`.`dobjetopartida` SET id_tob = ?, id_obj = ? id_par=?, can_obj = ?;'
      let queryVar = [idTipoObjeto, idObjeto, idPartida, cantidadObjeto]
      conn.query(queryString, queryVar, function (error, results, fields) {
        if (error) return reject(error)
        resolve(results)
      })
      conn.end()
    })
  }
  async saveDeathRecord (idNivel, nickname) {
    let registro = {
      nivel: idNivel,
      nickname: nickname
    }
    let db = 'e_corp'
    let conn = config.getConnectionNOSQL()
    registro.createdAt = new Date()
    let result = await r.db(db).table('registros').insert(registro).run(conn)
    if (result.errors > 0) {
      return Promise.reject(new Error(result.first_error))
    }
    registro.id = result.generated_keys[0]
    await r.db(db).table('registros').get(registro.id).update({
      publicId: utils.encrypt(registro.id)
    }).run(conn)
    let created = await r.db(db).table('registros').get(registro.id).run(conn)
    conn.close()
    return Promise.resolve(created)
  }
  async saveGameSettings (nickname, gameSettings) {
    let settings = {
      nickname: nickname,
      gameSettings: gameSettings
    }
    let db = 'e_corp'
    let conn = config.getConnectionNOSQL()
    settings.createdAt = new Date()
    let result = await r.db(db).table('settings').insert(settings).run(conn)
    if (result.errors > 0) {
      return Promise.reject(new Error(result.first_error))
    }
    settings.id = result.generated_keys[0]
    await r.db(db).table('settings').get(settings.id).update({
      publicId: utils.encrypt(settings.id)
    }).run(conn)
    let created = await r.db(db).table('settings').get(settings.id).run(conn)
    conn.close()
    return Promise.resolve(created)
  }
}

module.exports = Db
