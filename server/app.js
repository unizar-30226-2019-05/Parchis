
const express = require('express')
const app = express()
const routerUsuario = require('./routes/usuario')

//permitir CORS
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use('/api/usuario', routerUsuario)

var server=require('http').Server(app)
var io= require('socket.io')(server)


/********************************************************************************************/

const Tablero =require( './logica/Tablero.js' )
const numJugadores = 4
const numDados = 1
//para logica ...
let tableroLogica =  new Tablero(numJugadores,numDados);
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

function parsearTablero(){
	tableroLogica.rellenar()
	let info = tableroLogica.getInfo()
	let pos = info.posicion
	let casa = info.estado
	let meta = info.meta

	let fpos=[]
	for(let i=0;i<numJugadores;i++){

		for(let j=0; j<4; j++){
			let nu = pos[i][j]
			let co = tableroLogica.player[i].color
			switch(co){
				case "Rojo":
				co="roja"
				break;
				case "Verde":
				co="verde"
				break;
				case "Amarillo":
				co="amarilla"
				break;
				default:
				co="azul"
				break;
			}
			let ve=null
			switch(casa[i][j]){
				case "CASA" :
					ve="casillasCasa"
					break;
				case "FUERA" :
					ve="casillasCampo"
					break;
				case "META" :
					ve="casillasMeta"
					nu=meta[i][j]
					break;
				case "METIDA" :
					ve="casillasFinMeta"
					break;
				default:
					ve=null;
					break;
			}


			fpos[i*4 +j] = {
				color: co ,
				n: j,
				vector: ve ,
				num: nu
			}


		}
	}
	console.log("EL FPOS CO")
	console.log(fpos)
	return fpos

}

io.on('connection', function(socket){
	
	console.log("Alguien se ha conectado con sockets");
	

	socket.on('iniciarPartida', function(data) {
		let c=cogerColor(data.col,data.id);
		if(c === null) socket.emit('elegirColor', elegirCol);

		//devolver fichas en tablero ...
		//else socket.emit('start_pos', {color:c, pos:fichas_pos});
		else socket.emit('start_pos', parsearTablero());
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
		if(data.msg !== "" && data.msg !== null) io.sockets.emit('mensaje',data);
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
