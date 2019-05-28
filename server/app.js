const express = require('express')
const path = require('path');
const app = express()
const routerUsuario = require('./routes/usuario')

//permitir CORS
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use('/api/usuario', routerUsuario)
app.use(express.static(path.join(__dirname,'..','dist')));

var server=require('http').Server(app)
var io= require('socket.io')(server)


/********************************************************************************************/

const Tablero=require( './logica/Tablero.js' )
const TableroMontecarlo=require('./logica/TableroMontecarlo.js')
const IAMontecarlo=require('./logica/IAMontecarlo')

let rooms = []
let infoPrivadaRooms = []
let itRooms = 0


io.on('connection', function(socket){
	
	console.log("Alguien se ha conectado con sockets");

	socket.on('buscarSalas', () =>{
		socket.emit('listaSalas', rooms);
	})

	socket.on('crearSala', data => {
		let nameRoom = 'room '+itRooms

		let name = data.nombre
		let t = parseInt(data.tTurnos)
		let creador = data.id
		let numJugadores = parseInt(data.jugadores)
		let numDados = parseInt(data.dados)
		
		let pass = data.pass //hash o vacío
		let dificultad = data.dificultad

		let tipoBarrera = data.tipoBarrera
		let Lmin = parseInt(data.Lmin)
		let Lmax = parseInt(data.Lmax)

		
		let descripcion = data.descripcion ? data.descripcion : 'Sin descripción'
		let allowPuentes = data.allowPuentes
		let porParejas = data.porParejas
    
		//comprobar campos correctos
		let errores = ''
		if(!name) errores+='Nombre de sala incorrecto. '
		if(t < 10 || t > 50) errores+='El tiempo de turno debe estar entre 10 y 50 segundos. '
		if(numJugadores !== 4 && numJugadores !== 8) errores+='Los jugadores deben ser 4 u 8. '
		if(numDados !== 1 && numDados !== 2) errores+='Los dados deben ser 1 o 2. '
    	if(Lmin<0 || Lmax<0 || Lmin > Lmax) errores+='El intervalo de puntuación para acceder a la partida no es valido. '
		if(!errores){
		
			let jcolors = ["amarilla","azul","roja", "verde"]
			if(numJugadores === 8) jcolors = ["amarilla","cyan","naranja","verde","morada","azul","roja","verdeOs"]

			rooms[itRooms] = new Sala(nameRoom,itRooms, name, t, numJugadores, numDados, jcolors, creador, 
				dificultad, tipoBarrera, Lmin, Lmax,descripcion,allowPuentes,porParejas)

			//poner la contraseña si la tiene
			infoPrivadaRooms[itRooms] = {password: pass, enSala: []}


			//el que crea la sala se une automaticamente a ella
			rooms[itRooms].conectar(socket,creador,false)
			//broadcast para que el resto pueda ver la nueva sala
			io.sockets.emit('listaSalas', rooms);
			//enviamos al creados la ID de la sala para que se autoconecte
			socket.emit('salaCreada', {sala:rooms[itRooms],id:itRooms});
			//actualizamos para siguiente nombre de sala
			itRooms++
		}
		else{ //si error
			socket.emit('errores', {titulo:'Error al crear sala', msg: errores});
		}

		
	})

	socket.on('unirseSala', data => {
		let yaEnSala = false
		if(infoPrivadaRooms[data.id] && infoPrivadaRooms[data.id].password){
			
			infoPrivadaRooms[data.id].enSala.forEach(s => {
				if(s === data.sesion) yaEnSala = true
			})
			if(!yaEnSala && !data.pass) socket.emit('pedirPass',data.id)
			else if(!yaEnSala && data.pass){
				if(data.pass === infoPrivadaRooms[data.id].password) yaEnSala=true //Autenticado
				else socket.emit('errores',{titulo: 'Error autenticación',msg: 'Contraseña incorrecta'})

			}
		} else if(infoPrivadaRooms[data.id] && !infoPrivadaRooms[data.id].password) yaEnSala=true //Autenticado al no haber contraseña

		if(yaEnSala){

			if (rooms[data.id] && rooms[data.id].conectar(socket,data.sesion,data.nuevoSocket)){
				//conectado con exito ...
				console.log("CONECTADO A SALA CORRECTAMENTE")
				socket.emit('unido', data.id);
				//io.sockets.emit('listaSalas', rooms);
			} else {
				//error ...
				console.log("***La sala no existe o esta llena ...*** (connect-failed)")
			}



		}
		
		

		
	})
	

});

