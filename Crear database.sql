-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-05-2019 a las 14:22:04
-- Versión del servidor: 10.1.36-MariaDB
-- Versión de PHP: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `parchis`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `amigode`
--

CREATE TABLE `amigode` (
  `nombreUsuario` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `nombreUsuario2` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `estado` varchar(20) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `amigode`
--

INSERT INTO `amigode` (`nombreUsuario`, `nombreUsuario2`, `estado`) VALUES
('Aspas10', 'ferbercedo', 'pendiente'),
('Cruyff', 'ferbercedo', 'aceptado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `consigue`
--

CREATE TABLE `consigue` (
  `Item_nombre` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `Usuario_nombreUsuario` varchar(20) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `consigue`
--

INSERT INTO `consigue` (`Item_nombre`, `Usuario_nombreUsuario`) VALUES
('Jugar con 2 dados', 'ferbercedo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `item`
--

CREATE TABLE `item` (
  `nombre` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `puntosRequeridos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `item`
--

INSERT INTO `item` (`nombre`, `puntosRequeridos`) VALUES
('Editar avatar', 25),
('Jugar con 2 dados', 25),
('Tablero 8 jug', 50),
('Dados amarillos', 50),
('Dados cyan', 100),
('Dados rojos', 100),
('Dados morados', 150),
('Dados rojos', 150),
('Dados verdes oscuros', 200),
('Dados verdes', 200),
('Dados naranjas', 200);


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `nombreUsuario` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `nombreCompleto` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `numPartidas` int(11) NOT NULL DEFAULT '0',
  `correo` varchar(60) COLLATE utf8_spanish_ci NOT NULL,
  `numVictorias` int(11) NOT NULL DEFAULT '0',
  `password` varchar(200) COLLATE utf8_spanish_ci NOT NULL,
  `puntos` int(11) NOT NULL DEFAULT '0',
  `dados` varchar(20) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'blanco',
  `url_avatar` varchar(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'https://pbs.twimg.com/profile_images/1082681728756604929/wfVhYJav_400x400.jpg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`nombreUsuario`, `nombreCompleto`, `numPartidas`, `correo`, `numVictorias`, `password`, `puntos`, `dados`,`url_avatar`) VALUES
('Aspas10', 'Iago Aspas 10', 0, 'Aspas10@gmail.com', 0, '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', 40, 'verde','https://as00.epimg.net/futbol/imagenes/2016/10/23/primera/1477242468_474164_1477242701_noticia_normal.jpg'),
('Cruyff', 'Johan Cruyff', 0, 'Cruyff@gmail.com', 0, '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', 24, 'verdeOs','https://e00-marca.uecdn.es/assets/multimedia/imagenes/2017/03/22/14901374129257.jpg'),
('Diego', 'Diego Armando', 0, 'Diego@gmail.com', 0, '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', 180, 'naranja','https://pbs.twimg.com/profile_images/1082681728756604929/wfVhYJav_400x400.jpg'),
('ferbercedo', 'Fernando Bercedo', 5, 'fernando@gmail.com', 3, '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', 120, 'roja','http://www.aragondigital.es/not/2018/6/3/img/img1673421s.jpg'),
('jesucristian', 'Cristian Darío Alvarez', 15, 'Cristian@gmail.com', 12, '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', 44, 'morada','https://www.mundodeportivo.com/r/GODO/MD/p5/Futbol/Imagenes/2018/06/04/Recortada/20180604-636637270518041676_20180604164041-k2DE-U444083209883IvD-980x554@MundoDeportivo-Web.jpg'),
('LVPIbai', 'Ibai Llanos', 0, 'Ibai@gmail.com', 0, '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', 0, 'cyan','https://pbs.twimg.com/profile_images/1082681728756604929/wfVhYJav_400x400.jpg');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `amigode`
--
ALTER TABLE `amigode`
  ADD PRIMARY KEY (`nombreUsuario`,`nombreUsuario2`),
  ADD KEY `nombreUsuario2` (`nombreUsuario2`),
  ADD KEY `nombreUsuario` (`nombreUsuario`) USING BTREE;

--
-- Indices de la tabla `consigue`
--
ALTER TABLE `consigue`
  ADD PRIMARY KEY (`Item_nombre`,`Usuario_nombreUsuario`),
  ADD KEY `Usuario_nombreUsuario` (`Usuario_nombreUsuario`);

--
-- Indices de la tabla `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`nombre`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`nombreUsuario`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `amigode`
--
ALTER TABLE `amigode`
  ADD CONSTRAINT `amigode_ibfk_1` FOREIGN KEY (`nombreUsuario`) REFERENCES `usuario` (`nombreUsuario`),
  ADD CONSTRAINT `amigode_ibfk_2` FOREIGN KEY (`nombreUsuario2`) REFERENCES `usuario` (`nombreUsuario`);

--
-- Filtros para la tabla `consigue`
--
ALTER TABLE `consigue`
  ADD CONSTRAINT `consigue_ibfk_1` FOREIGN KEY (`Item_nombre`) REFERENCES `item` (`nombre`),
  ADD CONSTRAINT `consigue_ibfk_2` FOREIGN KEY (`Usuario_nombreUsuario`) REFERENCES `usuario` (`nombreUsuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
