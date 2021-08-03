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
    `subject` binary(16) NOT NULL COMMENT 'UUID товара',
    `predicate` varchar(255) NOT NULL COMMENT 'Отношение субьекта к объекту',
    `object` binary(16) NOT NULL COMMENT 'UUID объекта',
    `priority` int NOT NULL DEFAULT '1' COMMENT 'Номер приоритета',
    `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Флаг удаления',
    PRIMARY KEY (`subject`)
);

CREATE TABLE suggestion_products (
    `id` binary(16) NOT NULL COMMENT 'UUID product',
    `source` varchar(1024) NOT NULL COMMENT 'search source',
    `type` varchar(255) NOT NULL COMMENT 'entity type',
    PRIMARY KEY (`id`),
    FULLTEXT `text` (source)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='suggestion products';

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO suggestion_products VALUES(101, 'Капецитабин', 'Таблетки');

INSERT INTO entities VALUES(1, 'test1', '{"1": 1}', "2008-10-23 10:37:22", "2008-10-23 10:37:22", 0);
INSERT INTO entities VALUES(2, 'test2', '{\"2\": 2}', "2010-10-23 10:37:22", "2012-10-23 10:37:22", 1);

delimiter //
  create definer=`root`@`localhost` function `ordered_uuid`(uuid binary(36))
  returns binary(16) deterministic
  return unhex(concat(substr(uuid, 15, 4),substr(uuid, 10, 4),substr(uuid, 1, 8),substr(uuid, 20, 4),substr(uuid, 25)));
//
delimiter ;

insert into suggestion_products values (ordered_uuid(uuid()),'1','m',....);

select hex(uuid),is_active,... from suggestion_products ;

