-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-04-2019 a las 20:04:01
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

/*INSERT INTO `amigode` (`nombreUsuario`, `nombreUsuario2`, `estado`) VALUES
('Antonio', 'ferbercedo', 'aceptado'),
('Antonio', 'jesucristian', 'aceptado'),
('Aspas10', 'ferbercedo', 'aceptado'),
('Diego', 'Cruyff', 'pendiente'),
('Diego', 'ferbercedo', 'aceptado'),
('ferbercedo', 'Cruyff', 'aceptado'),
('ferbercedo', 'jesucristian', 'pendiente'),
('javierl', 'ferbercedo', 'aceptado'),
('jesucristian', 'Cruyff', 'aceptado'),
('LVPIbai', 'ferbercedo', 'pendiente'),
('SantiL', 'ferbercedo', 'aceptado');*/

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

/*INSERT INTO `consigue` (`Item_nombre`, `Usuario_nombreUsuario`) VALUES
('Dados', 'ferbercedo');*/

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
('Dados', 100),
('Dados Rojos', 150),
('Fondo1', 50),
('Fondo2', 150),
('Fondo3', 250),
('Dados Verdes', 150);


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
  `password` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `puntos` int(11) NOT NULL DEFAULT '0',
  `url_avatar` varchar(200) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'https://pbs.twimg.com/profile_images/1082681728756604929/wfVhYJav_400x400.jpg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `usuario`
--

/*INSERT INTO `usuario` (`nombreUsuario`, `nombreCompleto`, `numPartidas`, `correo`, `numVictorias`, `password`, `puntos`, `url_avatar`) VALUES
('Antonio', 'Antonio Lecina Salinas', 0, 'AntonioLS@gmail.com', 0, '123', 0, 'https://i.ytimg.com/vi/5Ef7DwJS4N8/maxresdefault.jpg'),
('Aspas10', 'Iago Aspas 10', 0, 'Aspas10@gmail.com', 0, '123', 40, 'https://as00.epimg.net/futbol/imagenes/2016/10/23/primera/1477242468_474164_1477242701_noticia_normal.jpg'),
('Cruyff', 'Johan Cruyff', 0, 'Cruyff@gmail.com', 0, '123', 24, 'https://e00-marca.uecdn.es/assets/multimedia/imagenes/2017/03/22/14901374129257.jpg'),
('Diego', 'Diego Armando', 0, 'Diego@gmail.com', 0, '123', 18, 'https://pbs.twimg.com/profile_images/1082681728756604929/wfVhYJav_400x400.jpg'),
('ferbercedo', 'Fernando Bercedo', 5, 'fernando@gmail.com', 3, '123', 5, 'http://www.aragondigital.es/not/2018/6/3/img/img1673421s.jpg'),
('Javier', 'Javier Lacasta Profesor', 0, 'JavierLa@gmail.com', 0, '123', 0, 'https://i.ytimg.com/vi/5Ef7DwJS4N8/maxresdefault.jpg'),
('javierl', 'sss', 0, 'jlacasta@unizar.es', 0, '1234', 0, 'https://pbs.twimg.com/profile_images/1082681728756604929/wfVhYJav_400x400.jpg'),
('jesucristian', 'Cristian Darío Alvarez', 15, 'Cristian@gmail.com', 12, '123', 44, 'https://pbs.twimg.com/profile_images/1082681728756604929/wfVhYJav_400x400.jpg'),
('LVPIbai', 'Ibai Llanos', 0, 'Ibai@gmail.com', 0, '123', 0, 'https://pbs.twimg.com/profile_images/1082681728756604929/wfVhYJav_400x400.jpg'),
('SantiL', 'Santiago Luz', 0, 'Santi@gmail.com', 0, '123', 0, 'https://pbs.twimg.com/profile_images/1082681728756604929/wfVhYJav_400x400.jpg');
*/
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