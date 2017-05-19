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

db.getHeroes(dataUsuario.nickname).then((rows) => console.log(rows)).catch((err) => console.log(err))
