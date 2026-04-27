-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : lun. 27 avr. 2026 à 00:11
-- Version du serveur : 10.5.15-MariaDB-0+deb11u1
-- Version de PHP : 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `s44_raimbow`
--

-- --------------------------------------------------------

--
-- Structure de la table `privatevoc`
--

CREATE TABLE `privatevoc` (
  `guildID` varchar(100) NOT NULL,
  `categoryID` varchar(100) NOT NULL,
  `channelID` varchar(100) NOT NULL,
  `channelID2` varchar(20) DEFAULT NULL,
  `categoryID2` varchar(20) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `privatevoc`
--

INSERT INTO `privatevoc` (`guildID`, `categoryID`, `channelID`, `channelID2`, `categoryID2`) VALUES
('1277777462566326332', '1277777463220633669', '1277777463543332866', '1277777463673618558', '1277777463673618561');

-- --------------------------------------------------------

--
-- Structure de la table `rdv`
--

CREATE TABLE `rdv` (
  `id` int(11) NOT NULL,
  `guild_id` varchar(255) NOT NULL,
  `channel_id` varchar(255) NOT NULL,
  `creator_id` varchar(255) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `rdv_date` datetime NOT NULL,
  `mention_user` varchar(255) DEFAULT NULL,
  `mention_role` varchar(255) DEFAULT NULL,
  `rappel_envoye` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `server`
--

CREATE TABLE `server` (
  `guild` varchar(100) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `server`
--

INSERT INTO `server` (`guild`) VALUES
('1277777462566326332');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `privatevoc`
--
ALTER TABLE `privatevoc`
  ADD PRIMARY KEY (`guildID`);

--
-- Index pour la table `rdv`
--
ALTER TABLE `rdv`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `server`
--
ALTER TABLE `server`
  ADD PRIMARY KEY (`guild`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `rdv`
--
ALTER TABLE `rdv`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
