CREATE DATABASE /*!32312 IF NOT EXISTS*/ `stock` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `stock`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `entities` (
  `id` binary(16) NOT NULL COMMENT 'UUID сущности',
  `type` varchar(255) NOT NULL COMMENT 'Тип сущности',
  `entity` json NOT NULL COMMENT 'сущность',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата создания',
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Дата обновления',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'флаг удаления',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Сущности';
/*!40101 SET character_set_client = @saved_cs_client */;
