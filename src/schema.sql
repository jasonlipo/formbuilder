SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `formbuilder`
--
CREATE DATABASE formbuilder;
USE formbuilder;

-- --------------------------------------------------------

--
-- Table structure for table `forms`
--
CREATE TABLE `forms` (
  `id` int(10) NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`),
  `name` varchar(255) NULL DEFAULT NULL,
  `structure` text NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT NULL
) ENGINE=InnoDB;

--
-- Table structure for table `submissions`
--
CREATE TABLE `submissions` (
  `id` int(10) NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`),
  `form_id` int(10) NOT NULL,
  `data` text NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT NULL,
  `updated_at` datetime NULL DEFAULT NULL
) ENGINE=InnoDB;