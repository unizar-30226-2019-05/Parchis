
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


let rooms = []
let itRooms = 0


io.on('connection', function(socket){
	
	console.log("Alguien se ha conectado con sockets");

	socket.on('buscarSalas', () =>{
		socket.emit('listaSalas', rooms);
	})

	socket.on('crearSala', data => {
		let name = data.nombre
		let t = data.tTurnos
		let creador = data.id
		let nameRoom = 'room '+itRooms
		
		//enviar también desde data ****************************
		let numDados = 1
		let numJugadores = 4
		let jcolors = ["amarilla","azul","roja", "verde"]
		//**************************************************** */

		rooms[itRooms] = new Sala(nameRoom, name, t, numJugadores, numDados, jcolors, creador)
		
		
		//el que crea la sala se une automaticamente a ella
		rooms[itRooms].conectar(socket)

		

		//broadcast para que el resto pueda ver la nueva sala
		io.sockets.emit('listaSalas', rooms);
		//enviamos al creados la ID de la sala para que se autoconecte
		socket.emit('salaCreada', itRooms);

		itRooms++
	})

	socket.on('unirseSala', data => {
		console.log("Alguien se une a la sala")
		if (rooms[data.id].conectar(socket)){
			//conectado con exito ...
		} else {
			//error ...
		}

		
	})
	

});

/********************************************************************************************/

class Sala{
	constructor(nameRoom, nameSala, tTurnos, maxJugadores, numDados, colores, idCreador){
		this.nameRoom = nameRoom
		this.nameSala = nameSala
		this.tTurnos = tTurnos
		this.maxJugadores = maxJugadores
		this.nJugadores = 0
		this.numDados = numDados
		this.colores = colores
		this.idCreador = idCreador
		this.tableroLogica =  new Tablero(this.maxJugadores,this.numDados,this.colores)
		this.partidaEmpezada = false

		this.tiempoTurno = parseInt(tTurnos) * 1000 //segundos
		this.restoTurno = this.tiempoTurno //maxtiempo
		this.latenciaComprobacion = 1000 //1seg

		this.coloresSession = []
		this.elegirCol = []
		this.colores.forEach( (c,i) => {
			this.coloresSession[i] = {color: c, session: null, socket: null}
			this.elegirCol[i] = {color: c, ocupado: false}
		})

	}

