var mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'parchis',
  port: 3306
})

// preguntas sql referidas a usuario

// Consulta donde se obtiene la informacion del usuario. Posteriormente se reenvia esta informacion a la pagina correspondiente.
const info = function (data, res) {
  let sql = 'SELECT nombreCompleto, numPartidas, correo, numVictorias, puntos, url_avatar FROM usuario WHERE nombreUsuario = ? '
  connection.query(sql, data, function (err, result) {
    if (err) throw err
    if (result[0] === undefined) {
      res.status(400).send()
    } else {
      res.status(200).send({ nombreCompleto: result[0].nombreCompleto, correo: result[0].correo, url_avatar: result[0].url_avatar, numPartidas: result[0].numPartidas, numVictorias: result[0].numVictorias, puntos: result[0].puntos })
    }
  })
}

// Consulta para insertar los datos de un usuario recien registrado. Cuando se completa envia señal a la pagina correspondiente.
const register = function (data, res) {
  let sql = 'INSERT INTO usuario (nombreUsuario, nombreCompleto, correo, password) VALUES (?)'
  connection.query(sql, [data], function (err, result) {
    if (err) throw err
    res.status(200).send()
  })
}

// Consulta para obtener datos cuando un usuario hace login donde se comprueba que usuario y contraseña son correctas.
const login = function (data, res) {
  let sql = 'SELECT nombreUsuario, nombreCompleto FROM usuario WHERE correo = ?  AND password = ? '
  connection.query(sql, data, function (err, result) {
    if (err) throw err
    if (result[0] === undefined) {
      res.status(201).send()
    } else {
      res.status(200).send({ nombreUsuario: result[0].nombreUsuario, nombreCompleto: result[0].nombreCompleto })
    }
  })
}

// Consulta para actualizar los datos del usuario. Nombre y apellidos, correo y el avatar.
const actualizarPerfil = function (data, res) {
  let sql = 'UPDATE usuario set nombreCompleto= ?, correo = ? , url_avatar = ? where nombreUsuario = ? '
  connection.query(sql, data, function (err, result) {
    if (err) throw err
    if (result.affectedRows === 0) {
      res.status(201).send()
    } else {
      res.status(200).send({ name: data[0], correo: data[1], url_avatar: data[2] })
    }
  })
}

// Consulta para eliminar el usuario que desea darse de baja.
const darBaja = function (data, res) {
  let sql = 'DELETE FROM usuario WHERE nombreUsuario = ? '
  connection.query(sql, data, function (err, result) {
    if (err) throw err
    if (result.affectedRows === 0) {
      res.status(400).send()
    } else {
      res.status(200).send()
    }
  })
}

// Consulta donde se obtienen los datos de puntuacion de todos los usuarios.
const ranking = function (res) {
  let sql = 'SELECT nombreUsuario, numPartidas, numVictorias, puntos FROM usuario ORDER BY puntos DESC LIMIT 15'
  connection.query(sql, function (err, result) {
    if (err) throw err
    if (result[0] === undefined) {
      res.status(201).send()
    } else {
      res.status(200).send(result)
    }
  })
}

// Consulta donde se muestras todos los items disponibles
const compras = function (data, res) {
  let sql = 'SELECT nombre FROM item WHERE nombre NOT IN (SELECT a.nombre FROM item a, consigue b WHERE (b.Item_nombre = a.nombre AND b.Usuario_nombreUsuario = ?))'
  connection.query(sql, data, function (err, result) {
    if (err) throw err
    if (result[0] === undefined) {
      res.status(201).send()
    } else {
      res.status(200).send(result)
    }
  })
}

// Consulta donde se inserta cuando un usuario desbloquea un item. Falta restar puntos.
const canjear = function (data, res) {
  let sql = 'INSERT INTO consigue (Item_nombre, Usuario_nombreUsuario) VALUES (?)'
  connection.query(sql, [data], function (err, result) {
    if (err) throw err
    console.log('Ha insertado canjear')
    res.status(200).send()
  })
}

const listUsuarios = function (data, res) {
  console.log('data:' + data)
  let sql = 'SELECT DISTINCT c.nombreUsuario, c.puntos, c.url_avatar FROM amigode a, amigode b, usuario c WHERE (a.nombreUsuario = ? AND a.nombreUsuario2 = c.nombreUsuario AND a.estado = ?) OR (b.nombreUsuario2 = ? AND b.nombreUsuario = c.nombreUsuario AND b.estado = ?) ORDER BY c.puntos DESC'
  connection.query(sql, data, function (err, result) {
    if (err) throw err
    if (result[0] === undefined) {
      console.log('undefined')
      res.status(201).send()
    } else {
      console.log('ENTRA A ENVIAR')
      console.log(result)
      res.status(200).send(result)
    }
  })
}

