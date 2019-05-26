<template>
  <div class="content">
    
    <div class="note" style="border-left: 4px solid rgba(41,189,0,1)">
        <h5>Necesario para jugar</h5>
    </div>
    <div class="note" style="border-left: 4px solid #88D773; background-color: rgba(41,189,0,0.1);padding-top:15px">
        <p>⮚ Pueden jugar de 2 a 4 jugadores en un tablero de parchís corriente de 4 colores, o de 2 a 8 jugadores en un tablero de parchís de 8 colores.</p>
        <p>⮚ A cada jugador se le asocia un color y dispone de 4 fichas de ese mismo color y uno o dos dados de seis caras.</p>
    </div>
    <div class="note" style="border-left: 4px solid rgba(238,183,10,1)">
        <h5>Terminología típica</h5>
    </div>
    <div class="note" style="border-left: 4px solid #DCB75D; background-color: rgba(238,183,10,0.1);padding-top:15px">
        <p>⮚ Las casillas cuadradas coloreadas de las esquinas en las que se tienen todas las fichas inicialmente se denominan casas.</p>
        <p>⮚ Las casillas rectangulares, coloreadas y numeradas que hay junto a cada casa se denominan salidas.</p>
        <p>⮚ Las casillas rectangulares marcadas de otro color se denominan seguros.</p>
        <p>⮚ Las casillas triangulares coloreadas del centro del tablero se denominan metas.</p>
        <p>⮚ A las casillas coloreadas justo antes de las metas se les llama pasillo, incluida la casilla anterior del mismo color que la ficha.</p>
        <p>⮚ Dos fichas de igual color o diferente color en una casilla de seguro forman una barrera.</p>
		    <p>⮚ Contar siete, diez o veinte significa que un jugador debe avanzar una de sus fichas siete, diez o veinte casillas, respectivamente.</p>
        <p>⮚ Se emplean las palabras comer o capturar cuando una ficha ocupa la posición de una ficha contraria, moviéndose esta última a su casa.</p>
        <p>⮚ Se avanzarán 20 casillas en el caso de comer una ficha distinta a la tuya.</p>
        <p>⮚ Se avanzarán 10 casillas en el caso de meter una de tus fichas en la meta.</p>
    </div>
    
    <div class="note" style="border-left: 4px solid rgba(220,120,93,1)">
        <h5>Antes de comenzar la partida</h5>
    </div>
    <div class="note" style="border-left: 4px solid #F56D48; background-color: rgba(220,120,93,0.1);padding-top:15px">
        <p>⮚ Cada jugador elegirá uno de los colores disponibles en la partida: amarillo, azul claro, naranja, verde claro, morado, azul oscuro, rojo o verde oscuro.</p>
        <p>⮚ Los jugadores lanzarán el dado y quien obtenga la mayor puntuación será quien comience la partida.</p>
    </div>
    <div class="note" style="border-left: 4px solid rgba(204,204,66,1)">
        <h5>Reglas básicas</h5>
    </div>
    <div class="note" style="border-left: 4px solid #E1E147; background-color: rgba(245,245,72,0.1);padding-top:15px">
        <p>⮚ Al comenzar el juego todas las fichas están en la casa de su color.</p>
        <p>⮚ La partida se desarrolla por turnos. Cada jugador lanzará el dado una sola vez en cada turno. Una vez jugado su turno, si sacó un 6, o dobles en caso de jugar con dos dados, el jugador repetirá el turno.</p>
        <p>⮚ Sólo cuando la puntuación obtenida con el dado no permita hacer ninguna jugada el jugador no hará nada. En el resto de los casos el jugador está obligado a hacer lo que pueda hacer.</p>
        <p>⮚ Las fichas se mueven en sentido contrario a las agujas del reloj desde la salida de su color hasta la meta de su color. Las fichas que están en la casa y en la meta no pueden moverse.</p>
        <p>⮚ Una ficha no podrá moverse si se encuentre con una casilla en la que ya existan 2 fichas formando una barrera.</p>
    </div>
    
    <div class="note" style="border-left: 4px solid rgba(0,128,189,1)">
        <h5>Tirada</h5>
    </div>
    <div class="note" style="border-left: 4px solid #91C3FE; background-color: rgba(0,128,189,0.1);padding-top:15px;margin-bottom:0px">
        <p>⮛ Sobre el 1, el 2, el 3 y el 4:</p>
        <p>⮚ El jugador que saque un 1, un 2, un 3 o un 4 avanzará una de sus fichas una, dos, tres o cuatro casillas, respectivamente.</p>
    </div>
    <div class="note" style="border-left: 4px solid #5D98DC; background-color: rgba(0,128,189,0.1);padding-top:15px;margin-top:0px;margin-bottom:0px">
        <p>⮛ Sobre el 5:</p>
        <p>⮚ El jugador que saca un 5 con el dado puede sacar ficha de su casa a la casilla de salida. Si esto no fuera posible porque ya hay dos fichas de su mismo color en la salida o porque ya no dispone de más fichas para sacar, tendrá que mover 5 casillas con otra ficha. Si se da el caso de que 2 fichas de otro color se encuentran en la casilla de salida de otra, y esta otra saca un 5, una de las dos anteriores (la que esté más tiempo) deberá ser devuelta a su casa permitiendo que quien ha sacado un 5 pueda poner su ficha.</p>
        <p>⮚ Si en la salida hay una ficha del mismo color que la salida al mismo tiempo que una de otro color, lo cual es posible al ser también un seguro, si sale un 5 y saca por tanto una ficha que estaba en casa, se come a la ficha de otro color.</p>
        <p>⮚ Durante la partida, si un jugador tuviera alguna de sus fichas en su casa y sacara un cinco con el dado, estaría obligado a sacar ficha, siempre y cuando su casilla de salida no estuviera ocupada por dos fichas del mismo color.</p>
    </div>
    <div class="note" style="border-left: 4px solid #0970E9; background-color: rgba(0,128,189,0.1);padding-top:15px;margin-top:0px">
        <p>⮛ Sobre el 6:</p>
        <p>⮚ El jugador que saque un 6 avanzará una de sus fichas seis casillas.El jugador que saque un 6 podrá repetir turno. Si saca otro 6 podrá volver a repetir. Si saca un 6 en la tercera tirada, la última ficha que movió volverá a casa, exceptuando si la última ficha que movió ya estaba en el color de su meta. Esto mismo ocurrirá al sacar dobles si se juega con dos dados.</p>
	      <p>⮚ Cuando se realiza una jugada y se mueve una ficha, no se puede volver atrás.</p>
    </div>
    
    <div class="note" style="border-left: 4px solid rgba(66,204,130,1)">
        <h5>Barreras o puentes</h5>
    </div>
    <div class="note" style="border-left: 4px solid #3AE087; background-color: rgba(66,204,130,0.1);padding-top:15px">
        <p>⮚ Ninguna ficha puede pasar o comer en una barrera. Esta regla prevalece sobre las demás.</p>
        <p>⮚ Cada jugador tiene la posibilidad de poner una ficha en cada casilla de seguro.</p>
        <p>⮚ Si un jugador tiene una barrera y saca un 6 con un dado, o dobles con dos dados, deberá abrir la barrera obligatoriamente. La única excepción a esta regla ocurrirá cuando la ficha de la barrera deba avanzar y ésta no pueda, ya sea por encontrarse con otra barrera en medio del trayecto.</p>
        <p>⮚ Se permiten hacer barreras con fichas de distinto color en los seguros si se ha activado la corresponiente opción al crear la sala. Si hay dos fichas de distinto color en un seguro que es la salida de otro jugador y este tercero saca un 5 la primera ficha en entrar en este seguro estará eliminada.</p>
        <p>⮚ Si se está jugando por parejas, se permite hacer barreras con fichas mezcladas de ambos jugadores.</p>
    </div>
    
    <div class="note" style="border-left: 4px solid rgba(185,81,222,1)">
        <h5>Comer o capturar</h5>
    </div>
    <div class="note" style="border-left: 4px solid #9E2BC6; background-color: rgba(185,81,222,0.1);padding-top:15px">
        <p>⮚ Si una ficha cae en una casilla blanca y numerada ocupada por una ficha de otro color, se la comerá. La ficha comida irá a su casa original (de su mismo color). El jugador que coma contará 20.</p>
        <p>⮚ En las salidas y en los seguros no es posible comer y por tanto pueden estar dos fichas de colores diferentes.</p>
        <p>⮚ En la salida no puede haber más de dos fichas. Si un jugador, al sacar una ficha de su casa, encuentra dos fichas de otros colores, comerá la última que hubiese llegado y contará 20.</p>
        <p>⮚ Se pueden comer dos fichas contrarias pero solo se contarán 20.</p>
    </div>
      
    <div class="note" style="border-left: 4px solid rgba(220,120,93,1)">
        <h5>Meta y fin del juego</h5>
    </div>
    <div class="note" style="border-left: 4px solid #F56D48; background-color: rgba(220,120,93,0.1);padding-top:15px">
        <p>⮚ El jugador que mete una ficha en la meta, avanza 10 con alguna de sus otras fichas.</p>
        <p>⮚ El jugador que consigue meter sus 4 fichas en la meta finaliza el juego, deja de lanzar el dado y pasa turno.</p>
        <p>⮚ Gana el jugador que primero mete sus 4 fichas en su meta. En segundo lugar y tercer lugar quedan los jugadores que consiguen meter todas sus fichas en segundo y tercer lugar, respectivamente. Pierde el jugador que no consigue meter todas las fichas cuando los otros han terminado.</p>
        <p>⮚ Cuando un jugador tiene una ficha en el pasillo de meta debe sacar la puntuación exacta para introducir la ficha en meta. Si saca una cantidad mayor a la distancia a la meta, no podrá mover dicha ficha.</p>
    </div>

    <div class="note" style="border-left: 4px solid rgba(238,183,10,1)">
        <h5>Parchís por parejas</h5>
    </div>
    <div class="note" style="border-left: 4px solid #DCB75D; background-color: rgba(238,183,10,0.1);padding-top:15px">
        <p>⮚ En el parchís por parejas, los compañeros se sitúan en extremos opuestos del tablero.</p>
        <p>⮚ Gana la pareja que antes meta sus fichas.</p>
        <p>⮚ Cuando un jugador de la pareja meta sus cuatro fichas, la tirada de su turno contará para su compañero.</p>
    </div>
      
      
    <div class="note" style="border-left: 4px solid rgba(0,128,189,1)">
      <h5>Parchís con dos dados</h5>
    </div>
    <div class="note" style="border-left: 4px solid #5D98DC; background-color: rgba(0,128,189,0.1);padding-top:15px">
        <p>⮚ Esta modalidad permite un juego mucho más estratégico y rápido, ya que los jugadores pueden mover en su turno 2 fichas con el valor de cada dado.</p>
	      <p>⮚ Las reglas de esta modalidad son un reflejo de las del juego con 1 dado. Donde todas las reglas que aplicaban al sacar un 6, aplican ahora al sacar el mismo número en ambos dados (dobles). Por ejemplo: en vez de sacar un 6 para repetir turno, se debe sacar el mismo valor con los 2 dados (un doble); para sacar una ficha de casa, es suficiente con que ambos dados sumen 5; etc.</p>
    </div>
  </div>
</template>

<style>
.note{
    margin: 1.5em 0;
    padding: 8px 16px;
    overflow: hidden;
    border-left: 4px solid #ffab40;
    background-color: #E9E9E9;
    text-align: justify;
    text-justify: inter-word;
}
</style>