/********************************************************************************************/

class Sala{
	constructor(nameRoom, indexRoom, nameSala, tTurnos, maxJugadores, numDados, colores, 
		idCreador, dificultad, tipoBarrera, Lmin, Lmax, descripcion, allowPuentes, porParejas){
		this.nameRoom = nameRoom
		this.indexRoom = indexRoom
		this.nameSala = nameSala
		this.descripcion = descripcion
		this.tTurnos = tTurnos
		this.maxJugadores = maxJugadores
		this.nJugadores = 0
		this.numDados = numDados
		this.colores = colores
		this.idCreador = idCreador

		this.dificultad = dificultad
		this.tipoBarrera = tipoBarrera
		this.Lmin = Lmin
		this.Lmax = Lmax
		this.hayGanador = false
		this.allowPuentes = allowPuentes
		this.porParejas = porParejas
		this.tableroLogica =  new Tablero(this.maxJugadores,this.numDados,this.colores,this.allowPuentes,this.porParejas)
		this.partidaEmpezada = false

		this.tiempoTurno = parseInt(tTurnos) * 1000 //segundos
		this.restoTurno = this.tiempoTurno //maxtiempo
		this.turnoAnterior = 0;
		this.latenciaComprobacion = 1000 //1seg

		this.historialChat = []
		this.coloresSession = []
		this.elegirCol = []
		this.colores.forEach( (c,i) => {
			this.coloresSession[i] = {color: c, session: null, socket: null}
			this.elegirCol[i] = {color: c, ocupado: false, user: null}
		})

		this.dado1 = 0
		this.dado2 = 0
		this.ambos = true
		this.especial = false

		this.haLlegado = false
		this.haMatado = false

		this.IAMontecarlo = new IAMontecarlo(this.tTurnos - 1)
		this.tableroMontecarlo = new TableroMontecarlo(this.maxJugadores) // Se utilizara para sobreesscribirlo
	}

