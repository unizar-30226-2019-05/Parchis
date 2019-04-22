/*
if (process.env.NODE_ENV === 'production') {
  // Exprees will serve up production assets
  app.use(express.static(''));

  // Express serve up index.html file if it doesn't recognize route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
  });
}
*/

// BASE DE DATOS
const express = require('express')
const app = express()
const routerUsuario = require('./routes/usuario')
const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
}

app.use(allowCrossDomain)

app.use('/api/usuario', routerUsuario)

var server=require('http').Server(app)
var io= require('socket.io')(server)


/********************************************************************************************/
//posiciones de la partida, inicialmente:
let fichas_pos=[
	{color:"roja", n: 0, vector: "casillasCasa", num: 0},
	{color:"roja", n: 1, vector: "casillasCasa", num: 1},
	{color:"roja", n: 2, vector: "casillasCasa", num: 2},
	{color:"roja", n: 3, vector: "casillasCasa", num: 3},

	{color:"azul", n: 0, vector: "casillasCasa", num: 0},
	{color:"azul", n: 1, vector: "casillasCasa", num: 1},
	{color:"azul", n: 2, vector: "casillasCasa", num: 2},
	{color:"azul", n: 3, vector: "casillasCasa", num: 3},

	{color:"verde", n: 0, vector: "casillasCasa", num: 0},
	{color:"verde", n: 1, vector: "casillasCasa", num: 1},
	{color:"verde", n: 2, vector: "casillasCasa", num: 2},
	{color:"verde", n: 3, vector: "casillasCasa", num: 3},

	{color:"amarilla", n: 0, vector: "casillasCasa", num: 0},
	{color:"amarilla", n: 1, vector: "casillasCasa", num: 1},
	{color:"amarilla", n: 2, vector: "casillasCasa", num: 2},
	{color:"amarilla", n: 3, vector: "casillasCasa", num: 3}

];

let colores=[
	{color:"roja",session:null},
	{color:"azul",session:null},
	{color:"verde",session:null},
	{color:"amarilla",session:null}
];

let elegirCol=[
	{color:"roja",ocupado:false},
	{color:"azul",ocupado:false},
	{color:"verde",ocupado:false},
	{color:"amarilla",ocupado:false}
];

function cogerColor(color,sessionId){
	let col=null;
	let encontrado=false;
	let i = 0;
	while(i<colores.length && !encontrado){
		if(color === null && colores[i].session === sessionId){
			col=colores[i].color;
			encontrado=true;
		}else if(color === colores[i].color && colores[i].session === null){
			col=colores[i].color;
			colores[i].session=sessionId;
			elegirCol[i].ocupado=true;
			encontrado=true;
		}
		i++;
	}
	return col;
}

io.on('connection', function(socket){
	
	console.log("Alguien se ha conectado con sockets");
	

	socket.on('iniciarPartida', function(data) {
		let c=cogerColor(data.col,data.id);
		if(c === null) socket.emit('elegirColor', elegirCol);
		else socket.emit('start_pos', {color:c, pos:fichas_pos});
	});

	socket.on('mover', function(data){
		
		console.log("movimiento recibido");
		let pos=0;
		if(data.color==="roja") pos=0;
		else if(data.color==="azul") pos=4;
		else if(data.color==="verde") pos=8;
		else if(data.color==="amarilla") pos=12;
		fichas_pos[pos+data.n]=data;

		//reenvia a todos los usuarios
		io.sockets.emit('mover',data);
	});

	socket.on('mensaje', function(data){
		//broadcast a todos los cientes que vean el chat
		if(data.msg !== "") io.sockets.emit('mensaje',data);
	});

	socket.on('pingServer',function(data){
		console.log("Alguien ha enviado un ping")
		io.sockets.emit('pingCliente',"mensaje del servidor recibido");
	});

});

/********************************************************************************************/







let port = process.env.PORT || 3000

server.listen(port, function () {
  console.log('Express server listening on port ' + port)
})
