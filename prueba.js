const Db = require('./index')

let db = new Db()

let dataUsuario = {
  nickname: 'DAJ',
  nombre: 'Demian',
  app: 'Arenas',
  apm: 'Juanes',
  email: 'arenasdemian99@gmail.com',
  pass: 'root',
  idDatos: 0,
  idGenero: 2,
  idOrigen: 1,
  idTipoUsuario: 1
}
let queryString = ' INSER INTO `e_corp`.`musuarioaut` (`nck_usr`, `pass_usr`, `id_udt`, `id_tps`)' +
      ' VALUES ("' + dataUsuario.nickname + '","' + dataUsuario.pass + '",' + dataUsuario.idDatos + ',' + dataUsuario.idTipoUsuario + ');'
console.log(queryString)

db.saveUserData(dataUsuario)
  .then((rows) => {
    console.log(rows)
    let idDatos = rows.insertId
    dataUsuario.idDatos = idDatos
    console.log(idDatos)
    console.log(dataUsuario.idDatos)
    queryString = ' INSER INTO `e_corp`.`musuarioaut` (`nck_usr`, `pass_usr`, `id_udt`, `id_tps`)' +
      ' VALUES ("' + dataUsuario.nickname + '","' + dataUsuario.pass + '",' + dataUsuario.idDatos + ',' + dataUsuario.idTipoUsuario + ');'
    console.log(queryString)
    db.saveUserAut(dataUsuario).then((rows) => {
      console.log(rows)
    })
    .catch((err) => console.log(err))
  })
  .catch((err) => console.log(err))
  