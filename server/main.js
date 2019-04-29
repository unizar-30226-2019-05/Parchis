//Esto seria el servidor
//Estas 4 lineas siempre asi
var express = require('express');
//inicialización
var app=express();
var server=require('http').Server(app);
var io= require('socket.io')(server);



app.use(express.static('public'))

//muestra algo en la pagina
app.get('/', function(req, res){
	res.status(200).send("Hello Mundo!")
});

//Escucha un mensaje (connection) y cuando le llegue
//hara la funcion.


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
	{color:"roja",cogido:false},
	{color:"azul",cogido:false},
	{color:"verde",cogido:false},
	{color:"amarilla",cogido:false}
];

function cogerColor(){
	let col="roja";
	let encontrado=false;
	let i = 0;
	while(i<colores.length && !encontrado){
		if(!colores[i].cogido){
			col=colores[i].color;
			colores[i].cogido=true;
			encontrado=true;
		}
		i++;
	}
	return col;
}

io.on('connection', function(socket){
	//lo que se pone aqui al principio se enviara al conectarse al cliente.
	console.log("Alguien se ha conectado con sockets");
	//envia solo a un ciente
	

	let col=cogerColor();
	socket.emit('start_pos', {color:col, pos:fichas_pos});



	socket.on('mover', function(data){
		//messages.push(data);->actualizar fichas_pos ***********
		
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

});

//Puerto en el que se lanza el servidor
server.listen(8080, function(){
	console.log("servidor corriendo");
});
