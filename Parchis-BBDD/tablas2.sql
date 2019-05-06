CREATE TABLE Usuario
(
   nombreUsuario    CHAR(-1) PRIMARY KEY,
   nombreCompleto   CHAR(-1)        NOT NULL,
   numPartidas      NUMBER        NOT NULL,
   correo           CHAR(-1)        NOT NULL,
   numVictorias     NUMBER        NOT NULL,
   password         CHAR(-1)        NOT NULL,
   puntos           NUMBER        NOT NULL
);

CREATE TABLE Item
(
   nombre             CHAR(-1) PRIMARY KEY,
   puntosRequeridos   NUMBER        NOT NULL
);

CREATE TABLE amigoDe
(
   Usuario_nombreUsuario   CHAR(-1),
   Usuario_nombreUsuario   CHAR(-1),
   PRIMARY KEY (Usuario_nombreUsuario,Usuario_nombreUsuario),
   FOREIGN KEY (Usuario_nombreUsuario) REFERENCES Usuario(nombreUsuario),
   FOREIGN KEY (Usuario_nombreUsuario) REFERENCES Usuario(nombreUsuario)
);

CREATE TABLE consigue
(
   Item_nombre             CHAR(-1),
   Usuario_nombreUsuario   CHAR(-1),
   PRIMARY KEY (Item_nombre,Usuario_nombreUsuario),
   FOREIGN KEY (Item_nombre) REFERENCES Item(nombre),
   FOREIGN KEY (Usuario_nombreUsuario) REFERENCES Usuario(nombreUsuario)
);

