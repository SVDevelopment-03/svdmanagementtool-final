-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 29, 2026 at 01:02 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cpaneluser_svportal`
--

-- --------------------------------------------------------

--
-- Table structure for table `app_store`
--

CREATE TABLE `app_store` (
  `id` int(10) UNSIGNED NOT NULL,
  `store_key` varchar(190) NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `value` longtext NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `app_store`
--

INSERT INTO `app_store` (`id`, `store_key`, `user_id`, `value`, `updated_at`) VALUES
(1, 'svops:team', NULL, '[]', '2026-09-29 13:18:28'),
(2, 'svops:projects', NULL, '[{\"id\":\"pj_e8wkewh\",\"name\":\"test project\",\"client\":\"test client\",\"industry\":\"real estate\",\"region\":\"UAE\",\"techStack\":\"wordpess\",\"clientContacts\":[\"admin@email.com\",\"user@email.com\"],\"phase\":\"Discovery\",\"status\":\"On Track\",\"health\":\"green\",\"delayedBy\":\"None\",\"startDate\":\"2026-09-29\",\"endDate\":\"2026-10-09\",\"deliveryDate\":\"\",\"team\":[],\"tasks\":[{\"id\":\"tk_bwt3rwq\",\"text\":\"Kickoff call with client stakeholders\",\"done\":false,\"owner\":\"\",\"phase\":\"Discovery\",\"auto\":true},{\"id\":\"tk_t83iele\",\"text\":\"Gather requirements & existing assets\",\"done\":false,\"owner\":\"\",\"phase\":\"Discovery\",\"auto\":true},{\"id\":\"tk_3bwck8a\",\"text\":\"Define scope, goals, and success metrics\",\"done\":false,\"owner\":\"\",\"phase\":\"Discovery\",\"auto\":true},{\"id\":\"tk_h22xt0n\",\"text\":\"Competitive / benchmark review\",\"done\":false,\"owner\":\"\",\"phase\":\"Discovery\",\"auto\":true}],\"notes\":\"\",\"resources\":[],\"credentials\":[],\"files\":[]}]', '2026-09-29 13:41:40'),
(3, 'svops:commercials', NULL, '[]', '2026-09-29 13:32:48'),
(4, 'svops:revenue', NULL, '[]', '2026-09-29 13:51:24'),
(5, 'svops:pipeline', NULL, '[]', '2026-09-29 13:32:31'),
(6, 'svops:portfolio', NULL, '[]', '2026-09-29 13:16:44'),
(7, 'svops:marketing', NULL, '[]', '2026-09-29 13:16:31'),
(8, 'svops:maintenance', NULL, '[]', '2026-09-29 13:16:37'),
(9, 'svops:theme', 1, 'dark', '2026-07-30 00:47:12');

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `id` char(36) NOT NULL,
  `project_id` varchar(64) DEFAULT NULL,
  `original_name` varchar(255) NOT NULL,
  `stored_name` varchar(255) NOT NULL,
  `mime_type` varchar(120) NOT NULL,
  `size_bytes` int(10) UNSIGNED NOT NULL,
  `uploaded_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `token_hash` char(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `token_hash`, `expires_at`, `created_at`) VALUES
(3, 1, 'd0220ed7c22682fcd98e60cd4f05f328bf53b93c456415ec8253e1e248e0f4b6', '2026-09-29 21:45:54', '2026-09-29 13:15:54');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(190) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','member') NOT NULL DEFAULT 'member',
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'SV Admin', 'admin@svdigital.ae', '$2y$10$WutpYCAIY5LTKl0AzxzyYO9HY1HqatDhGBtVAq0uQ08TGbkZr0Mm6', 'admin', '2026-07-30 00:31:31'),
(2, 'Jayesh B', 'jayesh.baviskar@svdigital.ae', '$2y$10$HpHkObuytYkeD5kruPSukOCP2TRwq9wYrnZzmcQ8pTRLal73NsGcO', 'member', '2026-09-29 13:17:56');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `app_store`
--
ALTER TABLE `app_store`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_store` (`store_key`,`user_id`),
  ADD KEY `fk_store_user` (`user_id`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_files_project` (`project_id`),
  ADD KEY `fk_files_user` (`uploaded_by`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_sessions_token` (`token_hash`),
  ADD KEY `idx_sessions_user` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_users_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `app_store`
--
ALTER TABLE `app_store`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `app_store`
--
ALTER TABLE `app_store`
  ADD CONSTRAINT `fk_store_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `files`
--
ALTER TABLE `files`
  ADD CONSTRAINT `fk_files_user` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
