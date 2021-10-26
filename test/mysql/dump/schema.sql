CREATE DATABASE /*!32312 IF NOT EXISTS*/ `stock` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `stock`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE entities (
  `id` binary(16) NOT NULL COMMENT 'UUID сущности',
  `type` varchar(255) NOT NULL COMMENT 'Тип сущности',
  `entity` json NOT NULL COMMENT 'сущность',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата создания',
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Дата обновления',
  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'флаг удаления',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Сущности';
/*!40101 SET character_set_client = @saved_cs_client */;

CREATE TABLE triples (
    `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `subject` binary(16) NOT NULL COMMENT 'UUID товара',
    `predicate` varchar(255) NOT NULL COMMENT 'Отношение субьекта к объекту',
    `object` binary(16) NOT NULL COMMENT 'UUID объекта',
    `priority` int NOT NULL DEFAULT '1' COMMENT 'Номер приоритета',
    `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Флаг удаления',
    PRIMARY KEY (`id`),
    KEY (`subject`, `predicate`, `deleted`)
);

CREATE TABLE suggestion_products (
    `id` binary(16) NOT NULL COMMENT 'UUID product',
    `source` varchar(1024) NOT NULL COMMENT 'search source',
    `type` varchar(255) NOT NULL COMMENT 'entity type',
    PRIMARY KEY (`id`),
    FULLTEXT `text` (source)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='suggestion products';

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
