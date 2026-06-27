-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: fitnexusdb
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `nutrition`
--

DROP TABLE IF EXISTS `nutrition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nutrition` (
  `id` bigint NOT NULL,
  `calories` int NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `meal` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK160rjcl2tjvcuwwwkx9eodqxb` (`user_id`),
  CONSTRAINT `FK160rjcl2tjvcuwwwkx9eodqxb` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nutrition`
--

LOCK TABLES `nutrition` WRITE;
/*!40000 ALTER TABLE `nutrition` DISABLE KEYS */;
INSERT INTO `nutrition` VALUES (1,300,'2026-06-26 23:55:53.148474','rice','',54),(2,250,'2026-06-27 00:12:27.005476','Form Entry Log','Water: 2.0L, Protein: 0g',54);
/*!40000 ALTER TABLE `nutrition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nutrition_seq`
--

DROP TABLE IF EXISTS `nutrition_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nutrition_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nutrition_seq`
--

LOCK TABLES `nutrition_seq` WRITE;
/*!40000 ALTER TABLE `nutrition_seq` DISABLE KEYS */;
INSERT INTO `nutrition_seq` VALUES (101);
/*!40000 ALTER TABLE `nutrition_seq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sleep`
--

DROP TABLE IF EXISTS `sleep`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sleep` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `hours` int NOT NULL,
  `quality` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdyxrbrg144vjvl1w8c1leit8n` (`user_id`),
  CONSTRAINT `FKdyxrbrg144vjvl1w8c1leit8n` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sleep`
--

LOCK TABLES `sleep` WRITE;
/*!40000 ALTER TABLE `sleep` DISABLE KEYS */;
INSERT INTO `sleep` VALUES (1,'2026-06-26 23:56:04.503063',4,'DreamDisturbed',54);
/*!40000 ALTER TABLE `sleep` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sleep_seq`
--

DROP TABLE IF EXISTS `sleep_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sleep_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sleep_seq`
--

LOCK TABLES `sleep_seq` WRITE;
/*!40000 ALTER TABLE `sleep_seq` DISABLE KEYS */;
INSERT INTO `sleep_seq` VALUES (51);
/*!40000 ALTER TABLE `sleep_seq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stress`
--

DROP TABLE IF EXISTS `stress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stress` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `level` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK2sv1i2o3h9gh63u85gjih3bk` (`user_id`),
  CONSTRAINT `FK2sv1i2o3h9gh63u85gjih3bk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stress`
--

LOCK TABLES `stress` WRITE;
/*!40000 ALTER TABLE `stress` DISABLE KEYS */;
INSERT INTO `stress` VALUES (1,'2026-06-26 23:56:12.481857','6','',54),(2,'2026-06-27 00:12:27.066632','5','',54);
/*!40000 ALTER TABLE `stress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stress_seq`
--

DROP TABLE IF EXISTS `stress_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stress_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stress_seq`
--

LOCK TABLES `stress_seq` WRITE;
/*!40000 ALTER TABLE `stress_seq` DISABLE KEYS */;
INSERT INTO `stress_seq` VALUES (101);
/*!40000 ALTER TABLE `stress_seq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'komalg@fitnexus.com','Komal G');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'komalg@fitnexus.com','Komal G',NULL,NULL),(2,'kg@fitnexus.com','K G',NULL,NULL),(3,'gk@example.com',NULL,NULL,NULL),(4,'gk@example.com','GK',NULL,NULL),(5,'komalg@fitnexus.com','Komal G','12345','komal'),(6,'gk@example.com','GK','9999',NULL),(7,'gk@test.com','Gk Updated','secret123',NULL),(8,'gk@example.com','GK','9999',NULL),(9,'gk@example.com','GK','9999',NULL),(10,'komal@gmail.com','komal','12345',NULL),(11,'kg@gmail.com','kgnew','12345',NULL),(12,'kgnew@gmail.com','Komalnew','11111',NULL),(13,'k@gmail.com','K','12345',NULL),(14,'u@gmail.com',NULL,'12345',NULL),(15,'user1@gmail.com','u','12345',NULL),(16,'user1@gmail.com',NULL,'12345',NULL),(17,'u2@gmail.com',NULL,'12121',NULL),(18,'u2@gmail.com',NULL,'12121',NULL),(19,'u3@gmail.com',NULL,'12312',NULL),(20,'u4@gmail.com','u4@gmail.com','11111',NULL),(21,'u5@gmail.com','u5@gmail.com','12345',NULL),(22,'kg@gmail.com',NULL,'a',NULL),(23,'u10@gmail.com','u10@gmail.com','123456',NULL),(24,'u10@gmail.com',NULL,'123456',NULL),(25,'u11@gmail.com',NULL,'11111',NULL),(26,'u11@gmail.com',NULL,'11111',NULL),(27,'u11@gmail.com',NULL,'11111',NULL),(28,'u11@gmail.com',NULL,'11111',NULL),(29,'u11@gmail.com',NULL,'11111',NULL),(30,'u11@gmail.com',NULL,'11111',NULL),(31,'u12@gmail.com',NULL,'12345',NULL),(32,'u13@gmail.com','u111','11111',NULL),(33,'K','KTEST','G',NULL),(34,'NEWU',NULL,'NEWU',NULL),(35,'Knew',NULL,'Knew',NULL),(36,'KK',NULL,'KK',NULL),(37,'twentyt',NULL,'twentyt',NULL),(38,'second',NULL,'second',NULL),(39,'a',NULL,'a',NULL),(40,'kg@gmail.com',NULL,'aaaa','aaaa'),(41,'kg@gmail.com',NULL,'aaaa','aaaa'),(42,'kag@gmail.com',NULL,'aaaaa','aaaaa'),(43,'june@gmail.com',NULL,'june','june'),(44,'newu@gmail.com',NULL,'newu','newu'),(45,'anuj@gmail.com',NULL,'anuj','anuj'),(46,'usr@gmail.com',NULL,'usr','usr'),(47,'today@gmail.com',NULL,'today','today'),(48,'today',NULL,'today',NULL),(49,'kg@gmail.com',NULL,'kom',NULL),(50,'komal@gmail.com',NULL,'komal',NULL),(51,'pk@gmail.com',NULL,'pk',NULL),(52,'today@gmail.com',NULL,'today',NULL),(53,'ag@gmail.com',NULL,'Akshay','Akshay'),(54,'gk@gmail.com',NULL,'gk@gmail.com','gk@gmail.com');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wellness_inputs`
--

DROP TABLE IF EXISTS `wellness_inputs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wellness_inputs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `age` int NOT NULL,
  `days_per_week` int NOT NULL,
  `digestive_issues` varchar(255) DEFAULT NULL,
  `energy_level` varchar(255) DEFAULT NULL,
  `height` int NOT NULL,
  `journal_entry` varchar(1000) DEFAULT NULL,
  `minutes_per_session` int NOT NULL,
  `mood` varchar(255) DEFAULT NULL,
  `pain_area` varchar(255) DEFAULT NULL,
  `sleep_hours` double NOT NULL,
  `sleep_quality` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `water_intake` double NOT NULL,
  `weight` int NOT NULL,
  `yoga_experience` varchar(255) DEFAULT NULL,
  `alcohol` varchar(255) DEFAULT NULL,
  `bedtime` varchar(255) DEFAULT NULL,
  `bmi` double NOT NULL,
  `chronic_conditions` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `daily_calories` int NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fruit_servings` int NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `has_disease` bit(1) DEFAULT NULL,
  `inner_peace` varchar(255) DEFAULT NULL,
  `medications` varchar(255) DEFAULT NULL,
  `meditation_minutes` int NOT NULL,
  `mobile_number` varchar(255) DEFAULT NULL,
  `physical_activity` int NOT NULL,
  `protein_intake` int NOT NULL,
  `relaxation_practice` varchar(255) DEFAULT NULL,
  `screen_time` int NOT NULL,
  `sleep` varchar(255) DEFAULT NULL,
  `smoking` varchar(255) DEFAULT NULL,
  `social_support` varchar(255) DEFAULT NULL,
  `stress_level` int NOT NULL,
  `stress_triggers` varchar(255) DEFAULT NULL,
  `vegetable_servings` int NOT NULL,
  `wake_time` varchar(255) DEFAULT NULL,
  `with_nature` int DEFAULT NULL,
  `work_satisfaction` int DEFAULT NULL,
  `workout_duration` int NOT NULL,
  `workout_frequency` int NOT NULL,
  `workout_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wellness_inputs`
--

LOCK TABLES `wellness_inputs` WRITE;
/*!40000 ALTER TABLE `wellness_inputs` DISABLE KEYS */;
INSERT INTO `wellness_inputs` VALUES (1,26,3,'None','Balanced',151,'ok',30,'Irritable','None',0,NULL,54,2,48,'Beginner','No','12 am',22,'','Pune',250,'gk@gmail.com',0,'gk@gmail.com','Female',_binary '\0','sometimes','',0,'9876543210',30,0,'',4,'Oversleeping','No','sometimes',5,'',0,'5 am',1,5,30,4,'yoga');
/*!40000 ALTER TABLE `wellness_inputs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workout_logs`
--

DROP TABLE IF EXISTS `workout_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workout_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `calories_burned` int NOT NULL,
  `date` date DEFAULT NULL,
  `duration` int NOT NULL,
  `exercise_type` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6d7vhgag2nq8cnachxbcmpe0b` (`user_id`),
  CONSTRAINT `FK6d7vhgag2nq8cnachxbcmpe0b` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workout_logs`
--

LOCK TABLES `workout_logs` WRITE;
/*!40000 ALTER TABLE `workout_logs` DISABLE KEYS */;
INSERT INTO `workout_logs` VALUES (1,400,'2026-05-04',45,'Cycling',1),(3,250,'2026-05-04',30,'Running',1),(4,250,'2026-05-16',30,'Running',4),(5,250,'2026-05-24',30,'Running',1);
/*!40000 ALTER TABLE `workout_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workouts`
--

DROP TABLE IF EXISTS `workouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workouts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `duration` int NOT NULL,
  `intensity` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpf8ql3wbw2drijbk1ugfvki3d` (`user_id`),
  CONSTRAINT `FKpf8ql3wbw2drijbk1ugfvki3d` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workouts`
--

LOCK TABLES `workouts` WRITE;
/*!40000 ALTER TABLE `workouts` DISABLE KEYS */;
INSERT INTO `workouts` VALUES (1,'2026-06-26 23:54:49.876301',120,'High','yoga',54),(2,'2026-06-27 00:12:26.972630',30,'Medium','yoga',54);
/*!40000 ALTER TABLE `workouts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-27 17:49:00