	conectar(socket){
		if(this.nJugadores+1 > this.maxJugadores || this.partidaEmpezada) return false
		else {
			let $this = this
			socket.join(this.nameRoom, () => {
				io.to($this.nameRoom).emit('mensajeUnion','a new user has joined the room'); // broadcast to everyone in the room
			})

			socket.on('colorElegido', function(data){
				let c = null
				if(data.colOld === null) c=$this.cogerColor(data.colNew,data.id,socket.id);
				else c=$this.cambiarColor(data.colOld,data.colNew,data.id,socket.id);
				//actualizar colores elegidos en todos los usuarios de la sala eligiendo
				if(c !== null) io.to($this.nameRoom).emit('elegirColor', $this.elegirCol)
			})
			
			socket.on('iniciarPartida', function(data) {
				//************** */
				//adjudicar cualquier color libre a usuarios que no hayan elegido aun el color pero que esten en la sala ***********
				//************** */
				
				if($this.idCreador === data.id){
					console.log("Iniciando partida ...")
					$this.partidaEmpezada = true
					//io.to($this.nameRoom).emit('start_pos', {color:c, pos:$this.parsearTablero()});
					let positions = $this.parsearTablero()
					$this.coloresSession.forEach( e => {
						if(e.session !== null) 
							io.to(e.socket).emit('start_pos', {color: e.color, pos: positions});
					})

					//PRIMER TURNO
					let turno = $this.tableroLogica.getTurno()
					let turnoColor = $this.colores[turno]
					io.to($this.nameRoom).emit('turno',{color: turnoColor })
					io.to($this.nameRoom).emit('actTime',{tiempo: $this.restoTurno})
					//si es máquina directamente tira
					if($this.coloresSession[turno].session === null){//turno de jugador máquina
						let resultado = $this.tableroLogica.tirar(turno,5,null)
						if(resultado === null) {
							console.log("MAQUINA NO PUEDE MOVER")
							//no mueve y pasa turno ...
						}else{ //comunicar movimiento a los jugadores
							console.log("MAQUINA MUEVE")
							let ve= "CASA"
							switch(resultado.estado){
								case "CASA" :
									ve="casillasCasa"
									break;
								case "FUERA" :
									ve="casillasCampo"
									break;
								case "META" :
									ve="casillasMeta"
									break;
								case "METIDA" :
									ve="casillasFinMeta"
									break;
								default:
									ve="CASA";
									break;
							}
							let payload = {
								color: turnoColor,
								n: resultado.ficha,
								vector: ve,
								num: resultado.pos
							}

							io.to($this.nameRoom).emit('mover',payload)


						}
					}

					//RESTO TURNOS
					setInterval(function(){
						if($this.restoTurno - $this.latenciaComprobacion >= 0) $this.restoTurno -= $this.latenciaComprobacion
						else {
							//NUEVO TURNO
							//siguientes turnos
							$this.restoTurno = $this.tiempoTurno
							let turnoColor = $this.colores[turno]
							io.to($this.nameRoom).emit('turno',{color: turnoColor })
							//si es máquina directamente tira
							if($this.coloresSession[turno].session === null){//turno de jugador máquina
								let resultado = $this.tableroLogica.tirar(turno,5,null)
								if(resultado === null) {
									//no mueve y pasa turno ...
									console.log("MAQUINA NO PUEDE MOVER")
								}else{ //comunicar movimiento a los jugadores
									console.log("MAQUINA MUEVE")
									let ve= "CASA"
									switch(resultado.estado){
										case "CASA" :
											ve="casillasCasa"
											break;
										case "FUERA" :
											ve="casillasCampo"
											break;
										case "META" :
											ve="casillasMeta"
											break;
										case "METIDA" :
											ve="casillasFinMeta"
											break;
										default:
											ve="CASA";
											break;
									}
									let payload = {
										color: turnoColor,
										n: resultado.ficha,
										vector: ve,
										num: resultado.pos
									}

									io.to($this.nameRoom).emit('mover',payload)


								}
							}

						}

						//enviar cada latenciaComprobacion el nuevo tiempo que resta del turno ...
						io.to($this.nameRoom).emit('actTime',{tiempo: $this.restoTurno});

					}, $this.latenciaComprobacion)
					
				}
			});
		
			socket.on('mover', function(data){
				
				console.log("movimiento recibido");
		
				//reenvia a todos los usuarios
				io.to($this.nameRoom).emit('mover',data);
				
				let jugador=null
				$this.colores.forEach( (e,i) => {
					if(data.color === e) jugador=i
				});
				let resultado = null
				if(jugador !== null) resultado = $this.tableroLogica.movJugadorCasilla(jugador,data.n,data.num,"no");
				/*
				if(resultado.accion == "mata" || resultado.accion == "meta"){ //habría que obtener ahora con +20
					socket.emit('posibles_movs', {color:resultado.color,posibles:resultado.vector});
				}else{
					//Habría que pasar turno, no se si no hacer nada y ya
				}
				*/
			});
		
			socket.on('mensaje', function(data){
				//broadcast a todos los cientes que vean el chat
				if(data.msg !== "" && data.msg !== null) io.to($this.nameRoom).emit('mensaje',data);
			});
		
			socket.on('dado', (dado,session) => {
			
				let c= $this.checkColor(session)
				dado = parseInt(dado)
				let jugador=null
				$this.colores.forEach((col,i) => {
					if(c === col) jugador = i
				})
				
				let vect = (jugador!==null && dado!==null)? $this.tableroLogica.vectorJugador(jugador,dado) : null
				console.log(vect)
		
				socket.emit('posibles_movs', {color:c,posibles:vect});
			});
		
			socket.on('pingServer',function(data){
				console.log("Alguien ha enviado un ping")
				io.to($this.nameRoom).emit('pingCliente',"mensaje del servidor recibido");
			});

			//lanzamos la elección de color, ahora que se ha conectado a la sala
			socket.emit('elegirColor', this.elegirCol);
			
			this.nJugadores++
		}

	}
	cambiarColor(colorOld,colorNew,sessionId,socketId){
		let col = null
		let idxColorOld = null
		let idxColorNew = null
		this.coloresSession.forEach( (c,i) => {
			if(c.color === colorOld) idxColorOld = i
			if(c.color === colorNew) idxColorNew = i
		})
		if(idxColorNew !== null && idxColorOld !== null &&
			this.coloresSession[idxColorOld].session === sessionId &&
			this.coloresSession[idxColorNew].session === null){
				console.log("Cambiar a nuevo color")
				
				this.coloresSession[idxColorOld].session=null
				this.coloresSession[idxColorOld].socket=null
				this.elegirCol[idxColorOld].ocupado=false

				col = this.coloresSession[idxColorNew].color
				this.coloresSession[idxColorNew].session=sessionId
				this.coloresSession[idxColorNew].socket=socketId
				this.elegirCol[idxColorNew].ocupado=true
		}
		return col
	}
	
	cogerColor(color,sessionId,socketId){
		let col=null;
		let encontrado=false;
		let i = 0;
		//mirar que si ya habia elegido color y elige uno nuevo es que cambia de color en la eleccion ...******************
		while(i<this.coloresSession.length && !encontrado){
			if(color === null && this.coloresSession[i].session === sessionId){
				col=this.coloresSession[i].color;
				encontrado=true;
			}else if(color === this.coloresSession[i].color && this.coloresSession[i].session === null){
				console.log("Elegir nuevo color")
				col=this.coloresSession[i].color
				this.coloresSession[i].session=sessionId
				this.coloresSession[i].socket=socketId
				this.elegirCol[i].ocupado=true
				encontrado=true
			}
			i++;
		}
		return col;
	}
	
	checkColor(sessionId){
		let c=null
		this.coloresSession.forEach( e => {
			if(e.session === sessionId) c= e.color
		})
		return c
	}
	
	parsearTablero(){
		
		let info = this.tableroLogica.getInfo()
		let pos = info.posicion
		let casa = info.estado
		let meta = info.meta
	
		let fpos=[]
		for(let i=0;i<this.maxJugadores;i++){
	
			for(let j=0; j<4; j++){
				let nu = pos[i][j]
				let co = this.tableroLogica.player[i].color
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
		
		return fpos
	
	}
}





let port = process.env.PORT || 3000

server.listen(port, function () {
  console.log('Express server listening on port ' + port)
})