const listSolicitudes = function (data, res) {
  let sql = 'SELECT DISTINCT nombreUsuario2 as nombreUsuario FROM amigode WHERE nombreUsuario = ? AND estado = ?'
  connection.query(sql, data, function (err, result) {
    if (err) throw err
    if (result[0] === undefined) {
      console.log('undefined')
      res.status(201).send()
    } else {
      console.log('ENTRA A ENVIAR')
      console.log(result)
      res.status(200).send(result)
    }
  })
}

const amigos = function (data, res) {
  let sql = 'UPDATE amigode set estado= \'aceptado\' WHERE nombreUsuario = ? AND nombreUsuario2 = ?'
  connection.query(sql, data, function (err, result) {
    if (err) throw err
    if (result.affectedRows === 0) {
      res.status(204).send()
    } else {
      res.status(200).send()
    }
  })
}

const anyadir = function (data, res) {
  let sql = 'INSERT INTO amigode (nombreUsuario, nombreUsuario2, estado) VALUES (?)'
  connection.query(sql, [data], function (err, result) {
    if (err) throw err
    res.status(200).send()
  })
}

const listatotal = function (data, res) {
  let sql = 'SELECT nombreUsuario FROM usuario WHERE nombreUsuario != ? ORDER BY nombreUsuario ASC'
  connection.query(sql, data, function (err, result) {
    if (err) throw err
    console.log('Envia listo total')
    console.log(result)
    res.status(200).send(result)
  })
}
const itemsUsuario = function (data, res) {
  let sql = 'SELECT Item_nombre FROM consigue where Usuario_nombreUsuario = ?'
  connection.query(sql, [data], function (err, result) {
    if (err) throw err
    if (result[0] === undefined) {
      res.status(201).send()
    } else {
      res.status(200).send(result)
    }
  })
}

const comprobar = function (data, res) {
  console.log('Entra a realizar la consulta comprobar')
  console.log(data)
  let sql = 'SELECT a.nombreUsuario, b.nombreUsuario FROM amigode a, amigode b WHERE (a.nombreUsuario = ? AND a.nombreUsuario2 = ?) OR (b.nombreUsuario = ? AND b.nombreUsuario2 = ?)'
  connection.query(sql, data, function (err, result) {
    if (err) throw err
    if (result[0] === undefined) {
      console.log('Entra a resultado nulo')
      res.status(200).send()
    } else {
      console.log('encuentra consulta comprobar')
      res.status(201).send()
    }
  })
}

const existeUsuario = function (data, res) {
  let sql = 'SELECT nombreUsuario FROM usuario WHERE nombreUsuario = ? OR correo = ?'
  connection.query(sql, data, function (err, result) {
    if (err) throw err
    if (result[0] === undefined) {
      console.log('Entra a resultado nulo')
      res.status(200).send()
    } else {
      console.log('encuentra consulta comprobar')
      res.status(201).send()
    }
  })
}

const tienePuntos = function (data, res) {
  let sql = 'SELECT a.nombreUsuario FROM usuario a, item b WHERE a.nombreUsuario = ? AND b.nombre = ? AND a.puntos >= b.puntosRequeridos'
  connection.query(sql, data, function (err, result) {
    if (err) throw err
    if (result[0] === undefined) {
      console.log('No puede canjear')
      console.log(data)
      res.status(204).send()
    } else {
      console.log('Puede canjear')
      console.log(data)
      res.status(200).send()
    }
  })
}

module.exports = {
  info: info,
  register: register,
  login: login,
  actualizarPerfil: actualizarPerfil,
  darBaja: darBaja,
  ranking: ranking,
  compras: compras,
  canjear: canjear,
  listUsuarios: listUsuarios,
  amigos: amigos,
  anyadir: anyadir,
  listSolicitudes: listSolicitudes,
  listatotal: listatotal,
  itemsUsuario: itemsUsuario,
  comprobar: comprobar,
  existeUsuario: existeUsuario,
  tienePuntos: tienePuntos
// eslint-disable-next-line eol-last
}