	conectar(socket,sesion,nuevoSocket){
		let reconnect = false
		let yaEnSala = false
		let yatieneColor = false
		infoPrivadaRooms[this.indexRoom].enSala.forEach(s=>{
			if(s===sesion){
				yaEnSala = true
				if(nuevoSocket) reconnect = true
			}
		})
		this.coloresSession.forEach( e => {
			if(e.session === sesion){
				e.socket = socket.id
				socket.emit('recover',{sala:this,pos:this.parsearTablero()})

				//enviamos el turno actual
				let turnoActual = this.tableroLogica.getTurno()
				let turnoColor = this.colores[turnoActual.turno]
				socket.emit('turno',{color: turnoColor })
				//enviamos los dados actuales
				socket.emit('mostrarDados', {dado1:this.dado1,dado2:this.dado2,animacion:false});

				yatieneColor = true
				if(!reconnect) return true
			} 
			
		})
		if(yaEnSala && !yatieneColor){//si ya en sala pero no tiene color elegido
			socket.emit('elegirColor', this);
			if(!reconnect) return true
		}
		if((this.nJugadores+1 > this.maxJugadores || this.partidaEmpezada) && !reconnect) return false
		else {
			let $this = this
			socket.join(this.nameRoom, () => {
				
				if(!yaEnSala){
					console.log("SE ENVIA LA ELECCION INICIAL DE COLOR")
					infoPrivadaRooms[$this.indexRoom].enSala.push(sesion)
					socket.emit('elegirColor', $this);
					$this.nJugadores++
				}
				io.to($this.nameRoom).emit('mensajeUnion','a new user has joined the room'); // broadcast to everyone in the room
			})
			

			socket.on('colorElegido', function(data){
				let c = null
				if(data.colOld === null) c=$this.cogerColor(data.colNew,data.id,socket.id,data.user);
				else c=$this.cambiarColor(data.colOld,data.colNew,data.id,socket.id,data.user);
				//actualizar colores elegidos en todos los usuarios de la sala eligiendo
				if(c !== null) io.to($this.nameRoom).emit('elegirColor', $this)
			})
			
			socket.on('iniciarPartida', function(data) {
				//************** */
				//adjudicar cualquier color libre a usuarios que no hayan elegido aun el color pero que esten en la sala ***********
				//************** */
				console.log("NIVEL DE DIFICULTAD: " + $this.dificultad)
				if($this.idCreador === data.id){
					console.log("Iniciando partida ...")
					$this.partidaEmpezada = true
					//io.to($this.nameRoom).emit('start_pos', {color:c, pos:$this.parsearTablero()});
					let positions = $this.parsearTablero()
					$this.coloresSession.forEach( e => {
						if(e.session !== null) 
							io.to(e.socket).emit('start_pos', {color: e.color, pos: positions, jugadores: $this.elegirCol, 
								colores: $this.colores, porParejas: $this.porParejas, nDados: $this.numDados});
					})

					//PRIMER TURNO
					let turnoActual = $this.tableroLogica.getTurno()
					let turno = turnoActual.turno
					let reset = turnoActual.reset
					
					let turnoColor = $this.colores[turno]
					$this.haMatado = false
					$this.haLlegado = false
					io.to($this.nameRoom).emit('turno',{color: turnoColor })
					io.to($this.nameRoom).emit('actTime',{tiempo: $this.restoTurno})
					
				
					setTimeout( ()=>{ //tiempo para respuesta

						let rst = false
						if($this.coloresSession[turno].session === null) rst=true //si es máquina directamente tira
						$this.gestionTurnos(null,rst,socket) //primer turno

						let intervalo = setInterval( () => {$this.gestionTurnos(intervalo,null,socket)}, $this.latenciaComprobacion) //RESTO TURNOS

					},1000)
					


					
					
				}
			});

			socket.on('actValue', function(data){
				console.log("DADO1: "+$this.dado1+ " DADO2 "+$this.dado2+ " value "+data.valor)
				if(!$this.especial){
					if(data.valor===($this.dado1+$this.dado2)){
						$this.ambos = true;
					}else if(data.valor === $this.dado1){
						$this.dado1 = 0
					}else{
						$this.dado2 = 0
					}
					console.log("DADO1: "+$this.dado1+ " DADO2 "+$this.dado2)
				}else $this.especial = false
				console.log("AMBOS "+$this.ambos)
			});

			socket.on('actualiza', function(dado){
				console.log("ACTUALIZAAAR")
				$this.ambos = true
			});
		
			socket.on('pasar', function(dado){
				$this.tableroLogica.pasar
			});

			socket.on('move', function(data){
				
				console.log("movimiento recibido");
				
				
				let jugador=null
				$this.colores.forEach( (e,i) => {
					if(data.color === e)  jugador=i
				});
				console.log(data.accion)
				//******************HABRÏA QUE MOVER PRIMERO Y LUEGO LLAMAR AL TABLERO
				let resultado = null
				if(jugador !== null) resultado = $this.tableroLogica.movJugadorCasilla(jugador,data.n,data.num,data.accion,data.mov);
				console.log("Resultado es: " + resultado)
				for(let i=0;i<resultado.length;i++){
					console.log("Resultado: " + resultado[i][0]+resutlado[i][1]);
				}
				//reenvia a todos los usuarios
				if(resultado !== null){
					data.accion = resultado.accion;
					data.estado = resultado.estado;
					switch(resultado.accion){
						case "mata":
							$this.haMatado = true;
							$this.haLlegado = false;
							break;
						case "meta":
							$this.haMatado = false;
							$this.haLlegado = true;
							break;
						default:
							$this.haMatado = false;
							$this.haLlegado = false;
							break;
					}
					//Aquí eliminarif(mata)emit(comer)else emit(mover)
					
					io.to($this.nameRoom).emit('mover',data);
				} 
				
				this.restoTurno=0
			});
			socket.on('pasarTurno',function(data){
				console.log("RECIBE: "+$this.tableroLogica.haMovido)
				$this.tableroLogica.pasarTurno()
				console.log("YA "+$this.tableroLogica.haMovido)
			});

			socket.on('mensaje', function(data){
				//broadcast a todos los cientes que vean el chat
				if(data.msg){
					$this.historialChat.push(data)
					io.to($this.nameRoom).emit('mensaje',data);
				} 
			});
		
			//USUARIO PIDE TIRAR
			socket.on('tirarDados', (color) => {
			
				let c= color
				
				let cc = c

				let dado = $this.tableroLogica.obtenerDado()
				let dado2 = this.numDados === 2 ? $this.tableroLogica.obtenerDado() : null

				socket.emit('mostrarDados', {dado1:dado,dado2:dado2,animacion:true});


				let jugador=null
				$this.colores.forEach((col,i) => {
					if(c === col && $this.tableroLogica.haTerminado(i)){
						jugador=(i+$this.maxJugadores/2)%$this.maxJugadores
						cc = $this.tableroLogica.colorCompa(i)
						socket.emit('activame', {color:cc});
						console.log("ha activado")
					} 
					else if(c === col) jugador=i
				})
				if($this.numDados===2)$this.ambos = false
				$this.dado1 = dado; $this.dado2 = dado2
				
				if($this.haMatado) { dado = 20; $this.haMatado = false}
				else if($this.haLlegado){ dado = 10; $this.haLlegado = false}
				
				let vect = null
				if(this.numDados === 1) vect = (jugador!==null && dado!==null)? $this.tableroLogica.vectorJugador(jugador,dado) : null
				else if(this.numDados === 2) vect = (jugador!==null && dado!==null)? $this.tableroLogica.vectorJugador2(jugador,dado,dado2) : null
				 
				setTimeout( ()=>{ //tiempo para animación de tirada dados
					socket.emit('posibles_movs', {color:cc,posibles:vect});
				}, 1000)
				
			});

			//USUARIO ENVIA LA TIRADA QUE DESEA-> SOLO DESARROLLO************************************
			socket.on('dado', (dado,session) => {
			
				let c= $this.checkColor(session)
				console.log("COLOR "+c)
				let cc = c
				dado = parseInt(dado)
				let jugador=null
				$this.colores.forEach((col,i) => {
					if(c === col && $this.tableroLogica.haTerminado(i)){
						jugador=(i+$this.maxJugadores/2)%$this.maxJugadores
						cc = $this.tableroLogica.colorCompa(i)
						socket.emit('activame', {color:cc});
						console.log("ha activado")
					} 
					else if(c === col) jugador=i
				})
				if($this.numDados===2)$this.ambos = false
				$this.dado1 = dado
				$this.dado2 = (dado-1)%6
				io.to($this.nameRoom).emit('mostrarDados',{dado1: $this.dado1,dado2: $this.dado2,animacion:true})
				console.log("colorCompa: "+cc)
				console.log("llega: "+$this.haLlegado)
				if($this.haMatado) {
					dado = 20;
					$this.haMatado = false
				}
				else if($this.haLlegado){
					dado = 10; 
					$this.haLlegado = false
				}
				console.log("dado: "+dado)
				let vect = null
				if(this.numDados === 1) vect = (jugador!==null && dado!==null)? $this.tableroLogica.vectorJugador(jugador,dado) : null
				else if(this.numDados === 2) vect = (jugador!==null && dado!==null)? $this.tableroLogica.vectorJugador2(jugador,dado,(dado-1)%6) : null
				
				
				socket.emit('posibles_movs', {color:cc,posibles:vect});
			});

			
			return true
		}

	}
	cambiarColor(colorOld,colorNew,sessionId,socketId,username){
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
				this.elegirCol[idxColorOld].user=null
				this.elegirCol[idxColorOld].ocupado=false

				col = this.coloresSession[idxColorNew].color
				this.coloresSession[idxColorNew].session=sessionId
				this.coloresSession[idxColorNew].socket=socketId
				this.elegirCol[idxColorNew].user=username
				this.elegirCol[idxColorNew].ocupado=true
		}
		return col
	}
	
	cogerColor(color,sessionId,socketId,username){
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
				this.elegirCol[i].user=username
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
  
  	ganadores(){
		let turnoActual = this.tableroLogica.getTurno()
		return this.tableroLogica.player[turnoActual.turno].color
	}
	// actualizarEstadoPartida(jugada, accion){
	// 	$this.tableroLogica.estado.pos = clonedeep(this.pos)
	// 	$this.tableroLogica.estado.casa = clonedeep(this.casa)
	// 	$this.tableroLogica.estado.meta = clonedeep(this.meta)
	// 	$this.tableroLogica.estado.jugadores = clonedeep(this.jugadores)
	// 	$this.tableroLogica.estado.casilla = clonedeep(this.casilla)
	// 	$this.tableroLogica.estado.triples6 = this.veces6
	// 	$this.tableroLogica.estado.ultimaFicha = this.lastMove
	// 	$this.tableroLogica.estado.turno = this.turno
	// 	$this.tableroLogica.estado.repeticion = accion
		
	// 	let nuevoHistorial = this.estado.historial.slice()
	// 	$this.tableroLogica.estado.historial = nuevoHistorial.push(jugada)
	// }

	/*****FUNCION DE GESTION DE TURNO EN LOS INTERVALOS************ */
	/************************************************************** */
	gestionTurnos(intervalo,rst,socket){
		let $this = this
		if(!$this.tableroLogica.hayGanador()){
			let turnoActual = $this.tableroLogica.getTurno()
			let turno = turnoActual.turno;
			let reset = turnoActual.reset
			if(rst !== null && rst) reset=rst

			if($this.turnoAnterior !== turno){
				$this.haMatado = false;
				$this.haLlegado = false;
			}
			$this.turnoAnterior = turno;

			if( ($this.restoTurno - $this.latenciaComprobacion >= 0) && !reset ){
				$this.restoTurno -= $this.latenciaComprobacion
			}
			else if(reset){

				setTimeout(()=>{
					$this.nuevoTurno(turno,socket)
				},500)
				//TIEMPO ENTRE TURNOS 0.5seg
				
			}
			//if restoTurno=0 y el jugador es humano ...**********************************

			//enviar cada latenciaComprobacion el nuevo tiempo que resta del turno ...
			io.to($this.nameRoom).emit('actTime',{tiempo: $this.restoTurno});
		}else{
			console.log("HAYGANADOR")
			$this.hayGanador = true;
			let usuariosGanadores = {ganadores: $this.ganadores(), parejas: this.porParejas}
			//let data = {user: this.coloresSession[turno+1]}
			io.to($this.nameRoom).emit('hayGanador',usuariosGanadores);
			clearInterval(intervalo)
		}
	}

	/***************************************************************************** */
	/************************* Fin gestion turnos ******************************** */



	/*****************************GESTION NUEVO TURNO***************************** */
	nuevoTurno(turno,socket){
		let $this = this
		//NUEVO TURNO
		//siguientes turnos
		$this.restoTurno = $this.tiempoTurno
		let turnoColor = $this.colores[turno]
		io.to($this.nameRoom).emit('turno',{color: turnoColor })
		//si es máquina directamente tira
		let resultado = null
		/*if($this.coloresSession[turno].session !== null){
			let c= $this.checkColor($this.coloresSession[turno].session)
			let cc = c
			let jugador=null
			$this.colores.forEach((col,i) => {
				if(c === col && $this.tableroLogica.haTerminado(i)){
					jugador=(i+$this.maxJugadores/2)%$this.maxJugadores
					cc = $this.tableroLogica.colorCompa(i)
					socket.emit('activame', {color:cc});
					console.log("ha activado")
				} 
				else if(c === col) jugador=i
			})
			$this.tableroLogica.vectorJugador(jugador,0)
		}
		else*/ if($this.coloresSession[turno].session !== null && ($this.haMatado || $this.haLlegado || !$this.ambos)){
				let c= $this.checkColor($this.coloresSession[turno].session)
				let cc = c
				let jugador=null
				$this.colores.forEach((col,i) => {
					if(c === col && $this.tableroLogica.haTerminado(i)){
						jugador=(i+$this.maxJugadores/2)%$this.maxJugadores
						cc = $this.tableroLogica.colorCompa(i)
						socket.emit('activame', {color:cc});
						console.log("ha activado")
					} 
					else if(c === col) jugador=i
				})
				let dado=$this.dado1
				let dadoA=$this.dado2
				console.log("MATA "+$this.haMatado + " META "+$this.haLlegado)
				if($this.haMatado) {
					dado = 20;
					dadoA = 0;
					$this.haMatado = false
					$this.especial = true
				}
				else if($this.haLlegado){
					dado = 10; 
					dadoA = 0;
					$this.haLlegado = false
					$this.especial = true
				}else{
					
				}
				let vect = null
				if($this.numDados === 1) vect = (jugador!==null && dado!==null)? $this.tableroLogica.vectorJugador(jugador,dado) : null
				else if($this.numDados === 2) vect = (jugador!==null && dado!==null)? $this.tableroLogica.vectorJugador2(jugador,dado,dadoA) : null
				console.log("VECT "+vect)
				socket.emit('posibles_movs', {color:cc,posibles:vect});
		}
		else if($this.coloresSession[turno].session === null){//turno de jugador máquina 

			setTimeout( () => {
				console.log("haMatado "+$this.haMatado+ " turno "+turno)
				if($this.dificultad === "dificil"){ // TODO: De momento suponer que el jugador azul es IAMontecarlo
					if($this.haMatado){
						resultado = $this.IAMontecarlo.tirar(20, $this.tableroLogica, $this.tableroMontecarlo)
						console.log("MATAA")
					}else if($this.haLlegado){
						resultado = $this.IAMontecarlo.tirar(10, $this.tableroLogica, $this.tableroMontecarlo)
						console.log("METEE")								
					}else{
						// resultado = $this.IAMontecarlo.tirar(5, $this.tableroLogica, $this.tableroMontecarlo)
						let dado = $this.tableroLogica.obtenerDado()
						console.log("Jugador " + turno + " tira " + dado)
						resultado = $this.IAMontecarlo.tirar(dado, $this.tableroLogica, $this.tableroMontecarlo)
					}
				}
				else{
					if($this.haMatado){
						resultado = $this.tableroLogica.tirar(turno,20,0)
					}else if($this.haLlegado){
						resultado = $this.tableroLogica.tirar(turno,10,0)
					}else {
						//resultado = $this.tableroLogica.tirar(turno,$this.tableroLogica.obtenerDado(),null)
						//resultado = $this.tableroLogica.tirar(turno,5,null)
						if($this.numDados===2){
							if(!$this.tableroLogica.getMov()){
								$this.dado1 = $this.tableroLogica.obtenerDado()
								$this.dado2 = $this.tableroLogica.obtenerDado()
								if($this.dado === 5){
									let aux = $this.dado1
									$this.dado1 = $this.dado2
									$this.dado2 = aux
								}
								io.to($this.nameRoom).emit('mostrarDados',{dado1: $this.dado1,dado2: $this.dado2,animacion:true})
							}else{
								$this.dado1 = $this.dado2
								$this.dado2 = 0
							}
						}else{
							$this.dado1 = $this.tableroLogica.obtenerDado()
							$this.dado2 = 0
							io.to($this.nameRoom).emit('mostrarDados',{dado1: $this.dado1,dado2: $this.dado2,animacion:true})
						}


						//ENVIAR DADOS PARA QUE SE MUESTREN EN LA INTERFAZ**************************************
						//setTimeout( () => {
						//}, 1000) //1 segundo diferencia entre turnos

						console.log("$this.dado1 "+$this.dado1)
						console.log("$this.dado2 "+$this.dado2)
						resultado = $this.tableroLogica.tirar(turno,$this.dado1,$this.dado2)
					}
				}

				// let dado = 20, 10, 5, obtenerDado()
				// despues de que mueva la maquina hay que actualizar estado
				//$this.tableroLogica.actualizarEstadoPartida(new Jugada(resultado.ficha, dado), resultado.accion) // Nuevo estado de la partida después de tirar

				if(!resultado) {
					//no mueve y pasa turno ...
					//console.log("MAQUINA NO PUEDE MOVER")
				}else if(resultado.accion === "triple"){
					io.to($this.nameRoom).emit('triple6', {info: resultado});
				}
				else{ //comunicar movimiento a los jugadores
					console.log("MAQUINA MUEVE "+resultado.accion)
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
					}switch(resultado.accion){
						case "mata":
							$this.haMatado = true;
							$this.haLlegado = false;
							break;
						case "meta":
							$this.haMatado = false;
							$this.haLlegado = true;
							break;
						default:
							$this.haMatado = false;
							$this.haLlegado = false;
							break;
					}
					let value = resultado.pos
					if(resultado.estado!=="FUERA") value-=1
					console.log("Value "+value)
					let payload = {
						color: turnoColor,
						n: resultado.ficha,
						vector: ve,
						num: value,
						accion: resultado.accion,
						estado: resultado.estado
					}
					//MAQUINA MATAR if...
					//PONER TIMEOUT AQUI PARA ESPERAR ANIMACION DADOOOOÇ**************************************************
					setTimeout( () => {
						io.to($this.nameRoom).emit('mover',payload)
					},1000)
					//Aquí habría que volver a llamar si mata o la mete

				}
				
				$this.restoTurno=0 //resetear para nuevo turno

			}, 1000) //ENTRE TURNOS MAQUINA
		}
	}
}





let port = process.env.PORT || 3000

server.listen(port, function () {
  console.log('Express server listening on port ' + port)
})
