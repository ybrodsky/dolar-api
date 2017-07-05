SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `dolar_api`;
USE `dolar_api`;

CREATE TABLE `history` (
  `id` int(11) NOT NULL,
  `type` varchar(10) NOT NULL DEFAULT 'oficial',
  `buy` double(10,2) NOT NULL,
  `sell` double(10,2) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `history`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;