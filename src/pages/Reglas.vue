<template>
  <div class="content">
    <h2><b><u>REGLAS DEL PARCHIS</u></b></h2>
    <h4>Necesario para jugar:</h4>
    <p>- Pueden jugar de 2 a 4 jugadores en un tablero de parchís corriente de 4 colores, o de 2 a 8 jugadores en un tablero de parchís de 8 colores.
        <br>- A cada jugador se le asocia un color y dispone de 4 fichas de ese mismo color y uno o dos dados de seis caras.</p>
    <h4>La terminología típica es la siguiente:</h4>
    <p>- Las casillas cuadradas coloreadas de las esquinas en las que se tienen todas las fichas inicialmente se denominan casas.
        <br>- Las casillas rectangulares, coloreadas y numeradas que hay junto a cada casa se denominan salidas.
        <br>- Las casillas rectangulares marcadas de otro color se denominan seguros.
        <br>- Las casillas triangulares coloreadas del centro del tablero se denominan metas.
        <br>- A las casillas coloreadas justo antes de las metas se les llama pasillo, incluida la casilla anterior del mismo color que la ficha.
        <br>- Dos fichas de igual color o diferente color en una casilla de seguro forman una barrera.
		    <br>- Contar siete, diez o veinte significa que un jugador debe avanzar una de sus fichas siete, diez o veinte casillas, respectivamente.
        <br>- Se emplean las palabras comer o capturar cuando una ficha ocupa la posición de una ficha contraria, moviéndose esta última a su casa.
        <br>- Se avanzarán 20 casillas en el caso de comer una ficha distinta a la tuya.
        <br>- Se avanzarán 10 casillas en el caso de meter una de tus fichas en la meta.
    </p>
    <h4>Antes de comenzar la partida:</h4>
    <p>- Cada jugador elegirá uno de los colores disponibles en la partida: amarillo, azul claro, naranja, verde claro, morado, azul oscuro, rojo o verde oscuro.
      <br>- Los jugadores lanzarán el dado y quien obtenga la mayor puntuación será quien comience la partida.</p>
    <h4>Reglas básicas:</h4>
    <p>- Al comenzar el juego todas las fichas están en la casa de su color.
      <br>- La partida se desarrolla por turnos. Cada jugador lanzará el dado una sola vez en cada turno. Una vez jugado su turno, si sacó un 6, o dobles en caso de jugar con dos dados, el jugador repetirá el turno.
      <br>- Sólo cuando la puntuación obtenida con el dado no permita hacer ninguna jugada el jugador no hará nada. En el resto de los casos el jugador está obligado a hacer lo que pueda hacer.
      <br>- Las fichas se mueven en sentido contrario a las agujas del reloj desde la salida de su color hasta la meta de su color. Las fichas que están en la casa y en la meta no pueden moverse.
      <br>- Una ficha no podrá moverse si se encuentre con una casilla en la que ya existan 2 fichas formando una barrera.
    </p>
    <h4>Sobre el 5:</h4>
    <p>
      - El jugador que saca un 5 con el dado puede sacar ficha de su casa a la casilla de salida. Si esto no fuera posible porque ya hay dos fichas de su mismo color en la salida o porque ya no dispone de más fichas para sacar, tendrá que mover 5 casillas con otra ficha. Si se da el caso de que 2 fichas de otro color se encuentran en la casilla de salida de otra, y esta otra saca un 5, una de las dos anteriores (la que esté más tiempo) deberá ser devuelta a su casa permitiendo que quien ha sacado un 5 pueda poner su ficha.
      <br>- Si en la salida hay una ficha del mismo color que la salida al mismo tiempo que una de otro color, lo cual es posible al ser también un seguro, si sale un 5 y saca por tanto una ficha que estaba en casa, se come a la ficha de otro color.
      <br>- Durante la partida, si un jugador tuviera alguna de sus fichas en su casa y sacara un cinco con el dado, estaría obligado a sacar ficha, siempre y cuando su casilla de salida no estuviera ocupada por dos fichas del mismo color.
    </p>
    <h4>Sobre el 1, el 2, el 3 y el 4:</h4>
    <p>- El jugador que saque un 1, un 2, un 3 o un 4 avanzará una de sus fichas una, dos, tres o cuatro casillas, respectivamente.
      </p>
      <h4>Sobre el 6:</h4>
    <p>- El jugador que saque un 6 avanzará una de sus fichas seis casillas.El jugador que saque un 6 podrá repetir turno. Si saca otro 6 podrá volver a repetir. Si saca un 6 en la tercera tirada, la última ficha que movió volverá a casa, exceptuando si la última ficha que movió ya estaba en el color de su meta. Esto mismo ocurrirá al sacar dobles si se juega con dos dados.
	    <br>- Cuando se realiza una jugada y se mueve una ficha, no se puede volver atrás.</p>
    <h4>Sobre las barreras o puentes:</h4>
    <p>
      - Ninguna ficha puede pasar o comer en una barrera. Esta regla prevalece sobre las demás.
      <br>- Cada jugador tiene la posibilidad de poner una ficha en cada casilla de seguro.
      <br>- Si un jugador tiene una barrera y saca un 6 con un dado, o dobles con dos dados, deberá abrir la barrera obligatoriamente. La única excepción a esta regla ocurrirá cuando la ficha de la barrera deba avanzar y ésta no pueda, ya sea por encontrarse con otra barrera en medio del trayecto.
      <br>- Se permiten hacer barreras con fichas de distinto color en los seguros si se ha activado la corresponiente opción al crear la sala. Si hay dos fichas de distinto color en un seguro que es la salida de otro jugador y este tercero saca un 5 la primera ficha en entrar en este seguro estará eliminada.
      <br>- Si se está jugando por parejas, se permite hacer barreras con fichas mezcladas de ambos jugadores.
    </p>
    <h4>Sobre comer o capturar</h4>
      <p>
        - Si una ficha cae en una casilla blanca y numerada ocupada por una ficha de otro color, se la comerá. La ficha comida irá a su casa original (de su mismo color). El jugador que coma contará 20.
        <br>- En las salidas y en los seguros no es posible comer y por tanto pueden estar dos fichas de colores diferentes.
        <br>- En la salida no puede haber más de dos fichas. Si un jugador, al sacar una ficha de su casa, encuentra dos fichas de otros colores, comerá la última que hubiese llegado y contará 20.
        <br>- Se pueden comer dos fichas contrarias pero solo se contarán 20.
      </p>
      <h4>Sobre la meta y el fin del juego:</h4>
      <p>
        - El jugador que mete una ficha en la meta, avanza 10 con alguna de sus otras fichas.
        <br>- El jugador que consigue meter sus 4 fichas en la meta finaliza el juego, deja de lanzar el dado y pasa turno.
        <br>- Gana el jugador que primero mete sus 4 fichas en su meta. En segundo lugar y tercer lugar quedan los jugadores que consiguen meter todas sus fichas en segundo y tercer lugar, respectivamente. Pierde el jugador que no consigue meter todas las fichas cuando los otros han terminado.
        <br>- Cuando un jugador tiene una ficha en el pasillo de meta y no saca la puntuación exacta para introducir la ficha en meta, se deberá "rebotar". El "rebote" consiste en contar la tirada del dado hasta la meta y luego retroceder por las casillas del pasillo de meta hasta completar el valor del dado.
      </p>
      <h4>Parchís por parejas:</h4>
      <p>
        - En el parchís por parejas, los compañeros se sitúan en extremos opuestos del tablero.
        <br>- Gana la pareja que antes meta sus fichas.
        <br>- Cuando un jugador de la pareja meta sus cuatro fichas, la tirada de su turno contará para su compañero.
      </p>
      <h4>Parchís con 2 dados:</h4>
      <p>
        - Esta modalidad permite un juego mucho más estratégico y rápido, ya que los jugadores pueden mover en su turno 2 fichas con el valor de cada dado. 
	      <br>- Las reglas de esta modalidad son un reflejo de las del juego con 1 dado. Donde todas las reglas que aplicaban al sacar un 6, aplican ahora al sacar el mismo número en ambos dados (dobles). Por ejemplo: en vez de sacar un 6 para repetir turno, se debe sacar el mismo valor con los 2 dados (un doble); para sacar una ficha de casa, es suficiente con que ambos dados sumen 5; etc.</p>
  </div>
</template>
